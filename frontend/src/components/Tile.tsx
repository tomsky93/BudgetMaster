import React from "react";
import { Card } from "primereact/card";
import { Money } from "./Money";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface Props {
  label: string;
  value: number;
  onAdd?: () => void;
}

export const Tile: React.FC<Props> = ({ label, value, onAdd }) => (
  <Card className="relative group bg-white shadow-inner rounded-lg flex flex-col items-center p-2">
    {onAdd && (
      <button
        onClick={onAdd}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity
                   p-1 rounded-full hover:bg-gray-100"
        aria-label={`Add ${label}`}
      >
        <FontAwesomeIcon icon={faPlus} className="w-4 h-4 text-gray-500" />
      </button>
    )}

    <h6 className="text-xl text-gray-600">{label}</h6>
    <div className="text-xl text-gray-800">
      <Money amount={value}/>
    </div>
  </Card>
);
