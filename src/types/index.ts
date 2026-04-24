export interface LembreteDto {
    id: string;
    annotationId?: string;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
    createdAt: string;
}


export interface BannerTextElement {
    id: string;
    content: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontWeight: 'normal' | 'bold';
}

export interface BannerProject {
    id: string;
    name: string;
    backgroundImage: string;
    textElements: BannerTextElement[];
    createdAt: string;
    updatedAt: string;
}
