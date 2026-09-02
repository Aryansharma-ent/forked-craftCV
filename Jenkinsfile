pipeline {
    agent any

    environment {
        NODE_ENV   = 'production'
        BUILD_DIR  = 'Frontend/dist'
    }

    tools {
        nodejs 'NodeJS-20'
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 15, unit: 'MINUTES')
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out branch: ${env.GIT_BRANCH}"
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('Frontend') {
                    echo 'Installing npm dependencies...'
                    sh 'npm ci'
                }
            }
        }

        stage('Lint') {
            steps {
                dir('Frontend') {
                    echo 'Running linter...'
                    sh 'npm run lint'
                }
            }
        }

        stage('Build') {
            steps {
                dir('Frontend') {
                    echo 'Building production bundle...'
                    sh 'npm run build'
                }
            }
            post {
                success {
                    echo "Build succeeded. Artifact at: ${env.BUILD_DIR}"
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts(
                    artifacts: 'Frontend/dist/**',
                    fingerprint: true,
                    allowEmptyArchive: false
                )
            }
        }

    }

    post {
        success {
            echo "Pipeline completed successfully for build #${env.BUILD_NUMBER}."
        }
        failure {
            echo "Pipeline FAILED at stage: ${env.STAGE_NAME}. Check the console output above."
        }
        always {
            cleanWs()
        }
    }
}
