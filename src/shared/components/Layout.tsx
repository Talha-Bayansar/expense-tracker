import { motion } from "framer-motion";
import type { ReactNode } from "react";
import React from "react";
import { AppBar } from "./AppBar";

type Props = {
  children: ReactNode;
  title: string;
  hasBackButton?: boolean;
  showProfileButton?: boolean;
};

export const Layout = ({
  children,
  title,
  hasBackButton,
  showProfileButton,
}: Props) => {
  const variants = {
    hidden: { opacity: 0, x: -200, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
  };

  return (
    <div className="h-screen w-screen">
      <AppBar
        title={title}
        hasBackButton={hasBackButton}
        showProfileButton={showProfileButton}
      />
      <motion.main
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ type: "linear" }}
        className="flex h-full w-full flex-col p-12"
      >
        {children}
      </motion.main>
    </div>
  );
};
