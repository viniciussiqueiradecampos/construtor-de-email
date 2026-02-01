import { store } from '../store.js';

export function initSidebarLeft() {
    const container = document.getElementById('toolbox-content');
    if (!container) return;
    container.innerHTML = '';

    const logoContainer = document.createElement('div');
    logoContainer.id = 'sidebar-logo-container';
    logoContainer.style.width = '100%';
    logoContainer.style.display = 'flex';
    logoContainer.style.justifyContent = 'center';
    logoContainer.style.padding = '24px 0';
    container.appendChild(logoContainer);

    const renderLogo = (state) => {
        if (state.brandLogo) {
            logoContainer.innerHTML = `<img onclick="window.triggerBrandLogoUpload()" src="${state.brandLogo}" style="width: 52px; height: 52px; border-radius: 14px; object-fit: cover; box-shadow: 0 8px 16px -4px rgba(79, 70, 229, 0.3); border: 1.5px solid rgba(255, 255, 255, 0.1); cursor:pointer;">`;
        } else {
            logoContainer.innerHTML = `
                <div onclick="window.triggerBrandLogoUpload()" style="width: 52px; height: 52px; background: #4F46E5; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-size: 22px; font-weight: 900; box-shadow: 0 8px 16px -4px rgba(79, 70, 229, 0.3); border: 1.5px solid rgba(255, 255, 255, 0.1); cursor:pointer;">
                    CX
                </div>
            `;
        }
    };

    renderLogo(store.getState());
    store.subscribe((state) => renderLogo(state));

    const groups = [
        {
            title: 'TEXTOS E FOTOS',
            tools: [
                { type: 'title', label: 'Título Grande', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>', bg: '#EFF6FF', color: '#3B82F6' },
                { type: 'text', label: 'Frase ou Texto', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>', bg: '#F5F3FF', color: '#8B5CF6' },
                { type: 'image', label: 'Foto', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>', bg: '#ECFDF5', color: '#10B981' },
                { type: 'divisor', label: 'Linha', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="12" x2="16" y2="12"></line><polyline points="12 16 16 12 12 8"></polyline><polyline points="12 8 8 12 12 16"></polyline></svg>', bg: '#F3F4FE', color: '#6366F1' },
                { type: 'espaco', label: 'Vão Livre', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3zM21 9H3M21 15H3"/></svg>', bg: '#FFF7ED', color: '#F59E0B' }
            ]
        },
        {
            title: 'PERGUNTAS',
            tools: [
                { type: 'input_name', label: 'Pedir Nome', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>', bg: '#FDF2F8', color: '#EC4899' },
                { type: 'input_email', label: 'Pedir E-mail', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>', bg: '#F0FDF4', color: '#22C55E' },
                { type: 'input_phone', label: 'Telefone', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>', bg: '#FFF7ED', color: '#F97316' }
            ]
        },
        {
            title: 'OUTROS',
            tools: [
                { type: 'custom_trigger', label: 'Criar Novo', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>', bg: '#FFFFFF', color: '#94A3B8', isCustom: true }
            ]
        }
    ];

    groups.forEach((group, index) => {
        if (index > 0) {
            const hr = document.createElement('div');
            hr.style.width = '40px';
            hr.style.height = '1px';
            hr.style.background = '#E5E7EB';
            hr.style.margin = '20px auto';
            container.appendChild(hr);
        }

        const section = document.createElement('div');
        section.className = 'toolbox-section';

        const title = document.createElement('div');
        title.className = 'section-title';
        title.style.fontSize = '10px';
        title.style.color = '#94A3B8';
        title.style.letterSpacing = '1px';
        title.style.marginBottom = '20px';
        title.style.textAlign = 'center';
        title.style.width = '100%';
        title.textContent = group.title;
        section.appendChild(title);

        group.tools.forEach(tool => {
            const item = document.createElement('div');
            item.className = 'toolbox-item';
            item.draggable = true;
            item.innerHTML = `
                <div class="icon-box" style="background-color: ${tool.bg}; color: ${tool.color};">
                    ${tool.icon}
                </div>
                <div class="toolbox-label">${tool.label}</div>
            `;

            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('component-type', tool.type);
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });

            item.addEventListener('click', () => {
                if (tool.isCustom) {
                    if (window.openCustomFieldModal) window.openCustomFieldModal();
                } else if (tool.type === 'image') {
                    if (window.triggerImageUpload) window.triggerImageUpload();
                } else {
                    store.addComponent(tool.type);
                }
            });

            section.appendChild(item);
        });

        container.appendChild(section);
    });
}
