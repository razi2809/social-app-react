import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { db } from "../firebase";
import { Box, Typography } from "@mui/material";
import {
  DocumentReference,
  DocumentData,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import { useNavigate, useSearchParams } from "react-router-dom";
import { chatActions } from "../REDUX/chatSlice";
import { useAppDispatch, useAppSelector } from "../REDUX/bigpie";
import LoaderComponent from "../layout/LoaderComponent";
import DisplayUser from "./DisplayUser";
import DisplayUserChats from "./DisplayUserChats";
import { log } from "console";

interface ChatUser {
  displayName: string | null;
  photourl: string | null;
  uid: string;
}
interface User {
  avatar: string;
  displayName: string;
  uid: string;
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
  };
};
type ChatData = {
  [key: string]: ChatInfo;
};
interface Props {
  chatId: string;
}
const ChatSideBar: FC<Props> = ({ chatId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const userBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const dispatch = useAppDispatch();
  const MemoDisplayUsers = memo(DisplayUser);
  useEffect(() => {
    db.collection(`users`).onSnapshot((snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          avatar: doc.data().avatar,
          displayName: doc.data().displayName,
          uid: doc.data().uid,
        }))
      );
    });
    const getChat = async () => {
      const userUid = user.user?.uid;
      if (userUid) {
        const unsub = onSnapshot(
          doc(db, "userchats", userUid) as DocumentReference<DocumentData>,
          (doc) => {
            const chatData = doc.data() as ChatData;
            let sortedChats = Object.entries(chatData)
              .filter(([key, chat]) => chat.date && chat.date.seconds) // Ensure date exists and is not null
              .sort((a, b) => {
                if (a[1].date && b[1].date) {
                  const aDate = a[1]?.date?.toDate();
                  const bDate = b[1]?.date?.toDate();
                  return bDate.getTime() - aDate.getTime();
                }
                return 0;
              });

            setChats(sortedChats.map(([key, value]) => ({ [key]: value })));
            setDone(true);
          }
        );
        return () => {
          unsub();
        };
      }
    };

    if (user.isLoggedIn) {
      user.user?.uid && getChat();
    }
  }, [user.isLoggedIn]);
  const handleClick = useCallback(async (userBuddy: User) => {
    const userUid = user.user?.uid;
    if (userUid && userBuddy.uid === userUid) return;
    //check whether the group is already created or not, if not create
    if (user.user && userUid) {
      const combinedUsersId =
        userUid > userBuddy.uid
          ? userUid + userBuddy.uid
          : userBuddy.uid + user.user.uid;
      navigate(`/chat/chatuid?uid=${combinedUsersId}`);
      try {
        const res = await getDoc(doc(db, "chats", combinedUsersId));

        if (!res.exists()) {
          //create user chat group
          await setDoc(doc(db, `chats`, combinedUsersId), {
            messages: [],
          });

          await updateDoc(doc(db, `userchats`, user.user.uid), {
            [combinedUsersId + ".userInfo"]: {
              uid: userBuddy.uid,
              displayName: userBuddy.displayName,
              photourl: userBuddy.avatar,
            },
            [combinedUsersId + ".lastMessage"]: {
              text: "",
            },
            [combinedUsersId + ".date"]:
              firebase.firestore.FieldValue.serverTimestamp(),
          });
          await updateDoc(doc(db, `userchats`, userBuddy.uid), {
            [combinedUsersId + ".userInfo"]: {
              uid: user.user.uid,
              displayName: user.user.displayName,
              photourl: user.user.photoURL,
            },
            [combinedUsersId + ".date"]:
              firebase.firestore.FieldValue.serverTimestamp(),
            [combinedUsersId + ".lastMessage"]: {
              text: "",
            },
          });
        }
        dispatch(
          chatActions.selectedUser({
            displayName: userBuddy.displayName,
            photourl: userBuddy.avatar,
            uid: userBuddy.uid,
          })
        );
      } catch (err) {
        console.log(err);
      }
    }
  }, []);
  let arrChats = [];
  let doesHeHaveChat;
  let alreadyChattingWithHim;
  for (let userInArr of users) {
    if (userInArr.uid != user.user?.uid) {
      doesHeHaveChat = chats.some((chat) =>
        Object.keys(chat)[0].includes(userInArr.uid)
      );
      arrChats.push(doesHeHaveChat);
    }
    if (!doesHeHaveChat) {
      alreadyChattingWithHim = userInArr.uid === userBuddy.user?.uid;
      arrChats.push(alreadyChattingWithHim);
    }
  }

  const isThereUserWithoutChat = arrChats.every(Boolean);

  const openChat = useCallback((chatId: string, userBuddy: ChatUser) => {
    dispatch(chatActions.selectedUser(userBuddy));
    navigate(`/chat/chatuid?uid=${chatId}`);
  }, []);

  if (done) {
    return (
      <Box>
        <Box
          sx={{
            width: "100%",

            borderBottom: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h6"
            color="textSecondary"
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
          {!isThereUserWithoutChat && (
            <CSSTransition timeout={500} classNames="item">
              <Box
                sx={{
                  width: "100%",
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  color="textSecondary"
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
          {users.map((userExist) => {
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
    );
  } else {
    return <LoaderComponent />;
  }
};

export default ChatSideBar;
