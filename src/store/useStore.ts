import { useState, useCallback } from 'react';
import { LembreteDto, BannerProject } from '../types';

const LEMBRETE_KEY = 'devportal_lembrete';

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
    } catch { return fallback; }
}

function saveToStorage<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function useLembrete() {
    const [lembrete, setLembrete] = useState<LembreteDto[]>(() => loadFromStorage(LEMBRETE_KEY, []));

    const addLembrete = useCallback((Lembrete: Omit<LembreteDto, 'id' | 'createdAt'>) => {
        const newLembrete: LembreteDto = {
            ...Lembrete,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        setLembrete(prev => {
            const updated = [newLembrete, ...prev];
            saveToStorage(LEMBRETE_KEY, updated);
            return updated;
        });
        return newLembrete;
    }, []);

    const toggleLembrete = useCallback((id: string) => {
        setLembrete(prev => {
            const updated = prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
            saveToStorage(LEMBRETE_KEY, updated);
            return updated;
        });
    }, []);

    const deleteLembrete = useCallback((id: string) => {
        setLembrete(prev => {
            const updated = prev.filter(r => r.id !== id);
            saveToStorage(LEMBRETE_KEY, updated);
            return updated;
        });
    }, []);

    return { lembrete, addLembrete, toggleLembrete, deleteLembrete };
}


const BANNER_PROJECTS_KEY = 'devportal_banner_projects';

export function useBannerEditor(): {
    projects: BannerProject[];
    saveProject: (project: Omit<BannerProject, 'id' | 'createdAt' | 'updatedAt'>) => BannerProject;
    updateProject: (project: BannerProject) => void;
    loadProject: (id: string) => BannerProject | undefined;
    deleteProject: (id: string) => void;
} {
    const [projects, setProjects] = useState<BannerProject[]>(() =>
        loadFromStorage<BannerProject>(BANNER_PROJECTS_KEY, [])
    );

    const saveProject = useCallback((project: Omit<BannerProject, 'id' | 'createdAt' | 'updatedAt'>): BannerProject => {
        const now = new Date().toISOString();
        const newProject: BannerProject = {
            ...project,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
        };
        setProjects(prev => {
            const updated = [newProject, ...prev];
            saveToStorage(BANNER_PROJECTS_KEY, updated);
            return updated;
        });
        return newProject;
    }, []);

    const updateProject = useCallback((project: BannerProject): void => {
        setProjects(prev => {
            const updated = prev.map(p => p.id === project.id ? { ...project, updatedAt: new Date().toISOString() } : p);
            saveToStorage(BANNER_PROJECTS_KEY, updated);
            return updated;
        });
    }, []);

    const loadProject = useCallback((id: string): BannerProject | undefined => {
        return projects.find(p => p.id === id);
    }, [projects]);

    const deleteProject = useCallback((id: string): void => {
        setProjects(prev => {
            const updated = prev.filter(p => p.id !== id);
            saveToStorage(BANNER_PROJECTS_KEY, updated);
            return updated;
        });
    }, []);

    return { projects, saveProject, updateProject, loadProject, deleteProject };
}
