import { Box, Grid } from "@mui/material";
import React, { Fragment, memo } from "react";
import { useSearchParams } from "react-router-dom";
import ChatSideBar from "./ChatSidebBar";
import ChatTemplat from "./chatTemplat";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

const ChatInterface = () => {
  const [searchParams] = useSearchParams();
  const chatId: string = searchParams.get("uid")!;
  const MemoChatInput = memo(ChatInput);

  console.log("i have rederd");

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid item sm={4} xs={12} md={3}>
        {" "}
        <ChatSideBar chatId={chatId} />
      </Grid>
      <Grid
        item
        sm={8}
        xs={12}
        md={9}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {" "}
        {chatId && (
          <Fragment>
            <Box>{/* <ChatHeader /> */}</Box>
            <Box
              sx={{
                overflowY: "auto",
                flexGrow: 1,
                "&::-webkit-scrollbar": {
                  width: "0",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "transparent",
                  borderRadius: "5px",
                },
                "&:hover::-webkit-scrollbar-thumb": {
                  background: "#888",
                },
                "&:hover::-webkit-scrollbar": {
                  width: "10px",
                },
              }}
            >
              <ChatTemplat />
            </Box>
            <Box>
              <MemoChatInput />
            </Box>{" "}
          </Fragment>
        )}
      </Grid>
    </Grid>
  );
};

export default ChatInterface;
