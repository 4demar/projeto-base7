# Documento de Requisitos — Editor de Layout de Banner

## Introdução

O Editor de Layout de Banner é uma nova página no DevPortal que permite a colaboradores de marketing criar layouts visuais para banners do aplicativo mobile. Atualmente, a equipe de marketing produz material publicitário mensalmente combinando imagens e textos (título, descrição, valor, etc.), sem uma ferramenta interna dedicada. Esta funcionalidade oferece um editor visual onde o usuário pode anexar uma imagem de fundo, adicionar elementos de texto posicionáveis sobre a imagem, visualizar o resultado em tempo real e exportar o código HTML com Tailwind CSS. O código gerado pode ser salvo no localStorage e copiado para a área de transferência.

Nota importante: a interface do editor utiliza MUI (Material UI) seguindo o padrão do DevPortal. O Tailwind CSS é usado exclusivamente no código HTML gerado como saída, não na interface do próprio aplicativo.

## Glossário

- **Editor**: A página do DevPortal que fornece a interface visual para criação de layouts de banner.
- **Canvas**: A área de visualização em tempo real que exibe a imagem de fundo e os elementos de texto posicionados sobre ela.
- **Elemento_de_Texto**: Um componente de texto posicionável no Canvas, contendo conteúdo textual e propriedades de estilo (tamanho de fonte, cor, peso).
- **Imagem_de_Fundo**: A imagem anexada pelo usuário que serve como plano de fundo do banner.
- **Painel_de_Propriedades**: A seção lateral do Editor que exibe e permite editar as propriedades do Elemento_de_Texto selecionado.
- **Código_HTML**: O código HTML gerado com classes Tailwind CSS que representa o layout do banner criado.
- **Projeto_de_Banner**: A estrutura de dados que armazena a configuração completa de um layout de banner (imagem, elementos de texto, posições e estilos).
- **Lista_de_Projetos**: A lista de Projetos_de_Banner salvos no localStorage.

## Requisitos

### Requisito 1: Navegação e Acesso ao Editor

**User Story:** Como colaborador de marketing, eu quero acessar o Editor de Layout de Banner pelo menu de navegação do DevPortal, para que eu possa criar banners de forma rápida e integrada ao portal.

#### Critérios de Aceitação

1. THE Editor SHALL estar acessível pela rota `/banner-editor` no DevPortal.
2. THE Editor SHALL aparecer como item "Editor de Banner" no menu de navegação lateral (Drawer) do Layout.
3. WHEN o usuário navegar para `/banner-editor`, THE Editor SHALL renderizar a página do editor de layout de banner.

### Requisito 2: Upload de Imagem de Fundo

**User Story:** Como colaborador de marketing, eu quero anexar uma imagem de fundo ao banner, para que eu possa posicionar textos sobre o material visual.

#### Critérios de Aceitação

1. THE Editor SHALL fornecer um botão para upload de Imagem_de_Fundo a partir do sistema de arquivos local.
2. WHEN o usuário selecionar um arquivo de imagem (PNG, JPG, JPEG, WebP), THE Editor SHALL exibir a Imagem_de_Fundo no Canvas.
3. WHEN o usuário selecionar um arquivo que não seja de imagem válida (PNG, JPG, JPEG, WebP), THE Editor SHALL exibir uma mensagem de erro informando os formatos aceitos.
4. THE Editor SHALL converter a Imagem_de_Fundo para formato Data URL (base64) para armazenamento no Projeto_de_Banner.
5. WHEN uma Imagem_de_Fundo for carregada, THE Canvas SHALL redimensionar a área de visualização para manter a proporção (aspect ratio) da imagem.

### Requisito 3: Gerenciamento de Elementos de Texto

**User Story:** Como colaborador de marketing, eu quero adicionar e gerenciar múltiplos elementos de texto sobre a imagem, para que eu possa compor o layout do banner com título, descrição, valor e outras informações.

#### Critérios de Aceitação

