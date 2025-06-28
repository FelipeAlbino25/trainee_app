import React from "react";
import type { List } from "../types/List";
import type { Task } from "../types/Task";
import TaskComponent from "./Task";
import { useState } from "react";
import { findListByName } from "../api/endpoints/List";
import { createTask } from "../api/endpoints/Task";

interface ListProps {
    name:string,
    propTasks: Task[]
}


const List = ({ name, propTasks }: ListProps) => {

  const [tasks,setTasks] = useState<Task[]>(propTasks)

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [date, setDate] = useState('');


  const handleToggle = () => setShowModal(!showModal);

  const handleCreateTask = async(name:string) =>{
    const response = await findListByName(name);
   
    const newDate = new Date(date).toISOString();
    console.log(newDate)

    const newTask ={
      name:title,
      description:description,
      priority:priority,
      expectedFinishDate: newDate,
      listId: response.id
    }
    console.log(newTask)

    const createTaskResponse = await createTask(newTask);
    setShowModal(false)
    setTitle("")
    setDate("")
    setDescription("")
    setPriority("")
    if(createTaskResponse){
      const newTask = createTaskResponse;
      setTasks(prev=>[...prev,newTask])
      setShowModal(false)
    }


  }


    return (
      <div className="bg-black/30 border-2  p-4 rounded-md flex flex-col gap-4 min-w-[300px] w-full sm:w-80 h-min">
       
        <p className="font-mono text-white font-semibold text-xs">{name}</p>
        <button 
        onClick={handleToggle}
        className="hover:cursor-pointer bg-stone-200/30 border-1 rounded-md border-white/20 text-white/80 font-bold text-sm hover:bg-stone-200/10 transition duration-200 ">
            {"Adicionar Atividade"}
          </button>
        {tasks.map((task) => (
            <TaskComponent key={task.id} {...task} expectedFinishDate={task.expectedFinishDate ? new Date(task.expectedFinishDate) : undefined} />
        ))}
       
        {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-stone-900 text-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            {/* Botão de fechar */}
            <button
              onClick={handleToggle}
              className="absolute top-2 right-2 text-white text-xl font-bold hover:text-red-400"
            >
              &times;
            </button>

            {/* Formulário */}
            <h2 className="text-xl font-bold mb-4">Nova Tarefa</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Título"
                className="p-2 rounded text-white"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
              />
              <textarea
                placeholder="Descrição"
                value={description}
                className="p-2 rounded text-white"
                onChange={(e)=>setDescription(e.target.value)}
              />
              <select className="p-2 rounded text-white"
                value={priority}
                onChange={(e)=>setPriority(e.target.value)}
              >
                <option value="">Prioridade</option>
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
                <option value="VERY_HIGH">Altíssima</option>
              </select>
              <input
                type="date"
                className="p-2 rounded text-white"
                value={date}
                onChange={(e)=>setDate(e.target.value)}
              />
              <button
                onClick={ () => handleCreateTask(name)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
        
  );
  };
  

export default List;