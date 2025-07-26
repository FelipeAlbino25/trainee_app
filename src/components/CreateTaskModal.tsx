import { useState } from "react";
import { createTask } from "../api/endpoints/Task";
import { Bounce, toast } from "react-toastify";

type CreateTaskModalProps = {
  listId: string;
  refetchLists: () => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
};
const CreateTaskModal = (CreateTaskModalProps: CreateTaskModalProps) => {
  const { listId, refetchLists, isOpen, onClose } = CreateTaskModalProps;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState("");

  const buildDateAtMidnightLocal = (yyyyMmDd: string) => {
    const [year, month, day] = yyyyMmDd.split("-").map(Number);
    return new Date(year, month - 1, day, 0, 0, 0);
  };

  const handleCreateTask = async () => {
    try {
      let newDate = null;
      if (date !== "") {
        const localDate = buildDateAtMidnightLocal(date);
        newDate = localDate;
      }

      const newTask = {
        name: title,
        description,
        priority,
        expectedFinishDate: newDate,
        listId: listId,
        finished: false,
      };

      await createTask(newTask);

      onClose();
      setTitle("");
      setDate("");
      setDescription("");
      setPriority("");
      await refetchLists();
      toast.success("Tarefa criada com sucesso!");
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

  return (
    <>
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className=" absolute inset-0 bg-black/80" onClick={onClose}></div>
        <div
          className={`fixed top-16 right-0 h-full w-full max-w-md bg-[#252628] p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } flex flex-col gap-2`}
        >
          <button
            onClick={onClose}
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
              onClick={() => handleCreateTask()}
              className="bg-white hover:bg-black hover:text-white transition duration-300 hover:cursor-pointer text-black font-semibold py-2 rounded"
              style={{ paddingLeft: "4vh", paddingRight: "4vh" }}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTaskModal;
