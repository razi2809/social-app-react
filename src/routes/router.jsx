import React, { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import ChatSidebBar from "../components/ChatSidebBar";
import PostsPage from "../pages/PostsPage";
import Directing from "../pages/Directing";
import ROUTES from "./ROUTES";
import ChatTamplat from "../components/chatTemplat";
const Router = () => {
  return (
    <Routes>
      <Route index element={<Directing />} />;
      <Route path={ROUTES.POSTS} element={<PostsPage />} />;
      <Route path={ROUTES.CHAT}>
        <Route index element={<ChatSidebBar />} />
        <Route path=":chatId" element={<ChatTamplat />} />
      </Route>
    </Routes>
  );
};

export default Router;
