import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Link, matchPath, useLocation} from "react-router-dom";
import React from "react";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  linkIcon: {
    display: "flex",
    justifyContent: "center",
  },
  linkActive: {
    color: theme.palette.primary.contrastText,
    fontWeight: 'bolder',
  }
}));

const NavItem = ({to, name, icon: Icon, id}) => {
  const classes = useStyles();
  const location = useLocation();

  const active = to ? !!matchPath(location.pathname, { path: to, exact: true }) : false;


  return (
    <ListItem key={id} button component={Link} to={to} selected={active} disableRipple >
      <ListItemIcon
        className={clsx(classes.linkIcon, {
          [classes.linkActive]: active,
        })}
      >
        <Icon />
      </ListItemIcon>
      <ListItemText
        primary={name}
        classes={{
          primary: clsx( {
            [classes.linkActive] : active,
          })
        }}
      />
    </ListItem>
  )
}

export default NavItem;
