import  { useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";

type ActionButtonsProps<T extends { id: number }> = {
  record: T;
  onEdit: (row: T) => void;
  onDelete: (id: number) => void;
};

const ActionButtons = <T extends { id: number }>({
  record,
  onEdit,
  onDelete,
}: ActionButtonsProps<T>) => {
  const menu = useRef<Menu>(null);

  const items = [
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => onEdit(record),
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: () => onDelete(record.id),
    },
  ];

  return (
    <div>
      <Menu model={items} popup ref={menu} />
      <Button
        icon="pi pi-ellipsis-v"
        className="p-button-rounded p-button-text"
        onClick={(event) => menu.current?.toggle(event)}
      />
    </div>
  );
};

export default ActionButtons;
