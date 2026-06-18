# Configuração Dinâmica de Ocorrências (Tipos, Subtipos, Tabs e Campos)

Documentação para reaproveitar, em outro projeto, a solução de **permissão/liberação de campos via banco**
em vez de deixar essas regras fixas (hardcoded) dentro dos componentes.

> ⚠️ **PRÉ-REQUISITO OBRIGATÓRIO — varrer o projeto antes de qualquer alteração.**
> Antes de implementar esta solução no projeto-alvo, é necessário **varrer todo o projeto, tanto na API quanto no front-end**, para entender como hoje se encontra o **cadastro de Tipo e Subtipo de ocorrência**:
> - **No front-end**: localizar as telas/componentes de cadastro de tipo e subtipo, os formulários de ocorrência, e onde hoje os campos/abas estão fixados em hardcode (quais aparecem, quais são editáveis, quais são obrigatórios).
> - **Na API**: localizar os endpoints e serviços que hoje gravam/leem tipos e subtipos (ex.: `services/boletim.ts`), entender o contrato atual e o modelo de dados existente.
>
> Sem esse mapeamento prévio é impossível saber o que precisa ser adaptado, qual o ponto de integração e o que pode ser reaproveitado.

## 1. Problema que isso resolve

Hoje, no projeto de origem, a regra de "quais campos/abas aparecem, quais são editáveis e quais são obrigatórios" está espalhada dentro dos próprios componentes. Qualquer mudança exige desenvolvimento e deploy.

A ideia aqui é mover essa decisão para **dados**: um administrador configura as regras numa tela, elas ficam persistidas num banco, e a tela de cadastro monta o formulário dinamicamente lendo essas regras. Sem recompilar nada.

**Importante sobre o projeto-alvo:** o projeto que vai receber a migração **já possui os campos fixados e estabelecidos em suas posições**. A ideia **não** é gerar os campos do zero, e sim **controlar os campos já existentes** a partir da informação extraída do banco (visibilidade, editável, obrigatório). Ou seja, os campos continuam onde estão; o que passa a ser dinâmico é a regra de exibição/edição/obrigatoriedade de cada um.

Modelo conceitual:

```
Tipo de Ocorrência   →  define QUAIS TABS aparecem (e em que ordem)
Subtipo (Complemento) →  define QUAIS CAMPOS aparecem dentro dessas tabs
Regra do Campo        →  define, por campo, se é EDITÁVEL e/ou OBRIGATÓRIO
```

## 2. Modelo de dados

Entidades persistidas no banco e o catálogo de tabs (que **não** é persistido — fica em hardcode num hook). IDs numéricos com `autoIncrement` para as entidades de banco; o catálogo de campos usa IDs fixos de seed.

| Entidade | Persistência | Campos | Papel |
|---|---|---|---|
| `TipoOcorrencia` | banco | `id, nome, descricao, listaIdTabs: number[], inativo` | Tipo. `listaIdTabs` guarda os ids das tabs **na ordem de exibição**. |
| `ComplementoOcorrencia` | banco | `id, idTipoOcorrencia, nome, descricao, inativo` | Subtipo, sempre vinculado a um Tipo. |
| `CampoTabFormulario` | banco (catálogo/seed) | `id, idTab, nome, label` | Catálogo de campos, cada um pertence a uma tab. |
| `RegraCampoOcorrencia` | banco | `id, idCampoFormulario, idComplementoOcorrencia, editavel, obrigatorio` | A liberação: une um campo a um subtipo, com as flags. |
| `TabFormulario` | **hardcode (hook)** | `id, link, descricao` | **Lista fixa de tabs.** Não é tabela do banco. |

> ℹ️ **`TabFormulario` NÃO é tabela do banco.** A lista de tabs é **fixada em hardcode dentro de um hook** (ex.: `listaNavegacaoBase` no `useNavigation.tsx`). Cada tab é composta por `id`, `link` e `descricao` — porque a mesma lista é reaproveitada também como **Breadcrumbs** e nas **rotas de navegação** (`link` é a rota; `descricao` é o texto exibido). As demais entidades (`TipoOcorrencia`, `ComplementoOcorrencia`, `CampoTabFormulario`, `RegraCampoOcorrencia`) continuam no banco.

