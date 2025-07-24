import type { Task } from "./Task";

export type List = {
  id: string;
  name: string;
  tasks: Task[];
};
