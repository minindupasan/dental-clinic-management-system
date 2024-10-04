import React from "react";
import { Button, ButtonProps as NextUIButtonProps } from "@nextui-org/react"; // Import ButtonProps from NextUI
import { NewItemIcon } from "./icons/NewItemIcon";

interface CustomButtonProps extends NextUIButtonProps {
  className?: string; // Add className prop type
}

const ButtonComponent: React.FC<CustomButtonProps> = (props) => {
  return (
    <Button
      {...props}
      className={`border-default-500 text-default-500  ${props.className || ""}`}
      startContent={<NewItemIcon />}
    >
      {props.children}
    </Button>
  );
};

export default ButtonComponent;
