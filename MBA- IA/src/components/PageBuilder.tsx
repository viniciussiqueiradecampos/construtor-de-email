import { useState } from 'react';
import { TopBar } from './TopBar';
import { LeftPanel } from './LeftPanel';
import { Canvas } from './Canvas';
import { RightPanel } from './RightPanel';

export interface FieldConfig {
  id: string;
  type: 'name' | 'email' | 'phone' | 'privacy' | 'robot' | 'text' | 'heading' | 'divider' | 'spacer' | 'image';
  enabled: boolean;
  order: number;
  label: string;
  placeholder?: string;
  required?: boolean;
  text?: string;
  policyText?: string;
  // Para elementos de texto/heading
  content?: string;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  fontWeight?: 'normal' | 'bold';
  // Para divisor
  height?: number;
  borderColor?: string;
  // Para espaçamento
  spacing?: number;
  // Para imagem
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export interface FormConfig {
  template: 'modern' | 'minimal' | 'bold' | 'elegant' | 'tech';
  
  fields: FieldConfig[];
  
  // Título
  title: {
    text: string;
    fontSize: number;
    color: string;
    enabled: boolean;
  };
  
  // Subtítulo
  subtitle: {
    text: string;
    fontSize: number;
    color: string;
    enabled: boolean;
  };
  
  // Botão
  button: {
    text: string;
    backgroundColor: string;
    textColor: string;
    useGradient: boolean;
    gradientFrom: string;
    gradientTo: string;
  };
  
  // Estilos
  style: {
    backgroundColor: string;
    inputBorderColor: string;
    inputBorderWidth: number;
    inputBorderRadius: number;
    inputPadding: number;
    inputFocusColor: string;
    shadow: number;
  };
  
  // Footer
  footer: {
    enabled: boolean;
    text: string;
  };
  
  // Country Flag
  countryFlag: {
    enabled: boolean;
    defaultCountry: string;
  };
  
  redirectUrl: string;
}

export function PageBuilder() {
  const [formConfig, setFormConfig] = useState<FormConfig>({
    template: 'modern',
    
    fields: [
      {
        id: 'name',
        type: 'name',
        enabled: true,
        order: 0,
        label: 'Nome completo',
        placeholder: '',
        required: true,
      },
      {
        id: 'email',
        type: 'email',
        enabled: true,
        order: 1,
        label: 'E-mail',
        placeholder: '',
        required: true,
      },
      {
        id: 'phone',
        type: 'phone',
        enabled: true,
        order: 2,
        label: 'Telefone',
        placeholder: '',
        required: true,
      },
      {
        id: 'privacy',
        type: 'privacy',
        enabled: true,
        order: 3,
        label: 'Aceitar privacidade',
        text: 'Aceitar notícias de privacidade',
        policyText: 'POLÍTICA DE PRIVACIDADE\n\nÚltima atualização: Janeiro 2026\n\n1. QUAIS INFORMAÇÕES COLETAMOS?\nQuando você preenche nosso formulário, a gente guarda seu nome, e-mail e telefone.\n\n2. O QUE FAZEMOS COM SUAS INFORMAÇÕES?\nUsamos suas informações para:\n- Enviar mensagens sobre nossos produtos\n- Melhorar nosso trabalho\n- Deixar tudo do jeito que você gosta\n\n3. COMPARTILHAMOS SEUS DADOS?\nNão! A gente não vende nem compartilha suas informações com outras empresas.\n\n4. SEUS DADOS ESTÃO SEGUROS?\nSim! A gente protege suas informações para que ninguém tenha acesso sem permissão.\n\n5. QUAIS SÃO SEUS DIREITOS?\nVocê pode:\n- Ver suas informações quando quiser\n- Pedir para corrigir algo que está errado\n- Pedir para apagar tudo\n- Cancelar quando quiser\n\n6. USAMOS COOKIES?\nSim, cookies são pequenos arquivos que ajudam nosso site a funcionar melhor para você.\n\n7. TEM DÚVIDAS?\nSe tiver alguma pergunta, pode mandar um e-mail para: contato@exemplo.com\n\nA gente está aqui para ajudar!',
      },
      {
        id: 'robot',
        type: 'robot',
        enabled: true,
        order: 4,
        label: 'Verificação de robô',
        text: 'Não sou um robô',
      },
    ],
    
    title: {
      text: 'DESCUBRA COMO VIVER UMA MATERNIDADE LEVE, FELIZ E SEM CULPA EM APENAS 90 DIAS',
      fontSize: 48,
      color: '#6b1945',
      enabled: true,
    },
    
    subtitle: {
      text: 'O método completo e científico que ensina você a cuidar do seu bebê com confiança, equilibrar vida pessoal e familiar, recuperar sua energia e redescobrir quem você é além de mãe.',
      fontSize: 18,
      color: '#374151',
      enabled: true,
    },
    
    button: {
      text: 'ENVIAR',
      backgroundColor: '#6b1945',
      textColor: '#ffffff',
      useGradient: true,
      gradientFrom: '#6b1945',
      gradientTo: '#8b1f5a',
    },
    
    style: {
      backgroundColor: '#ffffff',
      inputBorderColor: '#e5e7eb',
      inputBorderWidth: 2,
      inputBorderRadius: 12,
      inputPadding: 16,
      inputFocusColor: '#6b1945',
      shadow: 2,
    },
    
    footer: {
      enabled: true,
      text: 'ASSISTIR ESSE VÍDEO ATÉ O FINAL E ENTENDA POR QUE ESSE MÉTODO FUNCIONA',
    },
    
    // Country Flag
    countryFlag: {
      enabled: true,
      defaultCountry: 'Brasil',
    },
    
    redirectUrl: '',
  });

  const handleAddElement = (element: FieldConfig) => {
    setFormConfig(prevConfig => ({
      ...prevConfig,
      fields: [...prevConfig.fields, element],
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-[#1a1a1a]">
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel onAddElement={handleAddElement} />
        <Canvas formConfig={formConfig} />
        <RightPanel formConfig={formConfig} setFormConfig={setFormConfig} />
      </div>
    </div>
  );
}