import unittest
import testSetup
import testTearDown
import os
import sys

sys.path.append("myapp")
import test_create_user
sys.path.append("../../deployment/tests")

def load_tests(loader, standard_tests, pattern):
    test_suite = unittest.TestSuite()
    test_suite.addTests(loader.loadTestsFromModule(test_create_user))
    return test_suite

if __name__ == '__main__':
    unittest.main()