Pontos-chave do design:

- **A ordem das tabs vive em `listaIdTabs`** (um array). Reordenar = reordenar o array. Não há coluna "ordem" separada. Os ids em `listaIdTabs` referenciam os ids da lista hardcoded de tabs (`TabFormulario`).
- **A existência de uma `RegraCampoOcorrencia` = campo visível** para aquele subtipo. Se não existe regra, o campo não aparece. As flags `editavel`/`obrigatorio` só fazem sentido quando a regra existe.
- O catálogo de **campos** (`CampoTabFormulario`) é seed de banco; a lista de **tabs** (`TabFormulario`) é hardcode no hook. Tipos, subtipos e regras são **configuração do usuário**.

Relacionamentos:
Obs: a lista de tabs (`TabFormulario`/`listaNavegacaoBase`) é hardcode no `useNavigation.tsx`, não vem do banco.
```
TipoOcorrencia (1) ──< ComplementoOcorrencia (N)
ComplementoOcorrencia (1) ──< RegraCampoOcorrencia (N) >── (1) CampoTabFormulario
TipoOcorrencia.listaIdTabs ──> referencia listaNavegacaoBase.id (hardcode, ordenado)
```

### Tipos TypeScript

```ts
export interface TipoOcorrencia {
    id: number;
    nome: string;
    descricao: string;
    listaIdTabs: number[]; // ids de TabFormulario, na ordem de exibição
    inativo: boolean;
}

export interface ComplementoOcorrencia {
    id: number;
    idTipoOcorrencia: number;
    nome: string;
    descricao: string;
    inativo: boolean;
}

export interface TabFormulario {
    id: number;
    link: string;      // rota de navegação (usada nas rotas e como destino do Breadcrumb)
    descricao: string; // texto exibido (nas tabs e no Breadcrumb)
}
// Obs: TabFormulario NÃO é persistida no banco — é uma lista hardcoded
// dentro de um hook (ex.: listaNavegacaoBase no useNavigation.tsx).

export interface CampoTabFormulario {
    id: number;
    idTab: number;
    nome: string;
    label: string;
}

export interface RegraCampoOcorrencia {
    id: number;
    idCampoFormulario: number;
    idComplementoOcorrencia: number;
    editavel: boolean;
    obrigatorio: boolean;
}
```

## 3. Camada de serviço API

> ⚠️ **Antes de mexer aqui, conclua a varredura do projeto (ver aviso no topo).** É preciso mapear, **na API e no front**, como hoje funciona o cadastro de Tipo e Subtipo: quais endpoints existem, qual o contrato (payload/resposta) e onde o front consome.

- Atualmente, no projeto de origem, em `services/boletim.ts` são feitas chamadas na API para gravar os tipos e subtipos. Será necessário **verificar e alterar** esse serviço para aplicar a nova funcionalidade.
- Será necessário **criar endpoints e alterar a API** para acrescentar as novas funcionalidades (persistência de `RegraCampoOcorrencia` e de `listaIdTabs` por tipo, leitura das regras por subtipo, etc.).
- A lista de **tabs** não precisa de endpoint: ela é hardcode no hook (`TabFormulario`/`listaNavegacaoBase`). Só os **campos**, **regras**, **tipos** e **subtipos** transitam pela API.

## 4. Camada de hooks (estado React)

Os hooks ficam em `store/useStore.ts` e encapsulam o acesso ao banco. Cada um chama `ensureSeed()`, carrega os dados e expõe operações que dão `refresh` ao final.

