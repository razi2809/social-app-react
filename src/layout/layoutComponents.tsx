import React, { FC, useEffect, useState } from "react";
import Header from "./header/Header";
import { useAppDispatch } from "../REDUX/bigpie";
import { auth } from "../firebase";
import { authActions } from "../REDUX/authslice";
type Props = {
  children: React.ReactNode;
};
const LayoutComponents: FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [done, setDone] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(authActions.login(authUser));
        setDone(true);
      } else {
        setDone(true);
      }
    });
    return unsubscribe;
  }, []);
  return (
    <div>
      <Header done={done} />
      <div>{children}</div>
    </div>
  );
};

export default LayoutComponents;
