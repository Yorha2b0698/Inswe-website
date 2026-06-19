###### Modern Website Template

A modern, responsive website template built with Next.js 14 and Tailwind CSS.

## Features

- ⚡ **Next.js 14** with App Router
- 🎨 **Tailwind CSS** for styling
- 📱 **Fully responsive** design
- 🔍 **SEO optimized**
- 🚀 **Fast performance**
- 🎯 **TypeScript** for type safety
- 🎪 **Heroicons** for beautiful icons
- 🏗️ **Modular components**

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd inswe-bag
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── page.tsx          # Home page
│   ├── about/
│   │   └── page.tsx      # About page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Header.tsx        # Navigation header
│   ├── Hero.tsx          # Hero section
│   ├── Features.tsx      # Features section
│   └── Footer.tsx        # Footer
├── public/               # Static assets
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Customization

1. **Update colors**: Modify the Tailwind configuration in `tailwind.config.ts`
2. **Add pages**: Create new folders in `app/` with `page.tsx` files
3. **Update content**: Edit the components in the `components/` directory
4. **Change styling**: Modify the utility classes in the components

## Deployment

This template can be easily deployed to:

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Any static hosting** with `npm run build`

## License

MIT
