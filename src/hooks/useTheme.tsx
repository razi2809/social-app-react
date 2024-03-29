import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useAppDispatch } from "../REDUX/bigpie";
import { themeActions } from "../REDUX/themeSlice";

const useUserTheme = (run: Boolean) => {
  const dispatch = useAppDispatch();
  const [done, setDone] = useState(false);
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(auth.currentUser?.uid)
      .onSnapshot((doc) => {
        if (doc.data()?.theme) {
          setTheme(doc.data()?.theme);
          setDone(true);
          dispatch(themeActions.setTheme(doc.data()?.theme));
        } else {
          setDone(true);
        }
      });

    return unsubscribe;
  }, [run]);

  return { done, theme };
};

export default useUserTheme;
