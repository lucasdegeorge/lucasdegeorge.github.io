# Deployment Checklist

Use this checklist before deploying your academic website to ensure everything is configured correctly.

## Pre-Deployment Checklist

### ✅ Content

- [ ] Updated `_config.yml` with your personal information
- [ ] Replaced placeholder profile photo
- [ ] Updated About section with your biography
- [ ] Added at least 3-5 news items
- [ ] Listed your publications
- [ ] Created project pages with descriptions
- [ ] Updated teaching section (if applicable)
- [ ] Listed open-source contributions (if applicable)
- [ ] Proofread all content for typos and errors
- [ ] Verified all external links work

### ✅ Configuration

- [ ] Set correct `title` in `_config.yml`
- [ ] Set correct `email` in `_config.yml`
- [ ] Set correct `url` in `_config.yml` (e.g., `https://username.github.io`)
- [ ] Updated social media links (GitHub, Scholar, ORCID, etc.)
- [ ] Set correct `baseurl` (usually empty for GitHub Pages)
- [ ] Removed or updated example content placeholders

### ✅ Images

- [ ] Added profile photo (recommended: 400x400px)
- [ ] Added project images (recommended: 800x400px)
- [ ] Optimized images for web (compressed, appropriate format)
- [ ] All image paths are correct and relative
- [ ] Images have descriptive filenames

### ✅ Styling

- [ ] Tested light mode appearance
- [ ] Tested dark mode appearance (if enabled)
- [ ] Customized colors to match your brand (optional)
- [ ] Verified typography is readable
- [ ] Checked layout on different screen sizes

### ✅ Testing

- [ ] Site builds successfully locally (`bundle exec jekyll serve`)
- [ ] No build errors or warnings
- [ ] All pages load correctly
- [ ] Navigation works on all pages
- [ ] Mobile menu works (hamburger icon)
- [ ] Dark mode toggle works (if enabled)
- [ ] All internal links work
- [ ] All external links open in new tabs (where appropriate)
- [ ] RSS feed generates correctly

### ✅ SEO & Metadata

- [ ] Page titles are descriptive
- [ ] Meta descriptions are set
- [ ] Social media preview looks good
- [ ] Sitemap generates correctly
- [ ] Robots.txt is appropriate

### ✅ GitHub Repository

- [ ] Created repository (e.g., `username.github.io`)
- [ ] Repository is public
- [ ] Pushed all files to `main` branch
- [ ] `.gitignore` is properly configured
- [ ] `README.md` provides clear instructions

### ✅ GitHub Pages Settings

- [ ] Enabled GitHub Pages in repository settings
- [ ] Selected "GitHub Actions" as source
- [ ] Custom domain configured (if using one)
- [ ] HTTPS is enforced
- [ ] Verified deployment status (green checkmark)

### ✅ Post-Deployment

- [ ] Site is accessible at correct URL
- [ ] All pages render correctly
- [ ] Images load properly
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari)
- [ ] Tested on mobile device
- [ ] Google Analytics is tracking (if configured)
- [ ] RSS feed is accessible

### ✅ Optional Enhancements

- [ ] Added Google Analytics
- [ ] Submitted sitemap to Google Search Console
- [ ] Added custom domain
- [ ] Configured email forwarding
- [ ] Added favicon
- [ ] Set up social media cards (Open Graph, Twitter Cards)

---

## Quick Test Commands

```bash
# Test build locally
bundle exec jekyll serve

# Test build for production
JEKYLL_ENV=production bundle exec jekyll build

# Check for broken links (requires html-proofer gem)
bundle exec htmlproofer ./_site --disable-external

# Validate HTML
bundle exec jekyll build && html-proofer ./_site
```

---

## Common Issues & Solutions

### Issue: Site not building

**Solution:**
- Check `_config.yml` for syntax errors
- Verify all frontmatter is valid YAML
- Check GitHub Actions logs for specific errors

### Issue: Images not loading

**Solution:**
- Verify image paths start with `/assets/`
- Check image files are committed to repository
- Ensure filenames match exactly (case-sensitive)

### Issue: Styles not applying

**Solution:**
- Clear browser cache
- Check `main.css` path in `default.html`
- Verify CSS file is committed

### Issue: Dark mode not working

**Solution:**
- Enable JavaScript in browser
- Check console for JavaScript errors
- Verify `main.js` is loaded

### Issue: 404 errors on subpages

**Solution:**
- Check `permalink` in page frontmatter
- Verify `baseurl` in `_config.yml`
- Ensure pages are in root directory or have correct paths

---

## Performance Checklist

- [ ] Images are compressed and optimized
- [ ] CSS is minified (set in `_config.yml`)
- [ ] Minimize use of external resources
- [ ] Enable caching headers (GitHub Pages does this automatically)
- [ ] Test load time with PageSpeed Insights

---

## Accessibility Checklist

- [ ] All images have alt text
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Sufficient color contrast (4.5:1 minimum)
- [ ] Links are descriptive (avoid "click here")
- [ ] Forms have labels (if applicable)
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

---

## Security Checklist

- [ ] No sensitive information in repository
- [ ] No API keys or passwords in code
- [ ] External links use HTTPS
- [ ] HTTPS is enforced on your domain
- [ ] Dependencies are up to date

---

## Maintenance Schedule

### Weekly
- [ ] Check for new comments/issues
- [ ] Add news updates

### Monthly
- [ ] Update publications list
- [ ] Add new projects
- [ ] Check for broken links

### Quarterly
- [ ] Update dependencies (`bundle update`)
- [ ] Review analytics
- [ ] Update CV/resume content

### Annually
- [ ] Major content refresh
- [ ] Design review
- [ ] Performance audit

---

## Ready to Deploy?

Once you've checked all items:

```bash
# Commit all changes
git add .
git commit -m "Ready for deployment"

# Push to GitHub
git push origin main
```

Your site will automatically deploy via GitHub Actions!

---

## Post-Deployment Promotion

Share your new website:
- [ ] Update email signature
- [ ] Update social media bios
- [ ] Add to CV/resume
- [ ] Update department website
- [ ] Share on Twitter/LinkedIn
- [ ] Add to Google Scholar profile
- [ ] Update ORCID profile

---

**Congratulations on your new website! 🎉**

Need help? Check the [README](README.md) or [CUSTOMIZATION](CUSTOMIZATION.md) guide.
