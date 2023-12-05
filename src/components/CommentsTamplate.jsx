import { AccountCircle } from "@mui/icons-material";
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

import { formatDistance, formatDistanceToNow, subDays } from "date-fns";
import React, { Fragment, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { db } from "../firebase";
import EditIcon from "@mui/icons-material/Edit";
import firebase from "firebase/compat/app";

const CommentsTamplate = ({ comment, id, postId }) => {
  const [timeAgo, setTimeAgo] = useState(null);
  const [editComment, setEditComment] = useState(false);
  const [editText, setEditText] = useState(comment.comment);
  const caption = comment.comment;
  const who = comment.userName;
  const avatar = comment.avatar || null;
  const user = useSelector((bigPie) => bigPie.authReducer);
  useEffect(() => {
    if (comment.timestamp == null) return;
    const when = comment.timestamp.toDate();
    let time = formatDistanceToNow(when, { addSuffix: true });
    time = time.replace("about ", "");
    setTimeAgo(time);
  }, [comment.timestamp]);
  const handleEdit = () => {
    setEditComment(true);
  };
  const handleupdate = () => {
    db.collection("posts").doc(postId).collection("comments").doc(id).update({
      comment: editText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      edited: true,
    });
    setEditComment(false);
  };
  return (
    <Grid
      container
      spacing={1}
      sx={{
        paddingTop: 0,
      }}
    >
      <Grid item xs={2}>
        <Avatar sx={{ scale: "70%" }} src={avatar} />{" "}
      </Grid>
      <Grid item xs={5}>
        {" "}
        <Typography variant="body2" color="initial">
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
        {user.isLoggedIn && user.user.displayName == who && (
          <Fragment>
            <Tooltip title="delete comment">
              <IconButton
                onClick={() => {
                  db.collection("posts")
                    .doc(postId)
                    .collection("comments")
                    .doc(id)
                    .delete();
                }}
                aria-label="comment"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Fragment>
        )}
        {user.isLoggedIn && user.user.displayName == who && !editComment && (
          <Tooltip title="edit comment">
            <IconButton onClick={handleEdit} aria-label="comment">
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
        {user.isLoggedIn && user.user.displayName == who && editComment && (
          <Tooltip title="edit comment">
            <IconButton onClick={handleupdate} aria-label="comment">
              <CommentIcon />
            </IconButton>
          </Tooltip>
        )}
      </Grid>

      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        {comment.edited && (
          <Typography
            variant="body2"
            color="initial"
            sx={{ textAlign: "end", mr: 1 }}
          >
            edited
          </Typography>
        )}
        <Typography variant="body2" color="initial" sx={{ textAlign: "end" }}>
          {timeAgo}
        </Typography>
      </Box>
    </Grid>
  );
};

export default CommentsTamplate;
