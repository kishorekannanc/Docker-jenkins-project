pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/kishorekannanc/Docker-jenkins-project.git']]
                ])
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build -t myapp .'
            }
        }

        stage('Remove Old Container') {
            steps {
                sh '''
                docker stop mycontainer || true
                docker rm mycontainer || true
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker run -d -p 80:80 --name mycontainer myapp'
            }
        }
    }
}
