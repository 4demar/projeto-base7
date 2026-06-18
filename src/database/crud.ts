// Operações CRUD genéricas sobre o IndexedDB.

import { openDb, StoreName } from './db';

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Adiciona um registro (id é gerado pelo autoIncrement). Retorna o id criado.
export async function add<T>(store: StoreName, value: Omit<T, 'id'>): Promise<number> {
    const db = await openDb();
    const tx = db.transaction(store, 'readwrite');
    const key = await promisifyRequest(tx.objectStore(store).add(value));
    return key as number;
}

// Insere ou atualiza um registro completo (com id).
export async function put<T extends { id: number }>(store: StoreName, value: T): Promise<number> {
    const db = await openDb();
    const tx = db.transaction(store, 'readwrite');
    const key = await promisifyRequest(tx.objectStore(store).put(value));
    return key as number;
}

export async function getById<T>(store: StoreName, id: number): Promise<T | undefined> {
    const db = await openDb();
    const tx = db.transaction(store, 'readonly');
    return promisifyRequest<T>(tx.objectStore(store).get(id) as IDBRequest<T>);
}

export async function getAll<T>(store: StoreName): Promise<T[]> {
    const db = await openDb();
    const tx = db.transaction(store, 'readonly');
    return promisifyRequest<T[]>(tx.objectStore(store).getAll() as IDBRequest<T[]>);
}

// Busca registros por um índice (ex.: complementos de um tipo de ocorrência).
export async function getAllByIndex<T>(store: StoreName, indexName: string, value: IDBValidKey): Promise<T[]> {
    const db = await openDb();
    const tx = db.transaction(store, 'readonly');
    const index = tx.objectStore(store).index(indexName);
    return promisifyRequest<T[]>(index.getAll(value) as IDBRequest<T[]>);
}

export async function remove(store: StoreName, id: number): Promise<void> {
    const db = await openDb();
    const tx = db.transaction(store, 'readwrite');
    await promisifyRequest(tx.objectStore(store).delete(id));
}
