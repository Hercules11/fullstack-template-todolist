export class Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    isPending: boolean;
    createdAt: Date;
    updatedAt: Date;
}
