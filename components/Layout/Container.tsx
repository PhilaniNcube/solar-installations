import { ReactNode } from "react";

const Container = ({children}:{children:ReactNode}) => {
  return <div className="flex h-screen">{children}</div>;
};
export default Container;
