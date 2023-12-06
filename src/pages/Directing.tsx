import { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../routes/ROUTES";
import { useAppSelector } from "../REDUX/bigpie";
import React from "react";
const Directing = () => {
  const loggedin = useAppSelector((bigPie) => bigPie.authReducer.isLoggedIn);
  const navigate = useNavigate();
  console.log("navigate", ROUTES);
  console.log("loggedin", loggedin);
  //direct the user on open to diffrent route depends on whether he loggin alredy
  useEffect(() => {
    navigate(ROUTES.HOME);
  }, []);
  return <Fragment></Fragment>;
};
export default Directing;
