import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Header";
import { useEffect } from "react";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { authActions } from "./REDUX/authslice";
import Header from "./components/Header";
import PostsPage from "./pages/PostsPage";
import Router from "./routes/router";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(authActions.login(authUser));
      } else {
        dispatch(authActions.logout());
      }
    });
    return unsubscribe;
  }, []);
  console.log("user", auth.currentUser);
  return (
    <div className="app">
      <Header />
      <Router />
    </div>
  );
}

export default App;
