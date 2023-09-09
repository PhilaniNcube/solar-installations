import { ReactNode } from "react";

const InnerContent = ({children}:{children:ReactNode}) => {
  return <main className="flex-1 p-8 bg-slate-100">{children}</main>;
};
export default InnerContent;
