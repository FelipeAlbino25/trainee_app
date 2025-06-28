import api from "../axios";

import type { List } from "../../types/List";

export const getLists = async(): Promise<List[]> =>{
    const response = await api.get('/lists');
    return response.data as List[];
}

export const getListById = async (id:string): Promise<List> =>{
    const response = await api.get(`/lists/${id}`);
    return response.data as List;
}

export const createList = async (data: Partial<List>) : Promise<List> =>{
    const response = await api.post(`/lists/`,data);
    return response.data as List;
}

export const updateListById = async (data: Partial<List>) : Promise<List>=>{
    const updateListDTOS ={
        name: data.name,
        tasks : data.tasks
    }
    const response = await api.put(`/lists/${data.id}`,updateListDTOS);
    return response.data as List;
}

export const deleteListById = async (id: string): Promise<Boolean> =>{
    const response = await api.delete(`/lists/${id}`);
    return response.data as Boolean;
}
export const findListByName = async(name:string): Promise<List> =>{
    const response = await api.get(`lists/listName/${name}`)
    return response.data as List;
}