import React from "react";

interface TaskDateProps {
  date: Date| undefined;
}
// NEAR -> prazo perto de acabar
//MID -> prazo médio
// FAR -> prazo longe
//PAST -> prazo acabou !! :(

const dateMap: Record<string, { bgColor: string; textColor: string }> = {
  NEAR: {
    bgColor: "bg-red-300",
    textColor: "text-red-900",
  },
  MID: {
    bgColor: "bg-yellow-300",
    textColor: "text-yellow-900",
  },
  FAR: {
    bgColor: "bg-green-300",
    textColor: "text-green-900",
  },
  PAST: {
    bgColor: "bg-stone-300",
    textColor: "text-stone-900",
  },
};


const calculateTimeDiff = (date: Date): keyof typeof dateMap => {
  const now = new Date();

  // Zerar horas para comparar apenas datas, não horas/minutos
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const timeDiff = dateOnly.getTime() - nowOnly.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) return "PAST";
  if (daysDiff <= 2) return "NEAR";
  if (daysDiff <= 7) return "MID";
  return "FAR";
};


const TaskDate: React.FC<TaskDateProps> = ({ date }) => {
 
    if(date !=undefined){
        const setDate = new Date(date)
        const status = calculateTimeDiff(setDate)
        const { bgColor, textColor } = dateMap[status];

        return (
          <div className={`text-xs px-2 py-1 rounded-md font-semibold ${bgColor} ${textColor} mx-1 mt-auto`}>
            {setDate.toDateString()}
          </div>
        );


    }
    else{
       return (
          <div className="text-xs px-2 py-1 rounded-md font-semibold bg-gray-300 text-gray-700 mx-1 mt-auto">
            {'Data Indefinida'}
          </div>
        );


    }

 
};

export default TaskDate;
