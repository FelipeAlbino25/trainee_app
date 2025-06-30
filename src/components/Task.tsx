import React, { useState } from "react";
import TaskDate from "./TaskDate";
import Priority from "./Priority";
import { deleteTaskById, updateTaskById } from "../api/endpoints/Task";

type Task = {
  id: string;
  name: string;
  description?: string;
  priority: string;
  expectedFinishDate?: Date;
  listId: string;
};

const Task: React.FC<Task> = ({
  id,
  name,
  description,
  priority,
  expectedFinishDate,
  listId,
}) => {
  const [modal, setModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('')
  const [expectedFinishDateInput, setExpectedFinishDateInput] = useState('');

  const [initialName, setInitialName] = useState('');
const [initialDescription, setInitialDescription] = useState('');
const [initialPriority, setInitialPriority] = useState('');
const [initialDate, setInitialDate] = useState('');



  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const dateString = expectedFinishDate ? expectedFinishDate.toISOString().split('T')[0] : '';
    
    setInitialName(name);
    setInitialDescription(description ?? '');
    setInitialPriority(priority);
    setInitialDate(dateString);
  
    setNameInput(name);
    setDescriptionInput(description ?? '');
    setPriorityInput(priority);
    setExpectedFinishDateInput(dateString);
    
    setModal(true);
  };
  

  const fieldsChanged = () => {
    return (
      nameInput !== initialName ||
      descriptionInput !== initialDescription ||
      priorityInput !== initialPriority ||
      expectedFinishDateInput !== initialDate
    );
  };
  

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();

    if(fieldsChanged()){
      const confirmUpdate = window.confirm("Quer realmente perder estas mudanças?")
      if(confirmUpdate){
        setModal(false)
      }
    }
    else{

    setModal(false);
    }
  };

  const updateThisTask = async (e: React.MouseEvent) =>{
    try{
    e.preventDefault();

    let newDate;
    if(expectedFinishDateInput != ''){
      newDate = new Date(expectedFinishDateInput).toISOString();
    }
    else{
      newDate = undefined;
    }
    const newTask = {
      id: id,
      name: nameInput,
      description: descriptionInput,
      priority: priorityInput,
      expectedFinishDate: newDate,
      listId: listId
    }

    const response = await updateTaskById(newTask);
    console.log(response)
    setModal(false)
    window.location.reload();

    }
    catch(err){
      window.alert('Algo deu errado')
      console.error(err);
    }
  }

  const deleteThisTask = async (e: React.MouseEvent)=>{
    e.preventDefault();
    try{

      const response = await deleteTaskById(id);
      console.log(response);

      window.location.reload()

    }
    catch(err){
      console.error(err)
    }
  }

  return (
    <>
      <div
        onClick={(e) => {
          if (!modal) openModal(e);
        }}
        className="border border-stone-300/25 bg-stone-900 text-stone-300 rounded-md flex flex-col items-start gap-1 w-full min-h-[150px] p-2 hover:cursor-pointer hover:underline hover:border-stone-300/60 hover:bg-stone-900/50 transition duration-200"
      >
        <Priority priority={priority} />
        <div>
          <span className="text-xs font-extrabold px-1">{name}</span>
        </div>
        <p
          className="font-sans w-full text-left text-xs px-1 overflow-hidden text-ellipsis break-words font-medium"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {description}
        </p>
        <TaskDate date={expectedFinishDate} />
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/90 bg-opacity-50 z-50 flex items-center justify-center text-white">
          <div
            className="bg-stone-900 p-4 rounded shadow-lg w-full max-w-md relative flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
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

            <p className="mt-7 flex">Prioridade:</p>    
            <select
            onChange={(e)=>setPriorityInput(e.target.value)}
            className="ring-1 ring-slate-100/5 rounded-md p-2 hover:ring-2 hover:ring-slate-200/10 transition duration-200 hover:cursor-pointer" defaultValue={priority}>
              <option value={'LOW'}>Bixa Prioridade</option>
              <option value={'MEDIUM'}>Média Prioridade</option>
              <option value={'HIGH'}>Alta Prioridade</option>
              <option value={'VERY_HIGH'}>Altíssima Prioridade</option>
            </select>
            <p className="justify-left flex mt-3">Descrição:</p>
            <input 
            onChange={(e)=>setDescriptionInput(e.target.value)}
            type="text" defaultValue={description} className="ring-slate-100/5 ring-1 p-2 pb-10  hover:ring-slate-200/10 hover:ring-2  rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"/>
            <p className="justify-left flex mt-3">Data de Entrega:</p>
            <input
            onChange={(e)=>setExpectedFinishDateInput(e.target.value)}
            defaultValue={expectedFinishDate != undefined ? expectedFinishDate.toISOString().split('T')[0] :'' } type="date"className=" hover:cursor-pointer p-2 ring-1 ring-slate-100/10 hover:ring-slate-200/10 hover:ring-2  rounded-md transition duration-200 focus:ring-2 focus:ring-white/20 focus:outline-none"/>


            <button 
            onClick={(e)=> updateThisTask(e)}
            className='mt-2 p-1 bg-white text-black font-bold rounded-xl hover:bg-black hover:text-white transition duration-300 hover:cursor-pointer'>{'Atualizar'}</button>
            <button 
            onClick={(e)=> deleteThisTask(e)}
            className='mt-2 p-1 bg-white text-black font-bold rounded-xl hover:bg-red-600 hover:text-white transition duration-300 hover:cursor-pointer'>{'Excluir'}</button>
            
          
          </div>
        </div>
      )}
    </>
  );
};

export default Task;
