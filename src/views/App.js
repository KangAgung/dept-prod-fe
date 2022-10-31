import React, {useState} from 'react';
import { HashRouter, Route, Switch } from "react-router-dom";
import {CssBaseline} from "@material-ui/core";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import HomeStyles from "./styles/home.styles";
import DaftarTransaksi from "./pages/DaftarTransaksi";
import FormInput from "./pages/FormInput";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const classes = HomeStyles();

  return (
    <>
      <CssBaseline />
      <HashRouter>
        <NavBar classes={classes} drawer={handleDrawerToggle} />
        <Sidebar classes={classes} open={mobileOpen} drawer={handleDrawerToggle} />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route path={'/form'}>
              <FormInput/>
            </Route>
            <Route path={'/'}>
              <DaftarTransaksi/>
            </Route>
          </Switch>
        </main>
      </HashRouter>
    </>
  );
}

export default App;
