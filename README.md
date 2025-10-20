# Academic Personal Website

A minimal, elegant, and responsive academic personal website built with Jekyll and optimized for GitHub Pages deployment. Perfect for researchers, professors, and academics who want a professional online presence.

## 🌟 Features

- **Clean Academic Design**: Minimal aesthetic inspired by leading academic websites
- **Fully Responsive**: Mobile-friendly with hamburger navigation
- **Dark Mode**: Built-in light/dark theme toggle with localStorage persistence
- **Multiple Sections**:
  - **About**: Biography, photo, and contact information
  - **News**: Chronological updates grouped by year
  - **Publications**: List of papers with citation info and links
  - **Projects**: Individual project pages with detailed descriptions
  - **Teaching**: Course information and teaching philosophy
  - **Open Source**: Software projects and contributions
- **Collections**: Automatic page generation for news items and projects
- **BibTeX Support**: Import publications from BibTeX files
- **RSS Feed**: Automatic feed generation for news updates
- **GitHub Actions**: Automated deployment to GitHub Pages
- **SEO Optimized**: Built-in Jekyll SEO plugin
- **Fast Loading**: Minimal dependencies and optimized assets

## 🚀 Quick Start

### Prerequisites

- Ruby 2.7 or higher
- Bundler (`gem install bundler`)
- Git

### Installation

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/yourusername/yourrepo.git
   cd yourrepo
   ```

2. **Configure Bundler to install gems locally**
   ```bash
   bundle config set --local path 'vendor/bundle'
   ```

3. **Install dependencies**
   ```bash
   bundle install
   ```

4. **Run locally**
   ```bash
   bundle exec jekyll serve
   ```
   Or with live reload:
   ```bash
   bundle exec jekyll serve --livereload
   ```

5. **Open your browser**
   Navigate to `http://localhost:4000`

## 📝 Customization

### Basic Information

Edit `_config.yml` to update your personal information:

```yaml
# Site settings
title: Your Name
email: your.email@university.edu
description: Your description here

# Personal info
author:
  name: Your Name
  title: Your Position
  affiliation: Your Institution
  photo: /assets/images/profile.svg  # Replace with your photo
  bio: Your biography here

# Social links
social:
  email: your.email@university.edu
  github: yourusername
  scholar: your-scholar-id
  orcid: 0000-0000-0000-0000
  twitter: yourusername
  linkedin: yourprofile
```

### About Page

Edit `index.md` to customize your home/about page:

```markdown
---
layout: default
permalink: /
---

<section class="about">
  <!-- Your content here -->
</section>
```

### Adding News Items

Create a new file in `_news/` directory:

```markdown
---
date: 2024-10-15
---

Your news content here. You can use **Markdown** formatting!
```

News items are automatically grouped by year and sorted in reverse chronological order.

### Adding Projects

Create a new file in `_projects/` directory:

```markdown
---
title: Project Name
subtitle: Short description
date: 2024-01-15
image: /assets/images/projects/project-image.jpg
github: https://github.com/yourusername/project
paper: https://arxiv.org/abs/xxxx.xxxxx
website: https://project-website.com
---

## Project Description

Your detailed project description here...
```

Each project gets its own page at `/projects/project-name/`.

### Publications

Update `publications.md` with your papers, or import from BibTeX:

1. Add your references to `_bibliography/references.bib`
2. The site comes with example BibTeX entries you can modify

### Teaching

Edit `teaching.md` to add your courses:

```markdown
### Course Title
**Semester Year | Level**

Course description...

- **Topics**: List of topics
- **Enrollment**: Number of students
- [Syllabus](#) | [Course Website](#)
```

### Open Source

Edit `opensource.md` to showcase your software projects and contributions.

### Styling

The site uses a custom CSS file at `assets/css/main.css`. You can customize:

- **Colors**: Edit CSS variables at the top of the file
- **Fonts**: Change `--font-serif` and `--font-sans` variables
- **Layout**: Modify `--max-width` and spacing variables
- **Dark mode**: Adjust colors in `[data-theme="dark"]` section

Example color customization:

```css
:root {
  --accent-color: #2563eb;  /* Change to your preferred color */
  --accent-hover: #1d4ed8;
}
```

### Profile Photo

Replace `assets/images/profile.svg` with your photo:

1. Add your photo to `assets/images/`
2. Update `_config.yml`:
   ```yaml
   author:
     photo: /assets/images/your-photo.jpg
   ```

Recommended: Square image, at least 400x400px

### Project Images

Add images for your projects in `assets/images/projects/`:

```yaml
# In your project markdown file
image: /assets/images/projects/your-project.jpg
```

## 🌐 Deployment to GitHub Pages

### Method 1: GitHub Actions (Recommended)

The site includes a GitHub Actions workflow for automatic deployment.

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository Settings
   - Navigate to Pages section
   - Source: Select "GitHub Actions"

3. **Wait for deployment**
   - The workflow will automatically build and deploy
   - Your site will be available at `https://yourusername.github.io`

### Method 2: Manual Deployment

