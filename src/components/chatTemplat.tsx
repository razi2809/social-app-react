import { Grid } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { DocumentReference, doc, onSnapshot } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { db, storage } from "../firebase";
import MessagessContainr from "./MessagessContainr";
import { chatActions } from "../REDUX/chatSlice";
import { useAppDispatch, useAppSelector } from "../REDUX/bigpie";
import firebase from "firebase/compat/app";
import LoaderComponent from "../layout/LoaderComponent";
import ChatInput from "./ChatInput";

interface Chat {
  date: firebase.firestore.Timestamp;
  lastMessage: {
    text: string;
  };
  userInfo: {
    displayName: string;
    photourl: string;
    uid: string;
  };
}
const ChatTemplat = () => {
  const chatBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const [chatInfo, setChatInfo] = useState<Chat[]>([]);
  const [searchParams] = useSearchParams();
  const chatId: string = searchParams.get("uid")!;

  const dispatch = useAppDispatch();
  let res: Chat;
  useEffect(() => {
    const getChat = () => {
      const unsub = onSnapshot(
        doc(db, "userchats", user.user?.uid!) as DocumentReference,
        (doc) => {
          for (let item of Object.entries(doc.data() || {})) {
            if (item[0] === chatId) {
              res = item[1];
              setChatInfo([item[1]]);
              dispatch(chatActions.selectedUser(res.userInfo));
            }
          }
        }
      );
      return () => {
        unsub();
      };
    };
    if (user.isLoggedIn) {
      user.user?.uid && getChat();
    }
  }, [user.isLoggedIn]);

  if (chatBuddy.user) {
    return (
      <Fragment>
        <Grid container>
          <Grid item container md={4}>
            {chatInfo.length > 0 && <ChatInput chatInfo={chatInfo} />}
          </Grid>
        </Grid>{" "}
        <MessagessContainr />
      </Fragment>
    );
  } else {
    return <LoaderComponent />;
  }
};

export default ChatTemplat;
