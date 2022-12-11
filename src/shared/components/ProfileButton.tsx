import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { signOut, useSession } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";

export const ProfileButton = () => {
  const { data } = useSession();
  return (
    <Menu as="div" className={"relative inline-block text-left"}>
      <div className="flex items-center">
        <Menu.Button className="h-12 w-12 overflow-clip rounded-[50%] border border-white border-opacity-40 hover:border-opacity-100 active:border-opacity-100">
          {data && (
            <Image
              width={100}
              height={100}
              loader={({ src }) => src}
              src={data.user?.image}
              alt={data.user?.name}
            />
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-1 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-violet-500 text-white" : "text-gray-900"
                }  flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={() => signOut()}
              >
                <FaSignOutAlt className="mr-1" /> Sign Out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
