---
layout: page
title: Projects
permalink: /projects/
---


<div class="projects-grid">
  {% for project in site.projects %}
  <div class="project-card">
    {% if project.image %}
    <div class="project-image">
      <a href="{{ project.url | relative_url }}">
        <img src="{{ project.image | relative_url }}" alt="{{ project.title }}">
      </a>
    </div>
    {% endif %}
    
    <div class="project-card-content">
      <h3><a href="{{ project.url | relative_url }}">{{ project.title }}</a></h3>
      
      {% if project.subtitle %}
      <p class="project-subtitle">{{ project.subtitle }}</p>
      {% endif %}
      
      <p class="project-excerpt">{{ project.excerpt | strip_html | truncatewords: 30 }}</p>
      
      <div class="project-links">
        <a href="{{ project.url | relative_url }}" class="read-more">Read More →</a>
        
        {% if project.github %}
        <a href="{{ project.github }}" target="_blank" rel="noopener" class="project-icon" title="GitHub">
          <svg viewBox="0 0 16 16" width="16" height="16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
        </a>
        {% endif %}
        
        {% if project.paper %}
        <a href="{{ project.paper }}" target="_blank" rel="noopener" class="project-icon" title="Paper">
          <svg viewBox="0 0 16 16" width="16" height="16"><path d="M4 1.75C4 .784 4.784 0 5.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0114.25 15h-9a.75.75 0 010-1.5h9a.25.25 0 00.25-.25V4.664a.25.25 0 00-.073-.177L11.513 1.573a.25.25 0 00-.177-.073H5.75a.25.25 0 00-.25.25v2.5a.75.75 0 01-1.5 0v-2.5z"></path></svg>
        </a>
        {% endif %}
      </div>
    </div>
  </div>
  {% endfor %}
</div>
