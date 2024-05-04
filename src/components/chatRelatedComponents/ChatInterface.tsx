import { Box, Grid } from "@mui/material";
import React, { Fragment, memo } from "react";
import { useSearchParams } from "react-router-dom";
import ChatSideBar from "./ChatSidebBar";
import ChatTemplat from "./chatTemplate";
import ChatInput from "./ChatInput";
import ChatSideBarDemo from "./ChatSidebBar copy";

const ChatInterface = () => {
  const [searchParams] = useSearchParams();
  const chatId: string = searchParams.get("uid")!;
  const MemoChatInput = memo(ChatInput);

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        sm={6}
        md={4}
        sx={{
          bgcolor: "divider",
          display: { xs: "none", md: "flex", sm: "flex" },
        }}
      >
        {" "}
        <ChatSideBarDemo chatId={chatId} />
      </Grid>
      <Grid
        item
        sm={6}
        xs={12}
        md={8}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "divider",
        }}
      >
        {" "}
        {chatId && (
          <Fragment>
            <Box
              sx={{
                // overflowY: "auto",
                flexGrow: 1,
              }}
            >
              <ChatTemplat />
            </Box>
            {/*  <Box>
              <MemoChatInput />
            </Box>{" "} */}
          </Fragment>
        )}
      </Grid>
    </Grid>
  );
};

export default ChatInterface;
