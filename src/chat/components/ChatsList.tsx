import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

export const ChatsList = () => {
  const router = useRouter();
  const { data, isLoading, error } = trpc.chat.getAll.useQuery();
  const { data: session } = useSession();
  if (error) return <div>You need to authenticate.</div>;
  if (isLoading) return <div>Is loading...</div>;
  return (
    <div className="flex flex-col">
      {data.length === 0 ? (
        <div>There are no chats.</div>
      ) : (
        data.map((chat) => (
          <div
            key={chat.id}
            className="flex flex-col border-t border-b py-2 first:border-t-0 active:hover:bg-gray-300"
            onClick={() => router.push(`chats/${chat.id}`)}
          >
            <h3>
              {
                chat.members.find((member) => member.id !== session.user.id)
                  .name
              }
            </h3>
            <p className="text-sm text-gray-500">
              {chat.messages[chat.messages.length - 1]?.message ??
                "No messages sent yet."}
            </p>
          </div>
        ))
      )}
    </div>
  );
};
