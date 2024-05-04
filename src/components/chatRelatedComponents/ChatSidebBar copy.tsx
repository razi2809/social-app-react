import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { db } from "../../firebase";
import { Box, Drawer, Typography } from "@mui/material";
import {
  DocumentReference,
  Timestamp,
  DocumentData,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import { useNavigate, useSearchParams } from "react-router-dom";
import { chatActions } from "../../REDUX/chatSlice";
import { useAppDispatch, useAppSelector } from "../../REDUX/bigpie";
import LoaderComponent from "../../layout/LoaderComponent";
import DisplayUser from "../userRelatedComponents/DisplayUser";
import DisplayUserChats from "../userRelatedComponents/DisplayUserChats";
import ChatHeader from "./ChatHeader";
import useGetChats from "../../hooks/useGetChats";

interface ChatUser {
  displayName: string | null;
  photourl: string | null;
  uid: string;
  timestamp: Timestamp;
}
interface User {
  avatar: string;
  displayName: string;
  uid: string;
  timestamp: Timestamp;
}

type ChatInfo = {
  date: firebase.firestore.Timestamp;
  lastMessage: {
    text: string;
  };
  userInfo: {
    photourl: string;
    uid: string;
    displayName: string;
    timestamp: Timestamp;
  };
};
type ChatData = {
  [key: string]: ChatInfo;
};
interface Props {
  chatId: string;
}
const ChatSideBarDemo: FC<Props> = ({ chatId }) => {
  const { users, chats, done, openChat, handleClick, isHeChattingWithAll } =
    useGetChats();
  const [isHeWantNewChat, setIsHeWantNewChat] = useState(false);
  const userBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const MemoDisplayUsers = memo(DisplayUser);

  if (done) {
    return (
      <Box sx={{ width: "100%" }}>
        <ChatHeader
          isHeWantNewChat={isHeWantNewChat}
          setIsHeWantNewChat={setIsHeWantNewChat}
          isThereUserWithoutChat={isHeChattingWithAll}
        />
        <Box>
          <Box
            sx={{
              width: "100%",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              variant="h6"
              color="text.hover"
              component="p"
              textAlign={"center"}
            >
              Existing Chats
            </Typography>
          </Box>
          <TransitionGroup>
            {chats &&
              chats.map((chat) => {
                const key = Object.keys(chat)[0];

                return (
                  <CSSTransition key={key} timeout={500} classNames="item">
                    <DisplayUserChats
                      chats={chat[key]}
                      chatIsOpen={key === chatId}
                      key={key}
                      id={key}
                      handleOpenChat={() => openChat(key, chat[key].userInfo)}
                    />
                  </CSSTransition>
                );
              })}
          </TransitionGroup>
          <TransitionGroup>
            {!isHeChattingWithAll && isHeWantNewChat && (
              <CSSTransition timeout={500} classNames="item">
                <Box
                  sx={{
                    width: "100%",
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.hover"
                    component="p"
                    textAlign={"center"}
                  >
                    User's whom you don't have chat with
                  </Typography>
                </Box>
              </CSSTransition>
            )}{" "}
          </TransitionGroup>

          <TransitionGroup>
            {isHeWantNewChat &&
              users.map((userExist) => {
                const doesHeHaveChat = chats.some((chat) =>
                  Object.keys(chat)[0].includes(userExist.uid)
                );
                const alreadyChattingWithHim =
                  userExist.uid === userBuddy.user?.uid || "";
                if (!alreadyChattingWithHim) {
                  if (!doesHeHaveChat) {
                    return (
                      <CSSTransition
                        key={userExist.uid}
                        timeout={500}
                        classNames="item"
                      >
                        <MemoDisplayUsers
                          user={userExist}
                          display={userExist.uid !== user.user?.uid}
                          handleOpenChat={() => handleClick(userExist)}
                        />
                      </CSSTransition>
                    );
                  }
                }
                return null;
              })}
          </TransitionGroup>
        </Box>
      </Box>
    );
  } else {
    return <LoaderComponent />;
  }
};

export default ChatSideBarDemo;
