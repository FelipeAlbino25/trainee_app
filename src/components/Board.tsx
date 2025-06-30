import ListComponent from "./List";
import type{ List } from '../types/List';


const Board = ({ lists }: { lists: List[] }) => {
    return (
      <div className="flex gap-4  overflow-x-auto pt-10">
        {lists.map((list) => (
          <ListComponent key={list.id} id={list.id} name={list.name} propTasks={list.tasks}/>
        ))}
      </div>
    );
  };

  export default Board;