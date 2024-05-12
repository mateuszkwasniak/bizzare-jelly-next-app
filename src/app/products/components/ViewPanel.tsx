import React, { SetStateAction } from "react";
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { TfiList } from "react-icons/tfi";

export default function ViewPanel({
  view,
  setView,
}: {
  view: "detailed" | "image";
  setView: React.Dispatch<SetStateAction<"detailed" | "image">>;
}) {
  return (
    <div className="flex items-center gap-8 z-20">
      <div className="flex">
        <div
          className={`h-10 w-11 flex items-center justify-center border border-[#E8ECEF] ${
            view === "image" ? "bg-gray-border" : ""
          }`}
        >
          <TfiLayoutGrid3Alt
            className={`text-2xl cursor-pointer`}
            onClick={() => setView("image")}
          />
        </div>
        <div
          className={`h-10 w-11 flex items-center justify-center border border-[#E8ECEF] border-l-0 ${
            view === "detailed" ? "bg-gray-border" : ""
          }`}
        >
          <TfiList
            className="text-2xl cursor-pointer"
            onClick={() => setView("detailed")}
          />
        </div>
      </div>
    </div>
  );
}
