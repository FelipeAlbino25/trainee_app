export type Task ={
    id: string;
    name: string;
    description?: string |null;
    priority: string;
    expectedFinishDate?: string | null;
    listId: string;
}