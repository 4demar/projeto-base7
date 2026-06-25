// Base de conexão IndexedDB para a configuração dinâmica de ocorrências.
// Substitui o antigo "apiBoletim": o serviço grava/lê aqui como se fosse uma API.

export const DB_NAME = 'devportal_ocorrencias';
export const DB_VERSION = 1;

export const Stores = {
    tipoOcorrencia: 'tipoOcorrencia',
    complementoOcorrencia: 'complementoOcorrencia',
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

            // Tipo: PK numeroTipo (autoIncrement), guarda tabsConfiguracao inline.
            if (!db.objectStoreNames.contains(Stores.tipoOcorrencia)) {
                db.createObjectStore(Stores.tipoOcorrencia, { keyPath: 'numeroTipo', autoIncrement: true });
            }

            // Complemento (Subtipo): PK numeroComplemento (autoIncrement), índice por numeroTipo.
            if (!db.objectStoreNames.contains(Stores.complementoOcorrencia)) {
                const store = db.createObjectStore(Stores.complementoOcorrencia, { keyPath: 'numeroComplemento', autoIncrement: true });
                store.createIndex('numeroTipo', 'numeroTipo', { unique: false });
            }

            // Catálogo de campos (seed): PK id, índice por idTab.
            if (!db.objectStoreNames.contains(Stores.campoFormulario)) {
                const store = db.createObjectStore(Stores.campoFormulario, { keyPath: 'id' });
                store.createIndex('idTab', 'idTab', { unique: false });
            }

            // Regra de campo (UTLBO07): PK id (autoIncrement), índices por complemento/tipo.
            if (!db.objectStoreNames.contains(Stores.regraCampoOcorrencia)) {
                const store = db.createObjectStore(Stores.regraCampoOcorrencia, { keyPath: 'id', autoIncrement: true });
                store.createIndex('idComplementoOcorrencia', 'idComplementoOcorrencia', { unique: false });
                store.createIndex('idTipoOcorrencia', 'idTipoOcorrencia', { unique: false });
                store.createIndex('idCampoFormulario', 'idCampoFormulario', { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    return dbPromise;
}
