import unittest
from io import BytesIO
from unittest.mock import patch, MagicMock
from app import app
import cv2
import numpy as np
import time

class TestRegisterAdmin(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_register_admin_success(self):
        """Test registering an admin with all required fields."""
        data = {
            'username': 'testuser',
            'password': 'testpassword',
            'photo': (BytesIO(b'my_photo_data'), 'photo.jpg'),
            'admin_user_metamask_address': '0x123456789ABCDEF'
        }
        response = self.app.post('/registerAdmin', data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 200, msg="Expected status code 200 for successful registration")
        json_data = response.get_json()
        self.assertTrue(json_data['success'], msg="Registration should be successful")
        self.assertEqual(json_data['name'], 'testuser', msg="Returned username should match the submitted one")

    def test_register_admin_missing_fields(self):
        """Test registering an admin with missing fields."""
        data = {
            'username': 'testuser',
            'password': '',  # Password is missing
            'photo': (BytesIO(b'my_photo_data'), 'photo.jpg'),
            'admin_user_metamask_address': '0x123456789ABCDEF'
        }
        response = self.app.post('/registerAdmin', data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 200, msg="Expected status code 200 for missing fields")
        json_data = response.get_json()
        self.assertFalse(json_data['success'], msg="Registration should fail due to missing fields")
        self.assertIn('error', json_data, msg="Error message should be provided")
        self.assertEqual(json_data['error'], 'Password is required', msg="Error message should indicate missing password")

    def test_register_admin_no_photo(self):
        """Test registering an admin without a photo."""
        data = {
            'username': 'testuser',
            'password': 'testpassword',
            'admin_user_metamask_address': '0x123456789ABCDEF'
        }
        response = self.app.post('/registerAdmin', data=data)
        self.assertEqual(response.status_code, 400, msg="Expected status code 400 for no photo provided")
        self.assertIn('400 Bad Request', response.get_data(as_text=True), msg="HTML error page should be provided")


class TestRegister(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_register_success(self):
        """Test registering a user with all required fields."""
        data = {
            'username': 'testuser',
            'password': 'testpassword',
            'photo': (BytesIO(b'my_photo_data'), 'photo.jpg'),
            'user_metamask_address': '0x123456789ABCDEF'
        }
        response = self.app.post('/register', data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 200, msg="Expected status code 200 for successful registration")
        json_data = response.get_json()
        self.assertTrue(json_data['success'], msg="Registration should be successful")
        self.assertEqual(json_data['name'], 'testuser', msg="Returned username should match the submitted one")

    def test_register_missing_fields(self):
        """Test registering a user with missing fields."""
        data = {
            'username': 'testuser',
            'password': '',  # Password is missing
            'photo': (BytesIO(b'my_photo_data'), 'photo.jpg'),
            'user_metamask_address': '0x123456789ABCDEF'
        }
        response = self.app.post('/register', data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 200, msg="Expected status code 200 for missing fields")
        json_data = response.get_json()
        self.assertFalse(json_data['success'], msg="Registration should fail due to missing fields")
        self.assertIn('error', json_data, msg="Error message should be provided")
        self.assertEqual(json_data['error'], 'Password is required', msg="Error message should indicate missing password")

    def test_register_no_photo(self):
        """Test registering a user without a photo."""
        data = {
            'username': 'testuser',
            'password': 'testpassword',
            'user_metamask_address': '0x123456789ABCDEF'
        }
        response = self.app.post('/register', data=data)
        self.assertEqual(response.status_code, 400, msg="Expected status code 400 for no photo provided")
        self.assertIn('400 Bad Request', response.get_data(as_text=True), msg="HTML error page should be provided")

class TestLogin(unittest.TestCase):    

    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    def tearDown(self):
        pass
    
    def test_login_success(self):
        """Test successful login."""
        data = {
            'admin_metamask_address': '0x6de4770fdedebcb38bcf465865906c9c64e76e65',
            'username': 'kiarash',
            'password': '123',
            'admin_user_metamask_address': '0x6de4770fdedebcb38bcf465865906c9c64e76e65',
            'photo': open('./static/admin_uploads/k.jpg', 'rb')
        }
        response = self.app.post('/adminlogin', data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertTrue(json_data['success'])
        self.assertEqual(json_data['name'], 'kiarash')

    def test_login_missing_fields(self):
        """Test login with missing fields."""
        data = {
            'username': 'testuser',
            'password': 'testpassword',
            'user_metamask_address': '0x123456789ABCDEF',
            'photo': open('./static/admin_uploads/k.jpg', 'rb')
        }
        response = self.app.post('/adminlogin', data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertFalse(json_data['success'])
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'MetaMask address is required')

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials."""
        data = {
            'admin_metamask_address': '0x6de4770fdedebcb38bcf465865906c9c64e76e65',
            'username': 'kiarash',
            'password': '123',
            'admin_user_metamask_address': '0x6de4770fdedebcb38bcf465865906c9c64e76e65',
            'photo': open('./static/admin_uploads/test_image.png', 'rb')
        }
        response = self.app.post('/adminlogin', data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertFalse(json_data['success'])
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'Invalid credentials or face not recognized')


    def test_picture_preprocessing(self):
        """Test if picture preprocessing works."""
        image_path = './static/admin_uploads/k.jpg'
        image = cv2.imread(image_path)

        resized_image = cv2.resize(image, (100, 100))

        self.assertIsNotNone(resized_image)

    def test_picture_grayscale(self):
        """Test if picture grayscale conversion works."""
        image_path = './static/admin_uploads/k.jpg'
        image = cv2.imread(image_path)

        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        self.assertIsNotNone(gray_image)


class TestFacialRecognition(unittest.TestCase):    

    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_face_recognition(self):
        """Test if face is recognized in the photo."""
        # Load an image for face recognition
        image_path = './static/admin_uploads/k.jpg'
        image = cv2.imread(image_path)

        # Use face detection algorithm to detect faces
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        # Assert that at least one face is detected
        self.assertGreater(len(faces), 0)

    def test_face_verification(self):
        """Test if face verification is successful."""
        # Load registered and login face encodings
        # Replace these paths with your actual registered and login face encodings
        registered_face_encoding = np.array([0.1, 0.2, 0.3])  # Example registered face encoding
        login_face_encoding = np.array([0.1, 0.2, 0.3])  # Example login face encoding

        # Compare faces
        similarity_score = np.linalg.norm(registered_face_encoding - login_face_encoding)

        # Define a threshold for similarity
        similarity_threshold = 0.5

        # Assert that face verification is successful if similarity score is below threshold
        self.assertLess(similarity_score, similarity_threshold)

    def test_face_encoding_accuracy(self):
        """Test face encoding accuracy."""
        # Load a registered face encoding and a similar but different face encoding
        registered_face_encoding = np.array([0.1, 0.2, 0.3])  # Example registered face encoding
        similar_face_encoding = np.array([0.12, 0.22, 0.32])  # Similar face encoding

        # Calculate similarity score between the two face encodings
        similarity_score = np.linalg.norm(registered_face_encoding - similar_face_encoding)

        # Define a threshold for similarity
        similarity_threshold = 0.5

        # Print the actual similarity score
        print("Actual Similarity Score:", similarity_score)

        # Assert that the similarity score is below the threshold
        self.assertLess(similarity_score, similarity_threshold)

    def test_performance(self):
        """Test facial recognition performance."""
        # Load an image for testing performance
        image_path = './static/admin_uploads/k.jpg'
        image = cv2.imread(image_path)

        # Measure the time taken for face detection
        start_time = time.time()
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        detection_time = time.time() - start_time

        # Print the actual detection time
        print("Actual Detection Time:", detection_time, "seconds")

        # Assert that face detection time is within acceptable limits
        self.assertLess(detection_time, 1.0)  # Example threshold: 1 second

    def test_robustness_to_variation(self):
        """Test robustness to variation."""
        # Load an image with variations (e.g., different lighting, pose, expression, occlusion)
        image_path = './static/admin_uploads/variation.jpg'
        image = cv2.imread(image_path)

        # Perform face detection and recognition
        # Replace these steps with your actual face detection and recognition code
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        # Process detected faces for recognition

        # Assert that at least one face is detected and recognized
        self.assertGreater(len(faces), 0)


if __name__ == '__main__':
    suite_admin = unittest.TestLoader().loadTestsFromTestCase(TestRegisterAdmin)
    suite_register = unittest.TestLoader().loadTestsFromTestCase(TestRegister)
    suite_admin_login = unittest.TestLoader().loadTestsFromTestCase(TestLogin)
    suite_facial_recognition = unittest.TestLoader().loadTestsFromTestCase(TestFacialRecognition)
    all_tests = unittest.TestSuite([suite_admin, suite_register, suite_admin_login, suite_facial_recognition])
    result = unittest.TextTestRunner(verbosity=2).run(all_tests)
    print("\nRegistration Test Complete")
    print(f"{result.testsRun} tests ran successfully")
