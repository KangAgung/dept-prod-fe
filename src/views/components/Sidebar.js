import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Hidden from "@material-ui/core/Hidden";
import { SwipeableDrawer} from "@material-ui/core";
import DrawerContent from "./Drawer";

const Sidebar = (props) => {
  return (
    <nav className={props.classes.drawer} >
      <Hidden smUp >
        <SwipeableDrawer
          anchor={'left'}
          open={props.open}
          onClose={props.drawer}
          onOpen={props.drawer}
          classes={{
            paper: props.classes.drawerPaper,
          }}
        >
          <DrawerContent classes={props.classes} />
        </SwipeableDrawer>
      </Hidden>
      <Hidden xsDown>
        <Drawer
          classes={{
            paper: props.classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <DrawerContent classes={props.classes} />
        </Drawer>
      </Hidden>
    </nav>
  );
}

export default Sidebar;
