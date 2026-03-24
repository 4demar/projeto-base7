import { useState, useCallback } from 'react';
import { Annotation, Reminder } from '../types';

const ANNOTATIONS_KEY = 'devportal_annotations';
const REMINDERS_KEY = 'devportal_reminders';

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
    } catch { return fallback; }
}

function saveToStorage<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function useAnnotations() {
    const [annotations, setAnnotations] = useState<Annotation[]>(() => loadFromStorage(ANNOTATIONS_KEY, []));

    const addAnnotation = useCallback((annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newAnnotation: Annotation = {
            ...annotation,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setAnnotations(prev => {
            const updated = [newAnnotation, ...prev];
            saveToStorage(ANNOTATIONS_KEY, updated);
            return updated;
        });
        return newAnnotation;
    }, []);

    const updateAnnotation = useCallback((id: string, data: Partial<Annotation>) => {
        setAnnotations(prev => {
            const updated = prev.map(a => a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a);
            saveToStorage(ANNOTATIONS_KEY, updated);
            return updated;
        });
    }, []);

    const deleteAnnotation = useCallback((id: string) => {
        setAnnotations(prev => {
            const updated = prev.filter(a => a.id !== id);
            saveToStorage(ANNOTATIONS_KEY, updated);
            return updated;
        });
    }, []);

    return { annotations, addAnnotation, updateAnnotation, deleteAnnotation };
}

export function useReminders() {
    const [reminders, setReminders] = useState<Reminder[]>(() => loadFromStorage(REMINDERS_KEY, []));

    const addReminder = useCallback((reminder: Omit<Reminder, 'id' | 'createdAt'>) => {
        const newReminder: Reminder = {
            ...reminder,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        setReminders(prev => {
            const updated = [newReminder, ...prev];
            saveToStorage(REMINDERS_KEY, updated);
            return updated;
        });
        return newReminder;
    }, []);

    const toggleReminder = useCallback((id: string) => {
        setReminders(prev => {
            const updated = prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
            saveToStorage(REMINDERS_KEY, updated);
            return updated;
        });
    }, []);

    const deleteReminder = useCallback((id: string) => {
        setReminders(prev => {
            const updated = prev.filter(r => r.id !== id);
            saveToStorage(REMINDERS_KEY, updated);
            return updated;
        });
    }, []);

    return { reminders, addReminder, toggleReminder, deleteReminder };
}

import { TarefasTask, TarefasColumn } from '../types';

const Tarefas_KEY = 'devportal_Tarefas';

export function useTarefas() {
    const [tasks, setTasks] = useState<TarefasTask[]>(() => loadFromStorage(Tarefas_KEY, []));

    const addTask = useCallback((task: Omit<TarefasTask, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
        const colTasks = tasks.filter(t => t.column === task.column);
        const newTask: TarefasTask = {
            ...task,
            id: crypto.randomUUID(),
            order: colTasks.length,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setTasks(prev => {
            const updated = [...prev, newTask];
            saveToStorage(Tarefas_KEY, updated);
            return updated;
        });
        return newTask;
    }, [tasks]);

    const updateTask = useCallback((id: string, data: Partial<TarefasTask>) => {
        setTasks(prev => {
            const updated = prev.map(t => t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t);
            saveToStorage(Tarefas_KEY, updated);
            return updated;
        });
    }, []);

    const moveTask = useCallback((id: string, toColumn: TarefasColumn) => {
        setTasks(prev => {
            const task = prev.find(t => t.id === id);
            if (!task || task.column === toColumn) return prev;
            const targetTasks = prev.filter(t => t.column === toColumn);
            const updated = prev.map(t =>
                t.id === id ? { ...t, column: toColumn, order: targetTasks.length, updatedAt: new Date().toISOString() } : t
            );
            saveToStorage(Tarefas_KEY, updated);
            return updated;
        });
    }, []);

    const deleteTask = useCallback((id: string) => {
        setTasks(prev => {
            const updated = prev.filter(t => t.id !== id);
            saveToStorage(Tarefas_KEY, updated);
            return updated;
        });
    }, []);

    return { tasks, addTask, updateTask, moveTask, deleteTask };
}
