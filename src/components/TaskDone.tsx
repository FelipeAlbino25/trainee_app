type TaskDoneProps = {
  taskId: string;
  done: boolean;
  onToggleDone: (taskId: string) => void;
};

const TaskDone = (TaskDoneProps: TaskDoneProps) => {
  const { done, taskId, onToggleDone } = TaskDoneProps;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleDone(taskId);
  };

  return done ? (
    <button
      className="flex items-center gap-1 hover:cursor-pointer rounded-md"
      onClick={handleToggle}
    >
      <img
        src="./checked.svg"
        className="w-6 h-6 border border-dashed rounded-full border-green-700"
      />
      <span className=" text-[14px] text-green-700 font-semibold">
        Finalizada
      </span>
    </button>
  ) : (
    <button
      className="flex items-center gap-1 hover:cursor-pointer"
      onClick={handleToggle}
    >
      <img
        src="./check.svg"
        className="w-6 h-6 border border-dashed rounded-full"
      />
      <span className="text-[14px] font-semibold">Finalizar</span>
    </button>
  );
};

export default TaskDone;
