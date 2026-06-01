// Main Application State
window.appState = {
    currentLang: localStorage.getItem('portfolio_lang') || 'en',
    currentTheme: localStorage.getItem('portfolio_theme') || 'dark',
    portfolioData: null,
    blogData: null,
    activeCategory: 'All',
    searchQuery: ''
};

// Global Translation Strings for UI elements
const UI_TRANSLATIONS = {
    'en': {
        logo: "Simon",
        nav_portfolio: "Portfolio",
        nav_blog: "Blog",
        nav_admin: "Admin",
        hero_subtitle: "Robotics & Computer Science",
        hero_desc: "Student of General Computer Science. Passionate about robotics, hardware integration, and bioengineering.",
        btn_view_projects: "View Projects",
        btn_contact: "Get in Touch",
        sec_summary: "Summary",
        sec_projects: "Featured Projects",
        sec_services: "Active Services",
        sec_certs: "Certifications",
        sec_langs_presence: "Skills & Online Presence",
        sec_langs: "Languages",
        sec_links: "Online Presence",
        contact_loc: "Location",
        contact_email: "Email",
        contact_line: "Line ID",
        contact_kakao: "Kakao ID",
        status_running: "Active",
        search_placeholder: "Search posts...",
        all_categories: "All",
        read_more: "Read More",
        btn_back_blog: "Back to Blog",
        footer_rights: "Rights Reserved By Simon Lee",
        no_posts: "No posts found matching the criteria."
    },
    'kor': {
        logo: "이승원",
        nav_portfolio: "포트폴리오",
        nav_blog: "블로그",
        nav_admin: "관리자",
        hero_subtitle: "로보틱스 & 컴퓨터 과학",
        hero_desc: "컴퓨터 과학 전반을 탐구하고 있습니다. 로봇 공학, 하드웨어 통합 및 생물공학에 대한 깊은 열정이 있습니다.",
        btn_view_projects: "프로젝트 보기",
        btn_contact: "연락하기",
        sec_summary: "개요",
        sec_projects: "주요 프로젝트",
        sec_services: "운영 중인 서비스",
        sec_certs: "자격증",
        sec_langs_presence: "역량 및 온라인 활동",
        sec_langs: "언어",
        sec_links: "온라인 활동",
        contact_loc: "위치",
        contact_email: "이메일",
        contact_line: "라인 ID",
        contact_kakao: "카카오톡 ID",
        status_running: "운영중",
        search_placeholder: "글 검색...",
        all_categories: "전체",
        read_more: "자세히 보기",
        btn_back_blog: "블로그 목록으로",
        footer_rights: "모든 권리는 이승원에게 있습니다",
        no_posts: "검색 조건에 맞는 게시물이 없습니다."
    },
    'jp': {
        logo: "スン원",
        nav_portfolio: "ポートフォリオ",
        nav_blog: "ブログ",
        nav_admin: "管理者",
        hero_subtitle: "ロボティクス & コンピュータサイエンス",
        hero_desc: "コンピューターサイエンス全体を勉強しています。ロボット工学、ハードウェア統合、バイオエンジニアリングに関心があります。",
        btn_view_projects: "プロジェクトを見る",
        btn_contact: "連絡を取る",
        sec_summary: "概要",
        sec_projects: "主要プロジェクト",
        sec_services: "実行中のサービス",
        sec_certs: "資格",
        sec_langs_presence: "言語・オンラインプレゼンス",
        sec_langs: "言語",
        sec_links: "オンラインプレゼンス",
        contact_loc: "場所",
        contact_email: "メールアドレス",
        contact_line: "Line ID",
        contact_kakao: "Kakao ID",
        status_running: "アクティブ",
        search_placeholder: "記事を検索...",
        all_categories: "すべて",
        read_more: "詳細を読む",
        btn_back_blog: "ブログ一覧に戻る",
        footer_rights: "Simon Lee - 無断転載を禁じます",
        no_posts: "条件に一致する記事が見つかりませんでした。"
    },
    'chn': {
        logo: "承洹",
        nav_portfolio: "作品集",
        nav_blog: "博客",
        nav_admin: "管理后台",
        hero_subtitle: "机器人与计算机科学",
        hero_desc: "计算机科学专业学生。对机器人学、硬件集成以及生物工程充满热情。",
        btn_view_projects: "查看项目",
        btn_contact: "联系我",
        sec_summary: "个人简介",
        sec_projects: "精选项目",
        sec_services: "运行中服务",
        sec_certs: "专业证书",
        sec_langs_presence: "语言与在线形象",
        sec_langs: "语言",
        sec_links: "在线形象",
        contact_loc: "所在地",
        contact_email: "电子邮箱",
        contact_line: "Line ID",
        contact_kakao: "Kakao ID",
        status_running: "运行中",
        search_placeholder: "搜索文章...",
        all_categories: "全部",
        read_more: "阅读全文",
        btn_back_blog: "返回博客列表",
        footer_rights: "版权所有 © Simon Lee",
        no_posts: "未找到符合条件的文章。"
    }
};

