#!groovy


pipeline {
    agent any 
    stages{ 
          
        stage('Notify'){
            steps{
                slackSend color: "warning", message: "Started `${env.JOB_NAME}#${env.BUILD_NUMBER}`\n"
            }
        }
        /*
        stage 'Test'
            sh 'virtualenv env -p python3.10'
            sh '. env/bin/activate'
            sh 'env/bin/pip install -r requirements.txt'
            sh 'env/bin/python3.10 manage.py test --testrunner=blog.tests.test_runners.NoDbTestRunner'
        */
        stage('Deploy'){
            when { branch 'main' }
            steps{
                sh 'chmod +x ./deployment/deploy_prod.sh'
                sh './deployment/deploy_prod.sh'
            }
            
        }
                    
                
                
    }
    post{
        success{
            slackSend color: "good", message: "Build successful: `${env.JOB_NAME}#${env.BUILD_NUMBER}` <${env.BUILD_URL}|Open in Jenkins>"
        }

        failure{
            slackSend color: "danger", message: "Build failed :face_with_head_bandage: \n`${env.JOB_NAME}#${env.BUILD_NUMBER}` <${env.BUILD_URL}|Open in Jenkins>"
        }
    }
    

} 