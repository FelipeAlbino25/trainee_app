import ListComponent from "./List";
import { useState } from "react";
import type{ List } from '../types/List';
import { createList } from "../api/endpoints/List";



const Board = ({ lists }: { lists: List[] }) => {

  const [modal,setModal] = useState(false);
  const [listNameInput, setListNameInput] = useState('')

  const openModal = (e: React.MouseEvent) =>{
    e.preventDefault();
    setModal(true);
  }

  const closeModal = (e: React.MouseEvent) =>{
    e.preventDefault();
    const confirmClose = window.confirm('Quer realmente perder estas mudanças?');

    if(confirmClose){
      setModal(false)
    }
  }

  const verifySameListName = (listName:string) =>{

    for( let i=0; i <lists.length; i++){
      if(listName === lists[i].name){
        return true
      }
    }
    return false;
  }
  const createThisList = async(e: React.MouseEvent)=>{
    try{
    e.preventDefault();

    if(verifySameListName(listNameInput)){
      window.alert('Já existe uma lista com este nome!')
    }

    const newList = {
      name:listNameInput
    }

    const response =await createList(newList)
    console.log(response)
    if(response){
      window.location.reload();
    }

    }
    catch(err){
      console.error(err)
    }

  }

    return (
      <div className="flex gap-4  overflow-x-auto pt-10 p-10">
        {lists.map((list) => (
          <ListComponent key={list.id} id={list.id} name={list.name} propTasks={list.tasks}/>
        ))}
        <div className='items-center bg-black/30 border-2 p-4 rounded-md flex flex-col gap-4 min-w-[300px] w-full sm:w-80 h-min'>
        <p 
        className="font-mono text-white font-semibold text-xs ">{'Criar Lista'}</p>
        <button
        onClick={(e)=>openModal(e)}
        className='w-full p-1 bg-stone-900 border-2 border-stone-300/25 rounded-xl text-white font-extrabold text-sm hover:bg-black hover:ring-1 hover:ring-white transition duration-200 hover:cursor-pointer'>{'Adicionar Lista'}</button>
        </div>

        {modal && (
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
          <p>Criar Lista</p>
          <p className='flex mt-4'>{'Nome da Lista:'}</p>
          <input type='text'
          className='p-2 border-2 border-stone-100/10 rounded-xl focus:outline-none focus:ring focus:ring-white hover:ring hover:ring-white transition duration-200'
          onChange={(e)=>setListNameInput(e.target.value)}
          />
          <button
          onClick={(e)=>createThisList(e)}
          className={'mt-5 bg-white text-black font-extrabold p-1 rounded-xl hover:bg-black hover:text-white transition duration-200 hover:cursor-pointer'}
          >{'Criar Lista'}</button>
          </div>
          </div>
        )}
      </div>

    );
  };

  export default Board;