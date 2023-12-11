import React, { FC, useEffect, useState } from "react";
import Header from "./header/Header";
import { useAppDispatch } from "../REDUX/bigpie";
import { auth } from "../firebase";
import { authActions } from "../REDUX/authslice";
import LoaderComponent from "./LoaderComponent";
import { chatActions } from "../REDUX/chatSlice";
import { useLocation } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import useUserTheme from "../hooks/useTheme";
type Props = {
  children: React.ReactNode;
};
interface User {
  displayName: string | null;
  photourl: string | null;
  uid: string;
}
const LayoutComponents: FC<Props> = ({ children }) => {
  const { pathname } = useLocation();
  const [show, setShow] = useState(true);
  const isDone = useLogin();
  const theme = useUserTheme(isDone);
  console.log(theme);

  useEffect(() => {
    if (pathname === "/chat" || pathname === "/chat/chatuid") {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [pathname]);
  if (isDone && theme) {
    return (
      <div>
        {show && <Header done={isDone} />}
        <div>{children}</div>
      </div>
    );
  } else return <LoaderComponent />;
};

export default LayoutComponents;
