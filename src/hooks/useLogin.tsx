import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { authActions } from "../REDUX/authslice";
import { User } from "firebase/auth";
import { chatActions } from "../REDUX/chatSlice";
import { useAppDispatch } from "../REDUX/bigpie";
import useUserTheme from "./useTheme";
import getChatBuddy from "../REDUX/getChatUserFromLocal";

interface Props extends User {
  photourl: string | null;
}

const useLogin = () => {
  const dispatch = useAppDispatch();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const chatBuddUid = localStorage.getItem("userUid");

    const chatBuddy = async () => {
      if (chatBuddUid) {
        const chatBuddy = await getChatBuddy(chatBuddUid);
        if (chatBuddy) {
          dispatch(chatActions.selectedUser(chatBuddy));
        }
      }
    };
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(authActions.login(authUser));
        chatBuddy();

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
