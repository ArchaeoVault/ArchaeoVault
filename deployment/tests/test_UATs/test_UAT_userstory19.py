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
import os
import tempfile
import shutil
import time
import subprocess




class test_UAT_userstory19(unittest.TestCase):

	def setUp(self):
		env = os.environ.get('DJANGO_ENV', 'None')
		if env == 'selenium':
			# Start virtual display
			display = Display(visible=0, size=(1280, 800))
			display.start()

			
			#chromedriver_autoinstaller.install()
			#chrome_options = webdriver.ChromeOptions()
			# raise ValueError('$$$$$$$$$$$' + chrome_options.user_data_dir)
			#chrome_options.add_argument("--headless=new") # for Chrome >= 109

			#chrome_options.add_argument("--no-sandbox")
			#chrome_options.add_argument("--disable-blink-features=AutomationControlled")
			#chrome_options.add_argument("--disable-dev-shm-usage")
			#chrome_options.add_argument("--disable-gpu")
			#chrome_options.add_argument("--remote-debugging-port=9222")
			self.user_data_dir = tempfile.mkdtemp()
			#chrome_options.add_argument(f"--user-data-dir={self.user_data_dir}")

			#chrome_options.binary_location = "/usr/bin/google-chrome"
			#CHROMEDRIVER_PATH = '/usr/bin/chromedriver'
			#s = Service(CHROMEDRIVER_PATH)
			#self.driver = webdriver.Chrome(options=chrome_options, service=service)

			##self.driver = webdriver.Chrome(service=s, options=chrome_options)
			#self.driver = webdriver.Chrome(options=chrome_options)
			options = Options()
			options.add_argument(f"--user-data-dir={self.user_data_dir}")
			options.headless = True

			# Start the browser
			self.driver = webdriver.Firefox(options=options)
		else:
			self.driver = webdriver.Chrome()
		time.sleep(10)
		self.driver.get("http://152.42.155.23:3000/")
		login_page_button = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.LINK_TEXT, "Login")))
		login_page_button.click()

	"""
	def test_valid_email_with_valid_password(self):
		self.driver.implicitly_wait(1)
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		emailBox.send_keys("temp@email.com")
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
		assert message == "Login successful!"

	
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
		self.driver.quit()
		shutil.rmtree(self.user_data_dir, ignore_errors=True)

if __name__ == "__main__":
	unittest.main()