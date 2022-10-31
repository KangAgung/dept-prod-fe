import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@material-ui/core";
import {
  Menu as MenuIcon
} from "@material-ui/icons";

const NavBar = (props) => {

  return (
    <AppBar position="fixed" elevation={1} className={props.classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={props.drawer}
          className={props.classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography component="h1" variant="h5" noWrap className={props.classes.title}>
          Dept. Produksi
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