// UI translation helper
window.uiT = function(key) {
    const lang = window.appState.currentLang;
    return (UI_TRANSLATIONS[lang] && UI_TRANSLATIONS[lang][key]) || UI_TRANSLATIONS['en'][key] || key;
};

// Data item translation helper (maps translations dynamic object)
window.t = function(transObj) {
    if (!transObj) return '';
    const lang = window.appState.currentLang;
    return transObj[lang] || transObj['en'] || transObj[Object.keys(transObj)[0]] || '';
};

// Toast Notifications System
window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 4000);
};

// Loading Data with Local Storage overrides (for instant CRUD feedback)
async function loadData() {
    try {
        // Load Portfolio Data
        const localPortfolio = localStorage.getItem('portfolio_data_override');
        if (localPortfolio) {
            window.appState.portfolioData = JSON.parse(localPortfolio);
        } else {
            const resp = await fetch('data/portfolio.json?cb=' + Date.now());
            if (resp.ok) window.appState.portfolioData = await resp.json();
        }

        // Load Blog Data
        const localBlog = localStorage.getItem('blog_data_override');
        if (localBlog) {
            window.appState.blogData = JSON.parse(localBlog);
        } else {
            const resp = await fetch('data/blog.json?cb=' + Date.now());
            if (resp.ok) window.appState.blogData = await resp.json();
        }
    } catch (err) {
        console.error("Failed to load portfolio or blog database files", err);
        window.showToast("Failed to load dynamic data. Operating in offline/local storage mode.", "warning");
        
        // Setup empty structure if fetch failed
        if (!window.appState.portfolioData) window.appState.portfolioData = { profile: {}, summary: {}, projects: [], services: [], certs: [], languages: [], links: [] };
        if (!window.appState.blogData) window.appState.blogData = { posts: [] };
    }
}

// Global Theme Management
function initTheme() {
    const root = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');
    
    // Set theme
    root.setAttribute('data-theme', window.appState.currentTheme);
    updateThemeIcon();

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            window.appState.currentTheme = window.appState.currentTheme === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', window.appState.currentTheme);
            localStorage.setItem('portfolio_theme', window.appState.currentTheme);
            updateThemeIcon();
        });
    }
}

function updateThemeIcon() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;
    if (window.appState.currentTheme === 'light') {
        toggleBtn.innerHTML = '🌙'; // Icon for changing to dark mode
    } else {
        toggleBtn.innerHTML = '☀️'; // Icon for changing to light mode
    }
}

// Global Language Management
function initLanguage() {
    const langBtns = document.querySelectorAll('.lang-btn');
    
    langBtns.forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === window.appState.currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }

        btn.addEventListener('click', () => {
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            window.appState.currentLang = lang;
            localStorage.setItem('portfolio_lang', lang);
            
            // Re-render UI and current route contents
            updateStaticUITranslations();
            handleRoute();
        });
    });
}

// Translate marked elements
function updateStaticUITranslations() {
    document.querySelectorAll('[data-ui-key]').forEach(el => {
        const key = el.getAttribute('data-ui-key');
        if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
            el.setAttribute('placeholder', window.uiT(key));
        } else {
            el.textContent = window.uiT(key);
        }
    });
}

