// Features data and rendering
const features = [
    {
        icon: 'fa-briefcase',
        title: 'Job Board',
        description: 'Find your next career opportunity or hire talented professionals.'
    },
    {
        icon: 'fa-book',
        title: 'Learning Center',
        description: 'Access high-quality courses and tutorials to enhance your skills.'
    },
    {
        icon: 'fa-users',
        title: 'Community',
        description: 'Connect with like-minded individuals and grow your network.'
    },
    {
        icon: 'fa-bicycle',
        title: 'Bike Sharing',
        description: 'Sustainable and convenient transportation at your fingertips.'
    },
    {
        icon: 'fa-newspaper',
        title: 'Tech News',
        description: 'Stay updated with the latest technology trends and news.'
    },
    {
        icon: 'fa-comments',
        title: 'Chat',
        description: 'Real-time communication with other community members.'
    },
    {
        icon: 'fa-images',
        title: 'Content Sharing',
        description: 'Share and discover amazing photos and videos.'
    },
    {
        icon: 'fa-tasks',
        title: 'Task Management',
        description: 'Stay organized with personal to-do lists and task tracking.'
    }
];

function loadFeatures() {
    const featuresGrid = document.querySelector('.features-grid');
    
    features.forEach(feature => {
        const featureCard = document.createElement('div');
        featureCard.className = 'feature-card animate-on-scroll';
        
        featureCard.innerHTML = `
            <i class="fas ${feature.icon} fa-2x" style="color: var(--primary-color); margin-bottom: 1rem;"></i>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
        `;
        
        featuresGrid.appendChild(featureCard);
    });
}