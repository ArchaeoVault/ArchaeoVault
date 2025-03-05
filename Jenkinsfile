#!groovy


pipeline {
    agent any 1
    stages{

    

                stage('Checkout'){
                    steps{
                        checkout scm

                        sh 'git log HEAD^..HEAD --pretty="%h %an - %s" > GIT_CHANGES'
                        def lastChanges = readFile('GIT_CHANGES')
                        slackSend color: "warning", message: "Started `${env.JOB_NAME}#${env.BUILD_NUMBER}`\n\n_The changes:_\n${lastChanges}"
                    }
                }
                    
                
                    

                /*
                stage 'Test'
                    sh 'virtualenv env -p python3.10'
                    sh '. env/bin/activate'
                    sh 'env/bin/pip install -r requirements.txt'
                    sh 'env/bin/python3.10 manage.py test --testrunner=blog.tests.test_runners.NoDbTestRunner'
                */
                stage('Deploy')
                    when { branch 'main' }
                    steps{
                        sh 'chmod +x ./deployment/deploy_prod.sh'
                        sh './deployment/deploy_prod.sh'
                    }
                    

                stage ('Publish results'){
                    steps{
                        slackSend color: "good", message: "Build successful: `${env.JOB_NAME}#${env.BUILD_NUMBER}` <${env.BUILD_URL}|Open in Jenkins>"
                    }
                }
                    
                
                
    }
    

} 