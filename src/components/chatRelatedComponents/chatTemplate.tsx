import { Box, Typography } from "@mui/material";
import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { DocumentReference, doc, onSnapshot } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { db } from "../../firebase";
import MessagessContainr from "./MessagessContainr";
import { useAppSelector } from "../../REDUX/bigpie";
import firebase from "firebase/compat/app";
import LoaderComponent from "../../layout/LoaderComponent";
import ChatInput from "./ChatInput";
import ChatBuddyHeader from "./chatBuddyHeader";
import MessagessContainrtest from "./MessagessContainrtest";
import useGetChats from "../../hooks/useGetChats";
import DisplayUser from "../userRelatedComponents/DisplayUser";
import DisplayUserChats from "../userRelatedComponents/DisplayUserChats";
import DisplayUserChatsSmallScreen from "../userRelatedComponents/DisplayUserChatsSmallScreen";
import DisplayUserSmallScreen from "../userRelatedComponents/DisplayUserSmallScreen";

interface Message {
  date: firebase.firestore.Timestamp;
  id: string;
  senderId: string;
  text: string;
  Image?: string;
}

const ChatTemplate = () => {
  const MemoChatInput = memo(ChatInput);
  const chatBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const [searchParams] = useSearchParams();
  const chatId: string = searchParams.get("uid")!;
  const [messages, setMessages] = useState<Message[]>([]);
  const [done, setDone] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const {
    users,
    chats,
    done: doneGetstheChats,
    openChat,
    handleClick,
    isHeChattingWithAll,
  } = useGetChats();
  const [isHeWantNewChat, setIsHeWantNewChat] = useState(false);
  const userBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const MemoDisplayUsers = memo(DisplayUserSmallScreen);

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
        }}
        ref={parentRef}
      >
        <Box
          sx={{
            top: 0,
            zIndex: 1000,
          }}
        >
          <ChatBuddyHeader
            isHeWantNewChat={isHeWantNewChat}
            setIsHeWantNewChat={setIsHeWantNewChat}
            isThereUserWithoutChat={isHeChattingWithAll}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            display: { xs: "block", md: "none", sm: "none" },
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
        <Box
          sx={{
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            display: { xs: "flex", md: "none", sm: "none" },
          }}
        >
          {
            <TransitionGroup
              style={{
                display: "flex",
                flexGrow: 1,
                justifyContent: "space-evenly",
                alignContent: "center",
                flexWrap: "wrap",
              }}
            >
              {chats &&
                chats.map((chat) => {
                  const key = Object.keys(chat)[0];

                  return (
                    <CSSTransition key={key} timeout={500} classNames="item">
                      <DisplayUserChatsSmallScreen
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
          }
          <Box />{" "}
        </Box>
        <Box
          sx={{
            width: "100%",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            display: { xs: "block", md: "none", sm: "none" },
          }}
        >
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
          <Box
            sx={{
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              display: { xs: "flex", md: "none", sm: "none" },
            }}
          >
            <TransitionGroup
              style={{
                display: "flex",
                flexGrow: 1,
                justifyContent: "space-evenly",
                flexWrap: "wrap",
              }}
            >
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

        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "75vh",
          }}
        >
          {" "}
          {/* {messages.length > 0 && <MessagessContainr messages={messages} />} */}
          {messages.length > 0 && <MessagessContainrtest messages={messages} />}
        </Box>
        <Box sx={{ position: "sticky", bottom: 0, zIndex: 10 }}>
          <MemoChatInput />
        </Box>
      </Box>
    );
  } else {
    return <LoaderComponent />;
  }
};

export default ChatTemplate;
