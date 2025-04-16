import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from django.test import LiveServerTestCase
from django.test import TestCase, Client
from django.contrib.auth.hashers import make_password, check_password
from myapp.models import users, permissions
import json
import os

class TestUATUserstory19(LiveServerTestCase,TestCase):
	port = 8000
	@classmethod
	def setUpTestData(cls):
		print("RUNNING setUpTestData")
		permissions.objects.create(numval = 4, givenrole = 'GeneralPublic')
		permission = permissions.objects.get(numval = 4, givenrole = 'GeneralPublic') 
		users.objects.create(
    	email="temp@email.com", upassword=make_password("password123"), activated = True, upermission = permission
		)
		print("All permissions:", list(permissions.objects.all()))
		print("All users:", list(users.objects.all()))



	def setUp(self):
		print("RUNNING setup")
		env = os.environ.get('DJANGO_ENV', 'None')
		if env == 'production':
			chrome_options = Options()
			chrome_options.add_argument("--headless=new") # for Chrome >= 109
			self.driver = webdriver.Chrome(options=chrome_options)
		else:
			options = Options()
			options.set_capability("goog:loggingPrefs", {"performance": "ALL"})
			self.driver = webdriver.Chrome(options = options)
		self.driver.get('http://localhost:3000')
		print(self.live_server_url)
		login_page_button = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.LINK_TEXT, "Login")))
		login_page_button.click()

	def test_valid_email_with_valid_password(self):
		self.driver.implicitly_wait(1)
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		emailBox.send_keys("temp@email.com")
		passwordBox.send_keys("password123")
		print(users.objects.all())
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Log In']")
		submitButton.click()

		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		"""
		for entry in self.driver.get_log("performance"):
			log = json.loads(entry["message"])["message"]
			if log["method"] == "Network.requestWillBeSent":
				url = log["params"]["request"]["url"]
				print(f"Frontend made request to: {url}")
		"""
		self.assertEqual(message, "Login successful!", f"{message} does not equal login successful")

	"""
	def test_valid_email_with_invalid_password(self):
		self.driver.implicitly_wait(1)
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		emailBox.send_keys("temp@email.com")
		passwordBox.send_keys("wrongpassword")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Log In']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		assert message == "Invalid Email or Password"

	def test_long_password(self):
		self.driver.implicitly_wait(1)
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		emailBox.send_keys("temp@email.com")
		passwordBox.send_keys("wrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpasswordwrongpassword")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Log In']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		assert message == "Invalid Email or Password"



	def test_long_email(self):
		self.driver.implicitly_wait(1)
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		emailBox.send_keys("temptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemptemp@email.com")
		passwordBox.send_keys("password123")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Log In']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		assert message == "Invalid Email or Password"

	"""
	
	def test_no_email_no_password(self):
		self.driver.implicitly_wait(1)
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		emailBox.click()
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Log In']")
		try:
			validation_message = emailBox.get_attribute("validationMessage")
		except:
			print("No validation message found.")
		assert validation_message == "Please fill out this field."


	def test_valid_email_no_password(self):
		self.driver.implicitly_wait(1)
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		emailBox.send_keys("temp@email.com")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Log In']")
		try:
			validation_message = passwordBox.get_attribute("validationMessage")
		except:
			print("No validation message found.")
		assert validation_message == "Please fill out this field."
	

	def test_no_email_valid_password(self):
		self.driver.implicitly_wait(1)
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		passwordBox.send_keys("password")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Log In']")
		try:
			validation_message = emailBox.get_attribute("validationMessage")
		except:
			print("No validation message found.")
		assert validation_message == "Please fill out this field."

	def test_email_sql_injection(self):
		self.driver.implicitly_wait(1)
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		emailBox.send_keys("temp@email.com = 1' or '1' = '1")
		passwordBox.send_keys("password123")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Log In']")
		submitButton.click()
		try:
			validation_message = emailBox.get_attribute("validationMessage")
		except:
			print("No validation message found.")
		assert validation_message == "A part following '@' should not contain the symbol ' '."
	"""
	def test_password_sql_injection(self):
		self.driver.implicitly_wait(1)
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		emailBox.send_keys("temp@email.com")
		passwordBox.send_keys("password123 = 1' or '1' = '1")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Log In']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		assert message == "Invalid Username or Password"
		
	def test_forgot_password_button(self):
		self.driver.implicitly_wait(1)
		forgotPasswordButton = self.driver.find_element(by = By.LINK_TEXT, value = "Forgot Password?")
		forgotPasswordButton.click()
		assert True"""

	def tearDown(self):
		self.driver.close()
