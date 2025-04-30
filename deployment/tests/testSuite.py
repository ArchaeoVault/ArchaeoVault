import unittest
import sys
import os
from myapp.models import users, permissions
env = os.environ.get('DJANGO_ENV', 'None')
if env == 'production':
    sys.path.append(os.path.abspath("app/myapp/tests"))
else:
    sys.path.append("myapp/tests")

import test_create_user
import test_artifact_model
import test_change_password
import test_resend_verification
import test_activation
import test_delete_artifact
import test_edit_artifact
import test_login_user
import test_send_password_reset
import test_single_artifact

sys.path.append("..")
#print("Current working directory:", os.getcwd())

sys.path.append("../../deployment/tests/UAT_tests")
def load_tests(loader, standard_tests, pattern):
    test_suite = unittest.TestSuite()
    """"
    test_suite.addTests(loader.loadTestsFromModule(test_create_user))
    test_suite.addTests(loader.loadTestsFromModule(test_artifact_model))
    test_suite.addTests(loader.loadTestsFromModule(test_change_password))
    test_suite.addTests(loader.loadTestsFromModule(test_resend_verification))
    test_suite.addTests(loader.loadTestsFromModule(test_activation))
    test_suite.addTests(loader.loadTestsFromModule(test_delete_artifact))
    test_suite.addTests(loader.loadTestsFromModule(test_edit_artifact))
    test_suite.addTests(loader.loadTestsFromModule(test_login_user))
    test_suite.addTests(loader.loadTestsFromModule(test_send_password_reset))
    test_suite.addTests(loader.loadTestsFromModule(test_single_artifact))
    """
    return test_suite