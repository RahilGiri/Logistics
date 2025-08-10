#!/bin/bash

# 🚀 Transcore Logistics Deployment Script
# This script helps deploy your logistics website to various platforms

echo "🚀 Starting deployment process..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with your production configuration."
    echo "You can copy from env.example and update the values."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if deployment platform is specified
if [ "$1" = "heroku" ]; then
    echo "🌐 Deploying to Heroku..."
    
    # Check if Heroku CLI is installed
    if ! command -v heroku &> /dev/null; then
        echo "❌ Heroku CLI not found!"
        echo "Please install Heroku CLI first:"
        echo "  macOS: brew install heroku/brew/heroku"
        echo "  Windows: Download from https://devcenter.heroku.com/articles/heroku-cli"
        exit 1
    fi
    
    # Deploy to Heroku
    git add .
    git commit -m "Deploy to production"
    git push heroku main
    
    echo "✅ Deployment to Heroku completed!"
    echo "🌍 Your app is available at: https://your-app-name.herokuapp.com"
    
elif [ "$1" = "railway" ]; then
    echo "🚂 Deploying to Railway..."
    
    # Railway deployment (push to GitHub)
    git add .
    git commit -m "Deploy to Railway"
    git push origin main
    
    echo "✅ Deployment to Railway completed!"
    echo "🚂 Railway will automatically deploy from your GitHub repository"
    
elif [ "$1" = "render" ]; then
    echo "🎨 Deploying to Render..."
    
    # Render deployment (push to GitHub)
    git add .
    git commit -m "Deploy to Render"
    git push origin main
    
    echo "✅ Deployment to Render completed!"
    echo "🎨 Render will automatically deploy from your GitHub repository"
    
else
    echo "❌ Please specify deployment platform:"
    echo "  ./deploy.sh heroku    - Deploy to Heroku"
    echo "  ./deploy.sh railway   - Deploy to Railway"
    echo "  ./deploy.sh render    - Deploy to Render"
    echo ""
    echo "📋 Before deploying, make sure you have:"
    echo "  1. Created a .env file with production settings"
    echo "  2. Set up MongoDB Atlas database"
    echo "  3. Updated CORS_ORIGIN in .env"
    echo "  4. Configured your hosting platform"
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo "📖 Check DEPLOYMENT.md for more details and troubleshooting."