// Client-side Routing System
async function handleRoute() {
    const hash = window.location.hash || '#/portfolio';
    const mainContent = document.getElementById('main-content');
    
    // Close mobile/navbar or clean standard styles
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === hash || (hash.startsWith('#/blog') && href === '#/blog')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Ensure data is loaded
    if (!window.appState.portfolioData || !window.appState.blogData) {
        await loadData();
    }

    // Hide all view panels first
    document.getElementById('portfolio-view').classList.add('hidden');
    document.getElementById('blog-view').classList.add('hidden');
    document.getElementById('blog-post-view').classList.add('hidden');
    document.getElementById('admin-view').classList.add('hidden');

    if (hash === '#/portfolio' || hash === '' || hash === '#/') {
        document.getElementById('portfolio-view').classList.remove('hidden');
        renderPortfolio();
    } else if (hash === '#/blog') {
        document.getElementById('blog-view').classList.remove('hidden');
        renderBlog();
    } else if (hash.startsWith('#/blog/')) {
        const postId = hash.split('#/blog/')[1];
        document.getElementById('blog-post-view').classList.remove('hidden');
        renderBlogPost(postId);
    } else if (hash === '#/admin') {
        document.getElementById('admin-view').classList.remove('hidden');
        initAdminView();
    } else {
        // Fallback to portfolio
        window.location.hash = '#/portfolio';
    }
    
    window.scrollTo(0, 0);
}

// RENDER: Portfolio View
function renderPortfolio() {
    const data = window.appState.portfolioData;
    if (!data) return;

    document.getElementById('logo-text').textContent = window.uiT('logo');
    document.title = `${window.t(data.profile.name)} | Portfolio`;

    // Hero Section Rendering
    const heroContainer = document.getElementById('hero-container');
    heroContainer.innerHTML = `
        <div class="hero-content">
            <p class="hero-subtitle">${window.uiT('hero_subtitle')}</p>
            <h1 class="hero-title">
                ${window.uiT('logo') === 'Simon' ? "I'm " : ""}<span class="gradient-text">${window.t(data.profile.name)}</span>
            </h1>
            <p class="hero-desc">${window.uiT('hero_desc')}</p>
            <div class="hero-buttons">
                <a href="#/blog" class="btn btn-primary">${window.uiT('nav_blog')}</a>
                <a href="#links-anchor" class="btn btn-secondary">${window.uiT('btn_contact')}</a>
            </div>
        </div>
        <div class="glow-blur blur-1"></div>
        <div class="glow-blur blur-2"></div>
    `;

    // Summary Section
    const summaryContainer = document.getElementById('summary-container');
    summaryContainer.innerHTML = `
        <p>${window.t(data.summary.p1)}</p>
        ${data.summary.p2 ? `<p style="margin-top: 1.5rem;">${window.t(data.summary.p2)}</p>` : ''}
    `;

    // Profile Details Grid
    const profileGrid = document.getElementById('profile-details-grid');
    profileGrid.innerHTML = `
        <div class="contact-item">
            <div class="contact-icon">📍</div>
            <div class="contact-info-text">
                <h4>${window.uiT('contact_loc')}</h4>
                <p>${window.t(data.profile.location)}</p>
            </div>
        </div>
        <div class="contact-item">
            <div class="contact-icon">✉️</div>
            <div class="contact-info-text">
                <h4>${window.uiT('contact_email')}</h4>
                <p><a href="mailto:${data.profile.email}">${data.profile.email}</a></p>
            </div>
        </div>
        ${data.profile.lineId ? `
        <div class="contact-item">
            <div class="contact-icon">💬</div>
            <div class="contact-info-text">
                <h4>${window.uiT('contact_line')}</h4>
                <p>${data.profile.lineId}</p>
            </div>
        </div>` : ''}
        ${data.profile.kakaoId ? `
        <div class="contact-item">
            <div class="contact-icon">💬</div>
            <div class="contact-info-text">
                <h4>${window.uiT('contact_kakao')}</h4>
                <p>${data.profile.kakaoId}</p>
            </div>
        </div>` : ''}
    `;

    // Projects Section
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';
    
    if (data.projects && data.projects.length > 0) {
        data.projects.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'glass-card project-card';
            card.innerHTML = `
                <div class="project-card-header">
                    <div class="project-icon">📁</div>
                    <div class="project-links">
                        ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" class="project-link" title="GitHub Source">⚙️</a>` : ''}
                        ${proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="project-link" title="Live Demo">🔗</a>` : ''}
                    </div>
                </div>
                <h3>${window.t(proj.title)}</h3>
                <p>${window.t(proj.description)}</p>
            `;
            projectsGrid.appendChild(card);
        });
    }

    // Active Services Section
    const servicesGrid = document.getElementById('services-grid');
    servicesGrid.innerHTML = '';
    
    if (data.services && data.services.length > 0) {
        data.services.forEach(srv => {
            const card = document.createElement('div');
            card.className = 'glass-card service-card';
            card.innerHTML = `
                <div>
                    <div class="service-header">
                        <span class="status-badge">
                            <span class="status-pulse"></span>
                            ${window.uiT('status_running')}
                        </span>
                        <span>🚀</span>
                    </div>
                    <h3>${window.t(srv.title)}</h3>
                    <p>${window.t(srv.description)}</p>
                </div>
                <a href="${srv.url}" target="_blank" class="btn btn-secondary btn-small" style="margin-top: 1.5rem; text-align: center;">🔗 Visit App</a>
            `;
            servicesGrid.appendChild(card);
        });
    }

    // Certifications Section
    const certsContainer = document.getElementById('certs-container');
    certsContainer.innerHTML = '';
    
    if (data.certs && data.certs.length > 0) {
        data.certs.forEach(cert => {
            const row = document.createElement('div');
            row.className = 'glass-card cert-card';
            row.innerHTML = `
                <div class="cert-icon">🏆</div>
                <div class="cert-details">
                    <h3>${window.t(cert.title)}</h3>
                    <p>${window.t(cert.description)}</p>
                </div>
            `;
            certsContainer.appendChild(row);
        });
    }

    // Languages List
    const langsList = document.getElementById('langs-list');
    langsList.innerHTML = '';
    
    if (data.languages && data.languages.length > 0) {
        data.languages.forEach(lang => {
            const item = document.createElement('div');
            item.className = 'lang-item-bar';
            
            let pct = '60%';
            const lvl = window.t(lang.level).toLowerCase();
            if (lvl.includes('native') || lvl.includes('원어민') || lvl.includes('母语')) pct = '100%';
            else if (lvl.includes('advanced') || lvl.includes('상급') || lvl.includes('高级') || lvl.includes('ih')) pct = '85%';
            else if (lvl.includes('intermediate')) pct = '70%';
            
            item.innerHTML = `
                <div class="lang-info">
                    <span class="lang-name">${window.t(lang.name)}</span>
                    <span class="lang-level">${window.t(lang.level)}</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${pct}"></div>
                </div>
            `;
            langsList.appendChild(item);
        });
    }

    // Online Social Links
    const linksList = document.getElementById('links-list');
    linksList.innerHTML = '';
    
    if (data.links && data.links.length > 0) {
        data.links.forEach(link => {
            const a = document.createElement('a');
            a.className = 'social-link-item';
            a.href = link.url;
            a.target = '_blank';
            a.innerHTML = `
                <span class="social-name">🔗 ${window.t(link.platform)}</span>
                <span class="social-arrow">➔</span>
            `;
            linksList.appendChild(a);
        });
    }
}

