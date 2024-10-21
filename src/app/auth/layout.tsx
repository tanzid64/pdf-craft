import { FC } from "react";

interface AutyLayoutProps {
  children: React.ReactNode;
}

const AutyLayout: FC<AutyLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      {children}
    </div>
  );
};

export default AutyLayout;
