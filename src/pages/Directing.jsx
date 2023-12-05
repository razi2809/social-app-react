import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../routes/ROUTES";
import { useSelector } from "react-redux";
const Directing = () => {
  const loggedin = useSelector((bigPie) => bigPie.authReducer.isLoggedIn);
  const navigate = useNavigate();
  console.log("navigate", ROUTES);
  console.log("loggedin", loggedin);
  //direct the user on open to diffrent route depends on whether he loggin alredy
  useEffect(() => {
    navigate(ROUTES.HOME);
  }, []);
};
export default Directing;
