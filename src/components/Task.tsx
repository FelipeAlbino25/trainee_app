import React, { useState } from "react";
import TaskDate from "./TaskDate";
import Priority from "./Priority";
import { deleteTaskById, updateTaskById } from "../api/endpoints/Task";
import { useDraggable } from "@dnd-kit/core";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteNotification, setShowDeleteNotification] = useState(false);




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


  const buildDateAtMidnightLocal = (yyyyMmDd: string) => {
    const [year, month, day] = yyyyMmDd.split("-").map(Number);
    return new Date(year, month - 1, day, 0, 0, 0);
  };

  const updateThisTask = async (e: React.MouseEvent) =>{
    try{
    e.preventDefault();

    let newDate = null;
    if(expectedFinishDateInput != ""){
      const localDate = buildDateAtMidnightLocal(expectedFinishDateInput);
      newDate =  localDate.toISOString();
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

const deleteThisTask = async (e: React.MouseEvent) => {
  e.preventDefault();
  try {
    const response = await deleteTaskById(id);
    console.log(response);

    // Mostra a notificação
    setShowDeleteNotification(true);

    // Aguarda 2 segundos e recarrega
    setTimeout(() => {
      window.location.reload();
    }, 1300);
  } catch (err) {
    console.error(err);
  }
};

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
  id: id,
  data: {
    listId: listId,
  },
});


  const isDragging = !!transform;
  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
    zIndex: 9999, // Eleva o item ao topo durante o drag
    position: "relative" as React.CSSProperties["position"],
  } : undefined;

  return (
    <>
      <div
        onClick={(e) => {
          if (!modal) openModal(e);
        }}

        style={style}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`relative border border-stone-300/25 bg-[#252628] text-stone-300 rounded-xl flex flex-col items-start gap-1 
          w-full 
          h-[145px]                                
          
          max-[1280px]:h-[145px]                            
          max-[1024px]:h-[145px] 
          max-[768px]:h-[135px] 
          max-[640px]:h-[135px] 
          max-[500px]:h-[130px] 
          max-[400px]:h-[130px]
          
           ${isDragging ? 'z-[9999]' : ''}
          p-2 hover:cursor-pointer hover:underline hover:border-stone-300/60 hover:bg-stone-900/50
          ${transform ? "" : "transition duration-200"}
          `}
      >

        <Priority priority={priority} />
        <div>
          <span className="text-sm font-extrabold px-1">{name}</span>
        </div>
        <p
          className="tracking-wide w-full text-left text-[10px] text-xs/4 px-1 overflow-hidden text-ellipsis break-words"
         
        >
          {description}
        </p>
        <TaskDate date={expectedFinishDate} />
      </div>

      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${modal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
  <div
    className="absolute inset-0 bg-black/80"
    onClick={closeModal}
  ></div>

  <div
    onClick={(e) => e.stopPropagation()}
    className={`
      fixed top-0 right-0 h-full w-full max-w-md bg-[#252628] p-4 shadow-lg 
      transform transition-transform duration-300 ease-in-out 
      ${modal ? 'translate-x-0' : 'translate-x-full'}
      flex flex-col gap-2 overflow-y-auto
      text-white
    `}
  >
    <button
      onClick={closeModal}
      className="fixed top-2 right-2 text-black text-xl hover:text-red-400 font-extrabold transition duration-200 hover:cursor-pointer px-2 hover:bg-red-900/20 rounded-full"
    >
      &times;
    </button>
    
    <input
      onChange={(e) => setNameInput(e.target.value)}
      value={nameInput}
      type="text"
      className="p-2 text-xl w-15/16 hover:ring-slate-200/10 hover:ring-2  rounded-md transition duration-200 focus:ring-2 focus:ring-white/20 focus:outline-none"
    />
    <div className="flex items-center gap-2 mt-4">
  <label className="text-sm font-semibold text-white">
    Prioridade:
  </label>
  <select
    onChange={(e) => setPriorityInput(e.target.value)}
    className="ring-1 ring-slate-100/5 rounded-md p-2 ml-auto bg-transparent text-white border border-white/10 hover:ring-2 hover:ring-slate-200/10 transition duration-200 hover:cursor-pointer"
    defaultValue={priority}
    >
      <option value="LOW">Baixa Prioridade</option>
      <option value="MEDIUM">Média Prioridade</option>
      <option value="HIGH">Alta Prioridade</option>
      <option value="VERY_HIGH">Altíssima Prioridade</option>
    </select>
  </div>
  <div className="flex items-center gap-2 mt-4">
    
    <label className="text-sm font-semibold text-white">
      Data de Entrega:
  </label>
    <input
      onChange={(e) => setExpectedFinishDateInput(e.target.value)}
      defaultValue={expectedFinishDate != undefined ? expectedFinishDate.toISOString().split('T')[0] : ''}
      type="date"
      className="hover:cursor-pointer p-2 ring-1 ml-auto ring-slate-100/10 hover:ring-slate-200/10 hover:ring-2 rounded-md transition duration-200 focus:ring-2 focus:ring-white/20 focus:outline-none"
    />
  </div>
  <p className="justify-left flex mt-3">Descrição:</p>
<textarea
  value={descriptionInput}
  onChange={(e) => setDescriptionInput(e.target.value)}
  className="p-2 min-h-[100px] resize-y rounded-md ring-1 ring-slate-100/10 hover:ring-slate-200/10 hover:ring-2 transition duration-200 focus:ring-2 focus:ring-white/20 focus:outline-none bg-transparent text-white"
/>

    

  <div className="flex gap-2 mt-2 w-full">
  <button
    onClick={(e) => updateThisTask(e)}
    className="flex-1 py-2 bg-white text-black font-bold rounded-xl hover:bg-black hover:text-white transition duration-300 hover:cursor-pointer"
  >
    Atualizar
  </button>

  <button
    onClick={(e) => {
      e.preventDefault();
      setShowDeleteConfirm(true);
    }}
    className="rounded-xl flex-1 py-2 flex items-center justify-center gap-2 text-white font-semibold text-base rounded-xlhover:cursor-pointer hover:ring-1 transition duration-200"
  >
    <img src="./delete.png" alt="Trash icon" className="w-5 h-5 " />
    Excluir
  </button>
</div>


  </div>
</div>
{showDeleteConfirm && (
  <div className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center">
    <div className="relative bg-[#252628] border border-white/10 p-5 rounded-xl shadow-lg flex flex-col gap-3 max-w-xs w-full mx-4 text-white">
      
      <button
        onClick={() => setShowDeleteConfirm(false)}
        className="absolute top-2  right-2 text-white hover:text-red-400 text-xl font-bold px-2 hover:bg-red-900/20 rounded-full transition"
      >
        &times;
      </button>

      <h2 className="text-base font-bold m-3">
        Tem certeza que deseja excluir a tarefa <span className="text-white font-semibold">"{name}"</span>?
      </h2>

      <p className="text-sm text-stone-400">Essa ação não é reversível.</p>

      <button
        onClick={(e) => {
          deleteThisTask(e);
          setShowDeleteConfirm(false);
        }}
        className="mt-2 flex justify-center hover:ring-1 ring-red-500/30 p-2 rounded-md  items-center gap-2 text-[#C10000] font-semibold text-sm hover:cursor-pointer transition duration-100"
      >
        <img src="./delete.png" alt="Trash icon" className="w-4 h-4" />
        Excluir
      </button>
    </div>
  </div>
)}
{showDeleteNotification && (
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-[1000] transition-translation duration-300">
    Tarefa excluída com sucesso!
  </div>
)}


    </>
  );
};

export default Task;
