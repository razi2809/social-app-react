import { Avatar, Card, CardContent, Typography } from "@mui/material";
import React from "react";

interface User {
  avatar: string;
  displayName: string;
  uid: string;
}

interface DisplayUserProps {
  user: User;
  display: Boolean;
  handleOpenChat: (user: User) => void;
  doesHeHaveChat: boolean;
}

const DisplayUser: React.FC<DisplayUserProps> = ({
  user,
  display,
  handleOpenChat,
  doesHeHaveChat,
}) => {
  if (display && !doesHeHaveChat) {
    return (
      <Card style={{ display: "flex", alignItems: "center", margin: "10px" }}>
        <Avatar
          src={user.avatar}
          alt={user.displayName}
          style={{ margin: "10px" }}
          onClick={() => {
            handleOpenChat(user);
          }}
        />
        <CardContent>
          <Typography variant="h5">{user.displayName}</Typography>
        </CardContent>
      </Card>
    );
  } else return null;
};

export default DisplayUser;
