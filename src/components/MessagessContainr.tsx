import { Grid } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import MessageTamplate from "./messageTamplate";
import firebase from "firebase/compat/app";
import { useAppSelector } from "../REDUX/bigpie";
import { DocumentReference, doc, onSnapshot } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { db } from "../firebase";

interface Message {
  date: firebase.firestore.Timestamp;
  id: string;
  senderId: string;
  text: string;
  Image?: string;
}
type Props = {
  messages: Message[];
};

const MessagessContainr: FC = () => {
  const chatBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const [searchParams] = useSearchParams();
  const chatId: string = searchParams.get("uid")!;
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const getChat = () => {
      const messageChat = onSnapshot(
        doc(db, "chats", chatId!) as DocumentReference,
        (doc) => {
          doc.exists() && setMessages(doc.data().messages);
        }
      );
      return () => {
        messageChat();
      };
    };
    if (user.isLoggedIn) {
      user.user?.uid && getChat();
    }
  }, [user.isLoggedIn]);

  return (
    <Grid container>
      {messages &&
        messages.length > 0 &&
        messages.map((message) => (
          <MessageTamplate
            message={message}
            key={message.id}
            didISend={message.senderId != chatBuddy.user?.uid ? true : false}
          />
        ))}
    </Grid>
  );
};

export default MessagessContainr;
