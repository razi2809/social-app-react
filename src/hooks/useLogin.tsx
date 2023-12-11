import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { authActions } from "../REDUX/authslice";
import { User } from "firebase/auth";
import { chatActions } from "../REDUX/chatSlice";
import { useAppDispatch } from "../REDUX/bigpie";
import useUserTheme from "./useTheme";

interface Props extends User {
  photourl: string | null;
}

const useLogin = () => {
  const dispatch = useAppDispatch();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(authActions.login(authUser));
        const userJson = localStorage.getItem("User");
        const UserBuddy: Props | null = userJson ? JSON.parse(userJson) : null;
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
  return done;
};

export default useLogin;
