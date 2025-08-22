# We are borrowing spells from our spellbooks
from flask import Flask, jsonify
from qrng import generate_quantum_random_number

# This creates our magic portal
app = Flask(__name__)

# This is the address for the door to our portal
# like "www.our-workshop.com/generate_random_number"
@app.route('/generate_random_number')
def get_random_number():
    print("A request for a quantum number came in!")

    # 1. Run our quantum spell from the other file
    random_num = generate_quantum_random_number()
    print(f"Generated the number: {random_num}")

    # 2. Package the answer neatly and send it back
    return jsonify({
        'success': True,
        'randomNumber': random_num
    })


# This is the master command to turn the portal ON
if __name__ == '__main__':
    # This makes the portal listen on port 5001
    app.run(host='0.0.0.0', port=5001, debug=True)