1. THE Editor SHALL fornecer um botão "Adicionar Texto" para criar um novo Elemento_de_Texto no Canvas.
2. WHEN o usuário clicar em "Adicionar Texto", THE Editor SHALL criar um Elemento_de_Texto com conteúdo padrão "Novo Texto" posicionado no centro do Canvas.
3. THE Editor SHALL permitir a criação de múltiplos Elementos_de_Texto no mesmo Canvas.
4. WHEN o usuário selecionar um Elemento_de_Texto no Canvas, THE Painel_de_Propriedades SHALL exibir as propriedades editáveis do Elemento_de_Texto selecionado.
5. THE Editor SHALL fornecer um botão para remover o Elemento_de_Texto selecionado.
6. WHEN o usuário remover um Elemento_de_Texto, THE Canvas SHALL atualizar a visualização removendo o elemento correspondente.
7. THE Editor SHALL atribuir um identificador único (crypto.randomUUID()) a cada Elemento_de_Texto criado.

### Requisito 4: Posicionamento de Elementos de Texto

**User Story:** Como colaborador de marketing, eu quero posicionar livremente os textos sobre a imagem, para que eu possa escolher onde cada informação aparece no banner.

#### Critérios de Aceitação

1. THE Editor SHALL permitir o reposicionamento de cada Elemento_de_Texto via arrastar e soltar (drag and drop) no Canvas.
2. WHILE o usuário arrastar um Elemento_de_Texto, THE Canvas SHALL atualizar a posição do elemento em tempo real.
3. WHEN o usuário soltar um Elemento_de_Texto, THE Editor SHALL armazenar as coordenadas finais (posição X e Y em porcentagem relativa ao Canvas) no Projeto_de_Banner.
4. THE Editor SHALL manter os Elementos_de_Texto dentro dos limites do Canvas durante o arraste.

### Requisito 5: Edição de Propriedades de Texto

**User Story:** Como colaborador de marketing, eu quero editar as propriedades visuais dos textos (conteúdo, tamanho, cor, peso), para que eu possa estilizar cada elemento conforme a identidade visual do banner.

#### Critérios de Aceitação

1. THE Painel_de_Propriedades SHALL permitir a edição do conteúdo textual do Elemento_de_Texto selecionado.
2. THE Painel_de_Propriedades SHALL permitir a alteração do tamanho da fonte do Elemento_de_Texto selecionado.
3. THE Painel_de_Propriedades SHALL permitir a alteração da cor do texto do Elemento_de_Texto selecionado.
4. THE Painel_de_Propriedades SHALL permitir a alteração do peso da fonte (normal, bold) do Elemento_de_Texto selecionado.
5. WHEN o usuário alterar qualquer propriedade no Painel_de_Propriedades, THE Canvas SHALL refletir a alteração em tempo real no Elemento_de_Texto correspondente.

### Requisito 6: Visualização em Tempo Real

**User Story:** Como colaborador de marketing, eu quero visualizar o banner em tempo real enquanto edito, para que eu possa ver o resultado final antes de exportar.

#### Critérios de Aceitação

1. THE Canvas SHALL exibir a Imagem_de_Fundo com todos os Elementos_de_Texto posicionados e estilizados conforme as propriedades definidas.
2. WHEN qualquer propriedade de um Elemento_de_Texto for alterada, THE Canvas SHALL atualizar a renderização em tempo real sem necessidade de ação adicional do usuário.
3. WHEN a Imagem_de_Fundo for alterada, THE Canvas SHALL atualizar a renderização imediatamente.
4. WHILE nenhuma Imagem_de_Fundo estiver carregada, THE Canvas SHALL exibir um placeholder indicando ao usuário para fazer upload de uma imagem.

### Requisito 7: Geração de Código HTML com Tailwind CSS

**User Story:** Como colaborador de marketing, eu quero gerar o código HTML com Tailwind CSS do banner criado, para que eu possa utilizar o código no aplicativo mobile.

#### Critérios de Aceitação

