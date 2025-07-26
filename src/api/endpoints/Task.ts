import api from "../axios";

import type { Task } from "../../types/Task";

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks/");
  return response.data as Task[];
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data as Task;
};

export const createTask = async (data: Partial<Task>): Promise<Task> => {
  const response = await api.post("/tasks/", data);
  return response.data as Task;
};

export const deleteTaskById = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
export const updateTaskById = async (data: Partial<Task>): Promise<Task> => {
  const updateTaskDtos = {
    name: data.name,
    description: data.description,
    priority: data.priority,
    expectedFinishDate: data.expectedFinishDate,
    listId: data.listId,
    finished: data.finished,
  };
  const response = await api.put(`/tasks/${data.id}`, updateTaskDtos);
  return response.data as Task;
};

export const findTaskByListId = async (id: string): Promise<Task[]> => {
  const response = await api.get(`/tasks/listId/${id}`);
  return response.data as Task[];
};
export const deleteTasksByListId = async (id: string): Promise<void> => {
  await api.delete(`/tasks/listId/${id}`);
};
export const moveTaskToNewList = async (
  id: string,
  newListId: string
): Promise<Boolean> => {
  const response = await api.put(`/tasks/moveTask/${id}`, {
    listId: newListId,
  });
  return response.data as Boolean;
};
