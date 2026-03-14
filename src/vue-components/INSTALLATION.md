# 🚀 Installation Guide - Vue 3 Components

Panduan lengkap setup dan instalasi komponen LMS PjBL dengan Vue 3.

---

## 📋 Prerequisites

Pastikan sistem Anda sudah terinstall:

- **Node.js**: >= 18.0.0 (Recommended: 20.x LTS)
- **npm**: >= 9.0.0 atau **yarn**: >= 1.22.0
- **Git**: Latest version
- **Code Editor**: VS Code (Recommended)

Check versions:
```bash
node --version    # Should be >= 18.0.0
npm --version     # Should be >= 9.0.0
```

---

## 🛠️ Setup From Scratch

### Step 1: Create Vue Project

```bash
# Using Vite (Recommended)
npm create vite@latest lms-pjbl-vue -- --template vue-ts

# Navigate to project
cd lms-pjbl-vue

# Install dependencies
npm install
```

### Step 2: Install Required Packages

```bash
# Core dependencies
npm install vue@latest

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Lucide Icons for Vue
npm install lucide-vue-next

# TypeScript (if not included)
npm install -D typescript @vue/tsconfig vue-tsc
```

### Step 3: Configure Tailwind CSS

Create or update `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./vue-components/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neutral-950': '#0a0a0a',
      },
    },
  },
  plugins: [],
}
```

### Step 4: Setup CSS

Create or update `src/style.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Optional: Custom global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Step 5: Copy Vue Components

Copy folder komponen Vue ke project Anda:

```bash
# Copy entire vue-components folder
cp -r /path/to/vue-components ./src/
```

Atau manual copy files:
```
src/
└── vue-components/
    ├── ProjectDetailPage.vue
    ├── DebuggingPuzzlePage.vue
    └── ui/
        ├── card.vue
        ├── card-content.vue
        ├── badge.vue
        ├── button.vue
        ├── progress.vue
        └── textarea.vue
```

### Step 6: Update main.ts

```typescript
import { createApp } from 'vue'
import './style.css'  // Import Tailwind CSS
import App from './App.vue'

createApp(App).mount('#app')
```

### Step 7: Update App.vue

Copy content dari `/vue-components/App.vue.example` ke `src/App.vue`

### Step 8: Run Development Server

```bash
npm run dev
```

Buka browser di `http://localhost:3000`

---

## 🔧 Configuration Files

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "exclude": ["node_modules"]
}
```

### package.json

```json
{
  "name": "lms-pjbl-vue",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "lucide-vue-next": "^0.390.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "@vue/tsconfig": "^0.5.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "vue-tsc": "^2.0.0"
  }
}
```

---

## 🎯 Quick Integration

Jika sudah punya project Vue existing:

### 1. Install Dependencies Only

```bash
npm install lucide-vue-next
npm install -D tailwindcss postcss autoprefixer
```

### 2. Copy Components

```bash
# Copy vue-components folder ke src/
cp -r vue-components src/
```

### 3. Import & Use

```vue
<template>
  <div>
    <ProjectDetailPage :on-close="handleClose" />
  </div>
</template>

<script setup lang="ts">
import ProjectDetailPage from '@/vue-components/ProjectDetailPage.vue';

const handleClose = () => {
  console.log('Close');
};
</script>
```

---

## 📦 Alternative: Using Components as Package

### Create Local Package

1. Create `package.json` in `vue-components/`:

```json
{
  "name": "@lms-pjbl/components",
  "version": "1.0.0",
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts",
    "./ui": "./ui/index.ts"
  }
}
```

2. Create `vue-components/index.ts`:

```typescript
export { default as ProjectDetailPage } from './ProjectDetailPage.vue';
export { default as DebuggingPuzzlePage } from './DebuggingPuzzlePage.vue';
export * from './ui/index';
```

3. Install as local package:

```bash
npm install file:./vue-components
```

4. Import:

```typescript
import { ProjectDetailPage, DebuggingPuzzlePage } from '@lms-pjbl/components';
```

---

## 🔍 Troubleshooting

### Issue 1: Module not found 'lucide-vue-next'

```bash
npm install lucide-vue-next
```

### Issue 2: Tailwind classes not applying

Check `tailwind.config.js` content array:
```js
content: [
  "./src/**/*.{vue,js,ts,jsx,tsx}",
]
```

Restart dev server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Issue 3: TypeScript errors with .vue files

Create `env.d.ts` in project root:

```typescript
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

