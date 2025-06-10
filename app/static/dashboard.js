class StatusDashboard {
    constructor() {
        this.websocket = null;
        this.refreshInterval = 10; // seconds - 10초 고정
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
        this.manualRefreshBtn = document.getElementById('manual-refresh');
        this.connectionStatus = document.getElementById('connection-status');
        this.statusIndicator = document.getElementById('status-indicator');
        this.lastUpdated = document.getElementById('last-updated');
    }
    
    bindEvents() {
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
        
        // Scroll event for sticky header effects
        this.initScrollHandler();
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
                this.handleDisconnection();
                this.attemptReconnect();
            };
            
            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.updateConnectionStatus(false);
                this.handleDisconnection();
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
        
        // Update overall status summary
        this.updateStatusSummary(statusData.services);
        
        // Clear existing content
        this.dashboardContainer.innerHTML = '';
        
        // Render each service
        statusData.services.forEach(service => {
            const serviceCard = this.createServiceCard(service);
            this.dashboardContainer.appendChild(serviceCard);
        });
        
        this.updateLastUpdated(statusData.updated_at);
    }
    
    updateStatusSummary(services) {
        const operationalCount = services.filter(s => s.overall_status === 'operational').length;
        const issueCount = services.length - operationalCount;
        
        // Determine overall status
        let overallStatus = 'operational';
        let statusText = 'All Systems Operational';
        let statusDesc = '모든 AI 서비스가 정상적으로 작동하고 있습니다';
        
        if (issueCount > 0) {
            const hasOutage = services.some(s => s.overall_status === 'major_outage' || s.overall_status === 'partial_outage');
            if (hasOutage) {
                overallStatus = 'outage';
                statusText = 'Service Disruption';
                statusDesc = '일부 AI 서비스에 장애가 발생했습니다';
            } else {
                overallStatus = 'degraded';
                statusText = 'Performance Issues';
                statusDesc = '일부 AI 서비스의 성능이 저하되었습니다';
            }
        }
        
        // Update summary elements
        const overallStatusDot = document.getElementById('overall-status-dot');
        const overallStatusText = document.getElementById('overall-status-text');
        const overallStatusDesc = document.getElementById('overall-status-desc');
        const operationalCountEl = document.getElementById('operational-count');
        const issueCountEl = document.getElementById('issue-count');
        
        if (overallStatusDot) {
            overallStatusDot.className = `summary-dot status-${overallStatus}`;
        }
        
        if (overallStatusText) {
            overallStatusText.textContent = statusText;
        }
        
        if (overallStatusDesc) {
            overallStatusDesc.textContent = statusDesc;
        }
        
        if (operationalCountEl) {
            operationalCountEl.textContent = operationalCount;
        }
        
        if (issueCountEl) {
            issueCountEl.textContent = issueCount;
        }
    }
    
    createServiceCard(service) {
        const serviceCard = document.createElement('div');
        serviceCard.className = `service-card ${this.getStatusClass(service.overall_status)}`;
        
        const icon = this.getServiceIcon(service.service_name);
        const displayName = this.getServiceDisplayName(service.service_name);
        
        // Check if we should use image icon or emoji
        const useImageIcon = this.shouldUseImageIcon(service.service_name);
        const iconHtml = useImageIcon 
            ? `<img src="/static/images/${this.getServiceImageFile(service.service_name)}" alt="${displayName} 아이콘" style="width: 32px; height: 32px; object-fit: contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
               <span style="display:none; font-size: 24px;">${icon}</span>`
            : `<span style="font-size: 24px;">${icon}</span>`;
        
        serviceCard.innerHTML = `
            <div class="service-header">
                <div class="service-icon">
                    ${iconHtml}
                </div>
                <div class="service-info">
                    <h3>${displayName}</h3>
                    <div class="service-status-badge ${this.getStatusClass(service.overall_status)}">
                        <div class="status-indicator ${this.getStatusClass(service.overall_status)}"></div>
                        <span class="status-text">${this.formatStatus(service.overall_status)}</span>
                    </div>
                </div>
            </div>
            <div class="service-details">
                <div class="detail-item">
                    <span class="label">마지막 업데이트:</span>
                    <span class="value">${this.formatDateTime(service.updated_at)}</span>
                </div>
                <div class="detail-item">
                    <span class="label">구성요소:</span>
                    <span class="value">${service.components ? service.components.length : 0}개</span>
                </div>
                <div class="detail-item">
                    <a href="${service.page_url}" target="_blank" class="status-link">상태 페이지 ↗</a>
                </div>
            </div>
            ${this.createComponentsSection(service.components || [], service.service_name)}
        `;
        
        return serviceCard;
    }
    
    getServiceImageFile(serviceName) {
        const imageFiles = {
            'openai': 'gpt.svg',
            'anthropic': 'claude.png',
            'cursor': 'cursor.webp',
            'google_aistudio': 'google-ai-studio.svg'
        };
        return imageFiles[serviceName] || 'default-icon.png';
    }
    
    shouldUseImageIcon(serviceName) {
        // Use image files when available
        return true;
    }
    
    createComponentsSection(components, serviceName) {
        if (!components || components.length === 0) {
            return '<div class="components"><em>컴포넌트 정보가 없습니다</em></div>';
        }
        
        const componentItems = components.map(component => {
            const statusClass = this.getStatusClass(component.status);
            return `
                <div class="component-item">
                    <span class="component-name">${component.name}</span>
                    <div class="component-status">
                        <div class="status-indicator ${statusClass}"></div>
                        <span class="status-text">${this.formatStatus(component.status)}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        // Generate stable ID for this components section based on service name
        const sectionId = `components-${serviceName}`;
        
        // Check if there's a saved state for this service
        const savedState = this.getComponentSectionState(serviceName);
        // If savedState is 'true', then it's collapsed. If 'false', then it's expanded. Default to collapsed if no saved state.
        const isCollapsed = savedState === null ? true : savedState === 'true';
        
        const collapsedClass = isCollapsed ? 'collapsed' : '';
        const toggleIcon = isCollapsed ? '▶' : '▼';
        
        return `
            <div class="components">
                <div class="components-header" onclick="statusDashboard.toggleComponents('${sectionId}', '${serviceName}')">
                    <h4>서비스 구성요소 (${components.length}개)</h4>
                    <button class="toggle-button ${collapsedClass}" id="toggle-${sectionId}">${toggleIcon}</button>
                </div>
                <div class="component-list ${collapsedClass}" id="${sectionId}">
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
        // Handle undefined or null serviceName
        if (!serviceName) {
            return '🔧';
        }
        
        const icons = {
            'openai': '🤖',
            'anthropic': '🧠', 
            'cursor': '⚡',
            'google_aistudio': '🎨'
        };
        return icons[serviceName] || '🔧';
    }
    
    getServiceDisplayName(serviceName) {
        // Handle undefined or null serviceName
        if (!serviceName) {
            return '알 수 없는 서비스';
        }
        
        const displayNames = {
            'openai': 'ChatGPT (OpenAI)',
            'anthropic': 'Claude (Anthropic)',
            'cursor': 'Cursor',
            'google_aistudio': 'Google AI Studio'
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
        // Handle undefined or null status
        if (!status) {
            return '알 수 없음';
        }
        
        const statusLabels = {
            'operational': '정상',
            'degraded_performance': '성능 저하',
            'partial_outage': '부분 장애',
            'major_outage': '주요 장애',
            'under_maintenance': '점검 중',
            'unknown': '알 수 없음'
        };
        return statusLabels[status] || status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    formatDateTime(dateString) {
        if (!dateString) return '알 수 없음';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleString('ko-KR');
        } catch (error) {
            return dateString;
        }
    }
    
    updateConnectionStatus(connected) {
        if (connected) {
            this.connectionStatus.textContent = '연결됨';
            this.statusIndicator.className = 'status-dot connected';
        } else {
            this.connectionStatus.textContent = '연결 끊김';
            this.statusIndicator.className = 'status-dot disconnected';
        }
    }

    // 연결 끊어짐 처리
    handleDisconnection() {
        // 모든 서비스를 "확인 불가" 상태로 설정
        const serviceCards = this.dashboardContainer.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            // 상태 인디케이터를 주황색으로 변경
            const statusIndicator = card.querySelector('.status-indicator');
            if (statusIndicator) {
                statusIndicator.className = 'status-indicator status-unavailable';
            }
            
            // 상태 텍스트를 "확인 불가"로 변경
            const statusText = card.querySelector('.status-text');
            if (statusText) {
                statusText.textContent = '확인 불가';
            }
            
            // 서비스 카드 클래스도 업데이트
            card.className = card.className.replace(/status-\w+/g, '') + ' status-unavailable';
            
            // 마지막 업데이트 시간을 "연결 끊어짐"으로 표시
            const detailItems = card.querySelectorAll('.detail-item');
            detailItems.forEach(item => {
                const label = item.querySelector('.label');
                const value = item.querySelector('.value');
                if (label && value && label.textContent === '마지막 업데이트:') {
                    value.textContent = '연결 끊어짐';
                }
            });

            // 컴포넌트 상태도 업데이트
            const componentItems = card.querySelectorAll('.component-item');
            componentItems.forEach(componentItem => {
                const componentStatusIndicator = componentItem.querySelector('.status-indicator');
                const componentStatusText = componentItem.querySelector('.status-text');
                if (componentStatusIndicator) {
                    componentStatusIndicator.className = 'status-indicator status-unavailable';
                }
                if (componentStatusText) {
                    componentStatusText.textContent = '확인 불가';
                }
            });
        });
    }
    
    updateLastUpdated(timestamp = null) {
        const now = timestamp ? new Date(timestamp) : new Date();
        if (this.lastUpdated) {
            this.lastUpdated.textContent = `마지막 업데이트: ${now.toLocaleString('ko-KR')}`;
        }
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = `오류: ${message}`;
        
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
                <div class="loading-spinner"></div>
                <p>AI 서비스 상태를 확인하는 중...</p>
            </div>
        `;
    }
    
    manualRefresh() {
        this.isManualRefresh = true;
        this.manualRefreshBtn.disabled = true;
        this.manualRefreshBtn.textContent = '새로고침 중...';
        
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
            this.manualRefreshBtn.textContent = '수동 새로고침';
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
            this.showError(`상태 데이터 로드 실패: ${error.message}`);
        }
    }
    
    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Max reconnection attempts reached');
            this.showError('연결이 끊어졌습니다. 페이지를 새로고침하여 다시 연결해주세요.');
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

    toggleComponents(sectionId, serviceName) {
        const componentList = document.getElementById(sectionId);
        const toggleButton = document.getElementById(`toggle-${sectionId}`);
        
        if (!componentList || !toggleButton) return;
        
        const isCollapsed = componentList.classList.contains('collapsed');
        
        if (isCollapsed) {
            // Expand
            componentList.classList.remove('collapsed');
            toggleButton.classList.remove('collapsed');
            toggleButton.textContent = '▼';
            // Save expanded state
            this.setComponentSectionState(serviceName, false);
        } else {
            // Collapse
            componentList.classList.add('collapsed');
            toggleButton.classList.add('collapsed');
            toggleButton.textContent = '▶';
            // Save collapsed state
            this.setComponentSectionState(serviceName, true);
        }
    }

    getComponentSectionState(serviceName) {
        return localStorage.getItem(`component-section-collapsed-${serviceName}`);
    }

    setComponentSectionState(serviceName, isCollapsed) {
        localStorage.setItem(`component-section-collapsed-${serviceName}`, isCollapsed.toString());
    }
    
    initScrollHandler() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const statusSummary = document.querySelector('.status-summary');
                    if (statusSummary) {
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        
                        if (scrollTop > 50) {
                            statusSummary.classList.add('scrolled');
                        } else {
                            statusSummary.classList.remove('scrolled');
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
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