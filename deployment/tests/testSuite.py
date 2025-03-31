import unittest
import sys

sys.path.append("myapp")
import test_create_user
import test_artifact_model
sys.path.append("..")


sys.path.append("../../deployment/tests/UAT_tests")
def load_tests(loader, standard_tests, pattern):
    test_suite = unittest.TestSuite()
    test_suite.addTests(loader.loadTestsFromModule(test_create_user))
    test_suite.addTests(loader.loadTestsFromModule(test_artifact_model))

    return test_suite

if __name__ == '__main__':
    unittest.main()