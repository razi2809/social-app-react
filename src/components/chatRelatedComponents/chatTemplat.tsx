import { Box } from "@mui/material";
import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { DocumentReference, doc, onSnapshot } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { db } from "../../firebase";
import MessagessContainr from "./MessagessContainr";
import { useAppSelector } from "../../REDUX/bigpie";
import firebase from "firebase/compat/app";
import LoaderComponent from "../../layout/LoaderComponent";
import ChatInput from "./ChatInput";
import ChatBuddyHeader from "./chatBuddyHeader";

interface Message {
  date: firebase.firestore.Timestamp;
  id: string;
  senderId: string;
  text: string;
  Image?: string;
}

const ChatTemplat = () => {
  const MemoChatInput = memo(ChatInput);
  const chatBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const [searchParams] = useSearchParams();
  const chatId: string = searchParams.get("uid")!;
  const [messages, setMessages] = useState<Message[]>([]);
  const [done, setDone] = useState(false);
  const [parentWidth, setParentWidth] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const updateWidth = () => {
      if (parentRef.current) {
        const scrollbarWidth =
          window.innerWidth - document.documentElement.clientWidth;
        setParentWidth(parentRef.current.offsetWidth - scrollbarWidth);
      }
    };

    updateWidth();

    const handleResize = () => {
      updateWidth();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [done]);

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
            position: "fixed",
            top: 0,
            zIndex: 1000,
            width: `${parentWidth}px`,
          }}
        >
          <ChatBuddyHeader
            isHeWantNewChat={false}
            setIsHeWantNewChat={setDone}
            isThereUserWithoutChat={true}
          />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
          }}
        >
          {" "}
          {messages.length > 0 && <MessagessContainr messages={messages} />}
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

export default ChatTemplat;
