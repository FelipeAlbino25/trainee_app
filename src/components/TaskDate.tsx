import React from "react";

interface TaskDateProps {
  date: Date | undefined;
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
  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const timeDiff = dateOnly.getTime() - nowOnly.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) return "PAST";
  if (daysDiff <= 2) return "NEAR";
  if (daysDiff <= 7) return "MID";
  return "FAR";
};

const TaskDate: React.FC<TaskDateProps> = ({ date }) => {
  if (date != undefined) {
    const setDate = new Date(date);
    const status = calculateTimeDiff(setDate);
    const { bgColor, textColor } = dateMap[status];

    return (
      <div
        className={`items-center text-xs px-2 py-1 rounded-md font-bold ${bgColor} ${textColor} mx-1 mt-auto flex gap-2
          text-[12px]
          h-[18px]

            max-[1280px]:max-w-[150px]
            max-[1280px]:max-h-[18px]
            max-[1280px]:text-[11px]

            max-[1024px]:max-w-[120px]
            max-[1024px]:text-[9px]
            max-[1024px]:max-h-[20px]

            max-[768px]:max-w-[100px]
            max-[768px]:text-[8px]

            max-[640px]:max-w-[80px]
            max-[640px]:text-[9px]
            max-[640px]:max-h-[16px]

            max-[500px]:text-[7px]
            
             transition-all duration-300 ease-in-out relative
          
          `}
      >
        <img
          src="./calendar.svg"
          className="
            max-h-4
            max-w-4
            max-[1024px]:h-4
            max-[1024px]:w-4

            max-[768px]:h-3
            max-[768px]:w-3

            max-[640px]:w-3
            max-[640px]:h-3

            max-[500px]:w-2
            max-[500px]:h-2
            "
        />
        {setDate.toLocaleDateString()}
      </div>
    );
  } else {
    return (
      <div
        className="text-xs px-2 py-1 rounded-md font-semibold bg-gray-300 text-gray-700 mx-1 mt-auto
          text-[10px]
          h-[18px]

            max-[1280px]:max-w-[150px]
            max-[1280px]:max-h-[18px]
            max-[1280px]:text-[10px]

            max-[1024px]:max-w-[120px]
            max-[1024px]:text-[9px]
            max-[1024px]:max-h-[20px]

            max-[768px]:max-w-[100px]
            max-[768px]:text-[8px]

            max-[640px]:max-w-[80px]
            max-[640px]:text-[9px]
            max-[640px]:max-h-[16px]

            max-[500px]:text-[7px]
            
             transition-all duration-300 ease-in-out relative
          "
      >
        {"Data Indefinida"}
      </div>
    );
  }
};

export default TaskDate;
