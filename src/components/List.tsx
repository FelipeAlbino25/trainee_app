import React, { useEffect, useState } from "react";

import type { Task } from "../types/Task";
import TaskComponent from "./Task";
import { updateListById } from "../api/endpoints/List";
import { useDroppable } from "@dnd-kit/core";
import { toast } from "react-toastify";
import CreateTaskModal from "./CreateTaskModal";
import DeleteListModal from "./DeleteListModal";
import ShowListOptionsModal from "./ShowOptionsModal";

interface ListProps {
  id: string;
  name: string;
  propTasks: Task[];
  refetchLists: () => Promise<void>;
}

const List = ({ id, name, propTasks, refetchLists }: ListProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirmList, setShowDeleteConfirmList] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const [tasks, setTasks] = useState<Task[]>(propTasks);
  const [showModal, setShowModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);

  const [nameInput, setNameInput] = useState("");
  const [initialName, setInitialName] = useState("");

  const handleToggle = () => setShowModal(!showModal);

  const updateThisList = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const newList = { id, name: nameInput };
      await updateListById(newList);
      setShowListModal(false);
      await refetchLists();
    } catch (err) {
      toast.error(
        "Erro ao atualizar a lista. Verifique se já existe uma lista com este nome ou se o nome não está vazio.",
        {
          position: "top-center",
          autoClose: 5000,
          theme: "light",
          style: {
            backgroundColor: "#252628",
            font: "8px",
            color: "#fff",
            width: "100%",
          },
        }
      );
      console.error(err);
    }
  };

  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNameInput(name);
    setInitialName(name);
    setShowListModal(true);
  };

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (fieldsChanged()) {
      toast.warn(
        ({ closeToast }) => (
          <div className="flex flex-col gap-3 p-2 text-white rounded-md">
            <p className="text-sm text-white">
              Quer realmente perder estas mudanças?
            </p>
            <div className="flex items-center gap-2 justify-center">
              <button
                onClick={() => {
                  setShowListModal(false);
                  closeToast?.();
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm transition"
              >
                Sim
              </button>
              <button
                onClick={closeToast}
                className="bg-white hover:bg-gray-200 text-black px-4 py-1.5 rounded-md text-sm transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        ),
        {
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          closeButton: false,
          draggable: false,
          pauseOnHover: false,
          style: {
            backgroundColor: "#252628",
          },
        }
      );
    } else {
      setShowListModal(false);
    }
  };

  const fieldsChanged = () => nameInput !== initialName;

  useEffect(() => {
    setTasks(propTasks);
  }, [propTasks]);

  return (
    <>
      <div
        ref={setNodeRef}
        className={`
      bg-[#252628] border border-white/30 p-4 rounded-xl flex flex-col gap-4

      ${isOver ? "border-white/70 transition duration-200" : ""}
      min-h-[100vh]
      h-auto
      w-[350px]
      min-w[350px] 
      max-[1500px]:min-w-[380px]
      
      max-[1280px]:min-w-[360px]
      max-[1024px]:min-w-[340px]
      max-[768px]:min-w-[295px]

      transition-all duration-300 ease-in-out relative
    `}
      >
        <div className="flex justify-between items-center relative">
          <p className="text-white font-extrabold text-md">{name}</p>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions((prev) => !prev);
              }}
              className="text-white text-xl font-bold hover:text-gray-400 hover:cursor-pointer"
              style={{ paddingLeft: "1vh", paddingRight: "1vh" }}
            >
              ...
            </button>

            {showOptions && (
              <ShowListOptionsModal
                onClose={() => setShowOptions(false)}
                onEdit={(e) => openModal(e)}
                onDelete={() => setShowDeleteConfirmList(true)}
              />
            )}
          </div>
        </div>

        {/*RENDER DE TAREFAS*/}
        {tasks.map((task) => (
          <TaskComponent
            key={task.id}
            {...task}
            description={task.description ?? undefined}
            expectedFinishDate={
              task.expectedFinishDate
                ? new Date(task.expectedFinishDate)
                : undefined
            }
            refetchLists={refetchLists}
          />
        ))}

        {/*BOTÃO PARA CRIAR UMA NOVA TASK*/}
        <button
          onClick={handleToggle}
          className="flex hover:cursor-pointer items-center gap-2 bg-[#252628] text-white font-semibold text-sm py-2 rounded-md hover:bg-[#2A2A2A] transition"
          style={{ paddingLeft: "3vh", paddingRight: "3vh" }}
        >
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black text-base font-bold">
            +
          </div>
          Nova tarefa
        </button>

        {/*MODAL PARA CRIAR UMA TASK*/}

        {showModal && (
          <CreateTaskModal
            listId={id}
            refetchLists={refetchLists}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        )}

        {showListModal && (
          <div
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center text-white"
            onClick={(e) => closeModal(e)}
          >
            <div
              className="bg-[#252628] p-4 rounded shadow-lg w-full max-w-md relative flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => closeModal(e)}
                className="absolute top-2 right-2 text-white hover:text-red-400 text-xl font-bold hover:bg-red-900/20 rounded-full transition"
                style={{ paddingLeft: "2vh", paddingRight: "2vh" }}
              >
                &times;
              </button>
              <label className="text-sm font-semibold">Nome da Lista</label>
              <input
                onChange={(e) => setNameInput(e.target.value)}
                value={nameInput}
                type="text"
                className="p-3 text-lg w-full hover:ring-slate-200/10 hover:ring-2 rounded-md transition duration-200 focus:ring-2 focus:ring-white/20 focus:outline-none bg-transparent border border-white/20"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={(e) => updateThisList(e)}
                  className="flex-1 py-2 bg-white text-black font-bold rounded-xl hover:bg-black hover:text-white transition duration-300 hover:cursor-pointer"
                >
                  Atualizar
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirmList && (
          <DeleteListModal
            listId={id}
            listName={name}
            taskCount={propTasks.length}
            onClose={() => setShowDeleteConfirmList(false)}
            refetchLists={refetchLists}
            setDeleteMessage={setDeleteMessage}
          />
        )}

        {deleteMessage && (
          <div
            className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 rounded-md shadow-lg z-[999] transition"
            style={{ paddingLeft: "4vh", paddingRight: "4vh" }}
          >
            {deleteMessage}
          </div>
        )}
      </div>
    </>
  );
};

export default List;
