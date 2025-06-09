class StatusDashboard {
    constructor() {
        this.websocket = null;
        this.refreshInterval = 30; // seconds
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000; // milliseconds
        this.isManualRefresh = false;
        
        this.initializeElements();
        this.bindEvents();
        this.connect();
        this.loadInitialData();
    }
    
    initializeElements() {
        this.dashboardContainer = document.getElementById('dashboard');
        this.refreshSelect = document.getElementById('refresh-interval');
        this.manualRefreshBtn = document.getElementById('manual-refresh');
        this.connectionStatus = document.getElementById('connection-status');
        this.statusIndicator = document.getElementById('status-indicator');
        this.lastUpdated = document.getElementById('last-updated');
    }
    
    bindEvents() {
        // Refresh interval change
        this.refreshSelect.addEventListener('change', (e) => {
            this.refreshInterval = parseInt(e.target.value);
            this.sendMessage({
                type: 'configure',
                refresh_interval: this.refreshInterval
            });
        });
        
        // Manual refresh button
        this.manualRefreshBtn.addEventListener('click', () => {
            this.manualRefresh();
        });
        
        // Page visibility change - pause/resume on tab switch
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseUpdates();
            } else {
                this.resumeUpdates();
            }
        });
        
        // Window focus/blur events
        window.addEventListener('focus', () => this.resumeUpdates());
        window.addEventListener('blur', () => this.pauseUpdates());
    }
    
    connect() {
        try {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/ws/status?refresh_interval=${this.refreshInterval}`;
            
            this.websocket = new WebSocket(wsUrl);
            
            this.websocket.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
                this.updateConnectionStatus(true);
                
                // Send initial configuration
                this.sendMessage({
                    type: 'configure',
                    refresh_interval: this.refreshInterval
                });
            };
            
            this.websocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
            
            this.websocket.onclose = (event) => {
                console.log('WebSocket disconnected:', event.code, event.reason);
                this.updateConnectionStatus(false);
                this.attemptReconnect();
            };
            
            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.updateConnectionStatus(false);
            };
            
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            this.updateConnectionStatus(false);
            this.attemptReconnect();
        }
    }
    
    sendMessage(message) {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify(message));
        }
    }
    
    handleMessage(data) {
        switch (data.type) {
            case 'status_update':
                this.updateDashboard(data.data);
                this.updateLastUpdated();
                break;
            case 'error':
                this.showError(data.message);
                break;
            case 'pong':
                // Handle ping/pong if needed
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    }
    
    updateDashboard(statusData) {
        if (!statusData || !statusData.services) {
            console.error('Invalid status data received');
            return;
        }
        
        // Clear existing content
        this.dashboardContainer.innerHTML = '';
        
        // Render each service
        statusData.services.forEach(service => {
            const serviceCard = this.createServiceCard(service);
            this.dashboardContainer.appendChild(serviceCard);
        });
        
        this.updateLastUpdated(statusData.updated_at);
    }
    
    createServiceCard(service) {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.id = `service-${service.service_name}`;
        
        const iconClass = this.getServiceIconClass(service.service_name);
        const statusClass = this.getStatusClass(service.overall_status);
        const badgeClass = this.getBadgeClass(service.overall_status);
        
        card.innerHTML = `
            <div class="service-header">
                <div class="service-icon ${iconClass}">
                    ${this.getServiceIcon(service.service_name)}
                </div>
                <div class="service-title">
                    <h2>${this.getServiceDisplayName(service.service_name)}</h2>
                    <a href="${service.page_url}" target="_blank" class="service-url">
                        ${service.page_url}
                    </a>
                </div>
            </div>
            
            <div class="overall-status ${statusClass}">
                <div class="status-badge ${badgeClass}"></div>
                <span>${this.formatStatus(service.overall_status)}</span>
            </div>
            
            <div class="status-description">
                ${service.description || 'No additional information available.'}
            </div>
            
            ${this.createComponentsSection(service.components)}
            
            <div class="last-updated">
                Last updated: ${this.formatDateTime(service.updated_at)}
            </div>
        `;
        
        return card;
    }
    
    createComponentsSection(components) {
        if (!components || components.length === 0) {
            return '<div class="components"><em>No component information available</em></div>';
        }
        
        const componentItems = components.map(component => {
            const badgeClass = this.getBadgeClass(component.status);
            return `
                <div class="component-item">
                    <span class="component-name">${component.name}</span>
                    <div class="component-status">
                        <div class="status-badge ${badgeClass}"></div>
                        <span>${this.formatStatus(component.status)}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        // Generate unique ID for this components section
        const sectionId = 'components-' + Math.random().toString(36).substr(2, 9);
        
        return `
            <div class="components">
                <div class="components-header" onclick="statusDashboard.toggleComponents('${sectionId}')">
                    <h4>Service Components (${components.length})</h4>
                    <button class="toggle-button collapsed" id="toggle-${sectionId}">▶</button>
                </div>
                <div class="component-list collapsed" id="${sectionId}">
                    ${componentItems}
                </div>
            </div>
        `;
    }
    
    getServiceIconClass(serviceName) {
        const iconClasses = {
            'openai': 'openai-icon',
            'anthropic': 'anthropic-icon',
            'cursor': 'cursor-icon'
        };
        return iconClasses[serviceName] || 'default-icon';
    }
    
    getServiceIcon(serviceName) {
        const icons = {
            'openai': '🤖',
            'anthropic': '🧠',
            'cursor': '⚡'
        };
        return icons[serviceName] || '🔧';
    }
    
    getServiceDisplayName(serviceName) {
        const displayNames = {
            'openai': 'ChatGPT (OpenAI)',
            'anthropic': 'Claude (Anthropic)',
            'cursor': 'Cursor'
        };
        return displayNames[serviceName] || serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
    }
    
    getStatusClass(status) {
        const statusClasses = {
            'operational': 'status-operational',
            'degraded_performance': 'status-degraded',
            'partial_outage': 'status-outage',
            'major_outage': 'status-outage',
            'under_maintenance': 'status-degraded',
            'unknown': 'status-unknown'
        };
        return statusClasses[status] || 'status-unknown';
    }
    
    getBadgeClass(status) {
        const badgeClasses = {
            'operational': 'badge-operational',
            'degraded_performance': 'badge-degraded',
            'partial_outage': 'badge-outage',
            'major_outage': 'badge-outage',
            'under_maintenance': 'badge-degraded',
            'unknown': 'badge-unknown'
        };
        return badgeClasses[status] || 'badge-unknown';
    }
    
    formatStatus(status) {
        const statusLabels = {
            'operational': 'Operational',
            'degraded_performance': 'Degraded Performance',
            'partial_outage': 'Partial Outage',
            'major_outage': 'Major Outage',
            'under_maintenance': 'Under Maintenance',
            'unknown': 'Unknown'
        };
        return statusLabels[status] || status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    formatDateTime(dateString) {
        if (!dateString) return 'Unknown';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleString();
        } catch (error) {
            return dateString;
        }
    }
    
    updateConnectionStatus(connected) {
        if (connected) {
            this.connectionStatus.textContent = 'Connected';
            this.statusIndicator.className = 'status-indicator';
        } else {
            this.connectionStatus.textContent = 'Disconnected';
            this.statusIndicator.className = 'status-indicator disconnected';
        }
    }
    
    updateLastUpdated(timestamp = null) {
        const now = timestamp ? new Date(timestamp) : new Date();
        if (this.lastUpdated) {
            this.lastUpdated.textContent = `Last updated: ${now.toLocaleString()}`;
        }
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = `Error: ${message}`;
        
        // Insert at the top of the dashboard
        this.dashboardContainer.insertBefore(errorDiv, this.dashboardContainer.firstChild);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    showLoading() {
        this.dashboardContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                Loading status information...
            </div>
        `;
    }
    
    manualRefresh() {
        this.isManualRefresh = true;
        this.manualRefreshBtn.disabled = true;
        this.manualRefreshBtn.textContent = 'Refreshing...';
        
        // Send refresh request via WebSocket if connected
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.sendMessage({ type: 'refresh' });
        } else {
            // Fallback to HTTP request if WebSocket is not available
            this.loadInitialData();
        }
        
        // Re-enable button after 2 seconds
        setTimeout(() => {
            this.manualRefreshBtn.disabled = false;
            this.manualRefreshBtn.textContent = 'Refresh Now';
            this.isManualRefresh = false;
        }, 2000);
    }
    
    async loadInitialData() {
        try {
            this.showLoading();
            
            const response = await fetch(`/api/status?refresh_interval=${this.refreshInterval}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.updateDashboard(data);
            
        } catch (error) {
            console.error('Failed to load initial data:', error);
            this.showError(`Failed to load status data: ${error.message}`);
        }
    }
    
    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Max reconnection attempts reached');
            this.showError('Connection lost. Please refresh the page to reconnect.');
            return;
        }
        
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff
        
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        
        setTimeout(() => {
            if (this.websocket.readyState === WebSocket.CLOSED) {
                this.connect();
            }
        }, delay);
    }
    
    pauseUpdates() {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.sendMessage({ type: 'pause' });
        }
    }
    
    resumeUpdates() {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.sendMessage({ type: 'resume' });
        }
    }
    
    disconnect() {
        if (this.websocket) {
            this.websocket.close(1000, 'User disconnected');
        }
    }

    toggleComponents(sectionId) {
        const componentList = document.getElementById(sectionId);
        const toggleButton = document.getElementById(`toggle-${sectionId}`);
        
        if (!componentList || !toggleButton) return;
        
        const isCollapsed = componentList.classList.contains('collapsed');
        
        if (isCollapsed) {
            // Expand
            componentList.classList.remove('collapsed');
            toggleButton.classList.remove('collapsed');
            toggleButton.textContent = '▼';
        } else {
            // Collapse
            componentList.classList.add('collapsed');
            toggleButton.classList.add('collapsed');
            toggleButton.textContent = '▶';
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.statusDashboard = new StatusDashboard();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.statusDashboard) {
        window.statusDashboard.disconnect();
    }
}); 