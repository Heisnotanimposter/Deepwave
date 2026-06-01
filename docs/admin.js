// Admin Panel CMS Controller
(function() {
    // Admin state in-memory
    const adminState = {
        config: {
            owner: localStorage.getItem('github_owner') || '',
            repo: localStorage.getItem('github_repo') || '',
            branch: localStorage.getItem('github_branch') || 'main',
            pat: localStorage.getItem('github_pat') || '',
            localMode: localStorage.getItem('local_only_mode') === 'true'
        },
        currentTab: 'profile', // profile, projects, services, certs, languages, links, blog
        editingItem: null, // item currently in form edit mode
        editingLang: 'en', // language tab currently editing in form
        isSaving: false,
        isUnsaved: false
    };

    // Helper: Initialize Admin Controller
    window.initAdminController = function() {
        renderAdminShell();
    };

    // Render Auth screen or Admin Dashboard
    function renderAdminShell() {
        const container = document.getElementById('admin-view');
        if (!container) return;

        const isAuthConfigured = adminState.config.localMode || (adminState.config.owner && adminState.config.repo && adminState.config.pat);
        
        if (!isAuthConfigured) {
            renderAuthScreen(container);
        } else {
            renderDashboard(container);
        }
    }

    // Render Auth Settings Screen
    function renderAuthScreen(container) {
        container.innerHTML = `
            <div class="container">
                <div class="glass-card auth-container">
                    <div class="auth-header">
                        <h2>CMS Admin Settings</h2>
                        <p>Configure GitHub API or work locally to manage portfolio contents.</p>
                    </div>
                    
                    <div class="token-guide">
                        <strong>How to connect GitHub for live CRUD:</strong>
                        <ol>
                            <li>Create a <a href="https://github.com/settings/tokens" target="_blank">Classic Personal Access Token</a>.</li>
                            <li>Grant <code>repo</code> write permission scopes.</li>
                            <li>Paste the token and repo path below.</li>
                        </ol>
                    </div>

                    <form id="auth-config-form">
                        <div class="form-group">
                            <label>GitHub Repository Owner</label>
                            <input type="text" class="form-control" id="auth-owner" value="${adminState.config.owner}" placeholder="e.g. Heisnotanimposter" required>
                        </div>
                        <div class="form-group">
                            <label>Repository Name</label>
                            <input type="text" class="form-control" id="auth-repo" value="${adminState.config.repo}" placeholder="e.g. heisnotanimposter.github.io" required>
                        </div>
                        <div class="form-group">
                            <label>Branch Name</label>
                            <input type="text" class="form-control" id="auth-branch" value="${adminState.config.branch}" required>
                        </div>
                        <div class="form-group">
                            <label>Personal Access Token (PAT)</label>
                            <input type="password" class="form-control" id="auth-pat" value="${adminState.config.pat}" placeholder="ghp_xxxxxxxxxxxxxxx" required>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem;">
                            <button type="submit" class="btn btn-primary" style="width:100%;">⚙️ Save Configuration</button>
                            <button type="button" id="auth-local-btn" class="btn btn-secondary" style="width:100%;">💡 Local Storage Test Mode</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('auth-config-form').addEventListener('submit', (e) => {
            e.preventDefault();
            adminState.config.owner = document.getElementById('auth-owner').value.trim();
            adminState.config.repo = document.getElementById('auth-repo').value.trim();
            adminState.config.branch = document.getElementById('auth-branch').value.trim();
            adminState.config.pat = document.getElementById('auth-pat').value.trim();
            adminState.config.localMode = false;

            saveConfigToLocalStorage();
            window.showToast("GitHub config saved successfully!");
            renderAdminShell();
        });

        document.getElementById('auth-local-btn').addEventListener('click', () => {
            adminState.config.localMode = true;
            saveConfigToLocalStorage();
            window.showToast("Operating in Local Storage fallback mode.", "warning");
            renderAdminShell();
        });
    }

    function saveConfigToLocalStorage() {
        localStorage.setItem('github_owner', adminState.config.owner);
        localStorage.setItem('github_repo', adminState.config.repo);
        localStorage.setItem('github_branch', adminState.config.branch);
        localStorage.setItem('github_pat', adminState.config.pat);
        localStorage.setItem('local_only_mode', adminState.config.localMode);
    }

    // Render Admin Dashboard
    function renderDashboard(container) {
        const modeLabel = adminState.config.localMode ? "Local Mode" : `Syncing with GitHub (${adminState.config.owner}/${adminState.config.repo})`;
        const syncStatusClass = adminState.isSaving ? 'unsaved' : (adminState.isUnsaved ? 'unsaved' : 'synced');
        const syncStatusText = adminState.isSaving ? 'Committing...' : (adminState.isUnsaved ? 'Unsaved Changes' : 'Synced to Browser');

        container.innerHTML = `
            <div class="container">
                <div class="admin-header">
                    <div>
                        <h2>CMS Control Dashboard</h2>
                        <p style="font-size: 0.9rem; color: var(--text-muted);">${modeLabel}</p>
                    </div>
                    
                    <div class="sync-status">
                        <span class="status-indicator ${syncStatusClass}">${syncStatusText}</span>
                        ${!adminState.config.localMode ? `
                            <button id="git-push-btn" class="btn btn-success btn-small" ${adminState.isSaving ? 'disabled' : ''}>
                                ${adminState.isSaving ? '<span class="spinner"></span> Saving' : '☁️ Push to GitHub'}
                            </button>
                        ` : ''}
                        <button id="admin-logout-btn" class="btn btn-secondary btn-small">🔒 Logout / Settings</button>
                    </div>
                </div>

                <div class="admin-grid">
                    <aside class="admin-sidebar">
                        <button class="admin-nav-item ${adminState.currentTab === 'profile' ? 'active' : ''}" data-tab="profile">📝 Profile & Summary</button>
                        <button class="admin-nav-item ${adminState.currentTab === 'projects' ? 'active' : ''}" data-tab="projects">📁 Projects CRUD</button>
                        <button class="admin-nav-item ${adminState.currentTab === 'services' ? 'active' : ''}" data-tab="services">🚀 Active Services</button>
                        <button class="admin-nav-item ${adminState.currentTab === 'certs' ? 'active' : ''}" data-tab="certs">🏆 Certifications</button>
                        <button class="admin-nav-item ${adminState.currentTab === 'languages' ? 'active' : ''}" data-tab="languages">🗣️ Languages</button>
                        <button class="admin-nav-item ${adminState.currentTab === 'links' ? 'active' : ''}" data-tab="links">🔗 Social Links</button>
                        <button class="admin-nav-item ${adminState.currentTab === 'blog' ? 'active' : ''}" data-tab="blog">✍️ Blog Posts CRUD</button>
                    </aside>

                    <main class="admin-content" id="admin-content-pane">
                        <!-- Filled dynamically based on tab -->
                    </main>
                </div>
            </div>
        `;

        document.getElementById('admin-logout-btn').addEventListener('click', () => {
            if (confirm("Logout from current dashboard settings?")) {
                localStorage.removeItem('github_owner');
                localStorage.removeItem('github_repo');
                localStorage.removeItem('github_branch');
                localStorage.removeItem('github_pat');
                localStorage.removeItem('local_only_mode');
                adminState.config = { owner: '', repo: '', branch: 'main', pat: '', localMode: false };
                renderAdminShell();
            }
        });

        const gitPushBtn = document.getElementById('git-push-btn');
        if (gitPushBtn) {
            gitPushBtn.addEventListener('click', commitAllDataToGitHub);
        }

        document.querySelectorAll('.admin-nav-item').forEach(btn => {
            btn.addEventListener('click', () => {
                adminState.currentTab = btn.getAttribute('data-tab');
                adminState.editingItem = null;
                renderDashboard(container);
            });
        });

        renderTabContent();
    }

    // Render active tab forms/lists
    function renderTabContent() {
        const pane = document.getElementById('admin-content-pane');
        if (!pane) return;

        pane.innerHTML = '';
        
        switch (adminState.currentTab) {
            case 'profile':
                renderProfileSection(pane);
                break;
            case 'projects':
                renderCrudSection(pane, 'projects', 'Project', ['title', 'description', 'githubUrl', 'liveUrl']);
                break;
            case 'services':
                renderCrudSection(pane, 'services', 'Service', ['title', 'description', 'url']);
                break;
            case 'certs':
                renderCrudSection(pane, 'certs', 'Certification', ['title', 'description']);
                break;
            case 'languages':
                renderCrudSection(pane, 'languages', 'Language', ['name', 'level']);
                break;
            case 'links':
                renderCrudSection(pane, 'links', 'Social Link', ['platform', 'url']);
                break;
            case 'blog':
                renderCrudSection(pane, 'posts', 'Blog Post', ['title', 'summary', 'content', 'category', 'date'], true);
                break;
        }
    }

    function setUnsaved(dirty = true) {
        adminState.isUnsaved = dirty;
        const indicator = document.querySelector('.status-indicator');
        if (indicator) {
            if (dirty) {
                indicator.className = 'status-indicator unsaved';
                indicator.textContent = 'Unsaved Changes';
            } else {
                indicator.className = 'status-indicator synced';
                indicator.textContent = 'Synced to Browser';
            }
        }
    }

    // 1. Profile Editor
    function renderProfileSection(pane) {
        const data = window.appState.portfolioData;
        pane.innerHTML = `
            <div class="admin-section-header">
                <h3>Profile & Personal Resume Summary</h3>
            </div>
            
            <form id="profile-edit-form">
                <h4>1. Contact Coordinates</h4>
                <div class="form-group" style="margin-top:1rem;">
                    <label>Email Address</label>
                    <input type="email" class="form-control" id="profile-email" value="${data.profile.email || ''}" required>
                </div>
                <div class="form-group">
                    <label>Line Messaging ID</label>
                    <input type="text" class="form-control" id="profile-line" value="${data.profile.lineId || ''}">
                </div>
                <div class="form-group">
                    <label>Kakao Messenger ID</label>
                    <input type="text" class="form-control" id="profile-kakao" value="${data.profile.kakaoId || ''}">
                </div>

                <h4 style="margin-top:2rem;">2. Multilingual Translations</h4>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">Select a language tab to edit matching translated values.</p>
                
                ${renderLanguageTabs()}

                <div class="translation-content-pane">
                    <div class="form-group">
                        <label>Name (${adminState.editingLang.toUpperCase()})</label>
                        <input type="text" class="form-control" id="trans-name" value="${data.profile.name[adminState.editingLang] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Location (${adminState.editingLang.toUpperCase()})</label>
                        <input type="text" class="form-control" id="trans-location" value="${data.profile.location[adminState.editingLang] || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Resume Summary Paragraph 1 (${adminState.editingLang.toUpperCase()})</label>
                        <textarea class="form-control" id="trans-p1" required>${data.summary.p1[adminState.editingLang] || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Resume Summary Paragraph 2 (${adminState.editingLang.toUpperCase()})</label>
                        <textarea class="form-control" id="trans-p2">${(data.summary.p2 && data.summary.p2[adminState.editingLang]) || ''}</textarea>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary">💾 Save Profile & Summary</button>
            </form>
        `;

        wireLanguageTabs(() => {
            const email = document.getElementById('profile-email').value;
            const line = document.getElementById('profile-line').value;
            const kakao = document.getElementById('profile-kakao').value;
            
            data.profile.email = email;
            data.profile.lineId = line;
            data.profile.kakaoId = kakao;

            data.profile.name[adminState.editingLang] = document.getElementById('trans-name').value;
            data.profile.location[adminState.editingLang] = document.getElementById('trans-location').value;
            data.summary.p1[adminState.editingLang] = document.getElementById('trans-p1').value;
            if (!data.summary.p2) data.summary.p2 = {};
            data.summary.p2[adminState.editingLang] = document.getElementById('trans-p2').value;

            renderProfileSection(pane);
        });

        document.getElementById('profile-edit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            data.profile.email = document.getElementById('profile-email').value;
            data.profile.lineId = document.getElementById('profile-line').value;
            data.profile.kakaoId = document.getElementById('profile-kakao').value;

            data.profile.name[adminState.editingLang] = document.getElementById('trans-name').value;
            data.profile.location[adminState.editingLang] = document.getElementById('trans-location').value;
            data.summary.p1[adminState.editingLang] = document.getElementById('trans-p1').value;
            if (!data.summary.p2) data.summary.p2 = {};
            data.summary.p2[adminState.editingLang] = document.getElementById('trans-p2').value;

            localStorage.setItem('portfolio_data_override', JSON.stringify(data));
            setUnsaved(true);
            window.showToast("General settings saved locally!");
        });
    }

    // 2. CRUD Tables / Form Switcher
    function renderCrudSection(pane, dataKey, singularLabel, fields, isBlog = false) {
        const db = isBlog ? window.appState.blogData : window.appState.portfolioData;
        const list = db[dataKey] || [];

        if (adminState.editingItem) {
            renderCrudForm(pane, db, dataKey, singularLabel, fields, isBlog);
        } else {
            pane.innerHTML = `
                <div class="admin-section-header">
                    <h3>Manage ${singularLabel}s</h3>
                    <button id="add-new-item-btn" class="btn btn-primary btn-small">＋ Add ${singularLabel}</button>
                </div>
                
                <div class="admin-items-list">
                    ${list.length === 0 ? `<div style="text-align:center; padding: 2rem; color:var(--text-muted);">No ${singularLabel.toLowerCase()}s found. Click add to create one.</div>` : ''}
                    ${list.map(item => {
                        let sub = '';
                        let name = '';
                        if (isBlog) {
                            name = window.t(item.title);
                            sub = `${item.date} | ${item.category || 'General'}`;
                        } else {
                            name = item.title ? window.t(item.title) : (item.name ? window.t(item.name) : window.t(item.platform));
                            sub = item.githubUrl || item.url || (item.level ? window.t(item.level) : '');
                        }
                        
                        return `
                            <div class="admin-item-row">
                                <div class="admin-item-info">
                                    <h4>${name || 'Untitled'}</h4>
                                    <p>${sub}</p>
                                </div>
                                <div class="admin-item-actions">
                                    <button class="btn btn-secondary btn-small edit-row-btn" data-id="${item.id}">✏️ Edit</button>
                                    <button class="btn btn-danger btn-small delete-row-btn" data-id="${item.id}">🗑️ Delete</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            document.getElementById('add-new-item-btn').addEventListener('click', () => {
                const newItem = { id: dataKey.slice(0, 4) + '_' + Date.now() };
                fields.forEach(f => {
                    if (['title', 'description', 'summary', 'content', 'name', 'level', 'platform'].includes(f)) {
                        newItem[f] = { en: '', kor: '', jp: '', chn: '' };
                    } else if (f === 'date') {
                        newItem[f] = new Date().toISOString().split('T')[0];
                    } else {
                        newItem[f] = '';
                    }
                });

                adminState.editingItem = newItem;
                adminState.editingLang = 'en';
                renderCrudSection(pane, dataKey, singularLabel, fields, isBlog);
            });

            pane.querySelectorAll('.edit-row-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const item = list.find(x => x.id === id);
                    if (item) {
                        adminState.editingItem = JSON.parse(JSON.stringify(item));
                        adminState.editingLang = 'en';
                        renderCrudSection(pane, dataKey, singularLabel, fields, isBlog);
                    }
                });
            });

            pane.querySelectorAll('.delete-row-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    if (confirm(`Are you sure you want to delete this ${singularLabel.toLowerCase()}?`)) {
                        const idx = list.findIndex(x => x.id === id);
                        if (idx !== -1) {
                            list.splice(idx, 1);
                            const storageKey = isBlog ? 'blog_data_override' : 'portfolio_data_override';
                            localStorage.setItem(storageKey, JSON.stringify(db));
                            setUnsaved(true);
                            window.showToast(`${singularLabel} deleted successfully!`);
                            renderTabContent();
                        }
                    }
                });
            });
        }
    }

    function renderCrudForm(pane, db, dataKey, singularLabel, fields, isBlog) {
        const item = adminState.editingItem;
        const list = db[dataKey] || [];
        const isExisting = list.some(x => x.id === item.id);

        pane.innerHTML = `
            <div class="admin-section-header">
                <h3>${isExisting ? 'Edit' : 'Create'} ${singularLabel}</h3>
                <button id="cancel-edit-btn" class="btn btn-secondary btn-small">⬅ Back to List</button>
            </div>
            
            <form id="crud-edit-form">
                ${fields.filter(f => !['title', 'description', 'summary', 'content', 'name', 'level', 'platform'].includes(f))
                  .map(f => {
                      const label = f.charAt(0).toUpperCase() + f.slice(1).replace(/Url/, ' URL');
                      const type = f === 'date' ? 'date' : (f === 'email' ? 'email' : 'text');
                      return `
                          <div class="form-group">
                              <label>${label}</label>
                              <input type="${type}" class="form-control" id="field-${f}" value="${item[f] || ''}" ${f === 'date' || f === 'url' || f === 'githubUrl' ? '' : 'required'}>
                          </div>
                      `;
                  }).join('')}

                <h4 style="margin-top:2rem; margin-bottom:1rem;">Multilingual Content Fields</h4>
                ${renderLanguageTabs()}

                <div class="translation-content-pane">
                    ${fields.filter(f => ['title', 'description', 'summary', 'content', 'name', 'level', 'platform'].includes(f))
                      .map(f => {
                          const label = f.charAt(0).toUpperCase() + f.slice(1);
                          const val = (item[f] && item[f][adminState.editingLang]) || '';
                          
                          if (f === 'content' || f === 'description') {
                              const descText = f === 'content' ? 'Markdown-like syntax supported. Use ## for headers, * for bullet lists, and ```code``` blocks.' : '';
                              return `
                                  <div class="form-group">
                                      <label>${label} (${adminState.editingLang.toUpperCase()})</label>
                                      <textarea class="form-control" id="field-${f}" style="${f === 'content' ? 'min-height:220px;' : ''}">${val}</textarea>
                                      <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">${descText}</p>
                                  </div>
                              `;
                          } else {
                              return `
                                  <div class="form-group">
                                      <label>${label} (${adminState.editingLang.toUpperCase()})</label>
                                      <input type="text" class="form-control" id="field-${f}" value="${val}">
                                  </div>
                              `;
                          }
                      }).join('')}
                </div>

                <div style="display:flex; gap:1rem;">
                    <button type="submit" class="btn btn-primary">💾 Save ${singularLabel}</button>
                    <button type="button" id="form-cancel-btn" class="btn btn-secondary">Cancel</button>
                </div>
            </form>
        `;

        document.getElementById('cancel-edit-btn').addEventListener('click', cancelForm);
        document.getElementById('form-cancel-btn').addEventListener('click', cancelForm);

        function cancelForm() {
            adminState.editingItem = null;
            renderTabContent();
        }

        wireLanguageTabs(() => {
            saveFieldsToState();
            renderCrudForm(pane, db, dataKey, singularLabel, fields, isBlog);
        });

        function saveFieldsToState() {
            fields.forEach(f => {
                const el = document.getElementById(`field-${f}`);
                if (!el) return;

                if (['title', 'description', 'summary', 'content', 'name', 'level', 'platform'].includes(f)) {
                    if (!item[f]) item[f] = {};
                    item[f][adminState.editingLang] = el.value;
                } else {
                    item[f] = el.value.trim();
                }
            });
        }

        document.getElementById('crud-edit-form').addEventListener('submit', (e) => {
            e.preventDefault();
            saveFieldsToState();

            if (isExisting) {
                const idx = list.findIndex(x => x.id === item.id);
                list[idx] = item;
            } else {
                list.push(item);
            }
            db[dataKey] = list;

            const storageKey = isBlog ? 'blog_data_override' : 'portfolio_data_override';
            localStorage.setItem(storageKey, JSON.stringify(db));
            setUnsaved(true);
            window.showToast(`${singularLabel} saved successfully!`);
            
            adminState.editingItem = null;
            renderTabContent();
        });
    }

    function renderLanguageTabs() {
        return `
            <div class="translation-tabs">
                <button type="button" class="trans-tab-btn ${adminState.editingLang === 'en' ? 'active' : ''}" data-lang-tab="en">🇬🇧 English</button>
                <button type="button" class="trans-tab-btn ${adminState.editingLang === 'kor' ? 'active' : ''}" data-lang-tab="kor">🇰🇷 한국어</button>
                <button type="button" class="trans-tab-btn ${adminState.editingLang === 'jp' ? 'active' : ''}" data-lang-tab="jp">🇯🇵 日本語</button>
                <button type="button" class="trans-tab-btn ${adminState.editingLang === 'chn' ? 'active' : ''}" data-lang-tab="chn">🇨🇳 中文</button>
            </div>
        `;
    }

    function wireLanguageTabs(onSwitchCallback) {
        document.querySelectorAll('[data-lang-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                const newLang = btn.getAttribute('data-lang-tab');
                if (newLang !== adminState.editingLang) {
                    onSwitchCallback();
                    adminState.editingLang = newLang;
                }
            });
        });
    }

    // --- GitHub REST API Integrations ---

    // Detect git path for branch configuration
    function getGitPath(filename) {
        // Since we are running in docs/ directory context for branch A1
        const isDocsDir = window.location.pathname.includes('/docs/') || adminState.config.branch === 'A1';
        return isDocsDir ? 'docs/' + filename : filename;
    }

    async function commitAllDataToGitHub() {
        if (adminState.config.localMode) return;
        
        const owner = adminState.config.owner;
        const repo = adminState.config.repo;
        const branch = adminState.config.branch;
        const pat = adminState.config.pat;

        if (!owner || !repo || !pat) {
            window.showToast("Authentication configurations missing. Re-open login.", "error");
            return;
        }

        adminState.isSaving = true;
        renderDashboard(document.getElementById('admin-view'));

        try {
            const portfolioOverride = localStorage.getItem('portfolio_data_override');
            const blogOverride = localStorage.getItem('blog_data_override');

            if (portfolioOverride) {
                const path = getGitPath('data/portfolio.json');
                await pushFileToGit(owner, repo, branch, pat, path, portfolioOverride, "Update portfolio resume contents via CMS panel");
                localStorage.removeItem('portfolio_data_override');
            }

            if (blogOverride) {
                const path = getGitPath('data/blog.json');
                await pushFileToGit(owner, repo, branch, pat, path, blogOverride, "Update blog posts database via CMS panel");
                localStorage.removeItem('blog_data_override');
            }

            setUnsaved(false);
            window.showToast("Changes successfully committed to GitHub Pages!");
        } catch (err) {
            console.error(err);
            window.showToast("Commit failed: " + err.message, "error");
        } finally {
            adminState.isSaving = false;
            renderDashboard(document.getElementById('admin-view'));
        }
    }

    async function pushFileToGit(owner, repo, branch, pat, filepath, fileContent, commitMessage) {
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filepath}?ref=${branch}`;
        
        let sha = '';
        const getResp = await fetch(url, {
            headers: {
                'Authorization': `token ${pat}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (getResp.ok) {
            const fileMeta = await getResp.json();
            sha = fileMeta.sha;
        }

        const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filepath}`;
        const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));

        const putPayload = {
            message: commitMessage,
            content: encodedContent,
            branch: branch
        };

        if (sha) {
            putPayload.sha = sha;
        }

        const putResp = await fetch(putUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${pat}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(putPayload)
        });

        if (!putResp.ok) {
            const errData = await putResp.json();
            throw new Error(errData.message || `HTTP ${putResp.status}`);
        }
    }

})();
