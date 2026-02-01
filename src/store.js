// Basic Pub/Sub Observer Pattern
class Store {
    constructor() {
        this.state = {
            components: [
                {
                    id: '1',
                    type: 'title',
                    visible: true,
                    props: { text: 'DESCUBRA COMO VIVER UMA MATERNIDADE LEVE, FELIZ E SEM CULPA EM APENAS 90 DIAS' }
                },
                {
                    id: '2',
                    type: 'text',
                    visible: true,
                    props: { text: 'O método completo e científico que ensina você a cuidar do seu bebê com confiança, equilibrar vida pessoal e familiar, recuperar sua energia e redescobrir quem você é além de mãe.' }
                },
                {
                    id: '3',
                    type: 'input_name',
                    visible: true,
                    props: { label: 'Nome completo', placeholder: 'Digite seu nome...' }
                },
                {
                    id: '4',
                    type: 'input_email',
                    visible: true,
                    props: { label: 'E-mail', placeholder: 'Digite seu e-mail...' }
                },
                {
                    id: 'privacy-fixed',
                    type: 'privacy',
                    visible: true,
                    props: { text: 'Eu aceito os termos de privacidade' }
                },
                {
                    id: '5',
                    type: 'button',
                    visible: true,
                    props: { text: 'ENVIAR', bg: '' }
                }
            ],
            selectedId: null,
            template: 'moderno', // 'moderno', 'minimalista', 'vibrante', 'elegante', 'tech'
            theme: 'light', // 'light', 'dark'
            viewMode: 'desktop', // 'desktop', 'mobile'
            brandName: 'clickmax.io',
            styleGuide: {
                colors: {
                    primary: '#4F46E5',
                    secondary: '#8B5CF6',
                    neutralBg: '#F8FAFC',
                    neutralText: '#1E293B',
                    success: '#10B981',
                    error: '#EF4444'
                },
                typography: {
                    fontFamily: 'Plus Jakarta Sans',
                    h1: { size: '32px', weight: '800', spacing: '-0.02em' },
                    h2: { size: '24px', weight: '700', spacing: '-0.01em' },
                    h3: { size: '20px', weight: '600', spacing: '0' },
                    body: { size: '15px', weight: '500', spacing: '0' },
                    legend: { size: '12px', weight: '500', spacing: '0' }
                },
                interactive: {
                    borderRadius: '12px',
                    style: 'soft', // 'round', 'square', 'soft'
                    shadow: 'medium' // 'none', 'soft', 'medium', 'hard'
                },
                spacing: {
                    globalMargin: '40px',
                    blockGap: '24px'
                }
            },
            activeTab: 'builder', // 'builder', 'styleguide'
            privacySettings: {
                source: 'text', // 'text', 'url', 'page'
                text: 'Nossa política de privacidade garante a proteção dos seus dados...',
                url: '',
                pageId: '',
                defaultChecked: true
            }
        };
        this.past = [];
        this.future = [];
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    getState() {
        return this.state;
    }

    saveHistory() {
        // Simple deep clone for history
        this.past.push(JSON.parse(JSON.stringify(this.state)));
        if (this.past.length > 50) this.past.shift();
        this.future = [];
    }

    undo() {
        if (this.past.length > 0) {
            this.future.push(JSON.parse(JSON.stringify(this.state)));
            this.state = this.past.pop();
            this.notify();
        }
    }

    redo() {
        if (this.future.length > 0) {
            this.past.push(JSON.parse(JSON.stringify(this.state)));
            this.state = this.future.pop();
            this.notify();
        }
    }

    // --- Actions ---

    addComponent(type, customProps = null) {
        this.saveHistory();
        const id = Date.now().toString();
        const newComponent = {
            id,
            type,
            visible: true,
            props: customProps || this.getDefaultProps(type)
        };
        this.state.components.push(newComponent);
        this.state.selectedId = id;
        this.notify();
    }

    duplicateComponent(id) {
        this.saveHistory();
        const index = this.state.components.findIndex(c => c.id === id);
        if (index !== -1) {
            const original = this.state.components[index];
            const duplicate = JSON.parse(JSON.stringify(original));
            duplicate.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
            this.state.components.splice(index + 1, 0, duplicate);
            this.state.selectedId = duplicate.id;
            this.notify();
        }
    }

    setSelected(id) {
        this.state.selectedId = id;
        this.notify();
    }

    updateComponent(id, newProps) {
        this.saveHistory();
        const component = this.state.components.find(c => c.id === id);
        if (component) {
            component.props = { ...component.props, ...newProps };
            this.notify();
        }
    }

    toggleVisibility(id) {
        this.saveHistory();
        const component = this.state.components.find(c => c.id === id);
        if (component) {
            component.visible = !component.visible;
            this.notify();
        }
    }

    reorderComponents(startIndex, endIndex) {
        this.saveHistory();
        const result = Array.from(this.state.components);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        this.state.components = result;
        this.notify();
    }

    removeComponent(id) {
        this.saveHistory();
        this.state.components = this.state.components.filter(c => c.id !== id);
        if (this.state.selectedId === id) {
            this.state.selectedId = null;
        }
        this.notify();
    }

    setTemplate(templateId) {
        this.saveHistory();
        this.state.template = templateId;

        // Reset component-specific colors to null so template defaults take over
        this.state.components.forEach(comp => {
            if (comp.props.color !== undefined) comp.props.color = '';
            if (comp.props.bg !== undefined) comp.props.bg = '';
        });

        this.notify();
    }

    setTheme(theme) {
        this.saveHistory();
        this.state.theme = theme;
        this.notify();
    }

    setViewMode(mode) {
        this.state.viewMode = mode;
        this.notify();
    }

    setBrandName(name) {
        this.saveHistory();
        this.state.brandName = name;
        this.notify();
    }

    updatePrivacySettings(newSettings) {
        this.saveHistory();
        this.state.privacySettings = { ...this.state.privacySettings, ...newSettings };
        this.notify();
    }

    updateStyleGuide(newGuide) {
        this.saveHistory();
        this.state.styleGuide = {
            ...this.state.styleGuide,
            ...newGuide,
            colors: { ...this.state.styleGuide.colors, ...(newGuide.colors || {}) },
            typography: { ...this.state.styleGuide.typography, ...(newGuide.typography || {}) },
            interactive: { ...this.state.styleGuide.interactive, ...(newGuide.interactive || {}) },
            spacing: { ...this.state.styleGuide.spacing, ...(newGuide.spacing || {}) }
        };
        this.notify();
    }

    setActiveTab(tab) {
        this.state.activeTab = tab;
        this.notify();
    }

    getDefaultProps(type) {
        switch (type) {
            case 'privacy': return { text: 'Eu aceito os termos de privacidade' };
            case 'captcha': return { label: 'Verificação de robô' };
            case 'title': return { text: 'Novo Título', color: '' };
            case 'text': return { text: 'Novo parágrafo de texto.', color: '' };
            case 'image': return { src: 'https://via.placeholder.com/600x400', alt: 'Imagem', height: 'auto' };
            case 'input_name': return { label: 'Nome Completo', placeholder: 'Ex: João Silva' };
            case 'input_email': return { label: 'E-mail', placeholder: 'exemplo@email.com' };
            case 'input_phone': return { label: 'Telefone', placeholder: '(00) 00000-0000' };
            case 'divisor': return { color: '#E5E7EB', thickness: '1px' };
            case 'espaco': return { size: '24px' };
            case 'button': return { text: 'ENVIAR', bg: '#8B1E4F' };
            case 'custom_text': return { label: 'Campo de Texto', placeholder: 'Digite aqui...', name: 'campo_texto' };
            case 'custom_select': return { label: 'Seleção', placeholder: 'Opção 1, Opção 2', name: 'campo_select' };
            case 'custom_checkbox': return { label: 'Checklist', placeholder: 'Opção 1, Opção 2', name: 'campo_checkbox' };
            case 'custom_radio': return { label: 'Opções', placeholder: 'Opção 1, Opção 2', name: 'campo_radio' };
            case 'custom_list': return { label: 'Lista', placeholder: 'Opção 1, Opção 2', name: 'campo_lista' };
            default: return {};
        }
    }
}

export const store = new Store();
