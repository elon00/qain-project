import type { Request, Response } from "express";

export const X402_VERSION = 2;
export const SOLANA_TESTNET_CAIP2 = "solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z";
export const SOLANA_TESTNET_USDC = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

export type X402Config = {
  facilitatorUrl: string;
  facilitatorToken?: string;
  network: string;
  asset: string;
  payTo: string;
  amount: string;
  maxTimeoutSeconds: number;
};

type PaymentRequirements = {
  scheme: "exact";
  network: string;
  amount: string;
  asset: string;
  payTo: string;
  maxTimeoutSeconds: number;
  extra: {
    name: "USDC";
    version: "2";
  };
};

type PaymentRequired = {
  x402Version: 2;
  error: string;
  resource: {
    url: string;
    description: string;
    mimeType: "application/json";
    serviceName: string;
    tags: string[];
  };
  accepts: PaymentRequirements[];
  extensions: Record<string, never>;
};

type FacilitatorVerifyResponse = {
  isValid: boolean;
  invalidReason?: string;
  payer?: string;
};

type FacilitatorSettleResponse = {
  success: boolean;
  errorReason?: string;
  payer?: string;
  transaction?: string;
  network?: string;
};

export function loadX402Config(
  env: NodeJS.ProcessEnv = process.env,
): X402Config | null {
  const facilitatorUrl = env.X402_FACILITATOR_URL?.trim();
  const payTo = env.X402_PAY_TO?.trim();

  if (!facilitatorUrl || !payTo) return null;

  const amount = env.X402_PRICE_ATOMIC?.trim() || "1000";
  if (!/^\d+$/.test(amount) || BigInt(amount) <= 0n) {
    throw new Error("X402_PRICE_ATOMIC must be a positive integer");
  }

  const maxTimeoutSeconds = Number(env.X402_MAX_TIMEOUT_SECONDS || "60");
  if (!Number.isInteger(maxTimeoutSeconds) || maxTimeoutSeconds < 1 || maxTimeoutSeconds > 600) {
    throw new Error("X402_MAX_TIMEOUT_SECONDS must be an integer from 1 to 600");
  }

  const parsedUrl = new URL(facilitatorUrl);
  if (parsedUrl.protocol !== "https:" && parsedUrl.hostname !== "localhost") {
    throw new Error("X402_FACILITATOR_URL must use HTTPS (localhost is allowed for development)");
  }

  return {
    facilitatorUrl: facilitatorUrl.replace(/\/$/, ""),
    facilitatorToken: env.X402_FACILITATOR_TOKEN?.trim() || undefined,
    network: env.X402_NETWORK?.trim() || SOLANA_TESTNET_CAIP2,
    asset: env.X402_ASSET?.trim() || SOLANA_TESTNET_USDC,
    payTo,
    amount,
    maxTimeoutSeconds,
  };
}

export function encodeX402Header(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
}

export function decodeX402Header<T>(value: string): T {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const decoded = Buffer.from(padded, "base64").toString("utf8");
  return JSON.parse(decoded) as T;
}

function resourceUrl(req: Request): string {
  const host = req.get("host") || "localhost";
  return `${req.protocol}://${host}${req.originalUrl}`;
}

function paymentRequirements(config: X402Config): PaymentRequirements {
  return {
    scheme: "exact",
    network: config.network,
    amount: config.amount,
    asset: config.asset,
    payTo: config.payTo,
    maxTimeoutSeconds: config.maxTimeoutSeconds,
    extra: {
      name: "USDC",
      version: "2",
    },
  };
}

function buildPaymentRequired(
  req: Request,
  config: X402Config,
  error: string,
): PaymentRequired {
  return {
    x402Version: X402_VERSION,
    error,
    resource: {
      url: resourceUrl(req),
      description: "QAIN paid post-quantum AI insight",
      mimeType: "application/json",
      serviceName: "QAIN Web 4.0",
      tags: ["solana", "x402", "pqc", "ai", "agentic-payments"],
    },
    accepts: [paymentRequirements(config)],
    extensions: {},
  };
}

function sendPaymentRequired(
  res: Response,
  required: PaymentRequired,
): Response {
  return res
    .status(402)
    .set("PAYMENT-REQUIRED", encodeX402Header(required))
    .set("Cache-Control", "no-store")
    .json(required);
}

async function facilitatorPost<T>(
  config: X402Config,
  endpoint: "/verify" | "/settle",
  paymentPayload: unknown,
  requirements: PaymentRequirements,
): Promise<T> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    accept: "application/json",
  };
  if (config.facilitatorToken) {
    headers.authorization = `Bearer ${config.facilitatorToken}`;
  }

  const response = await fetch(`${config.facilitatorUrl}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      x402Version: X402_VERSION,
      paymentPayload,
      paymentRequirements: requirements,
    }),
  });

  if (!response.ok) {
    throw new Error(`x402 facilitator ${endpoint} returned HTTP ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function handleX402ExactJson<T>(
  req: Request,
  res: Response,
  handler: () => Promise<T> | T,
): Promise<Response | void> {
  let config: X402Config | null;
  try {
    config = loadX402Config();
  } catch (error) {
    const message = error instanceof Error ? error.message : "invalid x402 configuration";
    return res.status(503).json({ success: false, error: message });
  }

  if (!config) {
    return res.status(503).json({
      success: false,
      error: "x402 is not configured",
      requiredEnvironment: ["X402_FACILITATOR_URL", "X402_PAY_TO"],
    });
  }

  const requirements = paymentRequirements(config);
  const paymentHeader = req.get("PAYMENT-SIGNATURE");

  if (!paymentHeader) {
    return sendPaymentRequired(
      res,
      buildPaymentRequired(req, config, "PAYMENT-SIGNATURE header is required"),
    );
  }

  let paymentPayload: unknown;
  try {
    paymentPayload = decodeX402Header(paymentHeader);
  } catch {
    return sendPaymentRequired(
      res,
      buildPaymentRequired(req, config, "PAYMENT-SIGNATURE is not valid base64 JSON"),
    );
  }

  try {
    const verification = await facilitatorPost<FacilitatorVerifyResponse>(
      config,
      "/verify",
      paymentPayload,
      requirements,
    );

    if (!verification.isValid) {
      return sendPaymentRequired(
        res,
        buildPaymentRequired(
          req,
          config,
          verification.invalidReason || "payment verification failed",
        ),
      );
    }

    const payload = await handler();

    const settlement = await facilitatorPost<FacilitatorSettleResponse>(
      config,
      "/settle",
      paymentPayload,
      requirements,
    );

    if (!settlement.success) {
      return res.status(502).json({
        success: false,
        error: settlement.errorReason || "payment settlement failed",
        transaction: settlement.transaction || undefined,
        network: settlement.network || config.network,
        reconciliationRequired: settlement.errorReason === "settlement_pending",
      });
    }

    res
      .set("PAYMENT-RESPONSE", encodeX402Header(settlement))
      .set("Cache-Control", "no-store")
      .json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "x402 facilitator error";
    return res.status(503).json({
      success: false,
      error: message,
      paymentExecuted: false,
    });
  }
}
