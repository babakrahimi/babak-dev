# Personal Site

This is the source code for [babak.dev](https://babak.dev), a simple single-page site built with **Astro**. The UI is written in **React** and styled with **Tailwind CSS**. It features smooth animations with Framer Motion and includes two sections:

- **About** – information about Babak Rahimi
- **Contact** – links to social profiles and email

## Running locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:4321`.
3. Create a production build:
   ```bash
   npm run build
   ```
4. Preview the build locally:
   ```bash
   npm run preview
   ```

## Project structure

```
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   ├── pages/       # Astro pages
│   └── styles/      # Global styles
└── package.json
```

The entry page is `src/pages/index.astro` which loads the React `App` component.
