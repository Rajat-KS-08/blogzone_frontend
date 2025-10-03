// ToastProvider.tsx
import React, { createContext, useContext } from "react";
import { message } from "antd";

type ToastContextType = ReturnType<typeof message.useMessage>;

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <ToastContext.Provider value={[messageApi, contextHolder]}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
};

export const useToastApi = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastApi must be used inside <ToastProvider>");
  return ctx[0]; // return messageApi
};
