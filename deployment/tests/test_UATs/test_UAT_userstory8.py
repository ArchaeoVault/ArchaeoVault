"""import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.chrome.options import Options
from django.test import LiveServerTestCase,TransactionTestCase
import os
from selenium.webdriver.firefox.options import Options
from pyvirtualdisplay import Display
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from myapp.models import users, permissions
import tempfile

class test_UAT_userstory8(LiveServerTestCase,TransactionTestCase):
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
		
		self.driver.get('http://localhost:3000/Login')
		self.driver.implicitly_wait(1)
		
		permission = permissions.objects.create(numval = 4, givenrole = 'GeneralPublic')
		test_user = users.objects.create(
        email='temp@email.com',
        upassword='password123',
        activated=True,
        upermission=permission
    	)
		test_user.save()
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
		artifact_page_button = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.LINK_TEXT, "Artifacts")))
		artifact_page_button.click()
		
		
	def test_can_see_artifacts_newport(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(by = By.LINK_TEXT, value = "Newport, RI").click()
		self.driver.implicitly_wait(1)
		first_artifact = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		self.assertIn("Tooth", first_artifact.text, f"Tooth not in {first_artifact.text}")
		artifact_list = self.driver.find_elements(by = By.CLASS_NAME, value = "artifact-item")
		self.assertGreater(len(artifact_list),0, "Length of artifacts was 0 or less")
		
	def test_can_see_artifacts_portsmouth(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(by = By.LINK_TEXT, value = "Portsmouth, RI").click()
		self.driver.implicitly_wait(1)
		first_artifact = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		self.assertIn("Lead", first_artifact.text, f"Lead not in artifact text {first_artifact.text}")
		artifact_list = self.driver.find_elements(by = By.CLASS_NAME, value = "artifact-item")
		self.assertGreater(len(artifact_list),0, "Length of artifacts was 0 or less")

	def test_can_turn_pages_forward_newport(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(by = By.LINK_TEXT, value = "Newport, RI").click()
		self.driver.implicitly_wait(1)
		self.driver.find_element(By.XPATH, "//button[text()='Next']").click()
		first_artifact = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		self.assertIn("Bone", first_artifact.text, f"Bone not in artifact text {first_artifact.text}")
	
	def test_can_turn_pages_forward_portsmouth(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(by = By.LINK_TEXT, value = "Portsmouth, RI").click()
		self.driver.implicitly_wait(1)
		self.driver.find_element(By.XPATH, "//button[text()='Next']").click()
		first_artifact = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		self.assertIn("Lead", first_artifact.text, f"Lead not in artifact text {first_artifact.text}")

	def test_can_turn_pages_forward_backward_newport(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(by = By.LINK_TEXT, value = "Newport, RI").click()
		self.driver.implicitly_wait(1)
		first_artifact = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		self.driver.find_element(By.XPATH, "//button[text()='Next']").click()
		self.driver.find_element(By.XPATH, "//button[text()='Previous']").click()
		first_artifact_after_clicks = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		self.assertEqual(first_artifact, first_artifact_after_clicks, f"artifact not the same after going forward and backward, artifact was {first_artifact} now is {first_artifact_after_clicks}")

		

	def test_can_turn_pages_forward_backward_portsmouth(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(by = By.LINK_TEXT, value = "Portsmouth, RI").click()
		self.driver.implicitly_wait(1)
		first_artifact = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		self.driver.find_element(By.XPATH, "//button[text()='Next']").click()
		self.driver.find_element(By.XPATH, "//button[text()='Previous']").click()
		first_artifact_after_clicks = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		self.assertEqual(first_artifact, first_artifact_after_clicks, f"artifact not the same after going forward and backward, artifact was {first_artifact} now is {first_artifact_after_clicks}")

	def test_turn_pages_to_end_newport(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(by = By.LINK_TEXT, value = "Newport, RI").click()
		self.driver.implicitly_wait(1)
		while(True):
			next_button = self.driver.find_element(By.XPATH, "//button[text()='Next']")
			if next_button.is_enabled():
				next_button.click()
			else:
				self.assertTrue(True)
				break

	def test_turn_pages_to_end_portsmouth(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(by = By.LINK_TEXT, value = "Portsmouth, RI").click()
		self.driver.implicitly_wait(1)
		while(True):
			next_button = self.driver.find_element(By.XPATH, "//button[text()='Next']")
			if next_button.is_enabled():
				next_button.click()
			else:
				break
		self.assertTrue(True)

	def test_previous_on_first_page_newport(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(by = By.LINK_TEXT, value = "Newport, RI").click()
		self.driver.implicitly_wait(1)
		previous_button = self.driver.find_element(By.XPATH, "//button[text()='Previous']")
		self.assertFalse(previous_button.is_enabled())

	def test_previous_on_first_page_portsmouth(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(by = By.LINK_TEXT, value = "Portsmouth, RI").click()
		self.driver.implicitly_wait(1)
		previous_button = self.driver.find_element(By.XPATH, "//button[text()='Previous']")
		self.assertFalse(previous_button.is_enabled())

	def tearDown(self):
		self.driver.close()

if __name__ == "__main__":
	unittest.main()"""
		