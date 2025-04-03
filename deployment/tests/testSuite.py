import unittest
import sys

sys.path.append("myapp/tests")
import app.myapp.tests.test_create_user
import app.myapp.tests.test_artifact_model
import app.myapp.tests.test_change_password
import app.myapp.tests.test_resend_verification
sys.path.append("..")


sys.path.append("../../deployment/tests/UAT_tests")
def load_tests(loader, standard_tests, pattern):
    test_suite = unittest.TestSuite()
    test_suite.addTests(loader.loadTestsFromModule(app.myapp.tests.test_create_user))
    test_suite.addTests(loader.loadTestsFromModule(app.myapp.tests.test_artifact_model))
    test_suite.addTests(loader.loadTestsFromModule(app.myapp.tests.test_change_password))
    test_suite.addTests(loader.loadTestsFromModule(app.myapp.tests.test_resend_verification))

    return test_suite

if __name__ == '__main__':
    unittest.main()