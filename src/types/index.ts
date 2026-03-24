export interface Application {
    id: string;
    name: string;
    description: string;
    documentationUrl: string;
    environments: Environment[];
}

export interface Environment {
    id: string;
    name: string;
    tools: Tool[];
    responsibles: Responsibles;
}

export interface Tool {
    id: string;
    name: string;
    icon: string;
    url: string;
    category: string;
}

export interface Responsibles {
    team: string;
    techLead: string;
    architecture: string;
    database: string;
    infrastructure: string;
    deploy: string;
}

export interface Annotation {
    id: string;
    title: string;
    content: string;
    images: string[];
    applicationId?: string;
    environmentId?: string;
    toolId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Reminder {
    id: string;
    annotationId?: string;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
    createdAt: string;
}

export type TarefasColumn = 'backlog' | 'todo' | 'doing' | 'review' | 'done';

export interface TarefasTask {
    id: string;
    title: string;
    description: string;
    column: TarefasColumn;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    tags: string[];
    order: number;
    createdAt: string;
    updatedAt: string;
}
