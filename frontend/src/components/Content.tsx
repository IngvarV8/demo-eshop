import React, { ReactNode } from "react";

interface ContentProps {
  children: ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <div style={{ padding: "16px" }}>
      {children} {}
    </div>
  );
};

export default Content;