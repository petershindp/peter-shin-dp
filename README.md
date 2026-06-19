# Peter Shin DP

Portfolio website for Peter Shin, Director of Photography — built with React, Vite, and Sanity CMS.

## Stack

- **React 19** + **React Router 7**
- **Vite 6**
- **Sanity** (headless CMS for projects, stills, and about page)
- **Framer Motion** (page transitions)
- **Umami** (privacy-friendly analytics)

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your Sanity credentials:
   ```
   VITE_SANITY_PROJECT_ID=your_project_id
   VITE_SANITY_DATASET=production
   VITE_SANITY_API_VERSION=2023-01-01
   ```
3. Install and run:
   ```bash
   npm install
   npm run dev
   ```

## Sanity Studio

```bash
cd peter-shin-dp-cms
npm install
npx sanity dev
```
