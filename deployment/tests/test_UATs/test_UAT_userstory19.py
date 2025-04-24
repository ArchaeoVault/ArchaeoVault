"""
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options
from pyvirtualdisplay import Display
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.firefox.options import Options
import chromedriver_autoinstaller
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from django.test import TestCase, Client, LiveServerTestCase,TransactionTestCase
from django.contrib.auth.hashers import make_password, check_password
from myapp.models import users, permissions
from django.db import connection
import json
import os
import tempfile
import shutil
import time
import subprocess

class test_UAT_userstory19(LiveServerTestCase,TransactionTestCase):
	port = 8000
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
		
		self.driver.get('http://localhost:3000/login')

		# Create a test user
		permission = permissions.objects.create(numval = 4, givenrole = 'GeneralPublic')
		test_user = users.objects.create(
        email='temp@email.com',
        upassword='password123',
        activated=True,
        upermission=permission
    	)
		test_user.save()

	def test_valid_email_with_valid_password(self):
		self.driver.implicitly_wait(1)
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		emailBox.send_keys('temp@email.com')
		passwordBox.send_keys('password123')
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Log In']")
		submitButton.click()

		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		self.assertEqual(message, "Login successful!", f"{message} does not equal login successful")

	
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
		self.assertEqual(message,"Passwords do not match", f"The alert says{message} instead of Passwords do not match")
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
		self.assertEqual(message,"Passwords do not match", f"The alert says{message} instead of Passwords do not match")


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
		self.assertEqual(message,"Invalid credentials", "long password has messed up the login process")
	
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
		self.assertEqual(validation_message,"Please fill out this field.", "failed to handle no username or password")


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
		self.assertEqual(validation_message,"Please fill out this field.", "failed to valid username with no password")
	

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
		self.assertEqual(validation_message,"Please fill out this field.", "failed to handle no username with valid password")

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
		assert (validation_message == "A part following '@' should not contain the symbol ' '." or validation_message == "Please enter an email address.")

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
		self.assertEqual(message,"Passwords do not match", "failed to handle sql injection properly")

	def tearDown(self):
		self.driver.close()
		self.driver.quit()"""
