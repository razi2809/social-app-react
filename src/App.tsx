import "./App.css";
import { useEffect } from "react";
import { auth } from "./firebase";
import { authActions } from "./REDUX/authslice";
import Header from "./layout/header/Header";
import Router from "./routes/router";
import { useAppDispatch } from "./REDUX/bigpie";
import React from "react"; // Add import statement for React
import LayoutComponents from "./layout/layoutComponents";

const App = () => {
  console.log("App");

  /*   const dispatch = useAppDispatch();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(authActions.login(authUser));
        console.log("authUser", authUser);
      } else {
        console.log("noauthUser");
      }
    });
    return unsubscribe;
  }, []); */

  return (
    <div className="app">
      <Router />
    </div>
  );
};

export default App;
