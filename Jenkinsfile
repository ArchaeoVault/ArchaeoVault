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
        // stage('Unit Tests'){
        //     steps{
        //         sh 'python3 -m venv env'
        //         sh 'chmod +x env/bin/activate'
        //         sh  '. env/bin/activate'
        //         sh 'env/bin/pip install -r requirements.txt'
        //         sh 'chmod +x ./app/manage.py'
        //         sh 'env/bin/python ./app/manage.py test app/myapp/tests > test_results.log 2>&1'
        //     }
        // }
        stage('Tests'){
            steps{
                /*
                sh 'python3 -m venv env'
                sh 'chmod +x env/bin/activate'
                sh  '. env/bin/activate'
                sh 'export PYTHONPATH=$(pwd)/app'
                sh 'env/bin/pip install -r requirements.txt'
                sh 'chmod +x ./app/manage.py'
                sh 'env/bin/python ./app/manage.py runserver > /dev/null 2>&1 &'
                dir('app/frontend'){
                    sh'pwd'
                    sh 'npm start > /dev/null 2>&1 &'
                } 
                sh 'pwd'

                // Wait for servers to be ready
                sh '''
                until curl --output /dev/null --silent --head --fail http://localhost:8000; do
                    echo "Waiting for Django..."
                    sleep 2
                done
                '''

                sh '''
                until curl --output /dev/null --silent --head --fail http://localhost:3000; do
                    echo "Waiting for frontend..."
                    sleep 2
                done
                '''
                
                sh 'curl http://localhost:8000'
                sh 'env/bin/python ./app/manage.py test ./deployment/tests'
                */
                sh 'echo "---- ENVIRONMENT ----"'
                sh 'echo "PATH: $PATH"'
                sh 'which google-chrome'
                sh 'ls -l /usr/bin/google-chrome'
                sh 'google-chrome --version'
                sh 'which chromedriver'
                //sh 'chmod +x /usr/bin/chromedriver'
                //sh '/usr/bin/chromedriver --version'
                //sh 'ls -l /usr/bin/chromedriver'


                sh 'chmod +x ./deployment/run_dev_servers.sh'
                sh './deployment/run_dev_servers.sh'
                sh 'ps aux'

                //sh 'python3 -m venv env'
                //sh 'chmod +x env/bin/activate'
                //sh  '. env/bin/activate'
                //sh 'env/bin/pip install -r requirements.txt'
                //sh 'chmod +x ./app/manage.py'
                //sh 'env/bin/python ./app/manage.py test ./deployment/tests'

                sh 'fuser -k 8000/tcp'
                sh 'fuser -k 3000/tcp'
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
        }

        failure{
            script{
                def file_contents = readFile('test_results.log')
                slackSend color: "danger", message: "Build failed :face_with_head_bandage: \n`${env.JOB_NAME}#${env.BUILD_NUMBER}` <${env.BUILD_URL}|Open in Jenkins>"
                slackSend color: "danger", message: "File Contents:\n\n'''" + file_contents + "'''"
            }
            
        }
    }
    

} 