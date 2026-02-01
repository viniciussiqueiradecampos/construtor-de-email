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

    // Deselect when clicking empty area
    container.onclick = (e) => {
        // If the event propagated here, it means it wasn't a component click (they call stopPropagation)
        store.setSelected(null);
    };
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
    const styleGuide = state.styleGuide || {};

    // Theme container styling
    if (isDark) {
        paper.style.backgroundColor = '#0F172A';
        paper.style.color = '#F8FAFB';
    } else {
        paper.style.backgroundColor = '#FFFFFF';
        paper.style.color = '#1E293B';
    }

    // Apply Style Guide Settings
    if (styleGuide.typography?.fontFamily) {
        paper.style.fontFamily = `'${styleGuide.typography.fontFamily}', sans-serif`;
    }

    if (styleGuide.spacing?.globalMargin) {
        paper.style.padding = `40px ${styleGuide.spacing.globalMargin}`;
    }

    // Apply grid columns if set
    if (styleGuide.spacing?.columns && styleGuide.spacing.columns > 1) {
        paper.style.display = 'grid';
        paper.style.gridTemplateColumns = `repeat(${styleGuide.spacing.columns}, 1fr)`;
        paper.style.gap = styleGuide.spacing?.blockGap || '24px';
        paper.style.alignItems = 'start';
    } else {
        paper.style.display = 'block';
    }

    // Separate fixed components from draggable ones
    const dynamicComponents = components.filter(c => c.type !== 'privacy' && c.type !== 'button');
    const privacyComponent = components.find(c => c.type === 'privacy');
    const buttonComponent = components.find(c => c.type === 'button');

    // We'll render dynamic components first, then privacy (if any), then button (if any)
    const sortedToRender = [...dynamicComponents];
    if (privacyComponent) sortedToRender.push(privacyComponent);
    if (buttonComponent) sortedToRender.push(buttonComponent);

    sortedToRender.forEach((comp, index) => {
        if (comp.visible === false) return;

        const isFixed = comp.type === 'privacy' || comp.type === 'button';
        const item = document.createElement('div');
        item.className = `canvas-item ${selectedId === comp.id ? 'selected' : ''}`;

        // Drag and Drop Logic for non-fixed components
        if (!isFixed) {
            item.draggable = true;
            item.dataset.index = index;

            item.ondragstart = (e) => {
                e.dataTransfer.setData('source-index', index);
                item.classList.add('dragging');
            };

            item.ondragend = () => {
                item.classList.remove('dragging');
                // Remove preview indicator if any
            };

            item.ondragover = (e) => {
                e.preventDefault();
                item.classList.add('drag-over');
            };

            item.ondragleave = () => {
                item.classList.remove('drag-over');
            };

            item.ondrop = (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');
                const sourceIndex = parseInt(e.dataTransfer.getData('source-index'));
                const targetIndex = index;

                if (sourceIndex !== targetIndex) {
                    // Find actual component indices in the original state components list
                    const sourceCompId = sortedToRender[sourceIndex].id;
                    const targetCompId = sortedToRender[targetIndex].id;

                    const actualSourceIdx = components.findIndex(c => c.id === sourceCompId);
                    const actualTargetIdx = components.findIndex(c => c.id === targetCompId);

                    store.reorderComponents(actualSourceIdx, actualTargetIdx);
                }
            };
        }

        // Apply style guide spacing
        if (styleGuide.spacing?.blockGap) {
            item.style.marginBottom = styleGuide.spacing.blockGap;
        }

        item.onclick = (e) => {
            e.stopPropagation();
            store.setSelected(comp.id);
        };

        // Only show actions for non-fixed components
        if (!isFixed) {
            const actions = document.createElement('div');
            actions.className = 'canvas-actions';

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
        }

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

            // Priority: Component > Style Guide > Template
            let titleColor = component.props.color;
            if (!titleColor) {
                const sgPrimary = state.styleGuide?.colors?.primary;
                if (sgPrimary) {
                    titleColor = sgPrimary;
                } else {
                    titleColor = state.template === 'minimalista'
                        ? (isDark ? '#FFFFFF' : '#000000')
                        : (isDark ? '#FFFFFF' : tpl.primary);
                }
            }
            h1.style.color = titleColor;
            h1.style.background = 'transparent';
            h1.style.cursor = 'text';
            h1.style.transition = 'all 0.2s';

            // Typography
            if (state.styleGuide?.typography?.h1?.size) h1.style.fontSize = state.styleGuide.typography.h1.size;
            if (state.styleGuide?.typography?.h1?.weight) h1.style.fontWeight = state.styleGuide.typography.h1.weight;

            // Inline Editing
            h1.onclick = (e) => {
                e.stopPropagation();
                if (h1.contentEditable === 'true') return;
                const originalText = h1.textContent;
                h1.contentEditable = 'true';
                h1.style.outline = '2px solid var(--color-brand)';
                h1.style.outlineOffset = '4px';
                h1.style.borderRadius = '8px';
                h1.focus();
                const range = document.createRange();
                range.selectNodeContents(h1);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);

                const save = () => {
                    h1.contentEditable = 'false';
                    h1.style.outline = 'none';
                    if (h1.textContent !== originalText) store.updateComponent(component.id, { text: h1.textContent });
                };
                h1.onblur = save;
                h1.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); h1.blur(); } };
            };
            wrapper.appendChild(h1);
            break;

        case 'text':
            const p = document.createElement('p');
            p.className = 'text-muted';
            p.textContent = component.props.text;
            // High contrast for body text
            p.style.color = component.props.color || (isDark ? '#94A3B8' : '#64748B');
            p.style.background = 'transparent';
            p.style.cursor = 'text';

            if (state.styleGuide?.typography?.body?.size) p.style.fontSize = state.styleGuide.typography.body.size;
            if (state.styleGuide?.typography?.body?.weight) p.style.fontWeight = state.styleGuide.typography.body.weight;

            p.onclick = (e) => {
                e.stopPropagation();
                if (p.contentEditable === 'true') return;
                const originalText = p.textContent;
                p.contentEditable = 'true';
                p.style.outline = '2px solid var(--color-brand)';
                p.style.outlineOffset = '4px';
                p.style.borderRadius = '8px';
                p.focus();
                const range = document.createRange();
                range.selectNodeContents(p);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);

                const save = () => {
                    p.contentEditable = 'false';
                    p.style.outline = 'none';
                    if (p.textContent !== originalText) store.updateComponent(component.id, { text: p.textContent });
                };
                p.onblur = save;
                p.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); p.blur(); } };
            };
            wrapper.appendChild(p);
            break;

        case 'input_name':
        case 'input_email':
        case 'input_phone':
        case 'custom_text':
            const group = document.createElement('div');
            group.className = 'input-group';
            const label = document.createElement('label');
            label.className = 'input-label';
            label.textContent = component.props.label || 'Campo';
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
            if (state.styleGuide?.interactive?.style) {
                const r = { soft: '12px', round: '20px', square: '0px' };
                input.style.borderRadius = r[state.styleGuide.interactive.style] || '12px';
            }
            if (state.styleGuide?.interactive?.shadow && state.styleGuide.interactive.shadow !== 'none') {
                const s = { soft: '0 2px 4px rgba(0,0,0,0.05)', medium: '0 4px 6px rgba(0,0,0,0.1)', hard: '0 10px 15px rgba(0,0,0,0.1)' };
                input.style.boxShadow = s[state.styleGuide.interactive.shadow];
            }
            group.appendChild(label);
            group.appendChild(input);
            wrapper.appendChild(group);
            break;

        case 'custom_select':
            const selGroup = document.createElement('div');
            selGroup.className = 'input-group';
            const selLabel = document.createElement('label');
            selLabel.className = 'input-label';
            selLabel.textContent = component.props.label || 'Seleção';
            if (isDark) selLabel.style.color = '#E2E8F0';

            const select = document.createElement('div');
            select.className = 'input-field';
            select.style.display = 'flex';
            select.style.justifyContent = 'space-between';
            select.style.alignItems = 'center';
            if (isDark) {
                select.style.backgroundColor = '#1E293B';
                select.style.borderColor = '#334155';
                select.style.color = '#FFFFFF';
            }
            select.innerHTML = `<span>${component.props.placeholder?.split(',')[0] || 'Selecione...'}</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
            selGroup.appendChild(selLabel);
            selGroup.appendChild(select);
            wrapper.appendChild(selGroup);
            break;

        case 'custom_checkbox':
        case 'custom_radio':
            const optGroup = document.createElement('div');
            optGroup.className = 'input-group';
            const optLabel = document.createElement('label');
            optLabel.className = 'input-label';
            optLabel.textContent = component.props.label || 'Opções';
            if (isDark) optLabel.style.color = '#E2E8F0';
            optGroup.appendChild(optLabel);

            (component.props.placeholder || 'Opção 1, Opção 2').split(',').forEach(opt => {
                const row = document.createElement('div');
                row.style.display = 'flex'; row.style.alignItems = 'center'; row.style.gap = '10px'; row.style.marginTop = '8px';
                const circle = document.createElement('div');
                circle.style.width = '16px'; circle.style.height = '16px';
                circle.style.border = `1.5px solid ${isDark ? '#475569' : '#CBD5E1'}`;
                circle.style.borderRadius = component.type === 'custom_radio' ? '50%' : '4px';
                const txt = document.createElement('span');
                txt.textContent = opt.trim();
                txt.style.fontSize = '14px'; txt.style.color = isDark ? '#CBD5E1' : '#475569';
                row.appendChild(circle); row.appendChild(txt);
                optGroup.appendChild(row);
            });
            wrapper.appendChild(optGroup);
            break;

        case 'privacy':
            const { privacySettings } = state;
            const pGroup = document.createElement('div');
            pGroup.style.display = 'flex';
            pGroup.style.alignItems = 'center';
            pGroup.style.gap = '14px';
            pGroup.style.margin = '14px 0';

            // Determine link action
            let linkAction = '';
            const mockText = `POLÍTICA DE PRIVACIDADE (MOCK DATA)\n\nEste é um exemplo de como sua política apareceria para o usuário.\n\nDados que coletamos:\n- Informações de contato ([EMAIL_CONTATO])\n- Nome da Empresa ([EMPRESA])\n- Data de Registro ([DATA])\n\nNosso compromisso na [EMPRESA] é manter a transparência e segurança de todos os seus dados.`.replace(/'/g, "\\'");

            if (privacySettings.source === 'url') {
                linkAction = `window.open('${privacySettings.url}', '_blank')`;
            } else if (privacySettings.source === 'page') {
                // For builder simulation, we just alert
                linkAction = `alert('Na página publicada, isso redirecionará para a página interna: ${privacySettings.pageId}')`;
            } else {
                linkAction = `if(window.showCustomAlert) window.showCustomAlert('Política de Privacidade', '${mockText}')`;
            }

            pGroup.innerHTML = `
                <input type="checkbox" ${privacySettings.defaultChecked ? 'checked' : ''} style="width:20px; height:20px; accent-color: ${tpl.primary}; cursor:pointer; flex-shrink:0;">
                <div style="font-size: 14px; font-weight: 500; color: ${isDark ? '#CBD5E1' : '#475569'}; line-height:1.4; cursor:default;">
                    ${component.props.text} 
                    <a href="#" class="privacy-link" style="color: ${tpl.primary}; text-decoration:none; font-weight:700; border-bottom:1.5px solid ${tpl.primary}; padding-bottom:1px; margin-left:4px; cursor:pointer;">(Ler política)</a>
                </div>
            `;

            // Restore Checkbox Toggle (Visual Only for Builder)
            const cb = pGroup.querySelector('input');
            if (cb) {
                cb.onclick = (e) => {
                    e.stopPropagation(); // Prevent component selection when clicking checkbox
                };
            }

            // Restore Link Click
            const link = pGroup.querySelector('.privacy-link');
            if (link) {
                link.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Execute defined action
                    try { eval(linkAction); } catch (err) { console.error(err); }
                };
            }

            wrapper.appendChild(pGroup);
            break;

        case 'captcha':
            const cap = document.createElement('div');
            cap.style.background = isDark ? '#1E293B' : '#F8FAFC';
            cap.style.border = `1px solid ${isDark ? '#334155' : '#E2E8F0'}`;
            cap.style.borderRadius = '8px';
            cap.style.padding = '12px 16px';
            cap.style.display = 'flex'; cap.style.justifyContent = 'space-between'; cap.style.alignItems = 'center';
            cap.innerHTML = `<div style="display:flex; gap:12px; align-items:center;"><div style="width:24px; height:24px; border:2px solid #CBD5E1; border-radius:4px; background:white;"></div><span style="font-size:14px; font-weight:500; color:${isDark ? '#E2E8F0' : '#334155'};">Não sou robô</span></div><img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" width="24" style="filter:grayscale(1); opacity:0.6;">`;
            wrapper.appendChild(cap);
            break;

        case 'button':
            const btn = document.createElement('button');
            btn.className = 'btn-submit';
            btn.textContent = component.props.text || 'Enviar';

            // Priority: Component > Style Guide > Template
            let btnBg = component.props.bg;
            if (!btnBg) {
                const sgPrimary = state.styleGuide?.colors?.primary;
                if (sgPrimary) {
                    btnBg = sgPrimary;
                } else {
                    btnBg = state.template === 'minimalista'
                        ? (isDark ? '#FFFFFF' : '#000000')
                        : tpl.primary;
                }
            }

            btn.style.background = btnBg;
            btn.style.color = '#FFFFFF';

            // Minimalist exception: if no custom color, stick to B&W text contrast
            if (state.template === 'minimalista' && !state.styleGuide?.colors?.primary && !component.props.bg) {
                btn.style.color = isDark ? '#000000' : '#FFFFFF';
            }

            btn.style.boxShadow = `0 10px 15px -3px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(79, 70, 229, 0.2)'}`;

            wrapper.appendChild(btn);
            break;

        case 'image':
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'image-canvas-wrapper';

            const img = document.createElement('img');
            img.src = component.props.src;
            img.alt = component.props.alt || '';
            img.style.maxWidth = '100%';
            img.style.display = 'block';
            img.style.margin = '0 auto';
            img.style.borderRadius = '20px';
            img.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)';

            // Height logic
            const h = component.props.height || 'auto';
            img.style.height = (h === 'auto') ? 'auto' : (h.toString().includes('px') ? h : `${h}px`);
            img.style.objectFit = 'contain';

            // Hover Overlay
            const overlay = document.createElement('div');
            overlay.className = 'image-hover-overlay';
            overlay.innerHTML = `
                <button class="btn-image-action" onclick="event.stopPropagation(); if(window.triggerImageUpload) window.triggerImageUpload('${component.id}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                    Trocar
                </button>
                <button class="btn-image-action delete" onclick="event.stopPropagation(); store.removeComponent('${component.id}')">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    Excluir
                </button>
            `;

            imgWrapper.appendChild(img);
            imgWrapper.appendChild(overlay);
            wrapper.appendChild(imgWrapper);
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
