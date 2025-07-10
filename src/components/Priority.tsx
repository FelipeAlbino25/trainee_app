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
    <div className={`${bgColor} ${textColor} font-black ml-1 mt-3 p-1 rounded-md`}>
      <p className="text-xs">{label}</p>
    </div>
  );
};

export default Priority;
