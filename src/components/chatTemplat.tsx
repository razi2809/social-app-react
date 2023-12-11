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
  const [searchParams] = useSearchParams();
  const chatId: string = searchParams.get("uid")!;
  const [messages, setMessages] = useState<Message[]>([]);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const getChat = async () => {
      const messageChat = await onSnapshot(
        doc(db, "chats", chatId!) as DocumentReference,
        (doc) => {
          doc.exists() && setMessages(doc.data().messages);
          setDone(true);
        }
      );
      return () => {
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
        {" "}
        {messages.length > 0 && <MessagessContainr messages={messages} />}
      </Box>
    );
  } else {
    return <LoaderComponent />;
  }
};

export default ChatTemplat;
