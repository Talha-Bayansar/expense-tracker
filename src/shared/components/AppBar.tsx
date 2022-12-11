import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { signIn, useSession } from "next-auth/react";
import { ProfileButton } from "./ProfileButton";
import { useRouter } from "next/router";

type Props = {
  className?: string;
  title: string;
  hasBackButton?: boolean;
  showProfileButton?: boolean;
};

export const AppBar = ({
  className,
  title,
  hasBackButton = false,
  showProfileButton = true,
}: Props) => {
  const [showShadow, setShowShadow] = useState<boolean>(false);
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    window.onscroll = () => {
      if (window.scrollY === 0 && showShadow) {
        setShowShadow(false);
      } else if (window.scrollY !== 0 && !showShadow) {
        setShowShadow(true);
      }
    };
  }, [showShadow]);

  return (
    <header
      className={`${
        className ?? ""
      } sticky top-0 flex h-16 items-center bg-blue-600 px-4 text-white ${
        showShadow ? "shadow-lg" : ""
      }`}
    >
      {hasBackButton && (
        <button
          className="mr-4 hover:text-slate-200 active:text-slate-200"
          onClick={() => router.replace("/movies")}
        >
          <IoMdArrowBack size={32} />
        </button>
      )}
      <h3 className="text-2xl font-semibold">{title}</h3>
      <div className="flex-grow"></div>
      {showProfileButton &&
        (status === "unauthenticated" ? (
          <button
            className="rounded border border-transparent border-opacity-20 bg-black bg-opacity-20 px-2 py-1"
            onClick={() => signIn()}
          >
            Sign In
          </button>
        ) : (
          <ProfileButton />
        ))}
    </header>
  );
};
