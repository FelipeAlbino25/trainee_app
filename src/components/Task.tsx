import React, { useState } from "react";
import TaskDate from "./TaskDate";
import Priority from "./Priority";
import { deleteTaskById, updateTaskById } from "../api/endpoints/Task";
import { useDraggable } from "@dnd-kit/core";
import UpdateTaskModal from "./UpdateTaskModal";
import TaskDone from "./TaskDone";
import { toast } from "react-toastify";

type TaskProps = {
  id: string;
  name: string;
  description?: string;
  priority: string;
  expectedFinishDate?: Date;
  listId: string;
  finished: boolean;
  refetchLists: () => Promise<void>;
};

const Task = ({
  id,
  name,
  description,
  priority,
  expectedFinishDate,
  listId,
  finished,
  refetchLists,
}: TaskProps) => {
  //updateTask modal state
  const [modal, setModal] = useState(false);

  //delete confirmation modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  //delete notification state
  const [showDeleteNotification, setShowDeleteNotification] = useState(false);

  //TaskDone.tsx state
  const [isDone, setIsDone] = useState(finished);

  const [nameInput, setNameInput] = useState(name);
  const [descriptionInput, setDescriptionInput] = useState(description ?? "");
  const [priorityInput, setPriorityInput] = useState(priority);
  const [expectedFinishDateInput, setExpectedFinishDateInput] =
    useState(expectedFinishDate);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: {
      listId: listId,
    },
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: 9999,
        position: "relative" as React.CSSProperties["position"],
      }
    : undefined;

  const deleteThisTask = async (e: React.MouseEvent) => {
    e.preventDefault();

    setShowDeleteNotification(true);

    setTimeout(async () => {
      try {
        await deleteTaskById(id);
        refetchLists();
      } catch (err) {
        console.error(err);
      }
    }, 900);
  };

  const handleToggleDone = async (taskId: string) => {
    let toastMessage = isDone
      ? "Tarefa marcada como não concluída!"
      : "Tarefa concluída com sucesso!";

    try {
      const updatedTask = {
        id: taskId,
        name,
        description,
        priority,
        expectedFinishDate,
        listId,
        finished: !isDone,
      };

      await updateTaskById(updatedTask);

      setIsDone((prev) => !prev);
      toast.success(toastMessage);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao concluir a tarefa");
    }
  };

  const handleUpdateTask = async (
    updatedName: string,
    updatedDescription: string,
    updatedPriority: string,
    updatedDate: Date | undefined
  ) => {
    setNameInput(updatedName);
    setDescriptionInput(updatedDescription);
    setPriorityInput(updatedPriority);
    setExpectedFinishDateInput(updatedDate);
  };

  return (
    <>
      <div
        onClick={() => {
          if (!modal) setModal(true);
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
          
          
          p-2 hover:cursor-pointer hover:border-stone-300/60 hover:bg-stone-900/50
          ${transform ? "" : "transition duration-200"}
          `}
      >
        <div className="flex items-center justify-between w-full">
          <Priority priority={priorityInput} />
          <TaskDone taskId={id} done={isDone} onToggleDone={handleToggleDone} />
        </div>
        <div>
          <span className="text-sm font-[1000] px-1">{nameInput}</span>
        </div>
        <p className="tracking-wide w-full text-left text-[10px] text-xs/4 px-1 overflow-hidden text-ellipsis break-words">
          {descriptionInput}
        </p>
        <TaskDate date={expectedFinishDateInput} />
      </div>

      <UpdateTaskModal
        isOpen={modal}
        onClose={() => setModal(false)}
        id={id}
        name={nameInput}
        description={descriptionInput}
        priority={priorityInput}
        expectedFinishDate={expectedFinishDateInput}
        listId={listId}
        finished={isDone}
        refetchLists={refetchLists}
        onUpdateTask={handleUpdateTask}
      />

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
              Tem certeza que deseja excluir a tarefa{" "}
              <span className="text-white font-semibold">"{name}"</span>?
            </h2>

            <p className="text-sm text-stone-400">
              Essa ação não é reversível.
            </p>

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
