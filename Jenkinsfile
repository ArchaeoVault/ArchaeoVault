#!groovy


pipeline {
    agent any 
    environment {
        ARCHAEODB_ENGINE = credentials('ARCHAEODB_ENGINE')
        ARCHAEODB_NAME = credentials('ARCHAEODB_NAME')
        ARCHAEODB_USER = credentials('ARCHAEODB_USER')
        ARCHAEODB_PASSWORD = credentials('ARCHAEODB_PASSWORD')
        ARCHAEODB_HOST = credentials('ARCHAEODB_HOST')
        ARCHAEODB_PORT = credentials('ARCHAEODB_PORT')
        DJANGO_ALLOWED_HOST_1 = credentials('DJANGO_ALLOWED_HOST_1')
        DJANGO_ALLOWED_HOST_2 = credentials('DJANGO_ALLOWED_HOST_2')
    }
    stages{ 
          
        stage('Notify'){
            steps{
                slackSend color: "warning", message: "Started `${env.JOB_NAME}#${env.BUILD_NUMBER}`\n"
            }
        }
        stage('Test'){
            steps{
                sh 'python3 -m venv env'
                sh 'chmod +x env/bin/activate'
                sh  '. env/bin/activate'
                sh 'env/bin/pip install -r requirements.txt'
                sh 'chmod +x ./app/manage.py'
                sh 'env/bin/python ./app/manage.py test app/myapp &> test_results.log'
            }
        }

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
            //slackSend color: "good", message: "Build successful: `${env.JOB_NAME}#${env.BUILD_NUMBER}` <${env.BUILD_URL}|Open in Jenkins>"
            sh 'cat test_results.log'
            script{
                def file_contents = readFile('./test_results.log')
                slackSend color: "good", message: "Build successful: `${env.JOB_NAME}#${env.BUILD_NUMBER}` <${env.BUILD_URL}|Open in Jenkins>"
                slackSend color: "good", message: "File Contents:\n'''" + file_contents + "'''"
            }
        }

        failure{
            script{
                def file_contents = readFile('test_results.log')
                slackSend color: "danger", message: "Build failed :face_with_head_bandage: \n`${env.JOB_NAME}#${env.BUILD_NUMBER}` <${env.BUILD_URL}|Open in Jenkins>"
                slackSend color: "danger", message: file_contents
            }
            
        }
    }
    

} 