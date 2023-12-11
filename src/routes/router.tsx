import React, { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import ChatSidebBar from "../components/ChatSidebBar";
import PostsPage from "../pages/PostsPage";
import Directing from "../pages/Directing";
import ROUTES from "./ROUTES";
import ChatTamplat from "../components/chatTemplat";
import ChatInterface from "../components/ChatInterface";
const Router = () => {
  console.log("i have rederd");

  return (
    <Routes>
      <Route index element={<Directing />} />;
      <Route path={ROUTES.HOME} element={<PostsPage />} />
      <Route path={ROUTES.POSTS} element={<PostsPage />} />;
      <Route path={ROUTES.CHAT}>
        <Route index element={<ChatInterface />} />
        <Route path=":chatId" element={<ChatInterface />} /> *
      </Route>
    </Routes>
  );
};

export default Router;
