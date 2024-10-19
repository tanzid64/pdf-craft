import { useMutation } from "@tanstack/react-query";
import { createContext, useState } from "react";

/*
This context is implemented to handle input chat in messages component.
As chat input & messages both components are in the same lavel so we need a react context to pass data to both of them.
*/
interface ChatContextProps {
  addMessage: () => void;
  message: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

export const ChatContext = createContext<ChatContextProps>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

// This provider will help to wrap the components
interface ChatContextProviderProps {
  children: React.ReactNode;
  fileId: string;
}
export const ChatContextProvider = ({
  children,
  fileId,
}: ChatContextProviderProps) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // as trpc only support json, we need to use mutation without trpc for AI response

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({message}: {message: string}) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({ message, fileId }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.body;
    },
  });

  const addMessage = () => sendMessage({message});
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
