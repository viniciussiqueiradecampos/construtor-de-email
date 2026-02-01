import { store } from '../store.js';

export function initCanvas() {
    const container = document.getElementById('canvas-content');
    if (!container) return;

    store.subscribe((state) => {
        renderCanvas(container, state);
    });

    renderCanvas(container, store.getState());

    container.addEventListener('dragover', (e) => e.preventDefault());
    container.addEventListener('drop', (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('component-type');
        if (type) store.addComponent(type);
    });
}

function renderCanvas(container, state) {
    const { components, selectedId, theme, template, viewMode } = state;
    if (!container) return;
    container.innerHTML = '';

    const paper = document.createElement('div');
    paper.className = `canvas-paper theme-${theme} template-${template} ${viewMode === 'mobile' ? 'mobile-view' : ''}`;

    // Ready-made Template Styles
    const templates = {
        moderno: { primary: '#6366F1', secondary: '#A855F7', contrast: '#FFFFFF' },
        minimalista: { primary: '#000000', secondary: '#374151', contrast: '#FFFFFF' },
        vibrante: { primary: '#F97316', secondary: '#EF4444', contrast: '#FFFFFF' },
        elegante: { primary: '#1E3A8A', secondary: '#1E40AF', contrast: '#FFFFFF' },
        tech: { primary: '#0EA5E9', secondary: '#2563EB', contrast: '#FFFFFF' }
    };

    const currentTpl = templates[template] || templates.moderno;
    const isDark = theme === 'dark';

    // Theme container styling
    if (isDark) {
        paper.style.backgroundColor = '#0F172A';
        paper.style.color = '#F8FAFB';
    } else {
        paper.style.backgroundColor = '#FFFFFF';
        paper.style.color = '#1E293B';
    }

    components.forEach(comp => {
        if (comp.visible === false) return;

        const item = document.createElement('div');
        item.className = `canvas-item ${selectedId === comp.id ? 'selected' : ''}`;
        item.onclick = (e) => {
            e.stopPropagation();
            store.setSelected(comp.id);
        };

        const actions = document.createElement('div');
        actions.className = 'canvas-actions';

        // Duplicate Button
        const dupBtn = document.createElement('button');
        dupBtn.className = 'btn-action-del';
        dupBtn.style.color = '#4F46E5';
        dupBtn.style.borderColor = '#E0E7FF';
        dupBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        dupBtn.onclick = (e) => {
            e.stopPropagation();
            store.duplicateComponent(comp.id);
        };

        const delBtn = document.createElement('button');
        delBtn.className = 'btn-action-del';
        delBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        delBtn.onclick = (e) => {
            e.stopPropagation();
            store.removeComponent(comp.id);
        };

        actions.appendChild(dupBtn);
        actions.appendChild(delBtn);
        item.appendChild(actions);

        const content = renderComponentContent(comp, state, currentTpl);
        item.appendChild(content);
        paper.appendChild(item);
    });

    container.appendChild(paper);
}

