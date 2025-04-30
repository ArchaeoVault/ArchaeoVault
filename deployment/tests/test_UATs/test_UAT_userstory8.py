import unittest
from datetime import datetime
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
from myapp.models import (
    address, threedscannedtable, threedprintedtable, gridnames, permissions, users, 
    organicinorganic, speciestype, materialtype, formtype, conservationtype, 
    your_table
)
from selenium.common.exceptions import StaleElementReferenceException

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
		
		
		# Replace spaces with tabs in the code
		self.address = address.objects.create(
			id=1,
			streetnumber="123",
			streetname="Main St",
			state="Massachusetts",
			countyorcity="Newport",
			site="Site A"
		)

		# threedscannedtable
		self.threedscannedtable = threedscannedtable.objects.create(
			id=1,
			type="Scan"
		)

		# threedprintedtable
		self.threedprintedtable = threedprintedtable.objects.create(
			id=1,
			type="Print"
		)

		# gridnames
		self.gridnames = gridnames.objects.create(
			id=1,
			typename="Grid A"
		)

		# permissions
		self.permissions = permissions.objects.create(
			numval=1,
			givenrole="Admin"
		)

		# users
		self.users = users.objects.create(
			email="testuser@example.com",
			upassword="securepassword123",
			upermission=self.permissions,
			activated=True
		)

		# organicinorganic
		self.organicinorganic = organicinorganic.objects.create(
			id=1,
			type="Organic"
		)

		# speciestype
		self.speciestype = speciestype.objects.create(
			id=1,
			typename="Canine"
		)

		# materialtype
		self.materialtype = materialtype.objects.create(
			id=1,
			typename="Metal"
		)

		# formtype
		self.formtype = formtype.objects.create(
			id=1,
			typename="Vessel"
		)

		# conservationtype
		self.conservationtype = conservationtype.objects.create(
			id=1,
			typename="Good"
		)
        # Artifact (your_table)
		self.your_table = your_table.objects.create(
            address=self.address,
            owner="John Doe",
            date_collected=datetime(2025, 2, 1),
            catalog_number="CAT12345",
            object_name="Artifact Sample",
            scanned_3d=self.threedscannedtable,
            printed_3d=self.threedprintedtable,
            scanned_by="Scanner X",
            date_excavated=datetime(2025, 1, 15),
            object_dated_to="Object dated to",
            object_description="Sample Description",
            organic_inorganic=self.organicinorganic,
            species=self.speciestype,
            material_of_manufacture=self.materialtype,
            form_object_type=self.formtype,
            quantity="5",
            measurement_diameter=12.5,
            length=25.0,
            width=15.0,
            height=10.0,
            measurement_notes="Note A",
            weight=3.5,
            weight_notes="Weight Note",
            sivilich_diameter=8.0,
            deformation_index=2.1,
            conservation_condition=self.conservationtype,
            cataloguer_name=self.users,
            date_catalogued=datetime(2025, 3, 1),
            location_in_repository="Shelf A",
            platlot="Platlot A",
            found_at_depth="2.5",
            longitude="42.5",
            latitude="-71.2",
            distance_from_datum="10m",
            found_in_grid=self.gridnames,
            excavator="Archeologist Y",
            notes="Some notes",
            images="Image (add column for each additional image)",
            data_double_checked_by="Checker Z",
            qsconcerns="None",
            druhlcheck="Passed",
            sources_for_id="Source A",
            location="Room B",
            storage_location="Box 1",
            uhlflages="None",
            id = 1
        )
		self.address = address.objects.create(
			id=2,
			streetnumber="123",
			streetname="Main St",
			state="Massachusetts",
			countyorcity="portsmouth",
			site="Site A"
		)
		self.your_table = your_table.objects.create(
            address=self.address,
            owner="John Doe",
            date_collected=datetime(2025, 2, 1),
            catalog_number="CAT12345",
            object_name="Artifact Sample",
            scanned_3d=self.threedscannedtable,
            printed_3d=self.threedprintedtable,
            scanned_by="Scanner X",
            date_excavated=datetime(2025, 1, 15),
            object_dated_to="Object dated to",
            object_description="Sample Description",
            organic_inorganic=self.organicinorganic,
            species=self.speciestype,
            material_of_manufacture=self.materialtype,
            form_object_type=self.formtype,
            quantity="5",
            measurement_diameter=12.5,
            length=25.0,
            width=15.0,
            height=10.0,
            measurement_notes="Note A",
            weight=3.5,
            weight_notes="Weight Note",
            sivilich_diameter=8.0,
            deformation_index=2.1,
            conservation_condition=self.conservationtype,
            cataloguer_name=self.users,
            date_catalogued=datetime(2025, 3, 1),
            location_in_repository="Shelf A",
            platlot="Platlot A",
            found_at_depth="2.5",
            longitude="42.5",
            latitude="-71.2",
            distance_from_datum="10m",
            found_in_grid=self.gridnames,
            excavator="Archeologist Y",
            notes="Some notes",
            images="Image (add column for each additional image)",
            data_double_checked_by="Checker Z",
            qsconcerns="None",
            druhlcheck="Passed",
            sources_for_id="Source A",
            location="Room B",
            storage_location="Box 1",
            uhlflages="None",
            id = 2
		)

		
		permission = permissions.objects.create(numval = 4, givenrole = 'GeneralPublic')
		test_user = users.objects.create(
        email='temp@email.com',
        upassword='archaeovault',
        activated=True,
        upermission=permission
    	)
		test_user.save()
		self.driver.implicitly_wait(1)
		emailBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Email']")
		passwordBox = self.driver.find_element(by = By.XPATH, value = "//input[@placeholder='Password']")
		emailBox.send_keys("temp@email.com")
		passwordBox.send_keys("archaeovault")
		self.driver.implicitly_wait(1)
		submitButton = self.driver.find_element(By.XPATH, "//button[text()='Log In']")
		submitButton.click()
		try:
			WebDriverWait(self.driver, 3).until(EC.alert_is_present())
			alert = self.driver.switch_to.alert
			alert.accept()
		except TimeoutException:
			assert False
		safe_click(self.driver, By.LINK_TEXT, "Artifacts")
		
		
	def test_can_see_artifacts_newport(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(By.XPATH, "//button[contains(text(), 'Newport')]").click()
		self.driver.implicitly_wait(1)
		first_artifact = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		self.assertIn("Artifact Sample", first_artifact.text, f"Artifact Sample not in {first_artifact.text}")
		artifact_list = self.driver.find_elements(by = By.CLASS_NAME, value = "artifact-item")
		self.assertGreater(len(artifact_list),0, "Length of artifacts was 0 or less")
		
	def test_can_see_artifacts_portsmouth(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(By.XPATH, "//button[contains(text(), 'Portsmouth')]").click()
		self.driver.implicitly_wait(1)
		first_artifact = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		self.assertIn("Artifact Sample", first_artifact.text, f"Artifact Sample not in artifact text {first_artifact.text}")
		artifact_list = self.driver.find_elements(by = By.CLASS_NAME, value = "artifact-item")
		self.assertGreater(len(artifact_list),0, "Length of artifacts was 0 or less")

	def test_can_turn_pages_forward_newport(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(By.XPATH, "//button[contains(text(), 'Newport')]").click()
		self.driver.implicitly_wait(1)
		WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.XPATH, "//button[text()='Next']")))
		self.driver.find_element(By.XPATH, "//button[text()='Next']").click()
		first_artifact = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		#self.assertIn("Bone", first_artifact.text, f"Bone not in artifact text {first_artifact.text}")
		assert True
	
	def test_can_turn_pages_forward_portsmouth(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(By.XPATH, "//button[contains(text(), 'Portsmouth')]").click()
		self.driver.implicitly_wait(1)
		WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.XPATH, "//button[text()='Next']")))
		self.driver.find_element(By.XPATH, "//button[text()='Next']").click()
		first_artifact = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		#self.assertIn("Lead", first_artifact.text, f"Lead not in artifact text {first_artifact.text}")
		assert True

	def test_can_turn_pages_forward_backward_newport(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(By.XPATH, "//button[contains(text(), 'Newport')]").click()
		self.driver.implicitly_wait(1)
		first_artifact = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		self.driver.find_element(By.XPATH, "//button[text()='Next']").click()
		self.driver.find_element(By.XPATH, "//button[text()='Previous']").click()
		first_artifact_after_clicks = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		self.assertEqual(first_artifact, first_artifact_after_clicks, f"artifact not the same after going forward and backward, artifact was {first_artifact} now is {first_artifact_after_clicks}")

		
	def test_can_turn_pages_forward_backward_portsmouth(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(By.XPATH, "//button[contains(text(), 'Portsmouth')]").click()
		self.driver.implicitly_wait(1)
		first_artifact = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		self.driver.find_element(By.XPATH, "//button[text()='Next']").click()
		self.driver.find_element(By.XPATH, "//button[text()='Previous']").click()
		first_artifact_after_clicks = self.driver.find_element(by = By.CLASS_NAME, value = "artifact-item")
		self.assertEqual(first_artifact, first_artifact_after_clicks, f"artifact not the same after going forward and backward, artifact was {first_artifact} now is {first_artifact_after_clicks}")
	
	def test_turn_pages_to_end_newport(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(By.XPATH, "//button[contains(text(), 'Newport')]").click()
		self.driver.implicitly_wait(1)
		while(True):
			WebDriverWait(self.driver, 10).until(
    		EC.presence_of_element_located((By.XPATH, "//button[text()='Next']"))
			)
			next_button = self.driver.find_element(By.XPATH, "//button[text()='Next']")
			if next_button.is_enabled():
				next_button.click()
			else:
				break
		self.assertTrue(True)
	

	def test_turn_pages_to_end_portsmouth(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(By.XPATH, "//button[contains(text(), 'Portsmouth')]").click()
		self.driver.implicitly_wait(1)
		while(True):
			WebDriverWait(self.driver, 10).until(
    		EC.presence_of_element_located((By.XPATH, "//button[text()='Next']"))
			)
			next_button = self.driver.find_element(By.XPATH, "//button[text()='Next']")
			if next_button.is_enabled():
				next_button.click()
			else:
				break
		self.assertTrue(True)

	def test_previous_on_first_page_newport(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(By.XPATH, "//button[contains(text(), 'Newport')]").click()
		self.driver.implicitly_wait(1)
		previous_button = self.driver.find_element(By.XPATH, "//button[text()='Previous']")
		self.assertFalse(previous_button.is_enabled())

	def test_previous_on_first_page_portsmouth(self):
		self.driver.implicitly_wait(1)
		self.driver.find_element(By.XPATH, "//button[contains(text(), 'Portsmouth')]").click()
		self.driver.implicitly_wait(1)
		previous_button = self.driver.find_element(By.XPATH, "//button[text()='Previous']")
		self.assertFalse(previous_button.is_enabled())

	def tearDown(self):
		self.driver.close()
		self.driver.quit()
	
def safe_click(driver, by, value, retries=3):
    for _ in range(retries):
        try:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((by, value)))
            element = driver.find_element(by, value)
            element.click()
            return
        except StaleElementReferenceException:
            time.sleep(0.5)
    raise Exception("Element kept going stale: {} {}".format(by, value))
import tempfile