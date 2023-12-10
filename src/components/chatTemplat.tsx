import { Box, Grid } from "@mui/material";
import React, { Fragment, memo, useEffect, useState } from "react";
import { DocumentReference, doc, onSnapshot } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { db, storage } from "../firebase";
import MessagessContainr from "./MessagessContainr";
import { chatActions } from "../REDUX/chatSlice";
import { useAppDispatch, useAppSelector } from "../REDUX/bigpie";
import firebase from "firebase/compat/app";
import LoaderComponent from "../layout/LoaderComponent";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";

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
interface Message {
  date: firebase.firestore.Timestamp;
  id: string;
  senderId: string;
  text: string;
  Image?: string;
}

const ChatTemplat = () => {
  const chatBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const [chatInfo, setChatInfo] = useState<Chat[]>([]);
  const [searchParams] = useSearchParams();
  const chatId: string = searchParams.get("uid")!;
  const [messages, setMessages] = useState<Message[]>([]);
  const [done, setDone] = useState(false);
  let res: Chat;
  useEffect(() => {
    const getChat = async () => {
      const unsub = await onSnapshot(
        doc(db, "userchats", user.user?.uid!) as DocumentReference,
        (doc) => {
          for (let item of Object.entries(doc.data() || {})) {
            if (item[0] === chatId) {
              res = item[1];
              setChatInfo([item[1]]);
            }
          }
        }
      );
      const messageChat = await onSnapshot(
        doc(db, "chats", chatId!) as DocumentReference,
        (doc) => {
          doc.exists() && setMessages(doc.data().messages);
          setDone(true);
        }
      );
      return () => {
        unsub();
        messageChat();
      };
    };
    if (user.isLoggedIn) {
      user.user?.uid && getChat();
      setDone(false);
    }
  }, [user.isLoggedIn, chatId]);

  if (chatBuddy.user && done) {
    return (
      <Box>
        <Box>
          {" "}
          {messages.length > 0 && <MessagessContainr messages={messages} />}
        </Box>
      </Box>
    );
  } else {
    return <LoaderComponent />;
  }
};

export default ChatTemplat;
