import React from "react";
import type { List } from "../types/List";
import type { Task } from "../types/Task";
import TaskComponent from "./Task";
import { useState } from "react";

interface ListProps {
    name:string,
    tasks: Task[]
}


const List = ({ name, tasks }: ListProps) => {


  const [showModal, setShowModal] = useState(false);

  const handleToggle = () => setShowModal(!showModal);

  const handleCreateTask = (name:string) =>{
    console.log(name)

  }


    return (
      <div className="bg-black/30 border-2  p-4 rounded-md flex flex-col gap-4 min-w-[250px] w-full sm:w-80 h-min overflow-y-auto">
       
        <p className="font-mono text-white font-semibold text-xs">{name}</p>
        <button 
        onClick={handleToggle}
        className="bg-stone-200/30 border-1 rounded-md border-white/20 text-white/80 font-bold text-sm hover:bg-stone-200/10 transition duration-200 ">
            {"Adicionar Atividade"}
          </button>
        {tasks.map((task) => (
          <TaskComponent key={task.id} {...task} />
        ))}
       
        {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
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
              />
              <textarea
                placeholder="Descrição"
                className="p-2 rounded text-white"
              />
              <select className="p-2 rounded text-white">
                <option value="">Prioridade</option>
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
                <option value="VERY_HIGH">Altíssima</option>
              </select>
              <input
                type="date"
                className="p-2 rounded text-white"
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