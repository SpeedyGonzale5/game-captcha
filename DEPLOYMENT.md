# 🚀 Deploying Game Captcha to Vercel

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **API Keys**: You'll need these environment variables:
   - `GEMINI_API_KEY` - From [Google AI Studio](https://aistudio.google.com/)
   - `ELEVENLABS_API_KEY` - From [ElevenLabs](https://elevenlabs.io/)

## 🔧 Step 1: Prepare for Deployment

### Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### Update Build Script
Your `package.json` already has the correct build configuration:
```json
{
  "scripts": {
    "build": "next build --turbopack",
    "start": "next start"
  }
}
```

## 🌐 Step 2: Deploy via Vercel Dashboard

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select your `game-captcha` repository

3. **Configure Project**:
   - **Framework**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### Method 2: Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# ? Set up and deploy? [Y/n] y
# ? Which scope? [Your username]
# ? Link to existing project? [y/N] n
# ? What's your project's name? game-captcha
# ? In which directory is your code located? ./
```

## 🔐 Step 3: Set Environment Variables

In your Vercel dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `GEMINI_API_KEY` | Your Google API key | Production |
| `ELEVENLABS_API_KEY` | Your ElevenLabs API key | Production |

**Important**: 
- Make sure to select **Production** environment
- Never commit these keys to your repository
- Your `.env.local` file is already in `.gitignore`

## ⚙️ Step 4: Verify Configuration

Your `vercel.json` is already configured with:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "src/app/api/generate/route.js": {
      "maxDuration": 30
    }
  }
}
```

Key features:
- ✅ **30-second timeout** for AI generation API
- ✅ **CORS headers** for API routes
- ✅ **Next.js optimization**

## 🎯 Step 5: Test Your Deployment

1. **Wait for Build**: Usually takes 2-3 minutes
2. **Visit Your Site**: Vercel will provide a URL like `https://game-captcha-xyz.vercel.app`
3. **Test the Flow**:
   - ✅ Drawing interface loads
   - ✅ Submit drawing triggers AI generation
   - ✅ Modal shows with skeleton loaders
   - ✅ AI artwork appears
   - ✅ Audio generation works (if ElevenLabs API is set up)

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**:
   ```bash
   # Check build locally first
   npm run build
   ```

2. **API Timeouts**:
   - Vercel Free tier has 10s timeout
   - Upgrade to Pro for 30s timeout
   - Our config sets 30s for `/api/generate`

3. **Environment Variables Not Working**:
   - Redeploy after adding environment variables
   - Check spelling exactly: `GEMINI_API_KEY` and `ELEVENLABS_API_KEY`

4. **CORS Issues**:
   - Already configured in `vercel.json`
   - Check browser console for specific errors

### Debug Commands:
```bash
# Check deployment logs
vercel logs [deployment-url]

# Local testing
npm run build && npm run start
```

## 🎉 Success!

Your AI-powered Drawing Captcha is now live! 

### Features Working:
- ✨ Google Gemini image enhancement
- 🎵 ElevenLabs music generation
- 🎨 Interactive drawing interface
- 🚀 Professional loading animations
- 📱 Responsive design

### Next Steps:
- Share your deployment URL
- Monitor performance in Vercel dashboard
- Set up custom domain (optional)
- Enable analytics (optional)

---

**Need Help?** Check the Vercel documentation or create an issue in the repository.
