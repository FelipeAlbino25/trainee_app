import ListComponent from "./List";
import { useState } from "react";
import type { List } from "../types/List";
import { createList, findListByName } from "../api/endpoints/List";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { moveTaskToNewList } from "../api/endpoints/Task";
import { toast } from "react-toastify";

const Board = ({
  lists,
  refetchLists,
}: {
  lists: List[];
  refetchLists: () => Promise<void>;
}) => {
  const [modal, setModal] = useState(false);
  const [listNameInput, setListNameInput] = useState("");

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const fromListId = active.data.current?.listId as string;
    const toListId = over.id as string;
    if (fromListId && toListId && fromListId !== toListId) {
      try {
        await moveTaskToNewList(taskId, toListId);
        await refetchLists();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setModal(true);
  };

  const closeModal = (e: React.MouseEvent) => {
    e.preventDefault();

    setModal(false);
  };

  const verifySameListName = (listName: string) => {
    for (let i = 0; i < lists.length; i++) {
      if (listName === lists[i].name) {
        return true;
      }
    }
    return false;
  };

  const createThisList = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();

      if (listNameInput.trim() === "") {
        toast.error("Nome da lista não pode ser vazio!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      if (verifySameListName(listNameInput)) {
        toast.error("Já existe uma lista com esse nome!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      const newList = {
        name: listNameInput.trim(),
      };

      await createList(newList);
      setListNameInput("");
      const createdList = await findListByName(newList.name);
      lists.push(createdList);
      toast.success("Lista criada com sucesso!");
      closeModal(e);
    } catch (err) {
      console.error(err);
    }
  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 178,
        tolerance: 5,
      },
    })
  );

  return (
    <div className=" flex flex-row flex-nowrap gap-4 overflow-x-auto sm:pt-15 py-4  w-full pt-15">
      <DndContext
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        sensors={sensors}
      >
        {lists.map((list) => (
          <ListComponent
            key={list.id}
            id={list.id}
            name={list.name}
            propTasks={list.tasks}
            refetchLists={refetchLists}
          />
        ))}
        <div className="rounded-md flex flex-col gap-4 min-w-[300px] w-[300px] h-min shrink-0 relative top-2">
          <button
            onClick={(e) => openModal(e)}
            className="w-full flex items-center gap-2  text-white font-semibold text-sm px-3 py-2 rounded-md hover:bg-[#2A2A2A] transition hover:cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black text-base font-bold">
              +
            </div>
            Nova Lista
          </button>
        </div>

        {modal && (
          <div
            className="fixed inset-0 bg-black/90 bg-opacity-50 z-50 flex items-center justify-center text-white"
            onClick={(e) => closeModal(e)}
          >
            <div
              className="bg-[#252628] p-4 rounded shadow-lg w-full max-w-md relative flex flex-col gap-2"
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
      </DndContext>
    </div>
  );
};

export default Board;
