from qiskit import QuantumCircuit, transpile, Aer
import numpy as np

# Use a simulator of a quantum computer that runs on your PC
simulator = Aer.get_backend('aer_simulator')

def generate_quantum_random_number(num_bits=8):
    """
    Generates a random number using a simple quantum circuit.
    """
    # 1. We draw a magic circle with 8 quantum bits (qubits)
    qc = QuantumCircuit(num_bits, num_bits)

    # 2. We cast a spell on each qubit to put it in "superposition"
    # This is like making a coin spin, being both heads and tails at once.
    for i in range(num_bits):
        qc.h(i)

    # 3. We measure all the spinning coins at the same time.
    # This collapses them to a random result of 0s and 1s.
    qc.measure(range(num_bits), range(num_bits))

    # 4. We run the experiment on our simulator
    job = simulator.run(qc, shots=1, memory=True)
    result = job.result()

    # 5. We get the random binary string (like '10110101')
    random_binary_string = result.get_memory(qc)[0]

    # 6. We convert the binary string into a normal number
    random_int = int(random_binary_string, 2)

    return random_int

# This part lets us test the spell directly
if __name__ == "__main__":
    print("Generating a quantum random number...")
    random_number = generate_quantum_random_number()
    print(f"Your quantum random number is: {random_number}")