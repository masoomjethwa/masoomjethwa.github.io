/* ============================================
   MASOOM JETHWA PORTFOLIO - ENHANCED SCRIPTS
   Dynamic Folder Content Loading
   ============================================ */

let allRepos = [];
let currentSort = 'updated';

// Folder structure mapping (matches your repo)
const folderStructure = {
    '01': { name: '01 General Astronomy & Space Exploration', icon: '🌌' },
    '02': { name: '02 Solar System', icon: '🪐' },
    '03': { name: '03 Space-Related Topics', icon: '🛰️' },
    '04': { name: '04 Arduino & Microcontroller Projects', icon: '⚡' },
    '05': { name: '05 Raspberry Pi Projects', icon: '🔴' },
    '06': { name: '06 STEM Activities & Challenges', icon: '🔬' },
    '07': { name: '07 Educational Games', icon: '🎮' },
    '08': { name: '08 Miscellaneous Topics', icon: '📚' },
    '09': { name: '09 Codes', icon: '💻' }
};

/**
 * Load HTML files from a specific folder
 */
async function loadFolderContents(folderPath, folderNumber) {
    try {
        // Create a list of all known files in each folder
        const folderContents = {
            '01': ['01_Astronomy_for_Kids.html', '02_Cosmos_Journey.html', '03_Journey_Through_The_Cosmos.html', '04_Interactive_Journey.html', '05_Universe.html', '06_Celestial_Explorer.html', '07_Asteroids.html', '08_Astronomy_Pictionary_Printable.html', '09_Auroras.html', '10_Cosmic_Origins.html', '11_Cosmic_Tapestry.html', '12_Earths_Spin.html', '13_Eccentricity.html', '14_Ellipse.html'],
            '02': ['01_Interactive_Explorer_Theories_of_Solar_System_Origin.html', '02_Journey_Through_Our_Galaxy.html', '03_Planetary_Transit.html', '04_Planetary_Atmosphere.html', '05_Solar_Astro.html', '06_Solar_System.html', '07_Stellar_Gaze.html', '08_Stellar_Gaze_Light.html', '09_Unsolved_Mysteries_of_SS.html', '10_sensors2.html', '11_exp_in_ps.html', '12_ion_netraul_model.html', '13_sensors.html'],
            '03': ['01_Moon_2.html', '02_Abiogenesis.html'],
            '04': ['01_Arduino_Projects_in_PS.html', '02_Aurdiono.html', '03_BVI_Proj.html', '04_ESP32_Proj.html', '05_ESP32.html', '06_LED_Proj.html', '07_RPI_Pico_Proj.html', '08_RPI_Zero_Proj.html'],
            '05': ['01_RPI_2.html', '02_RPI_Course.html', '03_Raspi_Poster.html', '04_RPI_5_Proj.html'],
            '06': ['01_Env_Lab_Activities.html', '02_eSTEM.html', '03_STEM_in_Planetary_Science.html', '04_Green_Challenges.html'],
            '07': ['01_Quiz_3_9_Certi.html'],
            '08': ['01_Evening_and_Morning_Star.html', '02_Index.html', '03_7_journey.html', '04_life_cycle.html'],
            '09': ['clean_html_names.py', 'rename_folders_continuous.py']
        };

        const files = folderContents[folderNumber] || [];
        
        if (files.length === 0) {
            showModal('No resources found', 'This folder is empty or not configured yet.', folderNumber);
            return;
        }

        // Convert file names to display names
        const resources = files.map((file, index) => {
            const displayName = file
                .replace(/^\d+_/, '') // Remove leading number and underscore
                .replace(/_/g, ' ') // Replace underscores with spaces
                .replace(/\.html$|\.py$/, '') // Remove file extension
                .replace(/\b\w/g, char => char.toUpperCase()); // Title case

            return {
                name: displayName,
                file: file,
                url: `./${folderStructure[folderNumber].name}/${file}`,
                index: index + 1
            };
        });

        displayFolderModal(folderNumber, resources);
    } catch (error) {
        console.error('Error loading folder contents:', error);
        showModal('Error', 'Could not load folder contents. Please try again.', folderNumber);
    }
}

/**
 * Display folder contents in modal
 */
function displayFolderModal(folderNumber, resources) {
    const folderInfo = folderStructure[folderNumber];
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');
    
    modalTitle.innerHTML = `${folderInfo.icon} ${folderInfo.name}`;
    
    // Create resource list
    const resourceHTML = resources.map(resource => `
        <div class="resource-item">
            <div class="resource-number">${String(resource.index).padStart(2, '0')}</div>
            <div class="resource-info">
                <h4>${resource.name}</h4>
                <p class="resource-file">${resource.file}</p>
            </div>
            <a href="${resource.url}" target="_blank" class="resource-link">
                <span>Open</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </a>
        </div>
    `).join('');
    
    modalBody.innerHTML = `
        <div class="resources-container">
            ${resourceHTML}
        </div>
        <div class="modal-footer">
            <p class="resource-count">📊 Total Resources: ${resources.length}</p>
        </div>
    `;
    
    // Show modal
    document.getElementById('resource-modal').classList.add('active');
}

