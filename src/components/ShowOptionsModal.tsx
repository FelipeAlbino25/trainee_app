import React from "react";

interface ShowListOptionsModalProps {
  onClose: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: () => void;
}

const ShowListOptionsModal = ({
  onClose,
  onEdit,
  onDelete,
}: ShowListOptionsModalProps) => {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div
        className="absolute right-0 mt-2 bg-[#2A2A2A] text-white border border-white/10 rounded-md shadow-lg z-50 w-36"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            onEdit(e);
            onClose();
          }}
          className="w-full text-left py-2 hover:bg-white/10 transition text-sm"
          style={{ paddingLeft: "2vh", paddingRight: "2vh" }}
        >
          <img src="./edit.svg" className="h-4 w-4 inline mr-1" />
          Editar
        </button>
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="w-full text-left py-2 hover:bg-white/10 transition text-sm text-red-700"
          style={{ paddingLeft: "2vh", paddingRight: "2vh" }}
        >
          <img src="./delete.png" className="h-4 w-4 inline mr-1" />
          Excluir
        </button>
      </div>
    </>
  );
};

export default ShowListOptionsModal;
