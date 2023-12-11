import { Box, Grid } from "@mui/material";
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
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

const MessagessContainr: FC<Props> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <Box className="message-list">
      {messages.map((m, index) => (
        <div
          key={m.id}
          ref={index === messages.length - 1 ? messagesEndRef : null}
        >
          <MessageTamplate
            message={m}
            didISend={m.senderId != chatBuddy.user?.uid ? true : false}
            user={user.user}
          />
        </div>
      ))}
    </Box>
  );
};

export default MessagessContainr;
