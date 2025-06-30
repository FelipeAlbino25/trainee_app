import React from "react";
import type { List } from "../types/List";
import type { Task } from "../types/Task";
import TaskComponent from "./Task";
import { useState } from "react";
import { deleteListById, findListByName } from "../api/endpoints/List";
import { updateListById } from "../api/endpoints/List";
import { createTask } from "../api/endpoints/Task";

interface ListProps {
    id: string,
    name:string,
    propTasks: Task[]
}


const List = ({id, name, propTasks }: ListProps) => {

  const [tasks,setTasks] = useState<Task[]>(propTasks)

  const [showModal, setShowModal] = useState(false);

  const [showListModal, setShowListModal] = useState(false);

  const [nameInput, setNameInput] = useState('');
  const [initialName, setInitialName] = useState('')

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [date, setDate] = useState('');
  


  const handleToggle = () => setShowModal(!showModal);

  const updateThisList = async(e: React.MouseEvent)=>{

    try{
    e.preventDefault();

    const newList ={
      id: id,
      name: nameInput
    }

    const response = await updateListById(newList)
    console.log(response)

    if(response){
      window.location.reload()
    }
    else{
      window.alert('Algo deu errado')
    }
  }
  catch(err){
    console.error(err)
    window.alert('Algo deu errado')
  }
  }

  const deleteThisList = async(e:React.MouseEvent) =>{
    try{
    e.preventDefault();
    const response = await deleteListById(id)
    console.log(response)
    if(response){
      window.location.reload()
    }
    else window.alert('Algo deu Errado')
  }
  catch(err){
    console.error(err)
    window.alert('Algo deu Errado')
  }
  }

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
  const openModal = (e:React.MouseEvent)=>{
    e.stopPropagation();

    setNameInput(name)
    setInitialName(name)

    setShowListModal(true)

  }
  const closeModal = (e:React.MouseEvent) =>{
    e.stopPropagation()

    if(fieldsChanged()){
      const confirmUpdate = window.confirm('Quer realmente perder estas mudanças?')
      if(confirmUpdate){
        setShowListModal(false)
      }
    }
    else{
      setShowListModal(false)
    }
  }

  const fieldsChanged = () =>{
    return(
      nameInput !== initialName
    )
  }
    return (
      <div 
      
      className="bg-black/30 border-2  p-4 rounded-md flex flex-col gap-4 min-w-[300px] w-full sm:w-80 h-min hover:border-white hover:bg-black/60 transition duration-200 hover:cursor-pointer">
       
        <p 
        onClick={(e)=>openModal(e) }
        className="font-mono text-white font-semibold text-xs hover:underline hover:underline-offset-1">{name}</p>
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
              className="hover:cursor-pointer absolute top-2 right-2 text-white text-xl font-bold hover:text-red-400"
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

      {showListModal && (
        <div className="fixed inset-0 bg-black/90 bg-opacity-50 z-50 flex items-center justify-center text-white">
        <div
          className="bg-stone-900 p-4 rounded shadow-lg w-full max-w-md relative flex flex-col gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e)=>closeModal(e)}
            className="absolute top-2 right-2 text-black text-xl hover:text-red-400 font-extrabold text-xl transition duration-200 hover:cursor-pointer px-2 hover:bg-red-900/20 rounded-full"
          >
            &times;
          </button>
          <input
            onChange={(e) => setNameInput(e.target.value)}
            value={nameInput}
            type="text"
            className="p-2 w-15/16 hover:ring-slate-200/10 hover:ring-2  rounded-md transition duration-200 focus:ring-2 focus:ring-white/20 focus:outline-none"
          />

          <button 
          onClick={(e)=> updateThisList(e)}
          className='mt-2 p-1 bg-white text-black font-bold rounded-xl hover:bg-black hover:text-white transition duration-300 hover:cursor-pointer'>{'Atualizar'}</button>
          <button 
          onClick={(e)=> deleteThisList(e)}
          className='mt-2 p-1 bg-white text-black font-bold rounded-xl hover:bg-red-600 hover:text-white transition duration-300 hover:cursor-pointer'>{'Excluir'}</button>
          
        
        </div>
      </div>
      )}

      </div>
        
  );
  };
  

export default List;