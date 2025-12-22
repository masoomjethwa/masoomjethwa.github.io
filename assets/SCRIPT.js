/* ============================================
   MASOOM JETHWA PORTFOLIO - MAIN SCRIPTS
   ============================================ */

const GITHUB_USERNAME = 'masoomjethwa';
const REPO_NAME = 'masoomjethwa.github.io'; // Update this if your repo name is different
const IGNORE_FOLDERS = ['.git', 'assets', 'certifications', 'node_modules'];

let allRepos = [];
let currentSort = 'updated';

// ... (Keep existing fetchGitHubRepos, renderRepos, sortRepos functions exactly as they were) ...
// ... Copy-paste your previous Repo logic here ... 

/* ============================================
   DYNAMIC RESOURCE BROWSER LOGIC
   ============================================ */

/**
 * Initialize the resource browser
 */
async function initResourceBrowser() {
    const foldersContainer = document.getElementById('resource-folders');
    const loading = document.getElementById('resource-loading');
    
    // Safety check
    if(!foldersContainer) return;

    foldersContainer.innerHTML = '';
    loading.classList.remove('hidden');

    try {
        // Fetch root contents
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/`);
        
        if (!response.ok) throw new Error('Failed to load resources');
        
        const data = await response.json();
        
        // Filter for folders that are likely resource categories (e.g., start with numbers 01-09)
        const folders = data.filter(item => 
            item.type === 'dir' && 
            !IGNORE_FOLDERS.includes(item.name) &&
            /^\d{2}/.test(item.name) // Only fetch folders starting with 01, 02, etc.
        );

        renderFolders(folders);
        
    } catch (error) {
        console.error(error);
        document.getElementById('resource-error').textContent = 
            'Unable to load resources dynamically. API rate limit may be exceeded.';
        document.getElementById('resource-error').classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
}

/**
 * Render the top-level folders
 */
function renderFolders(folders) {
    const container = document.getElementById('resource-folders');
    container.classList.remove('hidden');
    
    container.innerHTML = folders.map(folder => {
        // Beautify name: "01 General Astronomy" -> "General Astronomy"
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

    // UI State update
    folderView.classList.add('hidden');
    fileView.classList.add('hidden');
    loading.classList.remove('hidden');
    
    // Beautify title
    navTitle.textContent = originalName.replace(/^\d{2}[_\s]*/, '').replace(/_/g, ' ');
    nav.classList.remove('hidden');

    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${path}`);
        const data = await response.json();

        // Filter for HTML files or relevant content
        const files = data.filter(item => item.name.endsWith('.html'));
        
        renderFiles(files, path);
        fileView.classList.remove('hidden');

    } catch (error) {
        console.error(error);
        alert('Could not load folder contents.');
        resetResourceView();
    } finally {
        loading.classList.add('hidden');
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
        // Construct live page URL
        // From: https://api.github.com/.../01_file.html
        // To: https://masoomjethwa.github.io/repo/path/01_file.html
        
        // Ensure path encoding handles spaces correctly
        const liveUrl = `https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/${encodeURIComponent(folderPath)}/${encodeURIComponent(file.name)}`;
        
        // Clean display name
        const displayName = file.name
            .replace('.html', '')
            .replace(/^\d{2}[_\s]*/, '') // Remove leading numbers
            .replace(/_/g, ' ');         // Replace underscores

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
    document.getElementById('resource-files').classList.add('hidden');
    document.getElementById('resource-nav').classList.add('hidden');
    document.getElementById('resource-folders').classList.remove('hidden');
}

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Existing Init
    fetchGitHubRepos();
    
    // New Resource Browser Init
    initResourceBrowser();
    
    // Smooth scrolling
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

// Refresh repos interval
setInterval(fetchGitHubRepos, 30 * 60 * 1000);