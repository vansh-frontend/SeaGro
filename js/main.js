// Main JavaScript file for initialization and common functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize features
    loadFeatures();
    
    // Initialize sections
    initializeSections();
    
    // Add scroll animation
    addScrollAnimation();
});

function initializeSections() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Hide all sections except home
    sections.forEach(section => {
        if (section.id !== 'home') {
            section.classList.add('hidden');
        }
    });

    // Add click handlers to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function addScrollAnimation() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}



// news
const redditContainer = document.getElementById("reddit-container");
const hindustanContainer = document.getElementById("hindustan-container");

// Fetch Tech News from Reddit API
const fetchRedditTechNews = async () => {
  const response = await fetch("https://www.reddit.com/r/technology/top.json?limit=5");
  const data = await response.json();
  
  data.data.children.forEach(post => {
    const newsItem = document.createElement("div");
    newsItem.classList.add("news-item");

    newsItem.innerHTML = `
      <h3><a href="https://www.reddit.com${post.data.permalink}" target="_blank">${post.data.title}</a></h3>
      <p>Posted by ${post.data.author}</p>
      <p>${post.data.selftext.substring(0, 150)}...</p>
    `;
    redditContainer.appendChild(newsItem);
  });
};

// Fetch Tech News from Hindustan Times RSS Feed
const fetchHindustanTechNews = async () => {
  const rssFeedUrl = "https://rss.hindustantimes.com/httech/rssfeed.xml";  // Replace with actual RSS URL
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssFeedUrl)}`;
  
  const response = await fetch(apiUrl);
  const data = await response.json();
  
  data.items.forEach(post => {
    const newsItem = document.createElement("div");
    newsItem.classList.add("news-item");

    newsItem.innerHTML = `
      <h3><a href="${post.link}" target="_blank">${post.title}</a></h3>
      <p>${post.description}</p>
    `;
    hindustanContainer.appendChild(newsItem);
  });
};

// Initialize Fetching Data
const init = () => {
  fetchRedditTechNews();
  fetchHindustanTechNews();
};

window.onload = init;


// jobs
