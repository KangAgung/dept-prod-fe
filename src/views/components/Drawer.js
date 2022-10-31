import React from "react";
import { List } from "@material-ui/core";
import {
  Description,
  Assignment
} from "@material-ui/icons";
import NavItem from "./NavItem";

const Drawer = (props) => {

  return (
    <div>
      <div className={props.classes.toolbar} />
      <List>
        <NavItem name={"Daftar Transaksi"} key={1} icon={Description} to={"/"} />
        <NavItem name={"Form Input"} key={2} icon={Assignment} to={"/form"} />
      </List>
    </div>
  );
};

export default Drawer;