| Hook | Uso |
|---|---|
| `useTipoOcorrencia()` | Lista/cria/edita/remove Tipos. Também devolve o catálogo de tabs. |
| `useComplementoOcorrencia()` | Lista/cria/edita/remove Subtipos. Devolve `contagemCampos` por subtipo. Ao remover, apaga as regras filhas antes. |
| `useRegrasComplemento(idComplemento, idsTabs)` | Tela de configuração: liga/desliga campos (`setExibido`) e altera flags (`setFlag`). |
| `useFormularioOcorrencia(idTipo, idSubtipo)` | **O consumo final**: monta a estrutura de tabs+campos visíveis para preencher uma ocorrência. |
| `useNavigacaoTabs()` | Responsável por montar as tabs e as rotas — contém a **lista hardcoded de tabs** (`TabFormulario`), usada também no Breadcrumb (exibido por `descricao`) e nas rotas (`link`). |

### O hook que monta o formulário dinâmico

Este é o coração da "liberação por banco". Ele resolve: dado um Tipo e um Subtipo, quais tabs (na ordem) e quais campos (com flags) devem aparecer.

```ts
export function useFormularioOcorrencia(idTipo: number | null, idSubtipo: number | null) {
    const [estrutura, setEstrutura] = useState<TabFormularioOcorrencia[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        await ensureSeed();
        if (idTipo == null || idSubtipo == null) { setEstrutura([]); return; }

        const tipo = await tipoOcorrenciaRepo.getById(idTipo);
        if (!tipo) { setEstrutura([]); return; }

        // tabs vêm da lista HARDCODED do hook (não do banco); apenas as regras vêm do banco
        const todasTabs = listaNavegacaoBase; // ex.: do useNavigation.tsx
        const regras = await regraCampoOcorrenciaRepo.getByComplemento(idSubtipo); // regras DESTE subtipo
        // campos das tabs do tipo, respeitando a ordem de listaIdTabs
        const camposPorTab = await Promise.all(
            tipo.listaIdTabs.map(idTab => campoFormularioRepo.getByTab(idTab))
        );
        const regraDe = (idCampo: number) => regras.find(r => r.idCampoFormulario === idCampo);

        const resultado = tipo.listaIdTabs.map((idTab, i) => {
            const tab = todasTabs.find(t => t.id === idTab) ?? { id: idTab, link: '', descricao: `Tab ${idTab}` };
            const campos = camposPorTab[i]
                .map(campo => {
                    const regra = regraDe(campo.id);
                    return regra ? { campo, editavel: regra.editavel, obrigatorio: regra.obrigatorio } : null;
                })
                .filter(c => c !== null);
            return { tab, campos };
        }).filter(t => t.campos.length > 0); // some tabs sem nenhum campo liberado

        setEstrutura(resultado);
    }, [idTipo, idSubtipo]);

    useEffect(() => {
        let ativo = true;
        setLoading(true);
        refresh().finally(() => { if (ativo) setLoading(false); });
        return () => { ativo = false; };
    }, [refresh]);

    return { estrutura, loading };
}
```

A tela de cadastro de ocorrência só itera `estrutura`: cada item vira uma aba, cada campo vira um input com `required={obrigatorio}` e `disabled={!editavel}`.

## 6. Telas (resumo)

- **Configuração (admin)**: painel com abas `Tipos` e `Subtipos`.
  - *Tipo*: nome, descrição, status, e seleção de tabs com **drag-and-drop** (HTML5 nativo) — a ordem arrastada é salva em `listaIdTabs`.
  - *Subtipo*: passo 1 escolhe o Tipo pai + dados; passo 2 mostra as tabs do tipo em accordions, e por campo permite marcar **Exibir / Editável / Obrigatório** (cria/edita/remove `RegraCampoOcorrencia`).
- **Cadastro de Ocorrência (uso final)**: seleciona Tipo → Subtipo e renderiza o formulário com `useFormularioOcorrencia`.

### Navegação: criação vs. edição/pesquisa

A forma de apresentar as tabs muda conforme a operação — isso impacta diretamente o uso da lista hardcoded de tabs (`link` para rota, `descricao` para Breadcrumb/título):