/**
 * Show simple modal
 */
function showModal(title, message, folderNumber) {
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = `<p style="text-align: center; padding: 2rem; color: #757575;">${message}</p>`;
    
    document.getElementById('resource-modal').classList.add('active');
}

/**
 * Close modal
 */
function closeModal() {
    document.getElementById('resource-modal').classList.remove('active');
}

/**
 * Fetch GitHub repositories dynamically
 */
async function fetchGitHubRepos() {
    try {
        const response = await fetch('https://api.github.com/users/masoomjethwa/repos?per_page=100&sort=updated');
        const repos = await response.json();
        
        if (Array.isArray(repos)) {
            allRepos = repos
                .filter(repo => !repo.fork) // Exclude forks
                .map(repo => ({
                    name: repo.name,
                    description: repo.description || 'No description available',
                    url: repo.html_url,
                    language: repo.language || 'N/A',
                    stars: repo.stargazers_count || 0,
                    updated: new Date(repo.updated_at),
                    topics: repo.topics || []
                }))
                .sort((a, b) => b.updated - a.updated);
            
            const repoCountElement = document.getElementById('repo-total-count');
            if (repoCountElement) {
                repoCountElement.textContent = allRepos.length;
                renderRepos(allRepos);
            }
        } else {
            showGitHubError('Unable to fetch repositories');
        }
    } catch (error) {
        console.error('Error fetching repos:', error);
        showGitHubError('Error loading repositories. Please try again later.');
    }
}

/**
 * Render repositories to the DOM
 */
function renderRepos(repos) {
    const container = document.getElementById('github-repos-container');
    
    if (!container) return;
    
    if (repos.length === 0) {
        container.innerHTML = '<p class="github-loading">No repositories found.</p>';
        return;
    }

    container.innerHTML = repos.map(repo => {
        const lastUpdated = formatDate(repo.updated);
        const languageColor = getLanguageColor(repo.language);
        
        return `
            <div class="repo-tile">
                <div class="repo-header">
                    <div class="repo-name">${escapeHtml(repo.name)}</div>
                    <div class="repo-icon">📦</div>
                </div>
                
                <p class="repo-description">${escapeHtml(repo.description)}</p>
                
                ${repo.language ? `<span class="repo-language" style="background-color: ${languageColor};">${escapeHtml(repo.language)}</span>` : ''}
                
                <div class="repo-meta">
                    ${repo.stars > 0 ? `<div class="repo-meta-item">⭐ ${repo.stars} stars</div>` : ''}
                    <div class="repo-meta-item">🕐 Updated</div>
                </div>
                
                <div class="repo-updated">${lastUpdated}</div>
                
                <div class="repo-stats">
                    <div class="repo-stat">📊 Repository</div>
                </div>
                
                <a href="${repo.url}" target="_blank" class="repo-link">View on GitHub →</a>
            </div>
        `;
    }).join('');
}

/**
 * Sort repositories by type
 */
function sortRepos(sortType) {
    currentSort = sortType;
    
    // Update button states
    document.querySelectorAll('.sort-option').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    let sorted = [...allRepos];
    
    if (sortType === 'updated') {
        sorted.sort((a, b) => b.updated - a.updated);
    } else if (sortType === 'stars') {
        sorted.sort((a, b) => b.stars - a.stars);
    } else if (sortType === 'language') {
        sorted.sort((a, b) => {
            if (!a.language) return 1;
            if (!b.language) return -1;
            return a.language.localeCompare(b.language);
        });
    }
    
    renderRepos(sorted);
}

/**
 * Format date to human-readable format
 */
function formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    
    return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Get language color for syntax highlighting
 */
function getLanguageColor(language) {
    const colors = {
        'Python': '#3776ab',
        'JavaScript': '#f7df1e',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Java': '#007396',
        'C++': '#00599c',
        'C': '#a9187f',
        'R': '#276dc3',
        'MATLAB': '#0076a8',
        'Shell': '#4ee748',
        'Jupyter Notebook': '#f37726'
    };
    return colors[language] || '#0d47a1';
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show GitHub error message
 */
function showGitHubError(message) {
    const container = document.getElementById('github-repos-container');
    if (container) {
        container.innerHTML = `<p class="github-loading">⚠️ ${message}</p>`;
    }
}

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Fetch repositories
    fetchGitHubRepos();
    
    // Set up modal close button
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('resource-modal');
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
    
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

// Refresh repositories every 30 minutes
setInterval(fetchGitHubRepos, 30 * 60 * 1000);
