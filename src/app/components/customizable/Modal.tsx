import { AnimatePresence, motion } from "framer-motion";
import React, { SetStateAction } from "react";
import DefaultButton from "./DefaultButton";
import { PiWarningCircleBold } from "react-icons/pi";

export default function Modal({
  text,
  btnLeftText,
  btnRightText,
  onBtnLeftClick,
  onBtnRightClick,
  onErrorBtnClick,
  loading,
  btnRightClassname,
  modalError,
}: {
  text: string;
  btnLeftText: string;
  btnRightText: string;
  onBtnLeftClick: () => void;
  onBtnRightClick: () => void;
  onErrorBtnClick: () => void;
  loading: boolean;
  modalError: string;
  btnRightClassname?: string;
}) {
  return (
    <motion.div
      className="w-full h-full fixed top-0 left-0 z-40 flex items-center justify-center"
      exit={{ opacity: [0.5, 0] }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute w-full h-full bg-gray-700"
        animate={{ opacity: [0, 0.5] }}
        exit={{ opacity: [0.5, 0] }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <motion.div
        className="px-8 py-6 mx-5 md:mx-0 w-full md:w-[400px] rounded-lg shadow-custom h-fit bg-white z-50 opacity-100"
        animate={{
          top: 0,
          scaleX: [1, 1.18, 0.5, 1.12, 0.75, 1],
          scaleY: [1, 0.25, 1.18, 0.5, 1.12, 1],
          opacity: [0, 1],
        }}
        exit={{ opacity: [1, 0], scale: [1, 0] }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        {" "}
        {modalError ? (
          <div className="flex flex-col gap-3 items-center">
            <motion.div>
              <PiWarningCircleBold className="text-red-600 text-5xl" />
            </motion.div>
            <p className="font-medium text-wrap text-red-700 flex-1 text-center">
              {modalError}
            </p>
            <DefaultButton
              text="OK"
              onClick={onErrorBtnClick}
              className="bg-white border border-gray-deep !text-black-nav hover:!text-white"
            />
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center gap-4">
              <motion.div>
                <PiWarningCircleBold className="text-red-600 text-5xl" />
              </motion.div>
              <p className="font-medium text-wrap text-xs md:text-base text-black-nav flex-1">
                {text}
              </p>
            </div>
            <div className="flex justify-center gap-4 bg-white opacity-100 z-50">
              <DefaultButton
                text={btnLeftText}
                onClick={onBtnLeftClick}
                className="bg-white border border-gray-deep !text-black-nav hover:!text-white"
              />
              <DefaultButton
                text={btnRightText}
                loading={loading}
                onClick={onBtnRightClick}
                className={`${btnRightClassname ? btnRightClassname : ""}`}
              />
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
