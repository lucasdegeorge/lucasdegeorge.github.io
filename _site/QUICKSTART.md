# Quick Start Guide

Get your academic website up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
# Configure Bundler to install gems locally
bundle config set --local path 'vendor/bundle'

# Install dependencies
bundle install
```

## Step 2: Customize Your Info

Edit `_config.yml`:
- Replace "Your Name" with your actual name
- Update email, affiliation, and bio
- Add your social media links (GitHub, Google Scholar, ORCID, etc.)

## Step 3: Add Your Profile Photo

Replace `assets/images/profile.svg` with your photo (recommended: 400x400px square image)

Update in `_config.yml`:
```yaml
author:
  photo: /assets/images/your-photo.jpg
```

## Step 4: Update Content

### About Page (`index.md`)
- Replace placeholder text with your actual bio
- Update research interests
- Add your background information

### Publications (`publications.md`)
- Add your actual papers
- Include DOI links, PDFs, and project pages
- Optionally use `_bibliography/references.bib` for BibTeX import

### Projects (`_projects/`)
- Create new `.md` files for each project
- Add project images to `assets/images/projects/`
- Follow the template in existing project files

### News (`_news/`)
- Add recent updates as separate `.md` files
- Use YAML frontmatter with `date` field

### Teaching (`teaching.md`)
- List your courses
- Add syllabi and course materials

### Open Source (`opensource.md`)
- Showcase your software projects
- Link to GitHub repositories

## Step 5: Test Locally

```bash
bundle exec jekyll serve
```

Visit `http://localhost:4000` to preview your site.

## Step 6: Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g., `yourusername.github.io`)
2. Initialize git and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git push -u origin main
   ```
3. Enable GitHub Pages in repository Settings → Pages
4. Select "GitHub Actions" as the source
5. Wait a few minutes for deployment

Your site will be live at `https://yourusername.github.io`

## Customization Tips

### Change Colors

Edit `assets/css/main.css`:
```css
:root {
  --accent-color: #your-color;  /* Main accent color */
}
```

### Add Sections

1. Create new `.md` file (e.g., `blog.md`)
2. Add to navigation in `_includes/header.html`

### Custom Domain

1. Add `CNAME` file with your domain
2. Configure DNS with your provider
3. Enable in GitHub Pages settings

## Need Help?

- Read the full [README.md](README.md)
- Check [Jekyll documentation](https://jekyllrb.com/docs/)
- Open an issue on GitHub

Happy building! 🚀
