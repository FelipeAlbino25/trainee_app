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

      setModal(false)
    
  }

  const verifySameListName = (listName:string) =>{

    for( let i=0; i <lists.length; i++){
      if(listName === lists[i].name){
        return true
      }
    }
    return false;
  }
 
  const createThisList = async (e: React.MouseEvent) => {
  try {
    e.preventDefault();

    if (listNameInput.trim() === '') {
      window.alert('O nome da lista não pode estar vazio!');
      return;
    }

    if (verifySameListName(listNameInput)) {
      window.alert('Já existe uma lista com este nome!');
      return;
    }

    const newList = {
      name: listNameInput.trim()
    };

    const response = await createList(newList);
    console.log(response);
    if (response) {
      window.location.reload();
    }

  } catch (err) {
    console.error(err);
  }



  }

    return (
  <div className="flex flex-row flex-nowrap gap-4 overflow-x-auto sm:p-10  w-full pt-15">
    {lists.map((list) => (
    <ListComponent
      key={list.id}
      id={list.id}
      name={list.name}
      propTasks={list.tasks}
    />
  ))}
  <div className="bg-[#1C1C1C] rounded-md flex flex-col gap-4 min-w-[300px] w-[300px] h-min shrink-0 relative top-2">
    <button
      onClick={(e) => openModal(e)}
      className="w-full flex items-center gap-2 bg-[#1C1C1C] text-white font-semibold text-sm px-3 py-2 rounded-md hover:bg-[#2A2A2A] transition"
    >
      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black text-base font-bold">+</div>
      Nova Lista
    </button>
  </div>

  {modal && (
    <div
      className="fixed inset-0 bg-black/90 bg-opacity-50 z-50 flex items-center justify-center text-white"
      onClick={(e) => closeModal(e)}
    >
      <div
        className="bg-[#1C1C1C] p-4 rounded shadow-lg w-full max-w-md relative flex flex-col gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => closeModal(e)}
          className="absolute top-2 right-2 text-black text-xl hover:text-red-400 font-extrabold px-2 hover:bg-red-900/20 rounded-full"
        >
          &times;
        </button>
        <p>Criar Lista</p>
        <p className="flex mt-4">Nome da Lista:</p>
        <input
          type="text"
          className="p-2 border-2 border-stone-100/10 rounded-xl focus:outline-none focus:ring focus:ring-white hover:ring hover:ring-white transition duration-200"
          onChange={(e) => setListNameInput(e.target.value)}
        />
        <button
          onClick={(e) => createThisList(e)}
          className="mt-6 bg-white text-black font-extrabold p-1 rounded-xl hover:bg-black hover:text-white transition duration-200"
        >
          Criar Lista
        </button>
      </div>
    </div>
  )}
</div>


    );
  };

  export default Board;