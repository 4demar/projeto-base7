// Operações CRUD genéricas sobre o IndexedDB.

import { openDb, StoreName } from './db';

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Adiciona um registro (chave gerada pelo autoIncrement). Retorna a chave criada.
export async function add<T>(store: StoreName, value: T): Promise<number> {
    const db = await openDb();
    const tx = db.transaction(store, 'readwrite');
    const key = await promisifyRequest(tx.objectStore(store).add(value));
    return key as number;
}

// Insere ou atualiza um registro completo.
export async function put<T>(store: StoreName, value: T): Promise<number> {
    const db = await openDb();
    const tx = db.transaction(store, 'readwrite');
    const key = await promisifyRequest(tx.objectStore(store).put(value));
    return key as number;
}

export async function getByKey<T>(store: StoreName, key: IDBValidKey): Promise<T | undefined> {
    const db = await openDb();
    const tx = db.transaction(store, 'readonly');
    return promisifyRequest<T>(tx.objectStore(store).get(key) as IDBRequest<T>);
}

export async function getAll<T>(store: StoreName): Promise<T[]> {
    const db = await openDb();
    const tx = db.transaction(store, 'readonly');
    return promisifyRequest<T[]>(tx.objectStore(store).getAll() as IDBRequest<T[]>);
}

// Busca registros por um índice (ex.: complementos de um tipo).
export async function getAllByIndex<T>(store: StoreName, indexName: string, value: IDBValidKey): Promise<T[]> {
    const db = await openDb();
    const tx = db.transaction(store, 'readonly');
    const index = tx.objectStore(store).index(indexName);
    return promisifyRequest<T[]>(index.getAll(value) as IDBRequest<T[]>);
}

export async function remove(store: StoreName, key: IDBValidKey): Promise<void> {
    const db = await openDb();
    const tx = db.transaction(store, 'readwrite');
    await promisifyRequest(tx.objectStore(store).delete(key));
}

export async function count(store: StoreName): Promise<number> {
    const db = await openDb();
    const tx = db.transaction(store, 'readonly');
    return promisifyRequest<number>(tx.objectStore(store).count());
}
