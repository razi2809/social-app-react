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
  return (
    <div className="app">
      <Router />
    </div>
  );
};

export default App;
