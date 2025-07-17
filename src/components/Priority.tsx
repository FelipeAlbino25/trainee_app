import React from "react";

interface PriorityProps {
  priority: string;
}

const priorityMap: Record<
  string,
  { bgColor: string; textColor: string; label: string }
> = {
  LOW: {
    bgColor: "bg-[#46F7B7]",
    textColor: "text-green-900",
    label: "Baixa Prioridade",
  },
  MEDIUM: {
    bgColor: "bg-[#F5EB88]",
    textColor: "text-yellow-900",
    label: "Média Prioridade",
  },
  HIGH: {
    bgColor: "bg-[#FFA775]",
    textColor: "text-orange-900",
    label: "Alta Prioridade",
  },
  VERY_HIGH: {
    bgColor: "bg-[#F27F77]",
    textColor: "text-red-900",
    label: "Altíssima Prioridade",
  },
  DEFAULT: {
    bgColor: "bg-stone-600",
    textColor: "text-stone-900",
    label: "Não definida",
  },
};

const Priority = ({ priority }: PriorityProps) => {
  const { bgColor, textColor, label } = priorityMap[priority] || priorityMap.DEFAULT;

  return (
    <div className={`${bgColor} ${textColor} font-black ml-1 mt-1 p-1 rounded-md flex items-center
          max-h-[20px]
          max-w-[150px]
          text-[12px]
        
            max-[1280px]:text-[12px]

            
            max-[1024px]:text-[9px]
           

            max-[768px]:max-w-[100px]
            max-[768px]:text-[8px]

            max-[640px]:max-w-[80px]
            max-[640px]:text-[9px]
            max-[640px]:max-h-[16px]

            max-[500px]:text-[7px]
            
             transition-all duration-300 ease-in-out relative
    `}>
      <p >{label}</p>
    </div>
  );
};

export default Priority;
