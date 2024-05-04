import React, { useCallback, useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import { useAppDispatch, useAppSelector } from "../REDUX/bigpie";
import { useNavigate } from "react-router-dom";
import { chatActions } from "../REDUX/chatSlice";
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
type ChatData = {
  [key: string]: ChatInfo;
};
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
/*
 * Custom hook to manage chat functionalities in the sidebar.
 * Handles fetching users, chats, and initializing new chats. */
const useGetChats = () => {
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const userBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  // Effect to fetch all users from Firestore and listen for changes.

  useEffect(() => {
    db.collection(`users`).onSnapshot((snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          avatar: doc.data().avatar,
          displayName: doc.data().displayName,
          uid: doc.data().uid,
          timestamp: doc.data().Timestamp,
        }))
      );
    });
    // Function to fetch and sort chat data based on the logged-in user.

    const getChats = async () => {
      if (!user.user?.uid) return;
      const unsub = onSnapshot(
        doc(db, "userchats", user.user?.uid) as DocumentReference<DocumentData>,
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
    };

    if (user.isLoggedIn) {
      user.user?.uid && getChats();
    }
  }, [user.isLoggedIn]);
  // Function to handle user selection for chat, either existing or new.
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
            timestamp: userBuddy.timestamp,
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

  const openChat = useCallback((chatId: string, userBuddy: ChatUser) => {
    dispatch(chatActions.selectedUser(userBuddy));
    navigate(`/chat/chatuid?uid=${chatId}`);
  }, []);
  const isHeChattingWithAll = arrChats.every(Boolean);
  return { users, chats, done, openChat, handleClick, isHeChattingWithAll };
};

export default useGetChats;
