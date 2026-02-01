import { store } from '../store.js';

export function initSidebarLeft() {
    const container = document.getElementById('toolbox-content');
    if (!container) return;
    container.innerHTML = '';

    // Logo Area
    const logoArea = document.createElement('div');
    logoArea.style.padding = '20px 0';
    logoArea.style.display = 'flex';
    logoArea.style.justifyContent = 'center';
    logoArea.style.width = '100%';
    logoArea.innerHTML = `
        <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #4F46E5, #9333EA); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 700; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            F
        </div>
    `;
    container.appendChild(logoArea);

    const groups = [
        {
            title: 'CONTEÚDO',
            tools: [
                { type: 'title', label: 'Título', icon: 'H₁', bg: '#EFF6FF', color: '#3B82F6' },
                { type: 'text', label: 'Texto', icon: 'T', bg: '#F5F3FF', color: '#8B5CF6' },
                { type: 'image', label: 'Imagem', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>', bg: '#ECFDF5', color: '#10B981' },
                { type: 'divisor', label: 'Divisor', icon: '—', bg: '#F3F4FE', color: '#6366F1' },
                { type: 'espaco', label: 'Espaço', icon: '⎵', bg: '#FFF7ED', color: '#F59E0B' }
            ]
        },
        {
            title: 'CAMPOS',
            tools: [
                { type: 'input_name', label: 'Nome', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="9" x2="12" y2="9"/></svg>', bg: '#FDF2F8', color: '#EC4899' },
                { type: 'input_email', label: 'E-mail', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="9" x2="12" y2="9"/></svg>', bg: '#F0FDF4', color: '#22C55E' },
                { type: 'input_phone', label: 'Telefone', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="9" x2="12" y2="9"/></svg>', bg: '#FFF7ED', color: '#F97316' }
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
                store.addComponent(tool.type);
            });

            section.appendChild(item);
        });

        container.appendChild(section);
    });
}
