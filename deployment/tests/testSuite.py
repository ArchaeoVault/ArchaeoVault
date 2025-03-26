import unittest
import sys



sys.path.append("myapp")
import test_create_user
sys.path.append("../../deployment/tests/UAT_tests")
import test_UATs.test_UAT_userstory19

# Get the current working directory

#python3 manage.py test ../deployment/tests

def load_tests(loader, standard_tests, pattern):
    test_suite = unittest.TestSuite()
    test_suite.addTests(loader.loadTestsFromModule(test_create_user))
    test_suite.addTests(loader.loadTestsFromModule(test_UATs.test_UAT_userstory19))

    return test_suite

if __name__ == '__main__':
    unittest.main()