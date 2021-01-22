import React from "react";
import { Grid, Toolbar, makeStyles } from "@material-ui/core";

import { NavLogo } from "./navlogo";
import { NavMenu } from "./navmenu";

const useStyles = makeStyles({
  background: {
    backgroundColor: "red"
  }
});

const Navbar: React.FC = () => {
  const classes = useStyles();

  return (
    <Toolbar className={classes.background}>
      <Grid container justify="space-between">
        <Grid item>
          <NavLogo />
        </Grid>
        <Grid item>
          <NavMenu />
        </Grid>
      </Grid>
    </Toolbar>
  );
};

export default Navbar;
