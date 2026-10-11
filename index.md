---
layout: default
permalink: /
extra_css:
  - /assets/css/home.css
---
<div class="home">

<!-- About Section -->
<section id="about" class="h-intro">
  <img src="{{ site.author.photo | relative_url }}" alt="{{ site.author.name }}" class="h-photo">
  <div class="h-intro-text">
    <h1 class="h-name">{{ site.author.name }}</h1>
    <p class="h-role">PhD Student working on Generative Modeling</p>
    <div class="h-social">
      {% if site.social.email %}
      <a href="mailto:{{ site.social.email }}" aria-label="Email" title="Email">
        <svg viewBox="0 0 16 16" width="18" height="18"><path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0114.25 14H1.75A1.75 1.75 0 010 12.25v-8.5C0 2.784.784 2 1.75 2zM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V5.809L8.38 9.397a.75.75 0 01-.76 0L1.5 5.809v6.442zm13-8.181v-.32a.25.25 0 00-.25-.25H1.75a.25.25 0 00-.25.25v.32L8 7.88l6.5-3.81z"></path></svg>
      </a>
      {% endif %}
      
      {% if site.social.github %}
      <a href="https://github.com/{{ site.social.github }}" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">
        <svg viewBox="0 0 16 16" width="18" height="18"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
      </a>
      {% endif %}
      
      {% if site.social.scholar %}
      <a href="https://scholar.google.com/citations?user={{ site.social.scholar }}" target="_blank" rel="noopener" aria-label="Google Scholar" title="Google Scholar">
        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.5 3.5 7.5-5.5 7.5 5.5 4.5-3.5L12 0z" fill="currentColor"/></svg>
      </a>
      {% endif %}
      
      {% if site.social.orcid %}
      <a href="https://orcid.org/{{ site.social.orcid }}" target="_blank" rel="noopener" aria-label="ORCID" title="ORCID">
        <svg viewBox="0 0 16 16" width="18" height="18"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zM5.5 4.5a1 1 0 11-2 0 1 1 0 012 0zm-.5 2h1v5h-1v-5zm3.5 0h2.5c1.38 0 2.5.84 2.5 2.5S12.38 11.5 11 11.5H8.5v-5zm1 1v3h1.5c.83 0 1.5-.45 1.5-1.5s-.67-1.5-1.5-1.5H9.5z" fill="currentColor"/></svg>
      </a>
      {% endif %}
      
      {% if site.social.twitter %}
      <a href="https://twitter.com/{{ site.social.twitter }}" target="_blank" rel="noopener" aria-label="Twitter" title="Twitter">
        <svg viewBox="0 0 16 16" width="18" height="18"><path d="M13.567 5.144c.008.123.008.247.008.371 0 3.796-2.889 8.173-8.172 8.173v-.002A8.131 8.131 0 011 12.398a5.768 5.768 0 004.25-1.19 2.876 2.876 0 01-2.683-1.995c.431.083.875.066 1.297-.05A2.873 2.873 0 011.56 6.348v-.036c.4.222.847.345 1.304.36a2.876 2.876 0 01-.89-3.836 8.152 8.152 0 005.916 3 2.874 2.874 0 014.895-2.619 5.763 5.763 0 001.824-.697 2.883 2.883 0 01-1.262 1.588A5.712 5.712 0 0015 3.656a5.834 5.834 0 01-1.433 1.488z" fill="currentColor"/></svg>
      </a>
      {% endif %}
      
      {% if site.social.bluesky %}
      <a href="https://bsky.app/profile/{{ site.social.bluesky }}" target="_blank" rel="noopener" aria-label="Bluesky" title="Bluesky">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/></svg>
      </a>
      {% endif %}
      
      {% if site.social.linkedin %}
      <a href="https://linkedin.com/in/{{ site.social.linkedin }}" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">
        <svg viewBox="0 0 16 16" width="18" height="18"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.695-2.165 1.193v.025h-.016a5.54 5.54 0 01.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" fill="currentColor"/></svg>
      </a>
      {% endif %}
    </div>
    <div class="h-bio">
      {{ site.author.bio | markdownify }}
      <p>
        My research focuses on generative models for images, especially text-to-image generation and flow matching.
        I am interested in making these models more data- and compute-efficient and training competitive text-to-image models.
        I am also interested in vision representation learning.
      </p>
    </div>
  </div>
</section>

<!-- News Section -->
<section id="news" class="h-section">
  <h2 class="h-h2">News</h2>
  {%- assign news = site.news | sort: "date" | reverse %}
  <ul class="h-news">
    {%- for item in news limit: 4 %}
    <li><span class="h-news-date">{{ item.date | date: "%b %Y" }}</span><div class="h-news-text">{{ item.content }}</div></li>
    {%- endfor %}
  </ul>
  {%- if news.size > 4 %}
  <details class="h-news-more">
    <summary>Show all news ({{ news.size }})</summary>
    <ul class="h-news">
      {%- for item in news offset: 4 %}
      <li><span class="h-news-date">{{ item.date | date: "%b %Y" }}</span><div class="h-news-text">{{ item.content }}</div></li>
      {%- endfor %}
    </ul>
  </details>
  {%- endif %}
</section>

<!-- Publications Section -->
<section id="publications" class="h-section">
  <h2 class="h-h2">Publications</h2>
  <p class="h-muted">Also on <a href="https://scholar.google.com/citations?user={{ site.social.scholar }}" target="_blank" rel="noopener">Google Scholar</a>{% if site.social.orcid %} and <a href="https://orcid.org/{{ site.social.orcid }}" target="_blank" rel="noopener">ORCID</a>{% endif %}.</p>
  {%- assign publications_by_year = site.data.publications | group_by: "year" | sort: "name" | reverse %}
  {%- for year_group in publications_by_year %}
  <h3 class="h-year">{{ year_group.name }}</h3>
  <div class="h-pubs">
    {%- for pub in year_group.items %}
    {% include publication.html pub=pub %}
    {%- endfor %}
  </div>
  {%- endfor %}
</section>

<!-- Misc Section -->
<section id="misc" class="h-section">
  <h2 class="h-h2">Misc</h2>
  <h3 class="h-misc-title">Teaching</h3>
  <ul class="h-rows">
    <li>
      <span class="h-rows-date">2024 &ndash; 2026</span>
      <div><span class="h-rows-main">Advanced Deep Learning</span><span class="h-rows-sub">Teaching Assistant &middot; Ecole polytechnique</span></div>
    </li>
    <li>
      <span class="h-rows-date">2024 &ndash; 2026</span>
      <div><span class="h-rows-main">Deep Learning for Computer Vision</span><span class="h-rows-sub">Teaching Assistant &middot; Ecole polytechnique</span></div>
    </li>
  </ul>

  <h3 class="h-misc-title">Reviewer</h3>
  <ul class="h-rows">
    <li>
      <span class="h-rows-date">2027</span>
      <div class="h-venues"><span>ICLR</span></div>
    </li>
    <li>
      <span class="h-rows-date">2026</span>
      <div class="h-venues"><span>NeurIPS <em class="h-award">Top Reviewer</em></span><span>ECCV</span><span>CVPR</span></div>
    </li>
  </ul>
</section>

</div>