- **Criar nova ocorrência → por rota de navegação.** Cada tab é uma rota; o usuário percorre as tabs navegando entre rotas, e o **Breadcrumb** é montado a partir da `descricao` de cada `TabFormulario`. O `link` de cada tab é a rota destino.
- **Editar ou pesquisar ocorrência → em tabs dentro de um modal.** As mesmas tabs são exibidas como abas (tabs) **dentro de um modal**, sem troca de rota.

Em ambos os casos a **estrutura de tabs/campos visíveis é a mesma** (vinda de `useFormularioOcorrencia`); o que muda é apenas o "container" de apresentação (rota com Breadcrumb na criação; modal com abas na edição/pesquisa).

### Convenção do switch de status

O modelo armazena `inativo: boolean`, mas a UI mostra "Status" no sentido positivo (marcado = ativo). Por isso a inversão na apresentação:

```tsx
<Switch checked={!inativo} onChange={(e) => setInativo(!e.target.checked)} />
```

## 7. Passos para portar para outro projeto

> 🔎 **Passo 0 (obrigatório): varrer o projeto-alvo, API e front.** Mapeie o cadastro atual de Tipo/Subtipo (endpoints, serviços como `services/boletim.ts`, telas e formulários) e identifique onde hoje os campos/abas estão fixados em hardcode. Lembre que o alvo **já tem os campos posicionados** — o objetivo é controlá-los via banco, não recriá-los.

1. Copie a pasta `src/database/` (`db.ts`, `crud.ts`, `ocorrenciaRepository.ts`, `index.ts`). Não há dependências externas.
2. Ajuste `DB_NAME` e os nomes em `Stores` para o seu domínio (ex.: `permissao`, `perfil`, `campo`...). O importante é manter o padrão: **uma store de "regra" que liga o item configurável (campo/feature) ao contexto (subtipo/perfil) com flags**.
3. Adapte as interfaces em `types/index.ts` ao seu domínio. A entidade-chave é a de **regra** (a tabela de liberação).
4. Defina o seed do catálogo de **campos** (`listaCamposBase`) e a **lista hardcoded de tabs** no hook (`listaNavegacaoBase`/`TabFormulario`, com `id`, `link`, `descricao`). As tabs **não** vão para o banco; só os campos.
5. Recrie os hooks de leitura/escrita seguindo o padrão `ensureSeed → carregar → operação → refresh`.
6. No componente que hoje decide a liberação no código, troque a lógica fixa por uma leitura da regra (equivalente ao `useFormularioOcorrencia`): se existe regra → mostra; flags → controlam editável/obrigatório. Como os campos já existem na tela, aplique as regras sobre eles (visibilidade, `disabled`, `required`) em vez de gerá-los do zero.

### Mapa mental da migração

| Hoje (hardcoded) | Depois (banco) |
|---|---|
| `if (perfil === 'X') mostrarCampo` | existe `RegraCampoOcorrencia` para aquele contexto |
| `campo.disabled = perfil !== 'admin'` | `regra.editavel` |
| `campo.required = true` no JSX | `regra.obrigatorio` |
| alterar regra = editar código + deploy | alterar regra = tela de admin grava no banco |

## 8. Limitações / pendências conhecidas

- **Persistência da ocorrência preenchida não foi implementada** — só existe a configuração e a montagem do formulário. Para salvar o que o usuário preenche, crie uma nova store (ex.: `ocorrencia`) com tipo, subtipo e os valores dos campos.
- IndexedDB é **por navegador/dispositivo**. Não há sincronização entre máquinas; para isso seria necessário um backend.
- O seed só roda com o banco vazio. Se mudar o catálogo depois, é preciso uma migração (bump de `DB_VERSION`) ou limpar o IndexedDB.
- Não há validação de integridade referencial automática do IndexedDB — a remoção em cascata (apagar regras ao excluir um subtipo) é feita manualmente no hook.
