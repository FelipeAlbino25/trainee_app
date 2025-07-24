// src/components/DeleteListModal.tsx
import React, { useState } from "react";
import { deleteListById } from "../api/endpoints/List";
import { toast } from "react-toastify";

interface DeleteListModalProps {
  listId: string;
  listName: string;
  taskCount: number;
  onClose: () => void;
  refetchLists: () => Promise<void>;
  setDeleteMessage: (msg: string) => void;
}

const DeleteListModal: React.FC<DeleteListModalProps> = ({
  listId,
  listName,
  taskCount,
  onClose,
  refetchLists,
  setDeleteMessage,
}) => {
  const [allowCascadeDelete, setAllowCascadeDelete] = useState(false);

  const onConfirmDeleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setAllowCascadeDelete(inputValue.toLowerCase() === listName.toLowerCase());
  };

  const deleteThisList = async () => {
    setDeleteMessage("Lista Excluída com Sucesso!");
    setTimeout(async () => {
      try {
        await deleteListById(listId);
        refetchLists();
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir a lista.");
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center">
      <div className="relative bg-[#252628] border border-white/10 p-5 rounded-xl shadow-lg flex flex-col gap-3 max-w-xs w-full mx-4 text-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-red-400 text-xl font-bold hover:bg-red-900/20 rounded-full transition"
        >
          &times;
        </button>
        <h2 className="text-base font-bold m-3">
          Tem certeza que deseja excluir a lista{" "}
          <span className="block text-white font-semibold">"{listName}"?</span>
        </h2>
        <p className="text-sm text-stone-400">Essa ação não é reversível.</p>

        {taskCount === 0 ? (
          <button
            onClick={() => {
              deleteThisList();
              onClose();
            }}
            className="hover:ring-1 ring-red-500/30 p-2 rounded-md justify-center mt-2 flex items-center gap-2 text-[#C10000] font-semibold text-sm hover:cursor-pointer transition duration-100"
          >
            <img src="./delete.png" alt="Trash icon" className="w-4 h-4" />
            Excluir
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder={`Digite "${listName}"`}
              className="text-md items-center p-2 rounded text-white bg-transparent border border-white"
              onChange={onConfirmDeleteChange}
            />
            <button
              disabled={!allowCascadeDelete}
              onClick={() => {
                deleteThisList();
                onClose();
              }}
              className={`${
                allowCascadeDelete
                  ? "hover:ring-1 ring-red-500/30 text-[#C10000] hover:cursor-pointer"
                  : "text-gray-500 cursor-not-allowed"
              } p-2 rounded-md justify-center mt-2 flex items-center gap-2 font-semibold text-sm transition duration-100`}
            >
              <img src="./delete.png" alt="Trash icon" className="w-4 h-4" />
              Excluir
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteListModal;
