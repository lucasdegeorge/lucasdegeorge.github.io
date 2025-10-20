# Customization Guide

This guide provides practical examples for customizing your academic website.

## Table of Contents
1. [Branding & Colors](#branding--colors)
2. [Typography](#typography)
3. [Layout & Spacing](#layout--spacing)
4. [Adding Content](#adding-content)
5. [Advanced Features](#advanced-features)

---

## Branding & Colors

### Change Accent Color

Edit `assets/css/main.css`:

```css
:root {
  --accent-color: #2563eb;      /* Links, active states */
  --accent-hover: #1d4ed8;      /* Hover states */
}

/* Dark mode accent colors */
[data-theme="dark"] {
  --accent-color: #60a5fa;
  --accent-hover: #93c5fd;
}
```

**Popular Academic Color Schemes:**
- Blue (default): `#2563eb` / `#1d4ed8`
- Green: `#10b981` / `#059669`
- Purple: `#8b5cf6` / `#7c3aed`
- Red: `#ef4444` / `#dc2626`

### Customize Background Colors

```css
:root {
  --bg-primary: #ffffff;        /* Main background */
  --bg-secondary: #f8f9fa;      /* Cards, footer */
  --text-primary: #1a1a1a;      /* Main text */
  --text-secondary: #6c757d;    /* Secondary text */
}
```

---

## Typography

### Change Fonts

Edit CSS variables in `assets/css/main.css`:

```css
:root {
  --font-serif: 'Crimson Pro', 'Georgia', serif;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Consolas', 'Monaco', 'Courier New', monospace;
}
```

**To use Google Fonts**, add to `_layouts/default.html` in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

Then update CSS:

```css
:root {
  --font-serif: 'Merriweather', serif;
  --font-sans: 'Inter', sans-serif;
}
```

### Adjust Font Sizes

```css
h1 { font-size: 2.5rem; }   /* Adjust as needed */
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }

/* Base body text */
body {
  font-size: 18px;  /* Default: 16px */
  line-height: 1.7;
}
```

---

## Layout & Spacing

### Change Maximum Width

```css
:root {
  --max-width: 900px;  /* Adjust from 700px to 1200px */
}
```

### Adjust Spacing

```css
:root {
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
}
```

### Modify Navigation Height

```css
:root {
  --nav-height: 60px;  /* Default: 60px */
}
```

---

## Adding Content

### Add a New News Item

Create `_news/YYYY-MM-DD-title.md`:

```markdown
---
date: 2024-10-15
---

**Exciting news!** Our paper was accepted to [Conference Name](link).
You can use *Markdown* formatting including [links](url) and **bold text**.
```

### Add a New Project

Create `_projects/project-name.md`:

```markdown
---
title: Project Title
subtitle: Brief description (optional)
date: 2024-01-15
image: /assets/images/projects/project.jpg
github: https://github.com/username/project
paper: https://arxiv.org/abs/xxxx.xxxxx
website: https://project-site.com
---

## Overview

Your project description using Markdown...

## Features

- Feature 1
- Feature 2

## Results

| Metric | Value |
|--------|-------|
| Accuracy | 95% |
```

### Add Publications from BibTeX

Publications are now managed through a simple YAML file at `_data/publications.yml`.

**To add a new publication:**

1. Edit `_data/publications.yml` and add a new entry:

```yaml
- title: "Your Paper Title"
  authors: "Author1, Author2, Author3"
  venue: "Conference/Journal Name"
  year: 2025
  thumbnail: "/assets/images/publications/paper-image.jpg"
  links:
    paper: "https://link-to-paper.com"
    code: "https://github.com/username/repo"
    arxiv: "https://arxiv.org/abs/xxxx.xxxxx"
    project: "https://project-page.com"
```

2. Add publication thumbnail image:
   - Place images in `assets/images/publications/`
   - Recommended size: 300x300px (square)
   - Supported formats: JPG, PNG, or SVG
   - The image will be displayed at 150x150px on desktop, full width on mobile

**Available link types:**
- `project`, `paper`, `arxiv`, `code`, `doi`, `poster`, `video`, `model`, `dataset`

**Features:**
- ✅ Automatic sorting by year (newest first)
- ✅ Automatic year grouping
- ✅ No HTML editing needed
- ✅ All styling and hover effects included

See `PUBLICATIONS_GUIDE.md` for detailed instructions.

### Add a Teaching Course

Edit `teaching.md`:

```markdown
### CS 101: Introduction to Programming
**Fall 2024 | Undergraduate**

Introduction to programming concepts using Python.

- **Prerequisites**: None
- **Enrollment**: 80 students
- **Format**: 3 lectures + 1 lab per week
- [Syllabus](/path/to/syllabus.pdf) | [Course Site](https://course-url.com)

**Topics Covered:**
- Python basics
- Data structures
- Algorithms
- Object-oriented programming
```

---

## Advanced Features

### Add Custom Section

1. Create new page `blog.md`:

```markdown
---
layout: page
title: Blog
permalink: /blog/
---

Your blog content here...
```

2. Add to navigation in `_includes/header.html`:

```html
<li><a href="{{ '/blog/' | relative_url }}" {% if page.url contains '/blog' %}class="active"{% endif %}>Blog</a></li>
```

### Create New Collection

1. Add to `_config.yml`:

```yaml
collections:
  talks:
    output: true
    permalink: /talks/:name/
```

2. Create `_talks/` directory

3. Add content files:

```markdown
---
title: Talk Title
date: 2024-06-15
venue: Conference Name
location: City, Country
slides: /assets/slides/talk.pdf
---

Talk abstract and details...
```

4. Create listing page `talks.md`:

```markdown
---
layout: page
title: Talks
---

{% for talk in site.talks %}
- **{{ talk.title }}** ({{ talk.date | date: "%B %Y" }})  
  {{ talk.venue }}, {{ talk.location }}  
  [Slides]({{ talk.slides }})
{% endfor %}
```

### Add Google Analytics

1. Create `_includes/analytics.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

2. Include in `_layouts/default.html` before `</head>`:

```html
{% if jekyll.environment == "production" %}
  {% include analytics.html %}
{% endif %}
```

### Add Search Functionality

1. Install jekyll-algolia plugin in `Gemfile`:

```ruby
gem 'jekyll-algolia'
```

2. Configure in `_config.yml`:

```yaml
algolia:
  application_id: YOUR_APP_ID
  index_name: YOUR_INDEX
  search_only_api_key: YOUR_KEY
```

3. Add search box to header

### Custom 404 Page

Create `404.md`:

```markdown
---
layout: page
title: Page Not Found
permalink: /404.html
---

# 404 - Page Not Found

Sorry, the page you're looking for doesn't exist.

[← Back to Home]({{ '/' | relative_url }})
```

### Add RSS Feed Customization

Edit `_config.yml`:

```yaml
feed:
  path: feed.xml
  posts_limit: 20
  excerpt_only: true
```

### Optimize Images

Add image optimization in GitHub Actions (`.github/workflows/jekyll.yml`):

```yaml
- name: Optimize images
  run: |
    sudo apt-get install -y jpegoptim optipng
    find assets/images -name "*.jpg" -exec jpegoptim --strip-all {} \;
    find assets/images -name "*.png" -exec optipng -o7 {} \;
```

---

## Styling Tips

### Hover Animations

Add smooth transitions to links:

```css
.project-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}
```

### Custom Buttons

```css
.btn {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background-color: var(--accent-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: var(--accent-hover);
}
```

Use in Markdown:

```markdown
<a href="/contact" class="btn">Get in Touch</a>
```

### Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  /* Styles for mobile */
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  /* Styles for tablet */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Styles for desktop */
}
```

---

## Performance Tips

1. **Compress images**: Use tools like TinyPNG or ImageOptim
2. **Minify CSS**: Enable in `_config.yml`:
   ```yaml
   sass:
     style: compressed
   ```
3. **Lazy load images**:
   ```html
   <img src="image.jpg" loading="lazy" alt="Description">
   ```
4. **Use SVG for logos**: Scalable and small file size

---

## Accessibility

1. **Alt text for images**: Always include descriptive alt text
2. **ARIA labels**: Add to interactive elements
3. **Color contrast**: Ensure text is readable (use tools like WebAIM)
4. **Keyboard navigation**: Test site without mouse

---

## Need More Help?

- Check [Jekyll documentation](https://jekyllrb.com/docs/)
- Review [Liquid template syntax](https://shopify.github.io/liquid/)
- Browse [Jekyll themes](http://jekyllthemes.org/) for inspiration
- Ask questions on [Jekyll Talk](https://talk.jekyllrb.com/)

---

*Happy customizing! 🎨*
