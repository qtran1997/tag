import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Menu, MenuItem, Typography } from "@material-ui/core";

import { Icon } from "tag-client/components/common";

const NavMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button aria-label="nav-menu-button" onClick={handleClick}>
        <Icon name="menu" />
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <Link to="/profile/@me">
          <MenuItem onClick={handleClose}>
            <Typography variant="subtitle1">My Profile</Typography>
          </MenuItem>
        </Link>
        <Link to="/account">
          <MenuItem onClick={handleClose}>
            <Typography variant="subtitle1">My Account</Typography>
          </MenuItem>
        </Link>
        <MenuItem onClick={handleClose}>
          <Typography variant="subtitle1">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default NavMenu;
