import React, { FC } from "react";
import Header from "./header/Header";
type Props = {
  children: React.ReactNode;
};
const LayoutComponents: FC<Props> = ({ children }) => {
  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  );
};

export default LayoutComponents;
