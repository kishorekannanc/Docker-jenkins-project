pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                // Replace with your actual build steps
                sh 'echo "Building the project..."'
            }
        }

        stage('Test') {
            steps {
                // Replace with your test commands
                sh 'echo "Running tests..."'
            }
        }

        stage('Deploy') {
            steps {
                // Intentional failure to trigger the failure email
                sh echo "KKKKKKploy"'
            }
        }
    }

    
}