### Issue 4: Icons not rendering

Make sure lucide-vue-next is installed:
```bash
npm list lucide-vue-next
```

If not installed:
```bash
npm install lucide-vue-next
```

### Issue 5: Build fails

Clear cache and rebuild:
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Issue 6: Port already in use

Change port in `vite.config.ts`:
```typescript
server: {
  port: 3001,  // Change to available port
}
```

---

## 🚀 Development Workflow

### Start Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

Output akan ada di `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Type Check

```bash
vue-tsc --noEmit
```

---

## 📱 VS Code Setup (Recommended)

### Required Extensions

1. **Volar** - Vue Language Features
   - Extension ID: `Vue.volar`
   
2. **TypeScript Vue Plugin (Volar)**
   - Extension ID: `Vue.vscode-typescript-vue-plugin`

3. **Tailwind CSS IntelliSense**
   - Extension ID: `bradlc.vscode-tailwindcss`

4. **ESLint** (Optional)
   - Extension ID: `dbaeumer.vscode-eslint`

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  },
  "tailwindCSS.experimental.classRegex": [
    ["class:\\s*?[\"'`]([^\"'`]*).*?[\"'`]", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## 🌐 Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### GitHub Pages

Add to `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/your-repo-name/',  // Your GitHub repo name
  // ... other config
})
```

Build and deploy:
```bash
npm run build
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:username/repo.git main:gh-pages
```

---

## 📊 Project Structure

After installation, your project should look like:

```
lms-pjbl-vue/
├── node_modules/
├── public/
├── src/
│   ├── vue-components/
│   │   ├── ProjectDetailPage.vue
│   │   ├── DebuggingPuzzlePage.vue
│   │   └── ui/
│   │       ├── card.vue
│   │       ├── badge.vue
│   │       ├── button.vue
│   │       ├── progress.vue
│   │       └── textarea.vue
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## ✅ Verification Checklist

Setelah instalasi, verify:

- [ ] `npm run dev` works without errors
- [ ] Tailwind classes applied correctly
- [ ] Icons (Lucide) rendered properly
- [ ] TypeScript compilation works
- [ ] Both components load without errors
- [ ] Interactive features work (edit, save, run code)
- [ ] Responsive design works on mobile
- [ ] No console errors

---

## 🎓 Next Steps

After successful installation:

1. **Explore Components**
   - Try ProjectDetailPage features
   - Test DebuggingPuzzlePage compiler

2. **Customize**
   - Update colors in tailwind.config.js
   - Modify component data
   - Add new stages or test cases

3. **Integrate**
   - Connect to backend API
   - Add routing (Vue Router)
   - Add state management (Pinia)

4. **Learn More**
   - Read `/vue-components/README.md`
   - Check `/FRAMEWORK_COMPARISON.md`
   - Review component code

---

## 💡 Tips

1. **Hot Module Replacement (HMR)** works automatically in dev mode
2. Use Vue DevTools browser extension untuk debugging
3. Enable Volar Takeover Mode untuk better TypeScript support
4. Use composition API dengan `<script setup>` untuk cleaner code
5. Keep components modular dan reusable

---

## 📞 Support

Jika mengalami masalah:

1. Check troubleshooting section di atas
2. Review `/vue-components/README.md`
3. Verify all dependencies installed correctly
4. Check browser console untuk error messages
5. Make sure Node.js version >= 18.0.0

---

## 📄 Additional Resources

- [Vue 3 Docs](https://vuejs.org)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Lucide Icons](https://lucide.dev)

---

**Installation Complete! 🎉**

Ready to build amazing LMS features! 🚀
