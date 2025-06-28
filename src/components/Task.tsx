import React, { useState } from "react";
import TaskDate from "./TaskDate";
import Priority from "./Priority";

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

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModal(true);
  };

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModal(false);
  };

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
        <div className="fixed inset-0 bg-black/90 bg-opacity-50 z-50 flex items-center justify-center">
          <div
            className="bg-white p-4 rounded shadow-lg w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-black font-bold">Editar Tarefa</h2>
          </div>
        </div>
      )}
    </>
  );
};

export default Task;
