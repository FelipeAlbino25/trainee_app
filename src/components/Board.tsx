import List from "./List";


const Board = ({ lists }: { lists: List[] }) => {
    return (
      <div className="flex gap-4 h-screen overflow-x-auto pt-10">
        {lists.map((list) => (
          <List key={list.id} name={list.name} tasks={list.tasks} />
        ))}
      </div>
    );
  };

  export default Board;