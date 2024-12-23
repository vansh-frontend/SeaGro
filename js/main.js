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


// share
// DOM Elements
const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const captionInput = document.getElementById("captionInput");
const contentGrid = document.getElementById("contentGrid");
const modal = document.getElementById("postModal");
const modalMedia = document.getElementById("modalMedia");
const modalCaption = document.getElementById("modalCaption");
const likeButton = document.getElementById("likeButton");
const likeCount = document.getElementById("likeCount");
const commentInput = document.getElementById("commentInput");
const addCommentButton = document.getElementById("addCommentButton");
const commentsSection = document.getElementById("commentsSection");
const closeModal = document.querySelector(".close-modal");

let currentPost = null;

// Load posts on page load
document.addEventListener("DOMContentLoaded", loadPosts);

// Form submission
uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    const caption = captionInput.value;

    if (file) {
        const fileURL = URL.createObjectURL(file);
        const post = {
            id: Date.now(),
            fileURL,
            fileType: file.type,
            caption,
            likes: 0,
            likedBy: [], // Tracks users who liked the post
            comments: [],
        };

        savePost(post);
        renderPost(post);

        // Reset form
        fileInput.value = "";
        captionInput.value = "";
    }
});

// Save post to localStorage
function savePost(post) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));
}

// Load posts from localStorage
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.forEach((post) => renderPost(post));
}

// Render a post in the DOM
function renderPost(post) {
    const contentItem = document.createElement("div");
    contentItem.className = "content-item";
    contentItem.dataset.id = post.id;

    const mediaElement =
        post.fileType.startsWith("image/")
            ? `<img src="${post.fileURL}" alt="Post Image"/>`
            : `<video src="${post.fileURL}" controls></video>`;

    contentItem.innerHTML = `
        <div class="media">${mediaElement}</div>
        <p class="caption">${post.caption}</p>
        <div class="post-actions">
            <button class="action-btn open-post">Open</button>
            <button class="action-btn delete-post">Delete</button>
        </div>
    `;

    // Event listeners
    contentItem.querySelector(".open-post").addEventListener("click", () => openPost(post));
    contentItem.querySelector(".delete-post").addEventListener("click", () => deletePost(post.id, contentItem));

    contentGrid.appendChild(contentItem);
}

// Open a post in the modal
function openPost(post) {
    currentPost = post;

    modalMedia.innerHTML = post.fileType.startsWith("image/")
        ? `<img src="${post.fileURL}" alt="Post Image"/>`
        : `<video src="${post.fileURL}" controls></video>`;

    modalCaption.textContent = post.caption;
    likeCount.textContent = post.likes;
    commentsSection.innerHTML = post.comments.map((comment) => `<div class="comment">${comment}</div>`).join("");

    const userId = getUserId();
    if (post.likedBy.includes(userId)) {
        likeButton.disabled = true;
        likeButton.textContent = `Liked (${post.likes})`;
    } else {
        likeButton.disabled = false;
        likeButton.textContent = `Like (${post.likes})`;
    }

    modal.classList.remove("hidden");
}

// Like a post
likeButton.addEventListener("click", () => {
    if (currentPost) {
        const userId = getUserId();

        if (!currentPost.likedBy.includes(userId)) {
            currentPost.likes += 1;
            currentPost.likedBy.push(userId);

            likeButton.disabled = true;
            likeButton.textContent = `Liked (${currentPost.likes})`;
            likeCount.textContent = currentPost.likes;

            updatePost(currentPost);
        }
    }
});

// Add a comment
addCommentButton.addEventListener("click", () => {
    if (currentPost && commentInput.value) {
        currentPost.comments.push(commentInput.value);

        const newComment = document.createElement("div");
        newComment.className = "comment";
        newComment.textContent = commentInput.value;
        commentsSection.appendChild(newComment);

        commentInput.value = "";

        updatePost(currentPost);
    }
});

// Update a post in localStorage
function updatePost(updatedPost) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const index = posts.findIndex((post) => post.id === updatedPost.id);

    if (index !== -1) {
        posts[index] = updatedPost;
        localStorage.setItem("posts", JSON.stringify(posts));
    }
}

// Delete a post
function deletePost(postId, contentItem) {
    if (confirm("Are you sure you want to delete this post?")) {
        let posts = JSON.parse(localStorage.getItem("posts")) || [];
        posts = posts.filter((post) => post.id !== postId);
        localStorage.setItem("posts", JSON.stringify(posts));

        contentItem.remove(); // Remove the post from the DOM
    }
}

// Close the modal
closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

// Generate a unique user ID
function getUserId() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = `user_${Date.now()}`;
        localStorage.setItem("userId", userId);
    }
    return userId;
}
