import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";

const CreateChat = () => {
  const router = useRouter();
  const id = router.pathname;
  console.log(id);
  return (
    <AnimatePresence>
      {id && (
        <motion.div
          className="absolute top-0 left-0 h-screen w-screen bg-white"
          layoutId={id}
        >
          Create Chat
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateChat;
