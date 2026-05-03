# Shrabani Baruah — Portfolio Site

A minimal static portfolio site. No build tools, no dependencies, no framework.  
Open `index.html` in a browser to preview locally.

---

## How to add your projects

1. Drop your project images into the `images/` folder.  
   Name them `project-01.jpg`, `project-02.jpg`, etc. (or update the `src` in `index.html`).

2. In `index.html`, edit each `<article class="project-card">` block:
   - `src="images/project-01.jpg"` → your image filename
   - `alt="..."` → your project name (used for accessibility)
   - `<h2 class="project-title">` → your project name
   - `<span class="project-info">` → Category — Year  (e.g. "Brand Identity — 2024")
   - `href="#"` on the `<a>` → link to a project page or leave as `#`

3. Update the **About** section with your bio, location, and email.

4. Update the social links (Instagram, LinkedIn) with your actual URLs.

---

## How to deploy (free options)

### Option A — Netlify (easiest, drag & drop)
1. Go to https://netlify.com and create a free account.
2. Drag the entire `portfolio/` folder onto the Netlify dashboard.
3. Done — you get a live URL instantly. Connect a custom domain in Settings.

### Option B — GitHub Pages
1. Create a free GitHub account and a new repository (e.g. `shrabanibaruah`).
2. Upload all files in this folder to the repo root.
3. Go to Settings → Pages → Source: "Deploy from branch" → main → / (root).
4. Your site will be live at `https://yourusername.github.io/reponame`.

### Option C — Vercel
1. Push this folder to a GitHub repo.
2. Go to https://vercel.com, import the repo.
3. No config needed — it deploys automatically on every push.

---

## Custom domain
All three options above support custom domains for free.  
Buy a domain (e.g. Namecheap, Squarespace Domains) and point it at your host.
