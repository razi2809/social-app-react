import React, { FC, useEffect, useState } from "react";
import Header from "./header/Header";
import { useAppDispatch } from "../REDUX/bigpie";
import { auth } from "../firebase";
import { authActions } from "../REDUX/authslice";
import LoaderComponent from "./LoaderComponent";
import { chatActions } from "../REDUX/chatSlice";
import { useLocation } from "react-router-dom";
type Props = {
  children: React.ReactNode;
};
interface User {
  displayName: string | null;
  photourl: string | null;
  uid: string;
}
const LayoutComponents: FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [done, setDone] = useState(false);
  const { pathname } = useLocation();
  const [show, setShow] = useState(true);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(authActions.login(authUser));
        const userJson = localStorage.getItem("User");
        const UserBuddy: User | null = userJson ? JSON.parse(userJson) : null;
        if (UserBuddy) {
          dispatch(chatActions.selectedUser(UserBuddy));
        }
        setDone(true);
      } else {
        setDone(true);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (pathname === "/chat" || pathname === "/chat/chatuid") {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [pathname]);
  if (done) {
    return (
      <div>
        {show && <Header done={done} />}
        <div>{children}</div>
      </div>
    );
  } else return <LoaderComponent />;
};

export default LayoutComponents;
