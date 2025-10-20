// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close mobile menu when clicking a link
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
});

// Dark mode toggle
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;
  
  // Check for saved theme preference or default to 'light'
  const currentTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', currentTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
});

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('a[href^="#"]');
  const navMenu = document.querySelector('.nav-menu');
  const navToggle = document.querySelector('.nav-toggle');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (navMenu && navToggle) {
          navMenu.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
        
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Add animation on scroll
document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
});

// Copy code blocks to clipboard
document.addEventListener('DOMContentLoaded', function() {
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(block => {
    const pre = block.parentElement;
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';
    button.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 4px 8px;
      font-size: 0.8rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
    `;
    
    pre.style.position = 'relative';
    pre.appendChild(button);
    
    pre.addEventListener('mouseenter', () => {
      button.style.opacity = '1';
    });
    
    pre.addEventListener('mouseleave', () => {
      button.style.opacity = '0';
    });
    
    button.addEventListener('click', async () => {
      const code = block.textContent;
      await navigator.clipboard.writeText(code);
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    });
  });
});

// Image Carousel
document.addEventListener('DOMContentLoaded', function() {
  const carousels = document.querySelectorAll('.carousel-container');
  
  carousels.forEach(carousel => {
    const slides = carousel.querySelector('.carousel-slides');
    const slideElements = carousel.querySelectorAll('.carousel-slide');
    const prevButton = carousel.querySelector('.carousel-button.prev');
    const nextButton = carousel.querySelector('.carousel-button.next');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    const counter = carousel.querySelector('.carousel-counter');
    
    if (!slides || slideElements.length === 0) return;
    
    let currentIndex = 0;
    const totalSlides = slideElements.length;
    
    function updateCarousel() {
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Update indicators
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
      
      // Update counter
      if (counter) {
        counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
      }
    }
    
    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    }
    
    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    }
    
    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }
    
    // Button event listeners
    if (prevButton) {
      prevButton.addEventListener('click', prevSlide);
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', nextSlide);
    }
    
    // Indicator event listeners
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }
    
    // Initialize
    updateCarousel();
  });
});

// Comparison Carousel (4 images in a row)
document.addEventListener('DOMContentLoaded', function() {
  const comparisonCarousels = document.querySelectorAll('.comparison-carousel-container');
  
  comparisonCarousels.forEach(carousel => {
    const slides = carousel.querySelector('.comparison-carousel-slides');
    const slideElements = carousel.querySelectorAll('.comparison-carousel-slide');
    const prevButton = carousel.querySelector('.comparison-carousel-button.prev');
    const nextButton = carousel.querySelector('.comparison-carousel-button.next');
    const indicators = carousel.querySelectorAll('.comparison-carousel-indicator');
    const counter = carousel.querySelector('.comparison-carousel-counter');
    
    if (!slides || slideElements.length === 0) return;
    
    let currentIndex = 0;
    const totalSlides = slideElements.length;
    
    function updateCarousel() {
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Update indicators
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
      
      // Update counter
      if (counter) {
        counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
      }
    }
    
    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    }
    
    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    }
    
    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }
    
    // Button event listeners
    if (prevButton) {
      prevButton.addEventListener('click', prevSlide);
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', nextSlide);
    }
    
    // Indicator event listeners
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }
    
    // Initialize
    updateCarousel();
  });
});
