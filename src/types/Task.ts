export type Task = {
  id: string;
  name: string;
  description?: string | null;
  priority: string;
  expectedFinishDate?: Date | null;
  listId: string;
  finished: boolean;
};
