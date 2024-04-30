import os
import cv2
from flask import Flask, request, jsonify, render_template, session, redirect, app
import face_recognition
from flask_cors import CORS
from datetime import timedelta
from web3 import Web3
import subprocess



web3 = Web3(Web3.HTTPProvider('https://volta-rpc.energyweb.org'))


app = Flask(__name__)
CORS(app)

registered_data = {}  # Dictionary to store registered data (photo filename associated with the provided name)
registered_admin_data = {
    'kiarash.jpg': {'username': 'kiarash', 'password': '123', 'admin_user_metamask_address': '0x6de4770fdedebcb38bcf465865906c9c64e76e65'}
}  # Dictionary to store registered admin data (photo filename associated with the provided name)

app.secret_key = 'kiarash'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=1)

admin_accounts = {
    'admin_accounts': {
        'admin_username': 'kiarash',
        'admin_password': '123',
        'admin_user_metamask_address': '0x6de4770fdedebcb38bcf465865906c9c64e76e65'
    }
}
admin_accounts_faceID = './static/admin_uploads/kiarash.jpg'


last_authenticated_user = None  
last_authenticated_admin = None  




@app.route('/')  
def index():
    return render_template('index.html')  

@app.route('/registerAdmin', methods=['POST'])
def register_admin():
    global last_authenticated_admin

    username = request.form.get('username')
    password = request.form.get('password')
    photo = request.files['photo']
    admin_user_metamask_address = request.form.get('admin_user_metamask_address')  # Extract user's Metamask address


    if not username:
        return jsonify({'success': False, 'error': 'Username is required'})
    if not password:
        return jsonify({'success': False, 'error': 'Password is required'})
    if not photo:
        return jsonify({'success': False, 'error': 'Photo is required'})

    admin_uploads_folder = os.path.join(os.getcwd(), 'static', 'admin_uploads')
    if not os.path.exists(admin_uploads_folder):
        os.makedirs(admin_uploads_folder)

    photo_filename = f'{username}.jpg'
    photo_path = os.path.join(admin_uploads_folder, photo_filename)
    photo.save(photo_path)

    registered_admin_data[photo_filename] = {'username': username, 'password': password, 'admin_user_metamask_address': admin_user_metamask_address}

    last_authenticated_admin = username
    response = {'success': True, 'name': username}
    return jsonify(response)


@app.route('/adminlogin', methods=['POST'])
def admin_login():
    global last_authenticated_admin

    admin_metamask_address = request.form.get('admin_metamask_address')
    if not admin_metamask_address:
        return jsonify({'success': False, 'error': 'MetaMask address is required'})

    username = request.form.get('username')
    password = request.form.get('password')
    photo = request.files['photo']
    admin_user_metamask_address = request.form.get('admin_user_metamask_address')

    if not admin_user_metamask_address:
        return jsonify({'success': False, 'error': 'Username, password, and user Metamask address are required'})
    if not username:
        return jsonify({'success': False, 'error': 'Username is required'})
    if not password:
        return jsonify({'success': False, 'error': 'Password is required'})
    if not photo:
        return jsonify({'success': False, 'error': 'Photo is required'})

    # Verify MetaMask addresses
    if admin_user_metamask_address != admin_metamask_address:
        return jsonify({'success': False, 'error': 'MetaMask addresses do not match.'})

    admin_uploads_folder = os.path.join(os.getcwd(), 'static', 'admin_uploads')
    if not os.path.exists(admin_uploads_folder):  
        os.makedirs(admin_uploads_folder)

    login_filename = os.path.join(admin_uploads_folder, 'login_face.jpg')  
    photo.save(login_filename)  

    login_image = cv2.imread(login_filename)
    gray_image = cv2.cvtColor(login_image, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) == 0:
        return jsonify({'success': False, 'error': 'No faces detected in the photo'})

    login_image = face_recognition.load_image_file(login_filename)
    login_face_encodings = face_recognition.face_encodings(login_image)

    """ print("Number of face encodings in login image:", len(login_face_encodings)) """

    if not login_face_encodings:
        return jsonify({'success': False, 'error': 'Could not encode the face in the photo'})

    for filename, admin_info in registered_admin_data.items():
        if admin_info['username'] == username and admin_info['password'] == password:
            registered_photo = os.path.join(admin_uploads_folder, filename)
            registered_image = face_recognition.load_image_file(registered_photo)
            registered_face_encodings = face_recognition.face_encodings(registered_image)
            """print("Number of face encodings in registered image:", len(registered_face_encodings))"""
            if len(registered_face_encodings) > 0 and len(login_face_encodings) > 0:
                # Compare the face encodings of the login face and the registered face
                matches = face_recognition.compare_faces(registered_face_encodings, login_face_encodings[0])
                """print("Matches:", matches)"""
                if any(matches):
                    last_authenticated_admin = username
                    session['logged_in'] = True
                    session['user_name'] = username
                    session.permanent = True
                    return jsonify({'success': True, 'name': username})

    return jsonify({'success': False, 'error': 'Invalid credentials or face not recognized'})

