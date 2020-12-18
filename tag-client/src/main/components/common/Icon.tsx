import React from "react";
import { Icon as MUIIcon } from "@material-ui/core";

interface IconProps {
  name: string;
}

const Icon: React.FC<IconProps> = ({ name }) => {
  return <MUIIcon>{name}</MUIIcon>;
};

export default Icon;
