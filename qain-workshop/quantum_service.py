import qiskit  # The quantum toolkit
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator  # Our pretend quantum machine
import hashlib  # For fingerprints

def generate_quantum_random():
    # Create a tiny quantum spell (circuit) with 1 qubit (like a magic coin)
    circuit = QuantumCircuit(1, 1)  # 1 qubit, 1 bit to measure
    circuit.h(0)  # Put the coin in "superposition" (heads and tails at once!)
    circuit.measure(0, 0)  # Look at it to make it choose randomly
    
    # Run the spell on our simulator
    simulator = AerSimulator()
    compiled_circuit = transpile(circuit, simulator)
    result = simulator.run(compiled_circuit, shots=1).result()
    counts = result.get_counts()
    
    # Get the random bit (0 or 1)
    random_bit = list(counts.keys())[0]  # This is our quantum random!
    return random_bit

# Test it!
random_number = generate_quantum_random()
print("Your quantum random bit is:", random_number)

# Make a bigger random number by doing it 256 times (for super randomness)
def generate_big_quantum_random():
    big_random = ""
    for _ in range(256):  # Do the spell 256 times
        big_random += generate_quantum_random()
    # Turn the bits into a number
    random_int = int(big_random, 2)
    return random_int

big_random = generate_big_quantum_random()
print("Your big quantum random number is:", big_random)

# Create a "fingerprint" (hash) of it, like in blockchain
hash_of_random = hashlib.sha256(str(big_random).encode()).hexdigest()
print("Fingerprint (hash) of the random number:", hash_of_random)

