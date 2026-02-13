pipeline {
    agent any

    environment {
        IMAGE_NAME = "geminieats-app"
        CONTAINER_NAME = "geminieats-container"
        HOST_PORT = "8082"
    }

    stages {
            stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/kishorekannanc/Docker-jenkins-project.git']]
                ])
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

    

        stage('Stop & Remove Old Container') {
            steps {
                sh """
                docker stop ${CONTAINER_NAME} || true
                docker rm ${CONTAINER_NAME} || true
                """
            }
        }

        stage('Run New Container') {
            steps {
                sh """
                docker run -d -p ${HOST_PORT}:80 \
                --name ${CONTAINER_NAME} \
                ${IMAGE_NAME}
                """
            }
        }

        stage('Cleanup Unused Images') {
            steps {
                sh "docker image prune -f"
            }
        }
    }

    post {
        success {
            echo "Deployment Successful 🚀"
        }
        failure {
            echo "Build Failed ❌"
        }
    }
}
