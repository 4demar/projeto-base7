// Base de conexão IndexedDB para a configuração dinâmica de ocorrências.
// Substitui o antigo "apiBoletim": o serviço grava/lê aqui como se fosse uma API.

export const DB_NAME = 'devportal_ocorrencias';
// v2: tipo/complemento passaram a usar numeroTipo/numeroComplemento como PK (na v1 era 'id').
// Bancos criados com o schema antigo precisam ser migrados; caso contrário o put() não
// encontra a chave no registro e cria um novo em vez de atualizar.
export const DB_VERSION = 2;

export const Stores = {
    tipoOcorrencia: 'tipoOcorrencia',
    complementoOcorrencia: 'complementoOcorrencia',
    campoFormulario: 'campoFormulario',
    regraCampoOcorrencia: 'regraCampoOcorrencia',
} as const;

export type StoreName = (typeof Stores)[keyof typeof Stores];

type Registro = Record<string, unknown>;

type DefinicaoStore = {
    nome: string;
    keyPath: string;
    autoIncrement: boolean;
    indices: string[];
    // Converte um registro do schema antigo para o atual.
    migrar?: (registro: Registro) => Registro;
};

// Move o valor da antiga PK 'id' para a nova PK, preservando o número (mantém os
// vínculos de complementos e regras que referenciam esse id).
function moverChave(novaChave: string) {
    return (r: Registro): Registro => {
        const { id, ...resto } = r;
        return { ...resto, [novaChave]: resto[novaChave] ?? id };
    };
}

const definicoes: DefinicaoStore[] = [
    // Tipo: PK numeroTipo (autoIncrement), guarda tabsConfiguracao inline.
    {
        nome: Stores.tipoOcorrencia,
        keyPath: 'numeroTipo',
        autoIncrement: true,
        indices: [],
        migrar: moverChave('numeroTipo'),
    },
    // Complemento (Subtipo): PK numeroComplemento (autoIncrement), índice por numeroTipo.
    {
        nome: Stores.complementoOcorrencia,
        keyPath: 'numeroComplemento',
        autoIncrement: true,
        indices: ['numeroTipo'],
        migrar: moverChave('numeroComplemento'),
    },
    // Catálogo de campos (seed): PK id, índice por idTab.
    {
        nome: Stores.campoFormulario,
        keyPath: 'id',
        autoIncrement: false,
        indices: ['idTab'],
    },
    // Regra de campo (UTLBO07): PK id (autoIncrement), índices por complemento/tipo/campo.
    {
        nome: Stores.regraCampoOcorrencia,
        keyPath: 'id',
        autoIncrement: true,
        indices: ['idComplementoOcorrencia', 'idTipoOcorrencia', 'idCampoFormulario'],
    },
];

function criarIndices(store: IDBObjectStore, indices: string[]) {
    indices.forEach(nome => {
        if (!store.indexNames.contains(nome)) store.createIndex(nome, nome, { unique: false });
    });
}

// Garante que a store exista com o keyPath esperado. Se existir com outro schema,
// lê os registros, recria a store e regrava os dados migrados (tudo na mesma
// transação de upgrade, então falhas revertem o upgrade inteiro).
function garantirStore(db: IDBDatabase, tx: IDBTransaction, def: DefinicaoStore) {
    if (!db.objectStoreNames.contains(def.nome)) {
        const store = db.createObjectStore(def.nome, { keyPath: def.keyPath, autoIncrement: def.autoIncrement });
        criarIndices(store, def.indices);
        return;
    }

    const existente = tx.objectStore(def.nome);
    if (existente.keyPath === def.keyPath && existente.autoIncrement === def.autoIncrement) {
        criarIndices(existente, def.indices);
        return;
    }

    const leitura = existente.getAll();
    leitura.onsuccess = () => {
        const registros = leitura.result as Registro[];
        db.deleteObjectStore(def.nome);
        const nova = db.createObjectStore(def.nome, { keyPath: def.keyPath, autoIncrement: def.autoIncrement });
        criarIndices(nova, def.indices);
        registros.forEach(r => nova.put(def.migrar ? def.migrar(r) : r));
    };
}

let dbPromise: Promise<IDBDatabase> | null = null;

export function openDb(): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            const tx = request.transaction;
            if (!tx) return;

            // Store obsoleta do schema v1.
            if (db.objectStoreNames.contains('tabFormulario')) db.deleteObjectStore('tabFormulario');

            definicoes.forEach(def => garantirStore(db, tx, def));
        };

        request.onsuccess = () => {
            const db = request.result;
            // Quando outra aba (ou um reload/HMR) pedir uma versão nova do banco, fecha esta
            // conexão para não bloquear o upgrade.
            db.onversionchange = () => {
                db.close();
                dbPromise = null;
            };
            resolve(db);
        };
        request.onerror = () => {
            dbPromise = null;
            reject(request.error);
        };
        // Upgrade bloqueado por uma conexão antiga ainda aberta (outra aba com a versão
        // anterior). Sem isso a promise nunca resolve e o loading fica travado na tela.
        request.onblocked = () => {
            dbPromise = null;
            reject(new Error('Banco local bloqueado por outra aba aberta do DevPortal. Feche as demais abas e recarregue a página.'));
        };
    });

    return dbPromise;
}
