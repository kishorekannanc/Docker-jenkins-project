pipeline {
	agent any

	environment {
		DEPLOY_HOST = "ec2-user@54.175.35.162"
		APP_NAME = "nginx-web"
		IMAGE_NAME = "nginx-deploy"
	}

 
    stages {

 
        stage('Build Docker Image') {

            steps {

                sh 'docker build -t $IMAGE_NAME .'

            }

        }
 
        stage('Save Docker Image') {

            steps {

                sh 'docker save $IMAGE_NAME | bzip2 > image.tar.bz2'

            }

        }
 
        stage('Deploy to Remote Host') {

            steps {

                // Copy image to deployment EC2

                sh 'scp -o StrictHostKeyChecking=no image.tar.bz2 $DEPLOY_HOST:/home/ec2-user/'
 
                // Run remotely on deployment EC2

                sh '''

                ssh -o StrictHostKeyChecking=no $DEPLOY_HOST << EOF

                    docker load < image.tar.bz2

                    docker rm -f $APP_NAME || true

                    docker run -d --name $APP_NAME -p 80:80 $IMAGE_NAME

                EOF

                '''

            }

        }

    }

}
 
