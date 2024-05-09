import {
  Avatar,
  Box,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";

import { formatDistanceToNow } from "date-fns";
import React, { FC, Fragment, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { db } from "../../firebase";
import EditIcon from "@mui/icons-material/Edit";
import firebase from "firebase/compat/app";
import { useAppSelector } from "../../REDUX/bigpie";
import { IComment } from "../../@types/postRelated";
interface Prop {
  comment: IComment;
  postId: string;
}

const CommentsTamplate: FC<Prop> = ({ comment, postId }) => {
  const [timeAgo, setTimeAgo] = useState("");
  const [editComment, setEditComment] = useState(false);
  const [editText, setEditText] = useState(comment.comment.comment);
  const caption = comment.comment.comment;
  const who = comment.comment.userName;
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  useEffect(() => {
    if (comment.comment.timestamp == null) return;
    const when = comment.comment.timestamp.toDate();
    let time = formatDistanceToNow(when, { addSuffix: true });
    time = time.replace("about ", "");
    setTimeAgo(time);
  }, [comment.comment.timestamp]);
  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setEditComment(true);
  };
  const handleupdate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    db.collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(comment.id)
      .update({
        comment: editText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        edited: true,
      });
    setEditComment(false);
  };
  const handleGoUserProfile = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.stopPropagation();
    console.log(comment.comment.userCrated);
  };
  return (
    <Grid
      container
      spacing={1}
      sx={{
        paddingTop: 0,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Grid item xs={2}>
        <Avatar
          sx={{ scale: "70%", cursor: "pointer" }}
          src={comment.comment.avatar ?? undefined}
          alt={comment.comment.avatar || "User"}
          onClick={(e) => handleGoUserProfile(e)}
        />{" "}
      </Grid>
      <Grid item xs={5}>
        {" "}
        <Typography
          variant="body2"
          color="initial"
          sx={{ cursor: "pointer" }}
          onClick={(e) => handleGoUserProfile(e)}
        >
          {who}
        </Typography>
        {!editComment ? (
          <Typography variant="body2" color="initial">
            {caption}
          </Typography>
        ) : (
          <TextField
            variant="standard"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
        )}
      </Grid>
      <Grid item xs={5}>
        {user.isLoggedIn && user.user?.displayName === who && (
          <Fragment>
            <Tooltip title="delete comment">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  db.collection("posts")
                    .doc(postId)
                    .collection("comments")
                    .doc(comment.id)
                    .delete();
                }}
                aria-label="comment"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Fragment>
        )}
        {user.isLoggedIn && user.user?.displayName === who && !editComment && (
          <Tooltip title="edit comment">
            <IconButton onClick={(e) => handleEdit(e)} aria-label="comment">
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
        {user.isLoggedIn && user.user?.displayName === who && editComment && (
          <Tooltip title="edit comment">
            <IconButton onClick={(e) => handleupdate(e)} aria-label="comment">
              <CommentIcon />
            </IconButton>
          </Tooltip>
        )}
      </Grid>

      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        {comment.comment.edited && (
          <Typography
            variant="body2"
            color="initial"
            sx={{ textAlign: "end", mr: 1 }}
          >
            edited
          </Typography>
        )}
        <Typography
          variant="body2"
          color="initial"
          sx={{ textAlign: "end", pr: 1 }}
        >
          {timeAgo}
        </Typography>
      </Box>
    </Grid>
  );
};

export default CommentsTamplate;
