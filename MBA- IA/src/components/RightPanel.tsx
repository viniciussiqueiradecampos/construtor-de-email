import { Settings, Zap, X, ChevronDown, ChevronRight, Type, Palette, Layout, MousePointer } from 'lucide-react';
import { useState } from 'react';
import { FormConfig, FieldConfig } from './PageBuilder';
import { TemplateSelector, getTemplateConfig } from './TemplateSelector';
import { FieldManager } from './FieldManager';

interface RightPanelProps {
  formConfig: FormConfig;
  setFormConfig: (config: FormConfig) => void;
}

export function RightPanel({ formConfig, setFormConfig }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<'config' | 'animation'>('config');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    title: false,
    subtitle: false,
    fields: false,
    button: false,
    style: false,
    footer: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateConfig = (path: string, value: any) => {
    const keys = path.split('.');
    const newConfig = { ...formConfig };
    let current: any = newConfig;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setFormConfig(newConfig);
  };

  const handleTemplateChange = (template: 'modern' | 'minimal' | 'bold' | 'elegant' | 'tech') => {
    const templateConfig = getTemplateConfig(template);
    setFormConfig({
      ...formConfig,
      template,
      title: { ...formConfig.title, ...templateConfig.title },
      button: { ...formConfig.button, ...templateConfig.button },
      style: { ...formConfig.style, ...templateConfig.style },
    });
  };

  const handleFieldReorder = (newFields: FieldConfig[]) => {
    setFormConfig({ ...formConfig, fields: newFields });
  };

  const handleToggleFieldVisibility = (id: string) => {
    const newFields = formConfig.fields.map(field =>
      field.id === id ? { ...field, enabled: !field.enabled } : field
    );
    setFormConfig({ ...formConfig, fields: newFields });
  };

  const handleRemoveField = (id: string) => {
    const newFields = formConfig.fields.filter(field => field.id !== id);
    setFormConfig({ ...formConfig, fields: newFields });
  };

  const handleAddField = (type: FieldConfig['type']) => {
    const fieldDefaults: Record<string, any> = {
      name: { label: 'Nome completo', text: '', policyText: '' },
      email: { label: 'E-mail', text: '', policyText: '' },
      phone: { label: 'Telefone', text: '', policyText: '' },
      privacy: { 
        label: 'Aceitar privacidade', 
        text: 'Aceitar notícias de privacidade',
        policyText: 'POLÍTICA DE PRIVACIDADE\n\nÚltima atualização: Janeiro 2026\n\n1. QUAIS INFORMAÇÕES COLETAMOS?\nQuando você preenche nosso formulário, a gente guarda seu nome, e-mail e telefone.\n\n2. O QUE FAZEMOS COM SUAS INFORMAÇÕES?\nUsamos suas informações para:\n- Enviar mensagens sobre nossos produtos\n- Melhorar nosso trabalho\n- Deixar tudo do jeito que você gosta\n\n3. COMPARTILHAMOS SEUS DADOS?\nNão! A gente não vende nem compartilha suas informações com outras empresas.\n\n4. SEUS DADOS ESTÃO SEGUROS?\nSim! A gente protege suas informações para que ninguém tenha acesso sem permissão.\n\n5. QUAIS SÃO SEUS DIREITOS?\nVocê pode:\n- Ver suas informações quando quiser\n- Pedir para corrigir algo que está errado\n- Pedir para apagar tudo\n- Cancelar quando quiser\n\n6. USAMOS COOKIES?\nSim, cookies são pequenos arquivos que ajudam nosso site a funcionar melhor para você.\n\n7. TEM DÚVIDAS?\nSe tiver alguma pergunta, pode mandar um e-mail para: contato@exemplo.com\n\nA gente está aqui para ajudar!',
      },
      robot: { label: 'Verificação de robô', text: 'Não sou um robô', policyText: '' },
      heading: { label: 'Título', content: 'Novo Título', fontSize: 32, textAlign: 'center', color: '#111827', fontWeight: 'bold' },
      text: { label: 'Texto', content: 'Digite seu texto aqui...', fontSize: 16, textAlign: 'left', color: '#374151', fontWeight: 'normal' },
      divider: { label: 'Divisor', height: 1, borderColor: '#e5e7eb' },
      spacer: { label: 'Espaçamento', spacing: 24 },
      image: { label: 'Imagem', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800', imageWidth: 100, textAlign: 'center' },
    };

    const newField: FieldConfig = {
      id: `${type}-${Date.now()}`,
      type,
      enabled: true,
      order: formConfig.fields.length,
      ...fieldDefaults[type],
    };

    setFormConfig({ ...formConfig, fields: [...formConfig.fields, newField] });
  };

  const updateFieldConfig = (id: string, path: string, value: any) => {
    const newFields = formConfig.fields.map(field => {
      if (field.id === id) {
        const keys = path.split('.');
        const updatedField = { ...field };
        let current: any = updatedField;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] = { ...current[keys[i]] };
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        return updatedField;
      }
      return field;
    });
    setFormConfig({ ...formConfig, fields: newFields });
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Configurações</h2>
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-3">
          {/* Template Selector */}
          <TemplateSelector 
            currentTemplate={formConfig.template}
            onSelectTemplate={handleTemplateChange}
          />

          <div className="h-px bg-gray-200 my-4" />

          {/* Field Manager */}
          <FieldManager
            fields={formConfig.fields}
            onReorder={handleFieldReorder}
            onToggleVisibility={handleToggleFieldVisibility}
            onRemove={handleRemoveField}
            onAdd={handleAddField}
          />

          <div className="h-px bg-gray-200 my-4" />

          {/* Campos */}
          <Section
            title="Configurações Gerais"
            icon={Layout}
            expanded={expandedSections.fields}
            onToggle={() => toggleSection('fields')}
          >
            <div className="space-y-4">
              {/* Phone Country Flag */}
              {formConfig.fields.some(f => f.type === 'phone' && f.enabled) && (
                <SwitchField
                  label="Mostrar bandeira do país"
                  value={formConfig.countryFlag.enabled}
                  onChange={(v) => updateConfig('countryFlag.enabled', v)}
                />
              )}

              {/* Redirect */}
              <div className="pt-2">
                <InputField
                  label="URL de redirecionamento"
                  value={formConfig.redirectUrl}
                  onChange={(v) => updateConfig('redirectUrl', v)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </Section>

          <div className="h-px bg-gray-200 my-4" />

          {/* Campos Individuais */}
          {formConfig.fields.filter(f => f.enabled).map((field) => (
            <Section
              key={field.id}
              title={field.label}
              icon={Layout}
              expanded={expandedSections[field.id] || false}
              onToggle={() => toggleSection(field.id)}
            >
              <div className="space-y-3">
                <InputField
                  label="Label"
                  value={field.label}
                  onChange={(v) => updateFieldConfig(field.id, 'label', v)}
                  placeholder="Ex: Nome completo"
                />
                
                {/* Text/Heading Content */}
                {(field.type === 'text' || field.type === 'heading') && (
                  <>
                    <TextareaField
                      label="Conteúdo"
                      value={field.content || ''}
                      onChange={(v) => updateFieldConfig(field.id, 'content', v)}
                      rows={3}
                    />
                    <SliderField
                      label="Tamanho da fonte"
                      value={field.fontSize || 16}
                      onChange={(v) => updateFieldConfig(field.id, 'fontSize', v)}
                      min={12}
                      max={72}
                    />
                    <ColorField
                      label="Cor do texto"
                      value={field.color || '#000000'}
                      onChange={(v) => updateFieldConfig(field.id, 'color', v)}
                    />
                    <SelectField
                      label="Alinhamento"
                      value={field.textAlign || 'left'}
                      onChange={(v) => updateFieldConfig(field.id, 'textAlign', v)}
                      options={[
                        { value: 'left', label: 'Esquerda' },
                        { value: 'center', label: 'Centro' },
                        { value: 'right', label: 'Direita' },
                      ]}
                    />
                    <SelectField
                      label="Peso da fonte"
                      value={field.fontWeight || 'normal'}
                      onChange={(v) => updateFieldConfig(field.id, 'fontWeight', v)}
                      options={[
                        { value: 'normal', label: 'Normal' },
                        { value: 'bold', label: 'Negrito' },
                      ]}
                    />
                  </>
                )}

                {/* Divider */}
                {field.type === 'divider' && (
                  <>
                    <SliderField
                      label="Espessura"
                      value={field.height || 1}
                      onChange={(v) => updateFieldConfig(field.id, 'height', v)}
                      min={1}
                      max={10}
                    />
                    <ColorField
                      label="Cor"
                      value={field.borderColor || '#e5e7eb'}
                      onChange={(v) => updateFieldConfig(field.id, 'borderColor', v)}
                    />
                  </>
                )}

                {/* Spacer */}
                {field.type === 'spacer' && (
                  <SliderField
                    label="Espaçamento (px)"
                    value={field.spacing || 24}
                    onChange={(v) => updateFieldConfig(field.id, 'spacing', v)}
                    min={8}
                    max={120}
                  />
                )}

                {/* Image */}
                {field.type === 'image' && (
                  <>
                    <InputField
                      label="URL da imagem"
                      value={field.imageUrl || ''}
                      onChange={(v) => updateFieldConfig(field.id, 'imageUrl', v)}
                      placeholder="https://..."
                    />
                    <SliderField
                      label="Largura (%)"
                      value={field.imageWidth || 100}
                      onChange={(v) => updateFieldConfig(field.id, 'imageWidth', v)}
                      min={10}
                      max={100}
                    />
                    <SelectField
                      label="Alinhamento"
                      value={field.textAlign || 'center'}
                      onChange={(v) => updateFieldConfig(field.id, 'textAlign', v)}
                      options={[
                        { value: 'left', label: 'Esquerda' },
                        { value: 'center', label: 'Centro' },
                        { value: 'right', label: 'Direita' },
                      ]}
                    />
                  </>
                )}

                {/* Privacy/Robot */}
                {(field.type === 'privacy' || field.type === 'robot') && (
                  <InputField
                    label="Texto"
                    value={field.text || ''}
                    onChange={(v) => updateFieldConfig(field.id, 'text', v)}
                  />
                )}
                {field.type === 'privacy' && (
                  <TextareaField
                    label="Política de Privacidade (completa)"
                    value={field.policyText || ''}
                    onChange={(v) => updateFieldConfig(field.id, 'policyText', v)}
                    rows={8}
                  />
                )}
              </div>
            </Section>
          ))}

          <div className="h-px bg-gray-200 my-4" />

          {/* Título */}
          <Section
            title="Título"
            icon={Type}
            expanded={expandedSections.title}
            onToggle={() => toggleSection('title')}
          >
            <SwitchField
              label="Habilitar título"
              value={formConfig.title.enabled}
              onChange={(v) => updateConfig('title.enabled', v)}
            />
            {formConfig.title.enabled && (
              <div className="space-y-3 pt-2">
                <TextareaField
                  label="Texto"
                  value={formConfig.title.text}
                  onChange={(v) => updateConfig('title.text', v)}
                  rows={3}
                />
                <SliderField
                  label="Tamanho"
                  value={formConfig.title.fontSize}
                  onChange={(v) => updateConfig('title.fontSize', v)}
                  min={20}
                  max={80}
                  unit="px"
                />
                <ColorField
                  label="Cor"
                  value={formConfig.title.color}
                  onChange={(v) => updateConfig('title.color', v)}
                />
              </div>
            )}
          </Section>

          {/* Subtítulo */}
          <Section
            title="Subtítulo"
            icon={Type}
            expanded={expandedSections.subtitle}
            onToggle={() => toggleSection('subtitle')}
          >
            <SwitchField
              label="Habilitar subtítulo"
              value={formConfig.subtitle.enabled}
              onChange={(v) => updateConfig('subtitle.enabled', v)}
            />
            {formConfig.subtitle.enabled && (
              <div className="space-y-3 pt-2">
                <TextareaField
                  label="Texto"
                  value={formConfig.subtitle.text}
                  onChange={(v) => updateConfig('subtitle.text', v)}
                  rows={3}
                />
                <SliderField
                  label="Tamanho"
                  value={formConfig.subtitle.fontSize}
                  onChange={(v) => updateConfig('subtitle.fontSize', v)}
                  min={12}
                  max={32}
                  unit="px"
                />
                <ColorField
                  label="Cor"
                  value={formConfig.subtitle.color}
                  onChange={(v) => updateConfig('subtitle.color', v)}
                />
              </div>
            )}
          </Section>

          {/* Botão */}
          <Section
            title="Botão"
            icon={MousePointer}
            expanded={expandedSections.button}
            onToggle={() => toggleSection('button')}
          >
            <div className="space-y-3">
              <InputField
                label="Texto do botão"
                value={formConfig.button.text}
                onChange={(v) => updateConfig('button.text', v)}
                placeholder="Ex: Enviar"
              />
              <SwitchField
                label="Usar gradiente"
                value={formConfig.button.useGradient}
                onChange={(v) => updateConfig('button.useGradient', v)}
              />
              {formConfig.button.useGradient ? (
                <div className="grid grid-cols-2 gap-2">
                  <ColorField
                    label="Cor inicial"
                    value={formConfig.button.gradientFrom}
                    onChange={(v) => updateConfig('button.gradientFrom', v)}
                  />
                  <ColorField
                    label="Cor final"
                    value={formConfig.button.gradientTo}
                    onChange={(v) => updateConfig('button.gradientTo', v)}
                  />
                </div>
              ) : (
                <ColorField
                  label="Cor de fundo"
                  value={formConfig.button.backgroundColor}
                  onChange={(v) => updateConfig('button.backgroundColor', v)}
                />
              )}
              <ColorField
                label="Cor do texto"
                value={formConfig.button.textColor}
                onChange={(v) => updateConfig('button.textColor', v)}
              />
            </div>
          </Section>

          {/* Estilos */}
          <Section
            title="Estilos"
            icon={Palette}
            expanded={expandedSections.style}
            onToggle={() => toggleSection('style')}
          >
            <div className="space-y-3">
              <ColorField
                label="Cor da borda"
                value={formConfig.style.inputBorderColor}
                onChange={(v) => updateConfig('style.inputBorderColor', v)}
              />
              <SliderField
                label="Espessura da borda"
                value={formConfig.style.inputBorderWidth}
                onChange={(v) => updateConfig('style.inputBorderWidth', v)}
                min={0}
                max={8}
                unit="px"
              />
              <SliderField
                label="Arredondamento"
                value={formConfig.style.inputBorderRadius}
                onChange={(v) => updateConfig('style.inputBorderRadius', v)}
                min={0}
                max={32}
                unit="px"
              />
              <SliderField
                label="Espaçamento interno"
                value={formConfig.style.inputPadding}
                onChange={(v) => updateConfig('style.inputPadding', v)}
                min={8}
                max={32}
                unit="px"
              />
            </div>
          </Section>

          {/* Footer */}
          <Section
            title="Rodapé"
            icon={Layout}
            expanded={expandedSections.footer}
            onToggle={() => toggleSection('footer')}
          >
            <SwitchField
              label="Habilitar rodapé"
              value={formConfig.footer.enabled}
              onChange={(v) => updateConfig('footer.enabled', v)}
            />
            {formConfig.footer.enabled && (
              <div className="pt-2">
                <TextareaField
                  label="Texto"
                  value={formConfig.footer.text}
                  onChange={(v) => updateConfig('footer.text', v)}
                  rows={2}
                />
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares modernos
function Section({ 
  title, 
  icon: Icon,
  expanded, 
  onToggle, 
  children 
}: { 
  title: string;
  icon?: any;
  expanded: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white hover:border-gray-300 transition-all">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-all group"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-400" />}
          <span className="font-medium text-sm text-gray-900">{title}</span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

function SwitchField({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: boolean; 
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-all ${
          value ? 'bg-[#4a7c9e]' : 'bg-gray-200'
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${
            value ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}

function FieldGroup({
  label,
  enabled,
  onToggle,
  children
}: {
  label: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`p-3 rounded-lg border transition-all ${
      enabled 
        ? 'bg-blue-50/50 border-blue-200' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <SwitchField label={label} value={enabled} onChange={onToggle} />
      {enabled && (
        <div className="mt-3 space-y-2 pl-0.5">
          {children}
        </div>
      )}
    </div>
  );
}

function InputField({ 
  label, 
  value, 
  onChange,
  placeholder = ''
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white text-gray-900 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4a7c9e] focus:ring-2 focus:ring-[#4a7c9e]/20 outline-none transition-all"
      />
    </div>
  );
}

function TextareaField({ 
  label, 
  value, 
  onChange,
  rows = 3
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-white text-gray-900 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4a7c9e] focus:ring-2 focus:ring-[#4a7c9e]/20 outline-none resize-none transition-all"
      />
    </div>
  );
}

function SliderField({ 
  label, 
  value, 
  onChange,
  min,
  max,
  unit = ''
}: { 
  label: string; 
  value: number; 
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-gray-600">{label}</label>
        <span className="text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer slider-modern"
        style={{
          background: `linear-gradient(to right, #4a7c9e 0%, #4a7c9e ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
        }}
      />
    </div>
  );
}

function ColorField({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="flex gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-white text-gray-900 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4a7c9e] focus:ring-2 focus:ring-[#4a7c9e]/20 outline-none font-mono transition-all"
        />
      </div>
    </div>
  );
}

function SelectField({ 
  label, 
  value, 
  onChange,
  options
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  options: { value: string, label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white text-gray-900 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4a7c9e] focus:ring-2 focus:ring-[#4a7c9e]/20 outline-none transition-all"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}