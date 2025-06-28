import React from "react"
import TaskDate from "./TaskDate";
import Priority from "./Priority"

type Task = {
    id: string;
    name: string;
    description ?: string;
    priority: string;
    expectedFinishDate?: Date;
    listId: string;
}

const Task: React.FC<Task> = ({
    id,
    name,
    description,
    priority,
    expectedFinishDate,
    listId
}) =>{
    return(
        <div className={"border border-stone-300/25 bg-stone-900 text-stone-300  rounded-md flex flex-col items-start gap-1 w-full min-h-[150px] p-2"}>
            <Priority priority={priority} />
            <div>
                <span className={"text-xs font-extrabold px-1"}>
                    {name}
                </span>
            </div>
            <p className="font-sans w-full text-xs px-1 overflow-hidden text-ellipsis break-words font-medium" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {description}
            </p>        
            <TaskDate date={expectedFinishDate}/>
        </div>
    )
}

export default Task;