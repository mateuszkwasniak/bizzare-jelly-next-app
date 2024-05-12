import React from "react";
import DefaultButton from "./components/customizable/DefaultButton";

export default function NotFoundPage() {
  return (
    <div className="w-full h-[calc(100vh-40px)] md:h-[calc(100vh-76px)] flex flex-col justify-center items-center">
      <h2 className="text-center">Ups!</h2>
      <p className="text-center mb-4">Seems there is no such jelly page</p>
      <DefaultButton
        variant="link"
        href="/"
        text={"Return Home"}
        className="!w-fit"
      />
    </div>
  );
}