function renderComponentContent(component, state, tpl) {
    const { theme, privacyPolicy } = state;
    const wrapper = document.createElement('div');
    const isDark = theme === 'dark';

    switch (component.type) {
        case 'title':
            const h1 = document.createElement('h1');
            h1.className = 'h1-brand';
            h1.textContent = component.props.text;
            // Template primary color for titles if it's not the minimalist one
            const defaultTitleColor = state.template === 'minimalista'
                ? (isDark ? '#FFFFFF' : '#000000')
                : (isDark ? '#FFFFFF' : tpl.primary);
            h1.style.color = component.props.color || defaultTitleColor;
            wrapper.appendChild(h1);
            break;

        case 'text':
            const p = document.createElement('p');
            p.className = 'text-muted';
            p.textContent = component.props.text;
            p.style.color = component.props.color || (isDark ? '#94A3B8' : '#64748B');
            wrapper.appendChild(p);
            break;

        case 'input_name':
        case 'input_email':
        case 'input_phone':
            const group = document.createElement('div');
            group.className = 'input-group';
            const label = document.createElement('label');
            label.className = 'input-label';
            label.textContent = component.props.label;
            if (isDark) label.style.color = '#E2E8F0';

            const input = document.createElement('input');
            input.className = 'input-field';
            input.type = 'text';
            input.placeholder = component.props.placeholder || '';
            input.readOnly = true;
            if (isDark) {
                input.style.backgroundColor = '#1E293B';
                input.style.borderColor = '#334155';
                input.style.color = '#FFFFFF';
            }
            group.appendChild(label);
            group.appendChild(input);
            wrapper.appendChild(group);
            break;

        case 'privacy':
            const { privacySettings } = state;
            const privGroup = document.createElement('div');
            privGroup.style.display = 'flex';
            privGroup.style.alignItems = 'center';
            privGroup.style.gap = '14px';
            privGroup.style.margin = '14px 0';

            let linkAction = '';
            if (privacySettings.source === 'url') {
                linkAction = `window.open('${privacySettings.url}', '_blank')`;
            } else if (privacySettings.source === 'page') {
                linkAction = `alert('Abrindo página interna: ${privacySettings.pageId}')`;
            } else {
                linkAction = `alert('POLÍTICA DE PRIVACIDADE:\\n\\n${privacySettings.text.replace(/'/g, "\\'")}')`;
            }

            privGroup.innerHTML = `
                <input type="checkbox" ${privacySettings.defaultChecked ? 'checked' : ''} disabled style="width:20px; height:20px; accent-color: ${tpl.primary};">
                <div style="font-size: 14px; font-weight: 500; color: ${isDark ? '#CBD5E1' : '#475569'}; line-height:1.4;">
                    ${component.props.text} 
                    <a href="#" class="privacy-link" onclick="${linkAction}; return false;" style="color: ${tpl.primary}; text-decoration:none; font-weight:700; border-bottom:1.5px solid ${tpl.primary}; padding-bottom:1px; margin-left:4px;">(Ler política)</a>
                </div>
            `;
            wrapper.appendChild(privGroup);
            break;

        case 'captcha':
            const captcha = document.createElement('div');
            captcha.style.background = isDark ? '#1E293B' : '#F8FAFC';
            captcha.style.border = `1.5px solid ${isDark ? '#334155' : '#E2E8F0'}`;
            captcha.style.borderRadius = '16px';
            captcha.style.padding = '16px 20px';
            captcha.style.display = 'flex';
            captcha.style.alignItems = 'center';
            captcha.style.justifyContent = 'space-between';
            captcha.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            captcha.innerHTML = `
                <div style="display:flex; align-items:center; gap:14px;">
                    <div style="width:28px; height:28px; border: 2px solid #CBD5E1; border-radius: 4px; background:white;"></div>
                    <span style="font-size:15px; color:${isDark ? '#E2E8F0' : '#334155'}; font-weight:600;">Não sou um robô</span>
                </div>
                <div style="text-align:center; opacity: 0.8;">
                    <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" width="32" style="margin:0 auto; filter: grayscale(1);">
                    <div style="font-size:9px; color:#94A3B8; margin-top:4px; font-weight:700;">reCAPTCHA</div>
                </div>
            `;
            wrapper.appendChild(captcha);
            break;

        case 'button':
            const btn = document.createElement('button');
            btn.className = 'btn-submit';
            btn.textContent = component.props.text || 'Enviar';

            // Apply Ready-made Template Colors
            if (state.template === 'minimalista') {
                btn.style.backgroundColor = isDark ? '#FFFFFF' : '#000000';
                btn.style.color = isDark ? '#000000' : '#FFFFFF';
            } else {
                btn.style.background = component.props.bg || tpl.primary;
                btn.style.color = '#FFFFFF';
                btn.style.boxShadow = `0 10px 15px -3px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(79, 70, 229, 0.2)'}`;
            }

            wrapper.appendChild(btn);
            break;

        case 'image':
            const img = document.createElement('img');
            img.src = component.props.src;
            img.alt = '';
            img.style.maxWidth = '100%';
            img.style.display = 'block';
            img.style.margin = '0 auto';
            img.style.borderRadius = '20px';
            img.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
            wrapper.appendChild(img);
            break;

        case 'divisor':
            const hr = document.createElement('hr');
            hr.style.border = 'none';
            hr.style.borderTop = `2px solid ${isDark ? '#334155' : '#F1F5F9'}`;
            hr.style.margin = '32px 0';
            wrapper.appendChild(hr);
            break;

        case 'espaco':
            const spacer = document.createElement('div');
            spacer.style.height = component.props.size || '32px';
            wrapper.appendChild(spacer);
            break;

        default:
            wrapper.textContent = ``;
    }

    return wrapper;
}
