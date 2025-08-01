import { useEffect, useState } from "react";
import { deleteTaskById, updateTaskById } from "../api/endpoints/Task";
import { toast, Bounce } from "react-toastify";

type UpdateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  name: string;
  description?: string;
  priority: string;
  expectedFinishDate?: Date;
  listId: string;
  finished: boolean;
  refetchLists: () => Promise<void>;
  onUpdateTask: (
    name: string,
    description: string,
    priority: string,
    expectedFinishDate?: Date
  ) => void;
};

const UpdateTaskModal = ({
  isOpen,
  onClose,
  id,
  name,
  description,
  priority,
  expectedFinishDate,
  listId,
  finished,
  onUpdateTask,
  refetchLists,
}: UpdateTaskModalProps) => {
  const [nameInput, setNameInput] = useState(name);
  const [descriptionInput, setDescriptionInput] = useState(description ?? "");
  const [priorityInput, setPriorityInput] = useState(priority);
  const [expectedFinishDateInput, setExpectedFinishDateInput] = useState(
    expectedFinishDate ? expectedFinishDate.toISOString().split("T")[0] : ""
  );

  useEffect(() => {
    if (isOpen) {
      setNameInput(name);
      setDescriptionInput(description ?? "");
      setPriorityInput(priority);
      setExpectedFinishDateInput(
        expectedFinishDate ? expectedFinishDate.toISOString().split("T")[0] : ""
      );
    }
  }, [isOpen, name, description, priority, expectedFinishDate]);

  const buildDateAtMidnightLocal = (yyyyMmDd: string) => {
    const [year, month, day] = yyyyMmDd.split("-").map(Number);
    return new Date(year, month - 1, day, 0, 0, 0);
  };

  const fieldsChanged = () => {
    const originalDate = expectedFinishDate
      ? expectedFinishDate.toISOString().split("T")[0]
      : "";
    return (
      nameInput !== name ||
      descriptionInput !== (description ?? "") ||
      priorityInput !== priority ||
      expectedFinishDateInput !== originalDate
    );
  };

  const close = (e: React.MouseEvent) => {
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
                  onClose();
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
          autoClose: 2000,
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
      onClose();
    }
  };

  const updateTask = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const newDate = expectedFinishDateInput
        ? buildDateAtMidnightLocal(expectedFinishDateInput)
        : undefined;

      const newTask = {
        id,
        name: nameInput,
        description: descriptionInput,
        priority: priorityInput,
        expectedFinishDate: newDate,
        listId,
        finished: finished,
      };
      await updateTaskById(newTask);
      onUpdateTask(nameInput, descriptionInput, priorityInput, newDate);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar a tarefa. Verifique os campos.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const deleteTask = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await deleteTaskById(id);
      await refetchLists();
      toast.success("Tarefa excluída com sucesso!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir a tarefa");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/80" onClick={close}></div>

      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          fixed top-16 right-0 h-full w-full max-w-md bg-[#252628] p-4 shadow-lg 
          transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          flex flex-col gap-2 overflow-y-auto text-white
        `}
      >
        <button
          onClick={close}
          className="fixed top-2 right-2 text-black text-xl hover:text-red-400 font-extrabold transition duration-200 hover:cursor-pointer px-2 hover:bg-red-900/20 rounded-full"
        >
          &times;
        </button>

        <input
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          type="text"
          className="p-2 mt-8 text-xl w-full hover:ring-slate-200/10 hover:ring-2 rounded-md transition duration-200 focus:ring-2 focus:ring-white/20 focus:outline-none"
        />

        <div className="flex items-center gap-2 mt-4">
          <label className="text-sm font-semibold">Prioridade:</label>
          <select
            value={priorityInput}
            onChange={(e) => setPriorityInput(e.target.value)}
            className="ring-1 ring-slate-100/5 rounded-md p-2 ml-auto bg-transparent text-white border border-white/10 hover:ring-2 hover:ring-slate-200/10 transition duration-200"
          >
            <option value="LOW">Baixa Prioridade</option>
            <option value="MEDIUM">Média Prioridade</option>
            <option value="HIGH">Alta Prioridade</option>
            <option value="VERY_HIGH">Altíssima Prioridade</option>
          </select>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <label className="text-sm font-semibold">Data de Entrega:</label>
          <input
            type="date"
            value={expectedFinishDateInput}
            onChange={(e) => setExpectedFinishDateInput(e.target.value)}
            className="hover:cursor-pointer p-2 ring-1 ml-auto ring-slate-100/10 hover:ring-2 hover:ring-slate-200/10 rounded-md transition duration-200 focus:ring-2 focus:ring-white/20 focus:outline-none"
          />
        </div>

        <p className="justify-left flex mt-3">Descrição:</p>
        <textarea
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          className="p-2 min-h-[100px] resize-y rounded-md ring-1 ring-slate-100/10 hover:ring-slate-200/10 hover:ring-2 transition duration-200 focus:ring-2 focus:ring-white/20 focus:outline-none bg-transparent text-white"
        />

        <div className="flex gap-2">
          <button
            onClick={(e) => updateTask(e)}
            className="mt-4 w-[100%] py-2 bg-white text-black font-bold rounded-xl hover:bg-black hover:cursor-pointer hover:text-white transition duration-300"
          >
            Atualizar
          </button>
          <button
            onClick={(e) => deleteTask(e)}
            className="mt-4 w-[100%] py-2 bg-white text-black font-bold rounded-xl hover:bg-black hover:text-white transition duration-300 hover:cursor-pointer"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTaskModal;
