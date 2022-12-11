import { ChatsList } from "@/chat";
import { Layout } from "@/shared";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { IoCreateOutline } from "react-icons/io5";

const ChatsPage = () => {
  const router = useRouter();
  return (
    <Layout title="Messages">
      <ChatsList />
      <motion.button
        className="fixed bottom-8 right-8 rounded-[50%] border p-4 shadow-md hover:active:shadow-none"
        layoutId="/chats/create"
        onClick={() => router.push("/chats/create")}
      >
        <IoCreateOutline size={24} />
      </motion.button>
    </Layout>
  );
};

export default ChatsPage;
