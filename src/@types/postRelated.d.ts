interface IComment {
  id: string;
  comment: {
    comment: string;
    timestamp: firebase.firestore.Timestamp;
    userName: string;
    avatar: string;
    edited: boolean;
    userCrated: string;
  };
}
interface IPost {
  id: string;
  post: {
    imgurl: string;
    avatar: string;
    username: string;
    edited: Boolean;
    timestamp: firebase.firestore.Timestamp;
    title: string;
    userLikes: string[];
    userCrated: string;
  };
}
export { IComment, IPost };
