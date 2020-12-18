import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HomeView } from "./components/home";
import { Navbar } from "./components/navbar";

const Main: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <HomeView />
        </Route>
      </Switch>
    </Router>
  );
};

export default Main;
