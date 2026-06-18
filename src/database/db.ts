// Banco IndexedDB para o cadastro de Tipo de Ocorrência.
// Implementação nativa (sem dependências externas).

export const DB_NAME = 'devportal_ocorrencias';
export const DB_VERSION = 1;

export const Stores = {
    tipoOcorrencia: 'tipoOcorrencia',
    complementoOcorrencia: 'complementoOcorrencia',
    tabFormulario: 'tabFormulario',
    campoFormulario: 'campoFormulario',
    regraCampoOcorrencia: 'regraCampoOcorrencia',
} as const;

export type StoreName = (typeof Stores)[keyof typeof Stores];

let dbPromise: Promise<IDBDatabase> | null = null;

export function openDb(): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;

            // tipoOcorrencia: id (PK autoincrement), nome, listaIdTabs[], inativo
            if (!db.objectStoreNames.contains(Stores.tipoOcorrencia)) {
                db.createObjectStore(Stores.tipoOcorrencia, { keyPath: 'id', autoIncrement: true });
            }

            // complementoOcorrencia: id (PK), idTipoOcorrencia (FK), nome, inativo
            if (!db.objectStoreNames.contains(Stores.complementoOcorrencia)) {
                const store = db.createObjectStore(Stores.complementoOcorrencia, { keyPath: 'id', autoIncrement: true });
                store.createIndex('idTipoOcorrencia', 'idTipoOcorrencia', { unique: false });
            }

            // tabFormulario: id (PK), nome
            if (!db.objectStoreNames.contains(Stores.tabFormulario)) {
                db.createObjectStore(Stores.tabFormulario, { keyPath: 'id', autoIncrement: true });
            }

            // campoFormulario: id (PK), idTab (FK), nome, label
            if (!db.objectStoreNames.contains(Stores.campoFormulario)) {
                const store = db.createObjectStore(Stores.campoFormulario, { keyPath: 'id', autoIncrement: true });
                store.createIndex('idTab', 'idTab', { unique: false });
            }

            // regraCampoOcorrencia: id (PK), idCampoFormulario (FK), idComplementoOcorrencia (FK), editavel, obrigatorio
            if (!db.objectStoreNames.contains(Stores.regraCampoOcorrencia)) {
                const store = db.createObjectStore(Stores.regraCampoOcorrencia, { keyPath: 'id', autoIncrement: true });
                store.createIndex('idCampoFormulario', 'idCampoFormulario', { unique: false });
                store.createIndex('idComplementoOcorrencia', 'idComplementoOcorrencia', { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    return dbPromise;
}
