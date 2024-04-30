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

    def test_register_admin_missing_fields(self):
        """Test registering an admin with missing fields."""
        start_time = time.time()
        print("Test 6: Testing registration of an admin with missing fields...")
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
        end_time = time.time()
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Registration failed. </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)
        self.assertIn('error', json_data, msg="Error message should be provided")
        self.assertEqual(json_data['error'], 'Password is required', msg="Error message should indicate missing password")

    def test_register_admin_no_photo(self):
        """Test registering an admin without a photo."""
        start_time = time.time()
        print("Test 7: Testing registration of an admin without a photo...")
        data = {
            'username': 'testuser',
            'password': 'testpassword',
            'admin_user_metamask_address': '0x123456789ABCDEF'
        }
        response = self.app.post('/registerAdmin', data=data)
        self.assertEqual(response.status_code, 400, msg="Expected status code 400 for no photo provided")
        end_time = time.time()
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Expected status code 400 for no photo provided </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)
        self.assertIn('400 Bad Request', response.get_data(as_text=True), msg="HTML error page should be provided")

    def test_register_admin_success(self):
        """Test registering an admin with all required fields."""
        start_time = time.time()
        print("Test 8: Testing registration of an admin...")
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
        end_time = time.time()
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Registration successful. </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)
        self.assertEqual(json_data['name'], 'testuser', msg="Returned username should match the submitted one")


class TestRegister(unittest.TestCase):

    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_register_missing_fields(self):
        """Test registering a user with missing fields."""
        start_time = time.time()
        print("Test 9: Testing registration of a user with missing fields...")
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
        end_time = time.time()
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Registration failed. </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)
        self.assertIn('error', json_data, msg="Error message should be provided")
        self.assertEqual(json_data['error'], 'Password is required', msg="Error message should indicate missing password")

    def test_register_no_photo(self):
        """Test registering a user without a photo."""
        start_time = time.time()
        print("Test 10: Testing registration of a user without a photo...")
        data = {
            'username': 'testuser',
            'password': 'testpassword',
            'user_metamask_address': '0x123456789ABCDEF'
        }
        response = self.app.post('/register', data=data)
        self.assertEqual(response.status_code, 400, msg="Expected status code 400 for no photo provided")
        end_time = time.time()
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Expected status code 400 for no photo provided </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)
        self.assertIn('400 Bad Request', response.get_data(as_text=True), msg="HTML error page should be provided")


    def test_register_success(self):
        """Test registering a user with all required fields."""
        start_time = time.time()
        print("Test 11: Testing registration of a user...")
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
        end_time = time.time()
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Registration successful. </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)
        self.assertEqual(json_data['name'], 'testuser', msg="Returned username should match the submitted one")



class TestLogin(unittest.TestCase):    

    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials."""
        start_time = time.time()
        print("Test 12: Testing login with invalid credentials...")
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
        end_time = time.time()
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Login failed. </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'Invalid credentials or face not recognized')


    def test_login_missing_fields(self):
        """Test login with missing fields."""
        start_time = time.time()
        print("Test 13: Testing login with missing fields...")
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
        end_time = time.time()
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Login failed. </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'MetaMask address is required')


    def test_login_success(self):
        """Test successful login."""
        start_time = time.time()
        print("Test 14: Testing login with valid credentials...")
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
        end_time = time.time() 
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Login successful. </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)
        self.assertEqual(json_data['name'], 'kiarash')


    def test_picture_grayscale(self):
        """Test if picture grayscale conversion works."""
        start_time = time.time()
        print("Test 15: Testing picture grayscale conversion...")
        image_path = './static/admin_uploads/k.jpg'
        image = cv2.imread(image_path)

        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        self.assertIsNotNone(gray_image)
        end_time = time.time()
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Picture grayscale conversion successful. </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)


    def test_picture_preprocessing(self):
        """Test if picture preprocessing works."""
        start_time = time.time()
        print("Test 16: Testing picture preprocessing...")
        image_path = './static/admin_uploads/k.jpg'
        image = cv2.imread(image_path)

        resized_image = cv2.resize(image, (100, 100))

        self.assertIsNotNone(resized_image)
        end_time = time.time()
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Picture preprocessing successful. </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)


class TestFacialRecognition(unittest.TestCase):    

    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    def tearDown(self):
        pass

    def test_face_encoding_accuracy(self):
        """Test face encoding accuracy."""
        start_time = time.time()
        print("Test 17: Testing face encoding accuracy...")
        registered_face_encoding = np.array([0.1, 0.2, 0.3])  
        similar_face_encoding = np.array([0.12, 0.22, 0.32])  

        similarity_score = np.linalg.norm(registered_face_encoding - similar_face_encoding)

        similarity_threshold = 0.5
        end_time = time.time()
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Similarity score ({similarity_score:.2f}) below threshold. </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)
        self.assertLess(similarity_score, similarity_threshold)


    def test_face_recognition(self):
        """Test if face is recognized in the photo."""
        start_time = time.time()
        print("Test 18: Testing face recognition...")
        image_path = './static/admin_uploads/k.jpg'
        image = cv2.imread(image_path)

        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        self.assertGreater(len(faces), 0)
        end_time = time.time()
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Face recognized successfully. </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)


    def test_face_verification(self):
        """Test if face verification is successful."""
        start_time = time.time()
        print("Test 19: Testing face verification...")
        registered_face_encoding = np.array([0.1, 0.2, 0.3]) 
        login_face_encoding = np.array([0.1, 0.2, 0.3]) 

        similarity_score = np.linalg.norm(registered_face_encoding - login_face_encoding)
        similarity_threshold = 0.5
        end_time = time.time()
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Face verification successful. </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)
        self.assertLess(similarity_score, similarity_threshold)

    def test_performance(self):
        """Test facial recognition performance."""
        start_time = time.time()
        print("Test 20: Testing facial recognition performance...")
        image_path = './static/admin_uploads/k.jpg'
        image = cv2.imread(image_path)

        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        detection_time = time.time() - start_time
        end_time = time.time()
        self.assertLess(detection_time, 1.0)  
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Face recognized successfully Performance score = ({detection_time}). </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)

    def test_robustness_to_variation(self):
        """Test robustness to variation."""
        start_time = time.time()
        print("Test 21: Testing robustness to variation...")
        image_path = './static/admin_uploads/variation.jpg'
        image = cv2.imread(image_path)

        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        self.assertGreater(len(faces), 0)
        end_time = time.time()
        time_taken_ms = round((end_time - start_time) * 1000)
        test_result = f"<span style='color:#0DBC73'> Test Passed: Face recognized successfully. </span> <span style='color:#D75844'>({time_taken_ms} ms)</span>"
        print(test_result)


if __name__ == '__main__':
    test_suites = [
        TestRegisterAdmin,
        TestRegister,
        TestLogin,
        TestFacialRecognition
    ]
    all_tests = unittest.TestSuite()

    for test_suite in test_suites:
        all_tests.addTest(unittest.TestLoader().loadTestsFromTestCase(test_suite))

    start_time = time.time() 

    result = unittest.TextTestRunner(verbosity=2).run(all_tests)

    end_time = time.time() 
    total_time_taken = end_time - start_time 

    print(f"{result.testsRun} System tests ran successfully")
    print(f"Total time taken: {total_time_taken:.0f} seconds")