1. THE Editor SHALL fornecer um botão "Ver Código HTML" para exibir o Código_HTML gerado.
2. WHEN o usuário clicar em "Ver Código HTML", THE Editor SHALL gerar o Código_HTML representando o layout do banner utilizando classes Tailwind CSS para posicionamento e estilização.
3. THE Editor SHALL exibir o Código_HTML em um diálogo (modal) com destaque de sintaxe ou formatação legível.
4. THE Código_HTML gerado SHALL utilizar posicionamento relativo/absoluto com classes Tailwind CSS para reproduzir o layout visual criado no Canvas.
5. THE Código_HTML gerado SHALL incluir a referência à Imagem_de_Fundo como tag `<img>` com o atributo `src` contendo o Data URL.
6. THE Código_HTML gerado SHALL representar cada Elemento_de_Texto como um elemento HTML com classes Tailwind CSS correspondentes às propriedades de estilo definidas (tamanho de fonte, cor, peso).

### Requisito 8: Copiar Código HTML

**User Story:** Como colaborador de marketing, eu quero copiar o código HTML gerado para a área de transferência, para que eu possa colar o código onde necessário.

#### Critérios de Aceitação

1. WHEN o Código_HTML estiver sendo exibido, THE Editor SHALL fornecer um botão "Copiar Código" no diálogo de visualização.
2. WHEN o usuário clicar em "Copiar Código", THE Editor SHALL copiar o Código_HTML para a área de transferência do sistema operacional.
3. WHEN o código for copiado com sucesso, THE Editor SHALL exibir uma notificação de confirmação (snackbar) informando "Código copiado com sucesso".
4. IF a cópia para a área de transferência falhar, THEN THE Editor SHALL exibir uma mensagem de erro informando a falha.

### Requisito 9: Salvar e Carregar Projetos no localStorage

**User Story:** Como colaborador de marketing, eu quero salvar meus projetos de banner no navegador e carregá-los posteriormente, para que eu possa continuar editando layouts em sessões diferentes.

#### Critérios de Aceitação

1. THE Editor SHALL fornecer um botão "Salvar Projeto" para persistir o Projeto_de_Banner atual no localStorage.
2. WHEN o usuário clicar em "Salvar Projeto", THE Editor SHALL serializar o Projeto_de_Banner (incluindo Imagem_de_Fundo, Elementos_de_Texto com posições e estilos) e armazenar no localStorage com um identificador único (crypto.randomUUID()).
3. THE Editor SHALL fornecer uma Lista_de_Projetos com os Projetos_de_Banner salvos anteriormente.
4. WHEN o usuário selecionar um Projeto_de_Banner da Lista_de_Projetos, THE Editor SHALL carregar o projeto no Canvas restaurando a Imagem_de_Fundo, Elementos_de_Texto, posições e estilos.
5. THE Editor SHALL fornecer a opção de excluir um Projeto_de_Banner da Lista_de_Projetos.
6. WHEN o usuário excluir um Projeto_de_Banner, THE Editor SHALL remover o projeto do localStorage e atualizar a Lista_de_Projetos.
7. THE Editor SHALL atribuir um nome ao Projeto_de_Banner no momento do salvamento, permitindo ao usuário identificar cada projeto na Lista_de_Projetos.
8. FOR ALL Projetos_de_Banner válidos, salvar e depois carregar o projeto SHALL produzir um estado equivalente ao original no Canvas (propriedade round-trip).

### Requisito 10: Gerenciamento de Estado com Hook Customizado

**User Story:** Como desenvolvedor, eu quero que o estado do Editor de Banner seja gerenciado por um hook customizado no padrão do DevPortal, para manter a consistência arquitetural do projeto.

#### Critérios de Aceitação

1. THE Editor SHALL gerenciar o estado dos Projetos_de_Banner através de um hook customizado `useBannerEditor` exportado de `src/store/useStore.ts`.
2. THE hook `useBannerEditor` SHALL utilizar `useState` e `useCallback` para gerenciamento de estado, seguindo o padrão existente no DevPortal.
3. THE hook `useBannerEditor` SHALL persistir a Lista_de_Projetos no localStorage sob a chave `devportal_banner_projects`.
4. THE hook `useBannerEditor` SHALL fornecer funções para adicionar, carregar, atualizar e excluir Projetos_de_Banner.
