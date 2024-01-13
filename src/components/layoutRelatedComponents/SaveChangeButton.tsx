import { Box, CircularProgress, Fab } from "@mui/material";
import React, { FC } from "react";
import { green } from "@mui/material/colors";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import { auth, db, storage } from "../../firebase";
import { updateProfile } from "firebase/auth";
interface Props {
  img: File;
  setImg: React.Dispatch<React.SetStateAction<File | null>>;
}
const SaveChangeButton: FC<Props> = ({ img, setImg }) => {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const uplodeProfileImg = () => {
    if (img) {
      const upload = storage.ref(`images/${img.name}`).put(img);
      upload.on(
        "state_changed",
        (snapshot) => {
          setLoading(true);

          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          if (progress == 100) {
            setLoading(false);
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          // setImg(null);
          setSuccess(true);
          storage
            .ref("images")
            .child(img.name)
            .getDownloadURL()
            .then(async (url) => {
              if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                  photoURL: url,
                });
                db.collection("users")
                  .doc(auth.currentUser?.uid)
                  .update({ avatar: url });
              }
            });
        }
      );
    }
  };
  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  return (
    <Box sx={{ position: "relative", mb: 1 }}>
      <Fab
        aria-label="save"
        color="primary"
        sx={{ ...buttonSx, height: 40, width: 40 }}
        onClick={uplodeProfileImg}
        // disabled={params.id !== rowId || loading}
      >
        {success ? <CheckIcon /> : <SaveIcon />}
      </Fab>
      {loading && (
        <CircularProgress
          size={48}
          sx={{
            color: green[500],
            position: "absolute",
            top: -3,
            left: -4,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};

export default SaveChangeButton;
