from flask import Flask, jsonify
import subprocess

app = Flask(__name__)

@app.route('/runTests', methods=['GET'])
def run_tests():
    try:
        # Execute the Python test script using subprocess
        result = subprocess.run(['python', '/app_tests.py'], capture_output=True, text=True)
        
        # Parse the output of the test script
        output = result.stdout.splitlines()
        tests_passed = 0
        total_time_taken = 0
        
        # Extract relevant information from the test output
        for line in output:
            if "tests ran successfully" in line:
                tests_passed = int(line.split()[0])
            elif "m tests ran successfully" in line:
                tests_passed = int(line.split()[0])
            elif "Tests Passed" in line:
                total_time_taken = int(line.split()[1][1:-3])  # Extract time without "ms"
        
        # Prepare response data
        response_data = {
            "results": output,
            "testsPassed": tests_passed,
            "totalTimeTaken": total_time_taken
        }
        
        return jsonify(response_data), 200
    except Exception as e:
        error_message = str(e)
        return jsonify({"error": error_message}), 500

if __name__ == '__main__':
    app.run(debug=True)
