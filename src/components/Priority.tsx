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
  const { bgColor, textColor, label } =
    priorityMap[priority] || priorityMap.DEFAULT;

  return (
    <div
      className={`${bgColor} ${textColor} font-black ml-1 mt-1 p-1 rounded-md justify-center flex items-center
          max-h-[25px]
          w-[135px]
          text-[12px]
        
            max-[1280px]:text-[12px]
            max-[1280px]:max-w-[135px]
            
            max-[1024px]:text-[11px]
            max-[1024px]:max-h-[22px]
           

            max-[768px]:max-w-[120px]
            max-[768px]:max-h-[20px]
            max-[768px]:text-[10px]
            max-[768px]:max-w-[90px]

            max-[640px]:max-w-[110px]
            max-[640px]:text-[9px]
            max-[640px]:max-h-[16px]

            max-[500px]:text-[9px]
            max-[500px]:max-w-[105px]
            max-[500px]:font-extrabold
             transition-all duration-300 ease-in-out relative
    `}
    >
      <p>{label}</p>
    </div>
  );
};

export default Priority;