// RENDER: Blog View
function renderBlog() {
    const data = window.appState.blogData;
    if (!data) return;

    const blogGrid = document.getElementById('blog-grid');
    const categoriesContainer = document.getElementById('blog-categories');
    
    const categories = ['All'];
    data.posts.forEach(p => {
        if (p.category && !categories.includes(p.category)) {
            categories.push(p.category);
        }
    });

    categoriesContainer.innerHTML = '';
    categories.forEach(cat => {
        const tab = document.createElement('button');
        tab.className = `category-tab ${window.appState.activeCategory === cat ? 'active' : ''}`;
        tab.textContent = cat === 'All' ? window.uiT('all_categories') : cat;
        tab.addEventListener('click', () => {
            window.appState.activeCategory = cat;
            renderBlogGrid();
            renderBlog();
        });
        categoriesContainer.appendChild(tab);
    });

    const searchInput = document.getElementById('blog-search-input');
    if (searchInput && !searchInput.dataset.listenerInstalled) {
        searchInput.dataset.listenerInstalled = 'true';
        searchInput.addEventListener('input', (e) => {
            window.appState.searchQuery = e.target.value.toLowerCase().trim();
            renderBlogGrid();
        });
    }

    if (searchInput) {
        searchInput.setAttribute('placeholder', window.uiT('search_placeholder'));
    }

    renderBlogGrid();
}

