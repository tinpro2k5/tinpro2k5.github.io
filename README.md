# tinpro2k5.github.io

Static GitHub Pages portfolio for **Lê Trung Tín** (Cloud/DevOps Engineer Intern track).

## Local edit workflow

1. Edit content in `index.html`:
   - Hero section and contact links
   - Featured project cards (`#projects` section)
   - Education/Awards/Coursework blocks
2. Update design tokens and component styles in `styles.css`.
3. Update client behavior (theme toggle + footer year) in `script.js`.
4. Validate JavaScript syntax:

```bash
node --check script.js
```

5. Open `index.html` in a browser and verify:
   - No console errors
   - Mobile + desktop responsiveness
   - Contact links and CTA buttons work

## Updating featured projects

Each project card lives directly in `index.html` under `<section id="projects">`.
For each card, keep:

- Project title
- 1-2 line impact summary
- Tech badges (`.tag`)
- GitHub link (and optional demo link)

## Deploying to GitHub Pages

This repo is a static site. Deployment is automatic from the default branch (`main`) via GitHub Pages.
After merging updates:

1. Go to **Settings → Pages**
2. Ensure source is set to **Deploy from a branch**
3. Branch should be **main** and folder **/** (root)
4. Wait for Pages build, then visit: `https://tinpro2k5.github.io/`
