"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Listbox,
  ListboxItem,
  cn,
} from "@nextui-org/react";
import {
  EllipsisVertical,
  Trash2,
  UserCog,
  UserMinus,
  UserRoundCog,
  UserRoundMinus,
} from "lucide-react";

export default function App() {
  return (
    <Popover placement="left" showArrow offset={10}>
      <PopoverTrigger>
        <Button color="primary">
          <EllipsisVertical className="text-default-900" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]">
        <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
          <Listbox variant="solid" aria-label="Listbox menu with icons">
            <ListboxItem
              key="edit"
              className="text-foreground-light"
              startContent={<UserRoundCog />}
            >
              Edit file
            </ListboxItem>
            <ListboxItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<UserRoundMinus className={"text-danger"} />}
            >
              Delete file
            </ListboxItem>
          </Listbox>
        </div>
      </PopoverContent>
    </Popover>
  );
}