function renderBlogGrid() {
    const data = window.appState.blogData;
    const blogGrid = document.getElementById('blog-grid');
    if (!data || !blogGrid) return;

    blogGrid.innerHTML = '';
    
    const filtered = data.posts.filter(post => {
        const matchCategory = window.appState.activeCategory === 'All' || post.category === window.appState.activeCategory;
        
        const titleText = window.t(post.title).toLowerCase();
        const summaryText = window.t(post.summary).toLowerCase();
        const contentText = window.t(post.content).toLowerCase();
        const matchSearch = !window.appState.searchQuery || 
            titleText.includes(window.appState.searchQuery) ||
            summaryText.includes(window.appState.searchQuery) ||
            contentText.includes(window.appState.searchQuery);
            
        return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
        blogGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">${window.uiT('no_posts')}</div>`;
        return;
    }

    filtered.sort((a,b) => new Date(b.date) - new Date(a.date));

    filtered.forEach(post => {
        const card = document.createElement('article');
        card.className = 'glass-card blog-card';
        card.innerHTML = `
            <div class="blog-card-meta">
                <span class="blog-meta-category">${post.category || 'General'}</span>
                <span class="blog-meta-date">${post.date}</span>
            </div>
            <h3>${window.t(post.title)}</h3>
            <p>${window.t(post.summary)}</p>
            <a href="#/blog/${post.id}" class="blog-card-link">
                ${window.uiT('read_more')} <span>➔</span>
            </a>
        `;
        blogGrid.appendChild(card);
    });
}

// RENDER: Detailed Blog Post View
function renderBlogPost(id) {
    const data = window.appState.blogData;
    const container = document.getElementById('blog-post-view');
    if (!data || !container) return;

    const post = data.posts.find(p => p.id === id);
    if (!post) {
        container.innerHTML = `
            <div class="container">
                <a href="#/blog" class="btn btn-secondary blog-post-back">⬅ ${window.uiT('btn_back_blog')}</a>
                <h2>Post not found</h2>
            </div>
        `;
        return;
    }

    function parseMarkdown(mdText) {
        if (!mdText) return '';
        let html = mdText;
        
        html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        html = html.replace(/```(\w*)\n([\s\S]*?)\n```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
        });

        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^&gt;\s+(.+)$/gm, '<blockquote><p>$1</p></blockquote>');
        
        const blocks = html.split(/\n\n+/);
        html = blocks.map(block => {
            const trimmed = block.trim();
            if (trimmed.startsWith('<h2>') || trimmed.startsWith('<h3>') || 
                trimmed.startsWith('<pre>') || trimmed.startsWith('<blockquote>') ||
                trimmed.startsWith('<ul>') || trimmed.startsWith('<ol>')) {
                return trimmed;
            }
            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                const listItems = trimmed.split(/\n[*|-]\s+/).map((item, idx) => {
                    const cleanItem = idx === 0 ? item.substring(2) : item;
                    return `<li>${cleanItem}</li>`;
                }).join('');
                return `<ul>${listItems}</ul>`;
            }
            return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
        }).join('');

        return html;
    }

    container.innerHTML = `
        <div class="container">
            <div class="blog-post-header">
                <a href="#/blog" class="btn btn-secondary btn-small blog-post-back">⬅ ${window.uiT('btn_back_blog')}</a>
                <div class="blog-post-meta">
                    <span class="blog-meta-category">${post.category || 'General'}</span>
                    <span class="blog-meta-date">${post.date}</span>
                </div>
                <h1 class="blog-post-title">${window.t(post.title)}</h1>
            </div>
            <div class="blog-post-content">
                ${parseMarkdown(window.t(post.content))}
            </div>
        </div>
    `;
}

// Lazy loading of admin CMS panel
function initAdminView() {
    if (typeof window.initAdminController === 'function') {
        window.initAdminController();
    } else {
        const script = document.createElement('script');
        script.src = 'admin.js';
        script.onload = () => {
            if (typeof window.initAdminController === 'function') {
                window.initAdminController();
            }
        };
        document.body.appendChild(script);
    }
}

// Global Event Initialization
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    updateStaticUITranslations();
    handleRoute();
});

window.addEventListener('hashchange', handleRoute);
