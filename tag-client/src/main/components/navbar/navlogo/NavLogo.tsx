import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";

const NavLogo: React.FC = () => {
  return (
    <Link aria-label="home-button" to="/">
      <Typography variant="h6">TAG</Typography>
    </Link>
  );
};

export default NavLogo;
