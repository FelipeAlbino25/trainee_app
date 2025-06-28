import List from "./List";


const Board = ({ lists }: { lists: List[] }) => {
    return (
      <div className="flex gap-4  overflow-x-auto pt-10">
        {lists.map((list) => (
          <List key={list.id} name={list.name} propTasks={list.tasks} />
        ))}
      </div>
    );
  };

  export default Board;