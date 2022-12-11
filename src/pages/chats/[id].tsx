import { trpc } from "@/utils/trpc";
import type { Message } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ChatDetailsPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const context = trpc.useContext();

  const { data, isLoading, error } = trpc.chat.getOne.useQuery({
    id,
  });
  const mutation = trpc.chat.add.useMutation();
  const newMessage = {
    chatId: id,
    message: "Test",
  };

  const [messages, setMessages] = useState<Message[]>(data?.messages ?? []);

  trpc.chat.onAdd.useSubscription(undefined, {
    onData(data) {
      console.log("NEW DATA CAME!", data);
      setMessages((previousState) => {
        return [...previousState, data];
      });
    },
    onError(err) {
      console.error("Subscription error:", err);
      // we might have missed a message - invalidate cache
      context.chat.invalidate();
    },
  });

  useEffect(() => {
    setMessages(data?.messages ?? []);
  }, [data]);

  return (
    <div className="flex flex-col">
      <h1>ChatDetailsPage: {router.query.id}</h1>
      {isLoading ? (
        <p>Is loading...</p>
      ) : !messages || error ? (
        <p>Not authenticated</p>
      ) : (
        <div>
          {messages.length === 0 ? (
            <p>There no messages sent yet.</p>
          ) : (
            messages.map((message) => <p key={message.id}>{message.message}</p>)
          )}
        </div>
      )}
      <button
        className="absolute bottom-8 right-8 h-24 w-24"
        onClick={() => {
          mutation.mutate(newMessage);
        }}
      >
        add
      </button>
    </div>
  );
};

export default ChatDetailsPage;
