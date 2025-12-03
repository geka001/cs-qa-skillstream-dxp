#!/bin/bash

# SkillStream QA Onboarding DXP - Installation Script
# This script will set up the project and verify everything is ready to run

echo "🚀 SkillStream QA Onboarding DXP - Setup Script"
echo "================================================"
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Found: $NODE_VERSION"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo ""
echo "📥 Installing dependencies..."
echo "   This may take a few minutes..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Please check the error above."
    exit 1
fi

echo ""
echo "🔍 Verifying installation..."

# Check if critical files exist
files=(
    "package.json"
    "tsconfig.json"
    "tailwind.config.ts"
    "next.config.js"
    "app/page.tsx"
    "app/layout.tsx"
    "app/login/page.tsx"
    "app/dashboard/page.tsx"
    "contexts/AppContext.tsx"
    "data/mockData.ts"
)

all_good=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file NOT FOUND"
        all_good=false
    fi
done

echo ""
if [ "$all_good" = true ]; then
    echo "✅ All files verified!"
    echo ""
    echo "🎉 Setup Complete!"
    echo ""
    echo "To start the development server, run:"
    echo "   npm run dev"
    echo ""
    echo "Then open your browser to:"
    echo "   http://localhost:3000"
    echo ""
    echo "📚 Documentation:"
    echo "   - README.md        - Full documentation"
    echo "   - QUICKSTART.md    - Quick start guide"
    echo "   - DEMO_SCRIPT.md   - Demo walkthrough"
    echo ""
    echo "Happy coding! 🚀"
else
    echo "❌ Some files are missing. Please check the project structure."
    exit 1
fi

