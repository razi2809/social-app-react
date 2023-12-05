import { Grid, Typography } from "@mui/material";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "../firebase";
import MessageTamplate from "./messageTamplate";

const MessagessContainr = () => {
  const [messages, setMessages] = useState([]);
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("uid");
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return () => {
      unsub();
    };
  }, [chatId]);
  return (
    <Grid container>
      {messages.length > 0 &&
        messages.map((message) => (
          <MessageTamplate message={message} key={message.id} />
        ))}
    </Grid>
  );
};

export default MessagessContainr;
