#!groovy


pipeline {
    agent any 
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
                sh  'env/bin/activate'
                sh 'env/bin/pip install -r requirements.txt'
                sh './app/manage.py test app/myapp'
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
            slackSend color: "good", message: "Build successful: `${env.JOB_NAME}#${env.BUILD_NUMBER}` <${env.BUILD_URL}|Open in Jenkins>"
        }

        failure{
            slackSend color: "danger", message: "Build failed :face_with_head_bandage: \n`${env.JOB_NAME}#${env.BUILD_NUMBER}` <${env.BUILD_URL}|Open in Jenkins>"
        }
    }
    

} 