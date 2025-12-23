/* ============================================
   MASOOM JETHWA PORTFOLIO - MAIN SCRIPTS
   INTEGRATED WITH GOOGLE SCHOLAR METRICS
   ============================================ */

const GITHUB_USERNAME = 'masoomjethwa';
const REPO_NAME = 'masoomjethwa.github.io';
const IGNORE_FOLDERS = ['.git', 'assets', 'certifications', 'node_modules'];

const SCHOLAR_CONFIG = {
    userId: '-wlEzlYAAAAJ',
    name: 'Masoom Jethwa'
};

let allRepos = [];
let currentSort = 'updated';

/* ============================================
   GOOGLE SCHOLAR METRICS FETCHER
   ============================================ */

/**
 * Fetch Google Scholar statistics via Semantic Scholar API
 */
async function fetchScholarStatsSemanticScholar() {
    try {
        const response = await fetch(
            `https://api.semanticscholar.org/graph/v1/author/search?query=${encodeURIComponent(SCHOLAR_CONFIG.name)}&fields=hIndex,citationCount,paperCount`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        );
        
        if (!response.ok) throw new Error('API fetch failed');
        
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            const author = data.data[0];
            return {
                citations: author.citationCount || 0,
                hIndex: author.hIndex || 0,
                i10Index: 0,
                publications: author.paperCount || 0,
                source: 'semantic-scholar'
            };
        }
    } catch (error) {
        console.warn('Semantic Scholar API failed:', error);
        return null;
    }
}

/**
 * Get manual fallback stats
 * UPDATE THESE VALUES QUARTERLY FROM YOUR GOOGLE SCHOLAR PROFILE
 */
function getManualStats() {
    return {
        citations: 0,
        hIndex: 0,
        i10Index: 0,
        publications: 0,
        source: 'manual'
    };
}

/**
 * Fetch and display Google Scholar statistics
 */
async function fetchGoogleScholarStats() {
    try {
        let stats = await fetchScholarStatsSemanticScholar();
        
        if (stats) {
            updateScholarDisplay(stats);
            return;
        }
        
        updateScholarDisplay(getManualStats());
        
    } catch (error) {
        console.error('Error fetching Scholar stats:', error);
        updateScholarDisplay(getManualStats());
    }
}

/**
 * Update HTML elements with fetched stats
 */
function updateScholarDisplay(stats) {
    const elements = {
        citations: document.getElementById('citations-count'),
        hIndex: document.getElementById('h-index-count'),
        i10Index: document.getElementById('i10-index-count'),
        publications: document.getElementById('publications-count')
    };
    
    if (elements.citations) {
        elements.citations.textContent = stats.citations || '—';
        elements.citations.style.color = '#42a5f5';
        elements.citations.style.fontWeight = 'bold';
    }
    if (elements.hIndex) {
        elements.hIndex.textContent = stats.hIndex || '—';
        elements.hIndex.style.color = '#42a5f5';
        elements.hIndex.style.fontWeight = 'bold';
    }
    if (elements.i10Index) {
        elements.i10Index.textContent = stats.i10Index || '—';
        elements.i10Index.style.color = '#42a5f5';
        elements.i10Index.style.fontWeight = 'bold';
    }
    if (elements.publications) {
        elements.publications.textContent = stats.publications || '—';
        elements.publications.style.color = '#42a5f5';
        elements.publications.style.fontWeight = 'bold';
    }
    
    console.log(`Scholar Stats Updated (${stats.source}):`, stats);
}

/* ============================================
   GITHUB REPOSITORIES FETCHER
   ============================================ */

/**
 * Fetch GitHub repositories
 */
async function fetchGitHubRepos() {
    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
        );
        const data = await response.json();
        
        if (Array.isArray(data)) {
            allRepos = data;
            currentSort = 'updated';
            renderRepos(allRepos);
        }
    } catch (error) {
        console.error('Error fetching repos:', error);
    }
}

/**
 * Render GitHub repositories as tiles
 */
function renderRepos(repos) {
    const container = document.getElementById('repos-container');
    if (!container) return;
    
    const reposHTML = repos.slice(0, 100).map(repo => {
        const lastUpdated = new Date(repo.updated_at);
        const daysAgo = Math.floor((new Date() - lastUpdated) / (1000 * 60 * 60 * 24));
        
        let timeString = '';
        if (daysAgo === 0) timeString = 'Updated today';
        else if (daysAgo === 1) timeString = 'Updated yesterday';
        else if (daysAgo < 30) timeString = `Updated ${daysAgo} days ago`;
        else if (daysAgo < 365) timeString = `Updated ${Math.floor(daysAgo / 30)} months ago`;
        else timeString = `Updated ${Math.floor(daysAgo / 365)} years ago`;
        
        return `
            <div class="repo-tile">
                <div class="repo-header">
                    <div class="repo-icon">📦</div>
                    <div class="repo-name">${repo.name}</div>
                </div>
                <p class="repo-description">${repo.description || 'No description available'}</p>
                <div class="repo-meta">
                    <span class="repo-language">${repo.language || 'N/A'}</span>
                    <span class="repo-updated">🕐 ${timeString}</span>
                </div>
                <a href="${repo.html_url}" target="_blank" class="repo-link">View on GitHub →</a>
            </div>
        `;
    }).join('');
    
    container.innerHTML = reposHTML;
}

