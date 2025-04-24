"""
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from django.test import LiveServerTestCase,TransactionTestCase
import os
from selenium.webdriver.firefox.options import Options
from pyvirtualdisplay import Display
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from myapp.models import users, permissions
import tempfile

class test_UAT_userstory17(LiveServerTestCase,TransactionTestCase):
	port=8000
	def setUp(self):
		env = os.environ.get('DJANGO_ENV', 'None')
		if env == 'production':
			# Start virtual display
			display = Display(visible=0, size=(1280, 800))
			display.start()

			self.user_data_dir = tempfile.mkdtemp()
			options = Options()
			options.add_argument(f"--user-data-dir={self.user_data_dir}")
			options.headless = True

			# Start the browser
			self.driver = webdriver.Firefox(options=options)
		else:
			options = Options()
			options.set_capability("goog:loggingPrefs", {"performance": "ALL"})
			options.headless = True
			self.driver = webdriver.Chrome(options = options)
		
		self.driver.get('http://localhost:3000/signup')

		# Create a test user
		permission = permissions.objects.create(numval = 4, givenrole = 'GeneralPublic')
		test_user = users.objects.create(
        email='temp@email.com',
        upassword='password123',
        activated=True,
        upermission=permission
    	)
		test_user.save()


	def test_create_account_with_valid_email_with_valid_password(self):
		self.driver.implicitly_wait(1)
		firstNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='First Name']")
		laststNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Last Name']")
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		confirmPasswordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Confirm Password']")
		firstNameBox.send_keys("John")
		laststNameBox.send_keys("Smith")
		emailBox.send_keys("temp1@email.com")
		passwordBox.send_keys("password123")
		confirmPasswordBox.send_keys("password123")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Sign Up']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		self.assertEqual(message, "Sign up successful!", "failed to make account with valid credentials")

	
	def test_create_account_with_duplicate_email_with_valid_password(self):
		self.driver.implicitly_wait(1)
		firstNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='First Name']")
		laststNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Last Name']")
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		confirmPasswordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Confirm Password']")
		firstNameBox.send_keys("John")
		laststNameBox.send_keys("Smith")
		emailBox.send_keys("temp@email.com")
		passwordBox.send_keys("password123")
		confirmPasswordBox.send_keys("password123")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Sign Up']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		self.assertIn("User with this email already exists", message, "Creating account with duplicate email threw an error")


	def test_create_account_with_valid_email_with_short_password(self):
		self.driver.implicitly_wait(1)
		firstNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='First Name']")
		laststNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Last Name']")
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		confirmPasswordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Confirm Password']")
		firstNameBox.send_keys("John")
		laststNameBox.send_keys("Smith")
		emailBox.send_keys("temp1@email.com")
		passwordBox.send_keys("p123")
		confirmPasswordBox.send_keys("p123")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Sign Up']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		self.assertEqual(message,"Passwword is too short", "Using a short password threw an error")


	def test_create_account_with_valid_email_with_mismatched_password(self):
		self.driver.implicitly_wait(1)
		firstNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='First Name']")
		laststNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Last Name']")
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		confirmPasswordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Confirm Password']")
		firstNameBox.send_keys("John")
		laststNameBox.send_keys("Smith")
		emailBox.send_keys("temp2@email.com")
		passwordBox.send_keys("password123")
		confirmPasswordBox.send_keys("Password123")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Sign Up']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		self.assertEqual(message,"Passwords do not match.", "Mismatched passwords threw an error")

	def test_create_account_with_valid_email_with_a_no_number_password(self):
		self.driver.implicitly_wait(1)
		firstNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='First Name']")
		laststNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Last Name']")
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		confirmPasswordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Confirm Password']")
		firstNameBox.send_keys("John")
		laststNameBox.send_keys("Smith")
		emailBox.send_keys("temp3@email.com")
		passwordBox.send_keys("password")
		confirmPasswordBox.send_keys("password")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Sign Up']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		self.assertEqual(message, "Sign up successful!", "password with no numbers threw an error")

	def test_create_account_with_valid_email_with_a_no_letter_password(self):
		self.driver.implicitly_wait(1)
		firstNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='First Name']")
		laststNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Last Name']")
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		confirmPasswordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Confirm Password']")
		firstNameBox.send_keys("John")
		laststNameBox.send_keys("Smith")
		emailBox.send_keys("temp1@email.com")
		passwordBox.send_keys("12345678")
		confirmPasswordBox.send_keys("12345678")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Sign Up']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		self.assertEqual(message,"Your password doesn't have any letters", "password with no letters threw an error")

	def test_create_account_with_duplicate_email_with_a_no_number_password(self):
		self.driver.implicitly_wait(1)
		firstNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='First Name']")
		laststNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Last Name']")
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		confirmPasswordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Confirm Password']")
		firstNameBox.send_keys("John")
		laststNameBox.send_keys("Smith")
		emailBox.send_keys("temp@email.com")
		passwordBox.send_keys("password")
		confirmPasswordBox.send_keys("password")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Sign Up']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		self.assertIn("User with this email already exists", message, "Creating account with duplicate email threw an error")

	def test_create_account_with_duplicate_email_with_a_no_letter_password(self):
		self.driver.implicitly_wait(1)
		firstNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='First Name']")
		laststNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Last Name']")
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		confirmPasswordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Confirm Password']")
		firstNameBox.send_keys("John")
		laststNameBox.send_keys("Smith")
		emailBox.send_keys("temp@email.com")
		passwordBox.send_keys("123")
		confirmPasswordBox.send_keys("123")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Sign Up']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		self.assertIn("User with this email already exists", message, "Creating account with duplicate email threw an error")

	def test_create_account_with_duplicate_email_with_a_short_password(self):
		self.driver.implicitly_wait(1)
		firstNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='First Name']")
		laststNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Last Name']")
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		confirmPasswordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Confirm Password']")
		firstNameBox.send_keys("John")
		laststNameBox.send_keys("Smith")
		emailBox.send_keys("temp@email.com")
		passwordBox.send_keys("p123")
		confirmPasswordBox.send_keys("p123")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Sign Up']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		self.assertIn("User with this email already exists", message, "Creating account with duplicate email threw an error")

	def test_create_account_with_a_long_first_name(self):
		self.driver.implicitly_wait(1)
		firstNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='First Name']")
		laststNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Last Name']")
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		confirmPasswordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Confirm Password']")
		firstNameBox.send_keys("DEJKASJLDELKFKDELLFDKLFDELKDFKLFWKKSFKSKFSLKFSLSDLDSMMSMDSMLDFSMSFLSDMLFSDMFMLSMLFSLMFWSLSLSFLQQQQQQQQQQDEJKASJLDELKFKDELLFDKLFDELKDFKLFWKKSFKSKFSLKFSLSDLDSMMSMDSMLDFSMSFLSDMLFSDMFMLSMLFSLMFWSLSLSFLQQQQQQQQQQDEJKASJLDELKFKDELLFDKLFDELKDFKLFWKKSFKSKFSLKFSLSDLDSMMSMDSMLDFSMSFLSDMLFSDMFMLSMLFSLMFWSLSLSFLQQQQQQQQQQDEJKASJLDELKFKDELLFDKLFDELKDFKLFWKKSFKSKFSLKFSLSDLDSMMSMDSMLDFSMSFLSDMLFSDMFMLSMLFSLMFWSLSLSFLQQQQQQQQQQ")
		laststNameBox.send_keys("Smith")
		emailBox.send_keys("temp4@email.com")
		passwordBox.send_keys("password123")
		confirmPasswordBox.send_keys("password123")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Sign Up']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		self.assertEqual(message,"Your first name is too long","Long first name threw an error")

	def test_create_account_with_a_long_last_name(self):
		self.driver.implicitly_wait(1)
		firstNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='First Name']")
		laststNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Last Name']")
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		confirmPasswordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Confirm Password']")
		firstNameBox.send_keys("John")
		laststNameBox.send_keys("DEJKASJLDELKFKDELLFDKLFDELKDFKLFWKKSFKSKFSLKFSLSDLDSMMSMDSMLDFSMSFLSDMLFSDMFMLSMLFSLMFWSLSLSFLQQQQQQQQQQ")
		emailBox.send_keys("temp4@email.com")
		passwordBox.send_keys("password123")
		confirmPasswordBox.send_keys("password123")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Sign Up']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		self.assertEqual(message, "Your last name is too long","Long last name threw an error")



	def tearDown(self):
		self.driver.close()
		self.driver.quit()"""