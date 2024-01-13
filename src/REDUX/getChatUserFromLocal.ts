import { DocumentReference, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Timestamp } from "firebase/firestore";
import { chatActions } from "./chatSlice";

interface userBuddy {
  displayName: string | null;
  photourl: string | null;
  uid: string;
  timestamp: Timestamp;
}
const getChatBuddy = async (uid: string) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const chatBuddy: userBuddy = {
      displayName: docSnap.data()?.displayName,
      photourl: docSnap.data()?.avatar,
      uid: docSnap.data()?.uid,
      timestamp: docSnap.data()?.timestamp,
    };
    return chatBuddy;
  } else {
    return null;
  }
};
export default getChatBuddy;
