"use client";

import { space_grotesk } from "@/fonts/fonts";
import { useAuthState } from "@/hooks/store/auth";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LuSearch } from "react-icons/lu";
import { LuUserCircle } from "react-icons/lu";
import { LuShoppingCart } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";
import AnimatedLogo from "./AnimatedLogo";
import Cart from "../../cart/Cart";
import { useCartState } from "@/hooks/store/cart";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { signOut } from "@/utils/auth/sign-out";
import { IoMdMenu } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import MobileMenu from "./MobileMenu";

const SignedInAvatar = ({ username }: { username: string }) => {
  return (
    <div className="border-2 border-black-nav rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center text-xs text-black-nav font-semibold bg-green-300">
      {username[0].toUpperCase()}
    </div>
  );
};

export default function Navbar() {
  const username = useAuthState((state) => state.auth.username);

  const totalCount = useCartState((state) => state.totalCount);

  const loadCartFromLocalStorage = useCartState(
    (state) => state.loadCartFromLocalStorage
  );

  const [showCart, setShowCart] = useState<boolean>(false);

  const [scope, animate] = useAnimate();
  const [mobileScope, animateMobile] = useAnimate();

  const [openMenu, setOpenMenu] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const animation = async () => {
      if (scope?.current) {
        await animate(
          scope?.current,
          {
            scaleX: [1, 1.18, 0.5, 1.12, 0.75, 1.1, 0.9, 1],
            scaleY: [1, 0.25, 1.18, 0.5, 1.12, 0.75, 1.1, 1],
          },
          {
            duration: 0.7,
            ease: "easeInOut",
          }
        );
      }
    };

    animation();
  }, [totalCount, animate, scope]);

  useEffect(() => {
    const mobileAnimation = async () => {
      if (mobileScope?.current) {
        await animateMobile(
          mobileScope?.current,
          {
            scale: [1, 1.2, 1],
            translateY: [-3, 0],
          },

          {
            duration: 0.3,
            ease: "easeInOut",
          }
        );
      }
    };

    mobileAnimation();
  }, [totalCount, animateMobile, mobileScope]);

  useEffect(() => {
    loadCartFromLocalStorage();
  }, []);

  return (
    <div className="w-full text-white fixed top-0 flex items-center justify-center h-[40px] md:h-[76px] p-2 md:px-5 xl:px-36 2xl:px-56 z-40 bg-white border-b shadow-custom">
      <Cart showCart={showCart} setShowCart={setShowCart} />
      <div
        className={`${
          pathname.startsWith("/auth/login") ||
          pathname.startsWith("/auth/register")
            ? ""
            : "hidden"
        } absolute left-0 w-1/2 h-full ${
          pathname.startsWith("/auth/login")
            ? "md:bg-gray-100"
            : pathname.startsWith("/auth/register")
            ? "md:bg-gray-100"
            : ""
        } -z-10`}
      />
      <div className="max-w-[1920px] w-full flex justify-between">
        <AnimatedLogo />
        <div>
          <div className="md:hidden flex items-center gap-4 h-full cursor-pointer">
            <Link href={username ? "/dashboard" : "/auth/login"}>
              {username ? (
                <SignedInAvatar username={username} />
              ) : (
                <LuUserCircle className="text-lg text-black-nav cursor-pointer" />
              )}
            </Link>
            <div className="relative">
              <LuShoppingCart
                className={`text-lg text-black-nav cursor-pointer`}
                onClick={() => {
                  if (totalCount > 0) {
                    setShowCart(true);
                  }
                }}
              ></LuShoppingCart>
              <motion.div
                ref={mobileScope}
                className={`w-2 h-2 absolute -top-0.5 -right-1.5 rounded-full flex items-center justify-center text-white text-[10px] text-bold ${
                  totalCount > 0 ? "bg-[#22c55e]" : "bg-transparent"
                }`}
              />
            </div>

            <div className="relative">
              <IoCloseSharp
                className={`absolute left-0 text-3xl text-black-nav transition duration-300 ${
                  openMenu ? "opacity: 100 rotate-0" : "opacity-0 -rotate-45"
                }`}
                onClick={() => setOpenMenu((prev) => !prev)}
              />

              <IoMdMenu
                className={`text-3xl text-black-nav transition duration-300 ${
                  openMenu ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                }`}
                onClick={() => setOpenMenu((prev) => !prev)}
              />
            </div>
            <AnimatePresence>
              {openMenu && (
                <MobileMenu
                  signOut={() => signOut(router)}
                  setOpen={setOpenMenu}
                />
              )}
            </AnimatePresence>
          </div>
          <div className="hidden md:flex h-full items-center justify-center w-full">
            <nav
              className={`ml-auto mr-16 flex items-center gap-5 xl:gap-10 ${space_grotesk.className} text-black-nav font-medium`}
            >
              <Link href="/">Home</Link>
              <Link href="/products">Shop</Link>
              <Link href="/contact">Contact us</Link>
            </nav>

            <div className="flex gap-4 items-center">
              <LuSearch className="text-2xl text-black-nav cursor-pointer" />
              <Link href={username ? "/dashboard" : "/auth/login"}>
                {username ? (
                  <SignedInAvatar username={username} />
                ) : (
                  <LuUserCircle className="text-2xl text-black-nav cursor-pointer" />
                )}
              </Link>
              {username && (
                <LuLogOut
                  className="text-2xl text-black-nav cursor-pointer"
                  onClick={() => signOut(router)}
                />
              )}
              <LuShoppingCart
                className={`text-2xl text-black-nav cursor-pointer`}
                onClick={() => {
                  if (totalCount > 0) {
                    setShowCart(true);
                  }
                }}
              />
              <motion.div
                ref={scope}
                className={`w-6 h-6 -ml-2.5 rounded-full flex items-center justify-center text-white text-[10px] text-bold bg-black-nav `}
              >
                {totalCount > 99 ? "+99" : totalCount}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
