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
        DJANGO_ENV = credentials('DJANGO_ENV')
    }
    stages{ 
          
        stage('Notify'){
            steps{
                slackSend color: "warning", message: "Started `${env.JOB_NAME}#${env.BUILD_NUMBER}`\n"
            }
        }
        stage('Tests'){
            when { not { branch 'main' } }
            steps{

                

                // Start front end and check connection
                dir("app/frontend")
                {
                    sh 'npm install'
                    sh 'npm start > /dev/null 2>&1 &'
                }
                
                //Start virutal environment
                sh 'python3 -m venv env'
                sh 'chmod +x env/bin/activate'
                sh  '. env/bin/activate'
                sh 'env/bin/pip install -r requirements.txt'


                //Run back end server
                sh 'chmod +x ./app/manage.py'
                // sh 'env/bin/python ./app/manage.py runserver > /dev/null 2>&1 &'
                sh 'touch ./test_results.log'
                sh 'env/bin/python ./app/manage.py test ./deployment/tests ' //> test_results.log 2>&1'
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
            slackSend color: "good", message: "Build successful :man_dancing: `${env.JOB_NAME}#${env.BUILD_NUMBER}` <${env.BUILD_URL}|Open in Jenkins>"
            cleanWs(deleteDirs: true)
            cleanWs(deleteDirs: true)
        }

        failure{
            sh 'ls'
            script{
                def file_contents = readFile('test_results.log')
                slackSend color: "danger", message: "Build failed :face_with_head_bandage: \n`${env.JOB_NAME}#${env.BUILD_NUMBER}` <${env.BUILD_URL}|Open in Jenkins>"
                slackSend color: "danger", message: "File Contents:\n\n'''" + file_contents + "'''"
            }
            cleanWs(deleteDirs: true)
            cleanWs(deleteDirs: true)
            
        }
        always {
            
            
            sh 'fuser -k 8000/tcp || true'
            sh 'fuser -k 3000/tcp || true'
            
        }
        
    }
    

} 