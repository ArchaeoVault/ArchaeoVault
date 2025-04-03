import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options
import os

class test_UAT_userstory19(unittest.TestCase):
	def setUp(self):
		env = os.environ.get('DJANGO_ENV', 'None')
		if env == 'production':
			chrome_options = Options()
			chrome_options.add_argument("--headless=new") # for Chrome >= 109
			self.driver = webdriver.Chrome(options=chrome_options)
		else:
			self.driver = webdriver.Chrome()
		self.driver.get("http://localhost:3000")
		login_page_button = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.LINK_TEXT, "Login")))
		login_page_button.click()
		self.driver.implicitly_wait(1)
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		emailBox.send_keys("testingarchaeo@gmail.com")
		passwordBox.send_keys("a")
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Log In']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			message = alert.text
			alert.accept()
		except TimeoutException:
			assert False
		artifact_page_button = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.LINK_TEXT, "Artifacts")))
		artifact_page_button.click()
		
		
	def test_can_see_artifacts_newport(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(by = By.LINK_TEXT, value = "Newport, RI").click()
		self.driver.implicitly_wait(1)
		first_artifact = self.driver.find_element(by = By.CLASS_NAME, value = "artifact")
		print(first_artifact.text)
		artifact_list = self.driver.find_elements(by = By.CLASS_NAME, value = "artifact-item")
		self.assertGreater(len(artifact_list),0, "Length of artifacts was 0 or less")

	def tearDown(self):
		self.driver.close()

if __name__ == "__main__":
	unittest.main()
		