/**
 * Sort repositories
 */
function sortRepos(sortBy) {
    currentSort = sortBy;
    
    let sorted = [...allRepos];
    
    if (sortBy === 'recent') {
        sorted.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } else if (sortBy === 'stars') {
        sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (sortBy === 'language') {
        sorted.sort((a, b) => {
            const langA = (a.language || 'Z').toLowerCase();
            const langB = (b.language || 'Z').toLowerCase();
            return langA.localeCompare(langB);
        });
    }
    
    renderRepos(sorted);
}

/* ============================================
   DYNAMIC RESOURCE BROWSER LOGIC
   ============================================ */

/**
 * Initialize the resource browser
 */
async function initResourceBrowser() {
    const foldersContainer = document.getElementById('resource-folders');
    const loading = document.getElementById('resource-loading');
    
    if (!foldersContainer) return;

    foldersContainer.innerHTML = '';
    if (loading) loading.classList.remove('hidden');

    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/`);
        
        if (!response.ok) throw new Error('Failed to load resources');
        
        const data = await response.json();
        
        const folders = data.filter(item => 
            item.type === 'dir' && 
            !IGNORE_FOLDERS.includes(item.name) &&
            /^\d{2}/.test(item.name)
        );

        renderFolders(folders);
        
    } catch (error) {
        console.error(error);
        const errorElement = document.getElementById('resource-error');
        if (errorElement) {
            errorElement.textContent = 'Unable to load resources dynamically. API rate limit may be exceeded.';
            errorElement.classList.remove('hidden');
        }
    } finally {
        if (loading) loading.classList.add('hidden');
    }
}

/**
 * Render the top-level folders
 */
function renderFolders(folders) {
    const container = document.getElementById('resource-folders');
    container.classList.remove('hidden');
    
    container.innerHTML = folders.map(folder => {
        const cleanName = folder.name.replace(/^\d{2}[_\s]*/, '').replace(/_/g, ' ');
        const folderIndex = folder.name.match(/^(\d{2})/)[0];

        return `
            <div class="folder-card" onclick="openFolder('${folder.path}', '${folder.name}')">
                <div class="folder-icon">📁</div>
                <div class="folder-name">${folderIndex}. ${cleanName}</div>
                <div class="folder-meta">Click to view contents</div>
            </div>
        `;
    }).join('');
}

/**
 * Open a specific folder and list files
 */
async function openFolder(path, originalName) {
    const folderView = document.getElementById('resource-folders');
    const fileView = document.getElementById('resource-files');
    const nav = document.getElementById('resource-nav');
    const loading = document.getElementById('resource-loading');
    const navTitle = document.getElementById('current-folder-name');

    folderView.classList.add('hidden');
    fileView.classList.add('hidden');
    if (loading) loading.classList.remove('hidden');
    
    if (navTitle) {
        navTitle.textContent = originalName.replace(/^\d{2}[_\s]*/, '').replace(/_/g, ' ');
    }
    if (nav) nav.classList.remove('hidden');

    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${path}`);
        const data = await response.json();

        const files = data.filter(item => item.name.endsWith('.html'));
        
        renderFiles(files, path);
        fileView.classList.remove('hidden');

    } catch (error) {
        console.error(error);
        alert('Could not load folder contents.');
        resetResourceView();
    } finally {
        if (loading) loading.classList.add('hidden');
    }
}

/**
 * Render files within a folder
 */
function renderFiles(files, folderPath) {
    const container = document.getElementById('resource-files');
    
    if (files.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-secondary);">No HTML files found in this folder.</p>';
        return;
    }

    container.innerHTML = files.map(file => {
        const liveUrl = `https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/${encodeURIComponent(folderPath)}/${encodeURIComponent(file.name)}`;
        
        const displayName = file.name
            .replace('.html', '')
            .replace(/^\d{2}[_\s]*/, '')
            .replace(/_/g, ' ');

        return `
            <a href="${liveUrl}" target="_blank" class="file-item">
                <div class="file-icon">📄</div>
                <div class="file-info">
                    <span class="file-name">${displayName}</span>
                    <span class="file-type">HTML Document</span>
                </div>
            </a>
        `;
    }).join('');
}

/**
 * Reset view back to folder list
 */
function resetResourceView() {
    const fileView = document.getElementById('resource-files');
    const nav = document.getElementById('resource-nav');
    const folderView = document.getElementById('resource-folders');
    
    if (fileView) fileView.classList.add('hidden');
    if (nav) nav.classList.add('hidden');
    if (folderView) folderView.classList.remove('hidden');
}

/* ============================================
   PAGE INITIALIZATION
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize GitHub repos
    fetchGitHubRepos();
    
    // Initialize Google Scholar metrics
    fetchGoogleScholarStats();
    
    // Initialize resource browser
    initResourceBrowser();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Auto-refresh GitHub repos every 30 minutes
setInterval(fetchGitHubRepos, 30 * 60 * 1000);

// Auto-refresh Google Scholar stats every 4 hours
setInterval(fetchGoogleScholarStats, 4 * 60 * 60 * 1000);
