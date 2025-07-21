  import React, { useState } from "react";

  import type { Task } from "../types/Task";
  import TaskComponent from "./Task";
  import { deleteListById, findListByName, updateListById } from "../api/endpoints/List";
  import { createTask } from "../api/endpoints/Task";
  import { useDroppable } from "@dnd-kit/core";

  interface ListProps {
    id: string;
    name: string;
    propTasks: Task[];
  }

  const List = ({ id, name, propTasks }: ListProps) => {
    const [showOptions, setShowOptions] = useState(false);
    const [showDeleteConfirmList, setShowDeleteConfirmList] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");

    const [tasks, setTasks] = useState<Task[]>(propTasks);
    const [showModal, setShowModal] = useState(false);
    const [showListModal, setShowListModal] = useState(false);

    const [nameInput, setNameInput] = useState("");
    const [initialName, setInitialName] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [date, setDate] = useState("");

    const handleToggle = () => setShowModal(!showModal);

    const buildDateAtMidnightLocal = (yyyyMmDd: string) => {
      const [year, month, day] = yyyyMmDd.split("-").map(Number);
      return new Date(year, month - 1, day, 0, 0, 0);
    };

    const updateThisList = async (e: React.MouseEvent) => {
      e.preventDefault();
      try {
        const newList = { id, name: nameInput };
        const response = await updateListById(newList);
        if (response) window.location.reload();
        else window.alert("Algo deu errado");
      } catch (err) {
        console.error(err);
        window.alert("Algo deu errado");
      }
    };

    const {setNodeRef,isOver} =  useDroppable({
      id: id
    })

    const deleteThisList = async (e: React.MouseEvent) => {
      e.preventDefault();
      try {
        const response = await deleteListById(id);
        if (response) {
          setDeleteMessage("Lista excluída com sucesso!");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          window.alert("Algo deu errado");
        }
      } catch (err) {
        console.error(err);
        window.alert("Algo deu errado");
      }
    };

    const handleCreateTask = async (name: string) => {
      try {
        const response = await findListByName(name);
        let newDate = null;
        if (date !== "") {
          const localDate = buildDateAtMidnightLocal(date);
          newDate = localDate.toISOString();
        }

        const newTask = {
          name: title,
          description,
          priority,
          expectedFinishDate: newDate,
          listId: response.id,
        };

        const createTaskResponse = await createTask(newTask);

        setShowModal(false);
        setTitle("");
        setDate("");
        setDescription("");
        setPriority("");

        if (createTaskResponse) {
          setTasks((prev) => [...prev, createTaskResponse]);
        }
      } catch (err) {
        console.error(err);
        window.alert("Algo deu Errado!");
      }
    };

    const openModal = (e: React.MouseEvent) => {
      e.stopPropagation();
      setNameInput(name);
      setInitialName(name);
      setShowListModal(true);
    };

    const closeModal = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (fieldsChanged()) {
        const confirmUpdate = window.confirm("Quer realmente perder estas mudanças?");
        if (confirmUpdate) setShowListModal(false);
      } else {
        setShowListModal(false);
      }
    };

    const fieldsChanged = () => nameInput !== initialName;

    return (
    <div
      ref={setNodeRef}

    className={`
      bg-[#252628] border border-white/30 p-4 rounded-xl flex flex-col gap-4

      ${isOver ? 'border-white/70 transition duration-200': ''}
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
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowOptions(false)}
            ></div>

            <div
              className="absolute right-0 mt-2 bg-[#2A2A2A] text-white border border-white/10 rounded-md shadow-lg z-50 w-36"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => openModal(e)}
                className="w-full text-left py-2 hover:bg-white/10 transition text-sm"
                style={{ paddingLeft: "2vh", paddingRight: "2vh" }}
              >
                <img src="./edit.svg" className="h-4 w-4 inline mr-1" />
                Editar
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirmList(true);
                  setShowOptions(false);
                }}
                className="w-full text-left py-2 hover:bg-white/10 transition text-sm text-red-700"
                style={{ paddingLeft: "2vh", paddingRight: "2vh" }}
              >
                <img src="./delete.png" className="h-4 w-4 inline mr-1" />
                Excluir
              </button>
            </div>
          </>
        )}
      </div>
    </div>

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
      />
    ))}

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

    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        showModal ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/80" onClick={handleToggle}></div>
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#252628] p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${
          showModal ? "translate-x-0" : "translate-x-full"
        } flex flex-col gap-2`}
      >
        <button
          onClick={handleToggle}
          className="hover:cursor-pointer absolute top-2 right-2 text-white text-xl font-bold hover:text-red-400"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-white">Nova Tarefa</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Título"
            className="p-2 rounded text-white bg-transparent border border-white focus:outline-none focus:ring ring-white transition duration-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 min-h-[100px] resize-y rounded-md bg-transparent text-white border border-white focus:outline-none focus:ring ring-white transition duration-200"
          />
          <select
            className="p-2 rounded text-white bg-transparent border border-white"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">Prioridade</option>
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
            <option value="VERY_HIGH">Altíssima</option>
          </select>
          <input
            type="date"
            className="p-2 rounded text-white bg-transparent border border-white"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button
            onClick={() => handleCreateTask(name)}
            className="bg-white hover:bg-black hover:text-white transition duration-300 hover:cursor-pointer text-black font-semibold py-2 rounded"
            style={{ paddingLeft: "4vh", paddingRight: "4vh" }}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>

    {showListModal && (
      <div
        className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center text-white"
        onClick={() => setShowListModal(false)}
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
      <div className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center">
        <div className="relative bg-[#252628] border border-white/10 p-5 rounded-xl shadow-lg flex flex-col gap-3 max-w-xs w-full mx-4 text-white">
          <button
            onClick={() => setShowDeleteConfirmList(false)}
            className="absolute top-2  right-2 text-white hover:text-red-400 text-xl font-bold hover:bg-red-900/20 rounded-full transition"
            style={{ paddingLeft: "2vh", paddingRight: "2vh" }}
          >
            &times;
          </button>
          <h2 className="text-base font-bold m-3">
            Tem certeza que deseja excluir a lista{" "}
            <span className="text-white font-semibold">"{name}"</span>?
          </h2>
          <p className="text-sm text-stone-400">
            Essa ação não é reversível.
          </p>
          <button
            onClick={(e) => {
              deleteThisList(e);
              setShowDeleteConfirmList(false);
            }}
            className="hover:ring-1 ring-red-500/30 p-2 rounded-md justify-center mt-2 flex items-center gap-2 text-[#C10000] font-semibold text-sm hover:cursor-pointer transition duration-100"
          >
            <img src="./delete.png" alt="Trash icon" className="w-4 h-4" />
            Excluir
          </button>
        </div>
      </div>
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

    );
  };

  export default List;
