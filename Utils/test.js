for filename, admin_info in registered_admin_data.items():
        if admin_info['username'] == username and admin_info['password'] == password:
            registered_photo = os.path.join(admin_uploads_folder, filename)
            registered_image = face_recognition.load_image_file(registered_photo)
            registered_face_encodings = face_recognition.face_encodings(registered_image)
            print("Number of face encodings in registered image:", len(registered_face_encodings))
            if len(registered_face_encodings) > 0 and len(login_face_encodings) > 0:
                # Compare the face encodings of the login face and the registered face
                matches = face_recognition.compare_faces(registered_face_encodings, login_face_encodings[0])
                print("Matches:", matches)
                if any(matches):
                    last_authenticated_admin = username
                    session['logged_in'] = True
                    session['user_name'] = username
                    session.permanent = True
                    return jsonify({'success': True, 'name': username})

    return jsonify({'success': False, 'error': 'Invalid credentials or face not recognized'})
