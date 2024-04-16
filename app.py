import os
import cv2
from flask import Flask, request, jsonify, render_template, session, redirect, app  # Importing necessary Flask modules
import face_recognition
from flask_cors import CORS
from datetime import timedelta, datetime

app = Flask(__name__)
CORS(app)

app.secret_key = 'kiarash'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=1)


registered_data = {}  # Dictionary to store registered data (photo filename associated with the provided name)


@app.route('/authenticationData', methods=['GET'])
def get_authentication_data():
    if last_authenticated_user:
        return jsonify({'success': True, 'name': last_authenticated_user})
    else:
        return jsonify({'success': False, 'name': ''})


@app.route('/')  
def index():
    return render_template('index.html')  

@app.route('/register', methods=['POST'])  
def register():

    global last_authenticated_user

    username = request.form.get('username')
    password = request.form.get('password')
    photo = request.files['photo']

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

    username = request.form.get('username')
    password = request.form.get('password')

    if not username:
        return jsonify({'success': False, 'error': 'Username is required'})
    if not password:
        return jsonify({'success': False, 'error': 'Password is required'})


    photo = request.files['photo']  
    

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

    if not login_face_encodings:
        return jsonify({'success': False, 'error': 'Could not encode the face in the photo'})

    for filename, user_info in registered_data.items():
        if user_info['username'] == username and user_info['password'] == password:
            registered_photo = os.path.join(uploads_folder, filename)
            if not os.path.exists(registered_photo):
                continue

            registered_image = face_recognition.load_image_file(registered_photo)
            registered_face_encodings = face_recognition.face_encodings(registered_image)

    if registered_face_encodings and face_recognition.compare_faces(registered_face_encodings, login_face_encodings[0]):
                last_authenticated_user = username
                session['logged_in'] = True
                session['user_name'] = username
                session.permanent = True
                return jsonify({'success': True, 'name': username})

    return jsonify({'success': False, 'error': 'Invalid credentials or face not recognized'})

@app.route('/success')
def success():
    user_name = request.args.get('user_name')
    return render_template('success.html', user_name=user_name)

@app.route('/logout')
def logout():
    print("Logged out")
    session.clear()  # Clear the session data
    return redirect("/")  # You can redirect or return a JSON response

if __name__ == '__main__':
    app.run(debug=True)
