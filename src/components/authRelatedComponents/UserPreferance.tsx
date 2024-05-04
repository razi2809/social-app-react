import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Fab,
  IconButton,
  InputBase,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import ThemeSwitcher from "../layoutRelatedComponents/ThemeSwitcher";
import { useAppSelector } from "../../REDUX/bigpie";
import { auth, db, storage } from "../../firebase";
import { updateProfile } from "firebase/auth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SaveChangeButton from "../layoutRelatedComponents/SaveChangeButton";
const UserPreferance = () => {
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const [img, setImg] = useState<null | File>(null);
  const [name, setName] = useState(user.user?.displayName);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nameEditable, setNameEditable] = useState(false);
  const defaultAvatarUrl =
    "https://firebasestorage.googleapis.com/v0/b/social-media-27267.appspot.com/o/images%2FavatarDefaulPic.png?alt=media&token=1ca6c08e-505f-465b-bcd9-3d47c9b1c28f";
  const handleSetPic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target as HTMLInputElement;
    if (inputElement.files) {
      setImg(inputElement.files[0]);
    } else {
      setImg(null);
    }
  };
  const handleDeleteButtonClick = () => {
    setImg(null);
    /*     if (auth.currentUser) {
      updateProfile(auth.currentUser, {
        photoURL: defaultAvatarUrl,
      });

      db.collection("users")
        .doc(auth.currentUser?.uid)
        .update({ avatar: defaultAvatarUrl });
    } */
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignContent: "center",
        height: "100%",
      }}
    >
      <Box>
        <Typography variant="h6" color="text.hover" sx={{ p: 1 }}>
          user settings:
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h6" color="text.hover" sx={{ p: 1 }}>
            theme:
          </Typography>
          <ThemeSwitcher />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <label htmlFor="file-input">
              <Avatar
                sx={{ width: 70, height: 70, cursor: "pointer", m: 1 }}
                alt="user pic"
                src={img ? URL.createObjectURL(img) : user.user?.photoURL ?? ""}
              />
            </label>{" "}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {!img && (
                <Fab
                  size="small"
                  color="primary"
                  aria-label="add"
                  sx={{ mb: 1 }}
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                >
                  <EditIcon />
                </Fab>
              )}
              {img && <SaveChangeButton img={img} setImg={setImg} />}
              <Fab
                size="small"
                color="primary"
                aria-label="add"
                onClick={() => {
                  handleDeleteButtonClick();
                }}
              >
                <DeleteIcon />
              </Fab>
            </Box>
          </Box>

          <input
            ref={fileInputRef}
            id="file-input"
            style={{ display: "none" }}
            className="file-input"
            type="file"
            accept="image/*"
            onChange={(e) => handleSetPic(e)}
          />
          <Box
            sx={{
              display: "flex",
              mt: 1,
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            <TextField
              sx={{ width: "75%", color: "text.hover" }}
              id="userName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!nameEditable}
              inputProps={{
                style: { textAlign: "center" },
              }}
            />

            <Tooltip title="edit name">
              <IconButton
                // sx={{ height: 50 }}
                onClick={() => setNameEditable(true)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Box>
          {nameEditable && (
            <Box sx={{ mt: 2 }}>
              <Fab variant="extended" aria-label="save" color="primary">
                <SaveIcon sx={{ mr: 1 }} />
                save
              </Fab>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserPreferance;
