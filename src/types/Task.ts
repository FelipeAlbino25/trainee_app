export type Task ={
    id: string;
    name: string;
    description?: string;
    priority: string;
    expectedFinishDate?: Date;
    listId: string;
}