If GitHub Actions is not available:

1. Build the site locally:
   ```bash
   JEKYLL_ENV=production bundle exec jekyll build
   ```

2. The built site is in `_site/` directory
3. Deploy contents to your hosting provider

### Custom Domain

To use a custom domain:

1. Add a `CNAME` file to the root directory with your domain:
   ```
   www.yourname.com
   ```

2. Configure DNS settings with your domain provider:
   - Type: `CNAME`
   - Name: `www` (or `@` for apex domain)
   - Value: `yourusername.github.io`

3. Enable custom domain in GitHub Pages settings

## 📁 Project Structure

```
.
├── _config.yml              # Site configuration
├── _layouts/                # Page templates
│   ├── default.html         # Base layout
│   ├── page.html            # Standard page layout
│   └── project.html         # Project page layout
├── _includes/               # Reusable components
│   ├── header.html          # Navigation bar
│   └── footer.html          # Footer
├── _news/                   # News items (Markdown files)
├── _projects/               # Project pages (Markdown files)
├── _bibliography/           # BibTeX files
├── assets/
│   ├── css/
│   │   └── main.css         # Main stylesheet
│   ├── js/
│   │   └── main.js          # JavaScript (navigation, dark mode)
│   └── images/              # Images and media
├── .github/
│   └── workflows/
│       └── jekyll.yml       # GitHub Actions workflow
├── index.md                 # Home/About page
├── news.md                  # News listing page
├── publications.md          # Publications page
├── projects.md              # Projects listing page
├── teaching.md              # Teaching page
├── opensource.md            # Open source page
├── Gemfile                  # Ruby dependencies
└── README.md               # This file
```

## 🎨 Design Philosophy

This website follows academic website best practices:

- **Content First**: Focus on your research and achievements
- **Readability**: Serif fonts for body text, clear hierarchy
- **Accessibility**: High contrast, semantic HTML, ARIA labels
- **Performance**: Minimal JavaScript, optimized CSS
- **Maintainability**: Clean code structure, well-documented

Inspired by excellent academic websites like:
- Jon Barron's website
- Andrej Karpathy's blog
- Tim Dettmers' website

## 🔧 Advanced Customization

### Adding New Sections

1. Create a new Markdown file (e.g., `blog.md`)
2. Add it to the navigation in `_includes/header.html`:
   ```html
   <li><a href="{{ '/blog/' | relative_url }}">Blog</a></li>
   ```

### Custom Collections

Add new collections in `_config.yml`:

```yaml
collections:
  talks:
    output: true
    permalink: /talks/:name/
```

Create `_talks/` directory and add content files.

### Analytics

Add Google Analytics or other tracking:

1. Create `_includes/analytics.html`
2. Add your tracking code
3. Include it in `_layouts/default.html`:
   ```html
   {% include analytics.html %}
   ```

### Comments

To add comments (e.g., Disqus) to blog posts or projects:

1. Create `_includes/comments.html`
2. Add comment service code
3. Include in desired layouts

## 🐛 Troubleshooting

### Bundle install fails with permission errors

If you get permission errors when running `bundle install`, configure Bundler to install gems locally:

```bash
bundle config set --local path 'vendor/bundle'
bundle install
```

This installs gems in `vendor/bundle` within your project instead of system directories.

### Site not building locally

```bash
# Clear cache and rebuild
bundle exec jekyll clean
bundle exec jekyll build
```

### Styles not loading

- Check that `assets/css/main.css` exists
- Verify the path in `_layouts/default.html`
- Clear browser cache

### GitHub Actions failing

- Check Ruby version in `.github/workflows/jekyll.yml`
- Ensure all dependencies are in `Gemfile`
- Review Actions logs in GitHub repository

### Dark mode not working

- Ensure JavaScript is enabled
- Check browser console for errors
- Verify `assets/js/main.js` is loaded

## 📚 Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Markdown Guide](https://www.markdownguide.org/)
- [BibTeX Format](http://www.bibtex.org/Format/)

## 🤝 Contributing

Feel free to fork this repository and customize it for your needs. If you find bugs or have suggestions:

1. Open an issue
2. Submit a pull request
3. Share your customizations!

## 📄 License

This template is free to use for academic and personal purposes. No attribution required, but appreciated!

## ✨ Credits

Built with:
- [Jekyll](https://jekyllrb.com/) - Static site generator
- [GitHub Pages](https://pages.github.com/) - Free hosting
- SVG icons from various open-source projects

## 💡 Tips for Success

1. **Keep it updated**: Regularly add news items and update publications
2. **Use good images**: High-quality project screenshots make a difference
3. **Write clearly**: Your website represents your research - proofread carefully
4. **Mobile test**: Check on different devices and screen sizes
5. **Link everything**: Add DOIs, GitHub links, PDFs where available
6. **Be discoverable**: Use proper meta tags and descriptions

## 📞 Support

For questions or issues:
- Check existing issues on GitHub
- Review Jekyll documentation
- Open a new issue with details

---

**Happy building! 🚀**

*Last updated: October 2024*