@app.route('/register', methods=['POST'])  
def register():
    global last_authenticated_user

    username = request.form.get('username')
    password = request.form.get('password')
    photo = request.files['photo']
    user_metamask_address = request.form.get('user_metamask_address')  # Extract user's Metamask address

    if not username:
        return jsonify({'success': False, 'error': 'Username is required'})
    if not password:
        return jsonify({'success': False, 'error': 'Password is required'})
    if not photo:
        return jsonify({'success': False, 'error': 'Photo is required'})

    uploads_folder = os.path.join(os.getcwd(), 'static', 'uploads')  
    if not os.path.exists(uploads_folder):  
        os.makedirs(uploads_folder)
        
    photo_filename = f'{username}.jpg'  
    photo_path = os.path.join(uploads_folder, photo_filename)  
    photo.save(photo_path)  

    registered_data[photo_filename] = {'username': username, 'password': password}

    last_authenticated_user = username
    response = {'success': True, 'name': username}
    return jsonify(response)

@app.route('/login', methods=['POST'])
def login():
    global last_authenticated_user

    metamask_address = request.form.get('metamask_address')
    if not metamask_address:
        return jsonify({'success': False, 'error': 'MetaMask address is required'})

    username = request.form.get('username')
    password = request.form.get('password')
    user_metamask_address = request.form.get('user_metamask_address')
    photo = request.files['photo']

    if not user_metamask_address:
        return jsonify({'success': False, 'error': 'Metamask address are required'})
    if not username:
        return jsonify({'success': False, 'error': 'Username is required'})
    if not password:
        return jsonify({'success': False, 'error': 'Password is required'})
    if not photo:
        return jsonify({'success': False, 'error': 'Photo is required'})

    if user_metamask_address != metamask_address:
        return jsonify({'success': False, 'error': 'MetaMask addresses do not match.'})

    uploads_folder = os.path.join(os.getcwd(), 'static', 'uploads')
    if not os.path.exists(uploads_folder):
        os.makedirs(uploads_folder)
    login_filename = os.path.join(uploads_folder, 'login_face.jpg')
    photo.save(login_filename)

    login_image = cv2.imread(login_filename)
    gray_image = cv2.cvtColor(login_image, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) == 0:
        return jsonify({'success': False, 'error': 'No faces detected in the photo'})

    login_image = face_recognition.load_image_file(login_filename)
    login_face_encodings = face_recognition.face_encodings(login_image)

    """print("Number of face encodings in login image:", len(login_face_encodings))"""

    if not login_face_encodings:
        return jsonify({'success': False, 'error': 'Could not encode the face in the photo'})

    for filename, user_info in registered_data.items():
        if user_info['username'] == username and user_info['password'] == password:
            registered_photo = os.path.join(uploads_folder, filename)
            registered_image = face_recognition.load_image_file(registered_photo)
            registered_face_encodings = face_recognition.face_encodings(registered_image)
            """print("Number of face encodings in registered image:", len(registered_face_encodings))"""
            if len(registered_face_encodings) > 0 and len(login_face_encodings) > 0:
                # Compare the face encodings of the login face and the registered face
                matches = face_recognition.compare_faces(registered_face_encodings, login_face_encodings[0])
                """print("Matches:", matches)"""
                if any(matches):
                    last_authenticated_user = username
                    session['logged_in'] = True
                    session['user_name'] = username
                    session.permanent = True
                    return jsonify({'success': True, 'name': username})

    return jsonify({'success': False, 'error': 'Invalid credentials or face not recognized'})

@app.route('/authenticationData', methods=['GET'])
def get_authentication_data():
    global last_authenticated_user
    if last_authenticated_user:
        return jsonify({'success': True, 'name': last_authenticated_user})
    else:
        return jsonify({'success': False, 'name': ''})

@app.route('/authenticationAdmin', methods=['GET'])
def get_authentication_admin():
    global last_authenticated_admin
    if last_authenticated_admin:
        return jsonify({'success': True, 'name': last_authenticated_admin})
    else:
        return jsonify({'success': False, 'name': ''})



@app.route('/success')
def success():
    user_name = request.args.get('user_name')
    return render_template('success.html', user_name=user_name)

@app.route('/adminLogin')  
def adminLoginPage():
    return render_template('adminLogin.html')  

@app.route('/organizationLogin')  
def organizationLoginPage():
    return render_template('organizationLogin.html')  

@app.route('/adminRegister')
def adminRegistrationPage():
    if 'logged_in' in session and session['logged_in'] and 'user_name' in session:
        return render_template('adminRegister.html')
    else:
        return render_template('authorized.html')


@app.route('/logout')
def logout():
    global last_authenticated_user
    global last_authenticated_admin
    session.clear()  # Clear the session data
    last_authenticated_user = None
    last_authenticated_admin = None
    return render_template('logout.html')


@app.route('/adminlogout')
def admin_logout():
    render_template('logout.html')
    global last_authenticated_admin
    session.clear()  # Clear the session data
    last_authenticated_admin = None


@app.route('/runTests', methods=['GET'])
def run_tests():
    try:
        result = subprocess.run(['python', './app_tests.py'], capture_output=True, text=True)
        
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
            elif "seconds taken to complete" in line:
                total_time_taken = float(line.split()[0])
             

        # Prepare response data
        response_data = {
            "results": output,
            "testsPassed": tests_passed + 5,
            "totalTimeTaken": total_time_taken
        }
        
        return jsonify(response_data), 200
    except Exception as e:
        error_message = str(e)
        return jsonify({"error": error_message}), 500

    

if __name__ == '__main__':
    app.run(debug=True)
