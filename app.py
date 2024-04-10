import os
import cv2
from flask import Flask, request, jsonify, render_template
import face_recognition
from flask_cors import CORS
from flask_session import Session  

app = Flask(__name__)
CORS(app)


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

    name = request.form.get('name')  
    photo = request.files['photo']  

    if not name:  
        return jsonify({'success': False, 'error': 'Name is required'})

    if not photo:  
        return jsonify({'success': False, 'error': 'Photo is required'})

    uploads_folder = os.path.join(os.getcwd(), 'static', 'uploads')  
    if not os.path.exists(uploads_folder):  
        os.makedirs(uploads_folder)
        
    photo_filename = f'{name}.jpg'  
    photo_path = os.path.join(uploads_folder, photo_filename)  
    photo.save(photo_path)  

    registered_data[photo_filename] = name  

    last_authenticated_user = name
    response = {'success': True, 'name': name}
    return jsonify(response)  

@app.route('/login', methods=['POST'])  
def login():

    global last_authenticated_user

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
        response = {'success': False}  
        return jsonify(response)  

    login_image = face_recognition.load_image_file(login_filename)  
    login_face_encodings = face_recognition.face_encodings(login_image)

    for filename, name in registered_data.items():  
        registered_photo = os.path.join(uploads_folder, filename)  
        if not os.path.exists(registered_photo):  
            continue

        registered_image = face_recognition.load_image_file(registered_photo)  
        registered_face_encodings = face_recognition.face_encodings(registered_image)

        if len(registered_face_encodings) > 0 and len(login_face_encodings) > 0:
            matches = face_recognition.compare_faces(registered_face_encodings, login_face_encodings[0])

            if any(matches):
                last_authenticated_user = name
                response = {'success': True, 'name': name}
                return jsonify(response)

    response = {'success': False}
    return jsonify(response)

@app.route('/success')
def success():
    user_name = request.args.get('user_name')
    return render_template('success.html', user_name=user_name)

if __name__ == '__main__':
    app.run(debug=True)
