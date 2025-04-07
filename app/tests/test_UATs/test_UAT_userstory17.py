"""
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait

class test_UAT_userstory19(unittest.TestCase):
	def setUp(self):
		self.driver = webdriver.Chrome()
		self.driver.get("https://archaeovault.com")
		login_page_button = WebDriverWait(self.driver,10).until(EC.presence_of_element_located((By.LINK_TEXT, "Login")))
		login_page_button.click()
		signup_page_button = WebDriverWait(self.driver,10).until(EC.presence_of_element_located((By.LINK_TEXT, "Sign Up")))
		signup_page_button.click()


	def test_create_account_with_valid_email_with_valid_password(self):
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
		assert message == "Verification email sent"

	
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
		assert message == "An account with that email already exists"


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
		assert message == "Password is too short"


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
		assert message == "Passwords don't match"

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
		assert message == "Your password doesn't have any numbers"

	def test_create_account_with_valid_email_with_a_no_letter_password(self):
		self.driver.implicitly_wait(1)
		firstNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='First Name']")
		laststNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Last Name']")
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		confirmPasswordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Confirm Password']")
		firstNameBox.send_keys("John")
		laststNameBox.send_keys("Smith")
		emailBox.send_keys("temp3@email.com")
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
		assert message == "Your password doesn't have any letters"

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
		assert message == "An account with that email already exists, and the password doesn't have any numbers"

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
		assert message == "An account with that email already exists, and the password doesn't have any letters"

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
		assert message == "An account with that email already exists, and the password is too short"

	def test_create_account_with_a_long_first_name(self):
		self.driver.implicitly_wait(1)
		firstNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='First Name']")
		laststNameBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Last Name']")
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		confirmPasswordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Confirm Password']")
		firstNameBox.send_keys("DEJKASJLDELKFKDELLFDKLFDELKDFKLFWKKSFKSKFSLKFSLSDLDSMMSMDSMLDFSMSFLSDMLFSDMFMLSMLFSLMFWSLSLSFLQQQQQQQQQQ")
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
		assert message == "Your first name is too long"

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
		assert message == "Your last name is too long"



	def tearDown(self):
		self.driver.close()

if __name__ == "__main__":
	unittest.main() """