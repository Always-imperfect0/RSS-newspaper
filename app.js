// --- CONFIGURATION ---


// Mock data used if API fails or for "Load More" simulation
const MOCK_DATA = [
    {
        title: "Neon Nights: The Return of Cyber Aesthetics",
        desc: "Why everyone is obsessed with glowing lights and dark interfaces again.",
        img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800",
        cat: "Aesthetics",
        type: "tech"
    },
    {
        title: "Print is Not Dead: It Just Moved Online",
        desc: "Long-form journalism is having a massive comeback in the age of TikTok.",
        img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800",
        cat: "Journalism",
        type: "paper"
    },
    {
        title: "Artificial Minds Dreaming of Electric Sheep",
        desc: "New AI models are generating art that closely mimics human dreams.",
        img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800",
        cat: "Systems",
        type: "tech"
    },
    {
        title: "Minimalism is Over. Welcome to Maximalism.",
        desc: "Cluttered desks, busy screens, and information overload are the new chic.",
        img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800",
        cat: "Culture",
        type: "paper"
    },
    {
        title: "The Sound of the Underground",
        desc: "Lo-fi beats are evolving into complex algorithmic symphonies.",
        img: "https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80&w=800",
        cat: "Music",
        type: "tech"
    },
    {
        title: "Fashion Week 2025: Digital Textiles",
        desc: "Clothing that changes color based on your mood is finally here.",
        img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800",
        cat: "Style",
        type: "paper"
    }
];

const grid = document.getElementById('bento-grid');

// --- RENDER FUNCTION ---
function renderCard(article, index) {
    const card = document.createElement('article');

    // Determine Style randomly or based on data
    const styleType = article.type || (Math.random() > 0.5 ? 'tech' : 'paper');
    const isSpan = (index % 5 === 0); // Every 5th item spans 2 columns

    card.className = `card style-${styleType} ${isSpan ? 'span-2' : ''} animate-enter`;
    card.style.animationDelay = `${index * 100}ms`; // Staggered animation

    // Open link simulation/actual link
    card.addEventListener('click', () => {
        const link = article.url || ('https://google.com/search?q=' + article.title);
        window.open(link, '_blank');
    });

    if (styleType === 'paper') {
        card.innerHTML = `
            <img src="${article.img}" alt="img" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800'">
            <div class="content">
                <div class="meta">/// ${article.cat}</div>
                <h3>${article.title}</h3>
                <p>${article.desc || 'No description available for this story.'}</p>
            </div>
        `;
    } else {
        // Tech Style
        card.innerHTML = `
            <div class="content">
                <h3>${article.title}</h3>
                <div class="meta">SYS_Category: ${article.cat}</div>
            </div>
            <img src="${article.img}" alt="img" onerror="this.src='https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800'">
        `;
    }

    return card;
}

// --- FETCH LOGIC ---
async function fetchNews() {
    grid.innerHTML = '<p style="color:white; padding:20px; font-family:monospace;">INITIALIZING_DATALINK...</p>';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const articles = data.articles;

        // Transform API data to our App format
        const transformedArticles = articles
            .filter(a => a.urlToImage) // Only items with images
            .map(a => ({
                title: a.title,
                desc: a.description,
                img: a.urlToImage,
                cat: a.source.name,
                url: a.url,
                type: null // Let renderCard decide random style
            }));

        grid.innerHTML = '';
        transformedArticles.forEach((item, idx) => {
            grid.appendChild(renderCard(item, idx));
        });

    } catch (error) {
        console.error("Fetch failed, using mock data", error);
        grid.innerHTML = '';
        // If API fails, fall back to cool mock data
        MOCK_DATA.forEach((item, idx) => {
            grid.appendChild(renderCard(item, idx));
        });
    }
}

// Init
document.addEventListener('DOMContentLoaded', fetchNews);

// Infinite Scroll Simulation / Load More
document.getElementById('load-more-btn').addEventListener('click', () => {
    // Just add more mock items for infinite feel
    const newItems = MOCK_DATA.sort(() => 0.5 - Math.random()).slice(0, 3);
    newItems.forEach((item, idx) => {
        grid.appendChild(renderCard(item, idx));
    });
});
