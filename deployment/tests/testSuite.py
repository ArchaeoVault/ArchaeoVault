import unittest
import sys

sys.path.append("myapp/tests")
from app.myapp.tests import test_create_user
from app.myapp.tests import test_artifact_model
from app.myapp.tests import test_change_password
from app.myapp.tests import test_resend_verification
sys.path.append("..")


sys.path.append("../../deployment/tests/UAT_tests")
def load_tests(loader, standard_tests, pattern):
    test_suite = unittest.TestSuite()
    test_suite.addTests(loader.loadTestsFromModule(test_create_user))
    test_suite.addTests(loader.loadTestsFromModule(test_artifact_model))
    test_suite.addTests(loader.loadTestsFromModule(test_change_password))
    test_suite.addTests(loader.loadTestsFromModule(test_resend_verification))

    return test_suite

if __name__ == '__main__':
    unittest.main()