"use client";

import React from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/utils/auth/sign-out";
import { useAuthState } from "@/hooks/store/auth";
import { motion } from "framer-motion";
import jellyAvatar from "../../../../public/gummy.png";
import Image from "next/image";
import Select, { ActionMeta } from "react-select";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface Option {
  label: string;
  href: string;
}

const dashboardLinks: Option[] = [
  {
    label: "Account",
    href: "/dashboard",
  },
  {
    label: "Address",
    href: "/dashboard/addresses",
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
  },
  {
    label: "Wishlist",
    href: "/",
  },
];

const DashboardLink = ({
  activePath,
  href,
  label,
}: {
  activePath: string;
  href: string;
  label: string;
}) => {
  return (
    <Link
      href={href}
      className={`w-full font-semibold py-2 transition duration-300 hover:opacity-70 ${
        activePath === href ? "border-b border-black-nav" : ""
      }`}
    >
      {label}
    </Link>
  );
};

const MobileNavigationSelect = ({
  navigationOptions,
  activePath,
  router,
}: {
  navigationOptions: Option[];
  activePath: string;
  router: AppRouterInstance;
}) => {
  const handleOption: (
    option: Option | null,
    actionMeta: ActionMeta<Option>
  ) => void = (option) => {
    router.push(option?.href || "/");
  };

  return (
    <div className="block md:hidden w-full">
      <Select
        onChange={handleOption}
        options={navigationOptions}
        value={navigationOptions.filter((option) => option.href === activePath)}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: "#121212",
            primary25: "rgb(134 239 172)",
          },
        })}
        styles={{
          container: (baseStyles) => ({
            ...baseStyles,
            transition: "all 0.3s ease-in-out",
          }),

          control: (baseStyles) => ({
            ...baseStyles,
            border: "1px solid #121212",
          }),

          option: (baseStyles) => ({
            ...baseStyles,
            transition: "all 0.2s ease-in-out",
            cursor: "pointer",
          }),
        }}
      />
    </div>
  );
};

export default function DashboardNavigationPanel() {
  const activePath = usePathname();
  const router = useRouter();
  const auth = useAuthState((state) => state.auth);

  return (
    <motion.div
      className="w-full md:w-[250px] shrink-0 h-fit px-4 pt-8 flex flex-col gap-8 md:sticky top-[calc(76px+3rem)] rounded-lg bg-[#F3F5F7] shadow-custom border border-gray-border"
      initial={{ opacity: 0, translateX: -100 }}
      whileInView={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col items-center gap-2 mb-10">
        <div className="h-20 w-20 rounded-full bg-green-400">
          <Image
            src={jellyAvatar}
            alt="avatar"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold text-black mb-8">
          {auth.username}
        </h3>
        <ul className="w-full hidden md:flex flex-col gap-3">
          {dashboardLinks.map((link) => (
            <DashboardLink key={link.label} activePath={activePath} {...link} />
          ))}
          <button
            className="w-full font-semibold py-2 transition duration-300 hover:opacity-70 text-start"
            onClick={() => signOut(router)}
          >
            Log out
          </button>
        </ul>
        <MobileNavigationSelect
          navigationOptions={dashboardLinks}
          activePath={activePath}
          router={router}
        />
      </div>
    </motion.div>
  );
}
