#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Vercel + Docker Deployment Setup\n');

// Files to exclude from Vercel deployment
const filesToExclude = [
  'workers/',
  'dockerfile.backend',
  'docker-compose.backend.yml',
  'docker-compose.yml',
  'dockerfile',
  'downloads/',
  '.env'
];

// Create .vercelignore file
const vercelIgnoreContent = filesToExclude.join('\n') + '\n';

const vercelIgnorePath = path.join(__dirname, '.vercelignore');
fs.writeFileSync(vercelIgnorePath, vercelIgnoreContent);
console.log('✅ Created .vercelignore file');

// Update .gitignore for Vercel deployment
const gitignorePath = path.join(__dirname, '.gitignore');
let gitignoreContent = '';

if (fs.existsSync(gitignorePath)) {
  gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
}

// Add Vercel-specific ignores
const vercelIgnores = [
  '# Vercel deployment',
  'downloads/',
  '.env',
  '.env.local',
  '.env.production',
  ''
];

const newGitignoreContent = gitignoreContent + '\n' + vercelIgnores.join('\n');
fs.writeFileSync(gitignorePath, newGitignoreContent);
console.log('✅ Updated .gitignore for Vercel deployment');

// Create deployment instructions
const deploymentInstructions = `
# Vercel + Docker Deployment Instructions

## Step 1: Deploy Frontend + API Routes to Vercel

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Set environment variables in Vercel dashboard:
   - MONGODB_URI=your_mongodb_connection_string
   - REDIS_URL=your_redis_connection_string

## Step 2: Deploy Backend Services

### Option A: Render (Recommended)
1. Create new Web Service on Render
2. Connect your GitHub repo
3. Build Command: docker build -f dockerfile.backend .
4. Start Command: node workers/downloadWorker.js
5. Set environment variables:
   - MONGODB_URI=your_mongodb_connection_string
   - REDIS_URL=your_redis_connection_string
   - WORKER_PORT=5050

### Option B: Railway
1. Connect your GitHub repo to Railway
2. Create new service
3. Select "Deploy from Dockerfile"
4. Use dockerfile.backend
5. Set environment variables

## Step 3: Test Deployment
1. Test frontend functionality
2. Test download functionality
3. Monitor worker logs

## Files Structure:
- Vercel: Frontend + API Routes (Next.js)
- Docker: Backend Worker (yt-dlp, ffmpeg)
- Cloud: MongoDB + Redis
`;

const instructionsPath = path.join(__dirname, 'VERCEL_DEPLOYMENT_INSTRUCTIONS.md');
fs.writeFileSync(instructionsPath, deploymentInstructions);
console.log('✅ Created VERCEL_DEPLOYMENT_INSTRUCTIONS.md');

console.log('\n📋 Next Steps:');
console.log('1. Review .vercelignore and .gitignore');
console.log('2. Push your code to GitHub');
console.log('3. Follow the instructions in VERCEL_DEPLOYMENT_INSTRUCTIONS.md');
console.log('4. Deploy frontend to Vercel');
console.log('5. Deploy backend with Docker');
console.log('\n🎉 Your hybrid deployment is ready!'); 