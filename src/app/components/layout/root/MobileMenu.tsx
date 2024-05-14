"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { BsEnvelopeAt } from "react-icons/bs";
import { PiSignOutBold } from "react-icons/pi";
import { PiSignInBold } from "react-icons/pi";
import { SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { useAuthState } from "@/hooks/store/auth";

export default function MobileMenu({
  signOut,
  setOpen,
}: {
  signOut: () => void;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  const pathname = usePathname();

  const jwt = useAuthState((state) => state.auth.jwt);

  return (
    <motion.div
      key="menu"
      className="absolute top-[40px] right-0 bg-black-nav flex flex-col p-6 gap-3 origin-top rounded-sm z-40"
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, translateX: -50 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/"
          className={`flex gap-2 items-center ${
            pathname === "/" ? "text-green-400" : "text-white"
          }`}
          onClick={() => setOpen(false)}
        >
          <IoHomeOutline /> Home
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, translateX: -50 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
        <Link
          href="/products"
          className={`flex gap-2 items-center ${
            pathname === "/products" ? "text-green-400" : "text-white"
          }`}
          onClick={() => setOpen(false)}
        >
          <MdOutlineShoppingBag /> Shop
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, translateX: -50 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ duration: 0.2, delay: 0.4 }}
      >
        <Link
          href="/contact"
          className={`flex gap-2 items-center ${
            pathname === "/contact" ? "text-green-400" : "text-white"
          }`}
        >
          <BsEnvelopeAt /> Contact us
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, translateX: -50 }}
        animate={{ opacity: 1, translateX: 0 }}
        className="flex gap-2 items-center"
        transition={{ duration: 0.2, delay: 0.6 }}
      >
        {jwt ? (
          <>
            <PiSignOutBold onClick={() => signOut()} /> Sign out
          </>
        ) : (
          <Link
            href="/auth/login"
            className={`flex gap-2 items-center ${
              pathname === "/auth/login" ? "text-green-400" : "text-white"
            }`}
            onClick={() => setOpen(false)}
          >
            <PiSignInBold /> Sign in
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
}
