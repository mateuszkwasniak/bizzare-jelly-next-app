"use client";

import React from "react";
import FormItem from "../../components/customizable/DefaultFormItem";
import DefaultButton from "@/app/components/customizable/DefaultButton";
import { motion } from "framer-motion";

const passwordData = [
  {
    label: "OLD PASSWORD",
    name: "password",
    placeholder: "Old password",
    value: "",
  },
  {
    label: "NEW PASSWORD",
    name: "newPassword",
    placeholder: "New password",
    value: "",
  },
  {
    label: "REPEAT NEW PASSWORD",
    name: "newPasswordRepeat",
    placeholder: "Repeat new password",
    value: "",
  },
];

export default function AccountForm({ userData }: { userData: User }) {
  return (
    <motion.form
      className="flex flex-col w-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="font-semibold text-xl text-black mb-6">
        Personal Details
      </h2>
      <ul className="flex flex-col gap-3 md:gap-6">
        <FormItem
          label={"FIRST NAME"}
          name={"firstName"}
          value={userData?.firstName || ""}
        />
        <FormItem
          label={"LAST NAME"}
          name={"lastName"}
          value={userData?.lastName || ""}
        />
        <FormItem
          label={"DISPLAY NAME"}
          name={"username"}
          value={userData?.username || ""}
        />
        <FormItem
          label={"EMAIL"}
          name={"email"}
          value={userData?.email || ""}
        />
      </ul>
      <h2 className="font-semibold text-xl text-black mt-10 mb-6">
        Password Details
      </h2>
      <ul className="flex flex-col gap-3 md:gap-6">
        {passwordData.map((data) => (
          <FormItem
            key={data.name}
            {...data}
            disabledInput={false}
            inputType="password"
          />
        ))}
      </ul>
      <DefaultButton
        text="Save changes"
        type="submit"
        className="mt-8 w-full md:w-fit"
      />
    </motion.form>
  );
}
