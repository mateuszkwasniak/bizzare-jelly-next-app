import { IoCheckmarkOutline } from "react-icons/io5";

export default function CheckoutStage({
  text,
  stage,
  activeStage,
  num,
  completed,
  className,
}: {
  text: string;
  stage: string;
  activeStage: string;
  num: number;
  completed: boolean;
  className?: string;
}) {
  return (
    <div
      className={`w-[220px] md:w-[256px] pb-4 md:pb-6 flex items-center gap-4 border-b-2 ${
        stage === activeStage
          ? "border-black-nav"
          : completed
          ? "border-[#38CB89]"
          : "border-transparent"
      } ${className ? className : ""}`}
    >
      <div
        className={`flex items-center justify-center rounded-full w-10 h-10 ${
          stage === activeStage
            ? "bg-[#23262F]"
            : completed
            ? "bg-[#38CB89]"
            : "bg-[#B1B5C3]"
        }`}
      >
        {completed ? (
          <IoCheckmarkOutline className="bg-[#38CB89] w-6 h-6 text-[#FCFCFD]" />
        ) : (
          <span className="font-semibold text-[#FCFCFD] text-base">{num}</span>
        )}
      </div>

      <p
        className={`text-sm md:text-base font-semibold ${
          stage === activeStage
            ? "text-[#23262F]"
            : completed
            ? "text-[#38CB89]"
            : "text-[#B1B5C3]"
        }`}
      >
        {text}
      </p>
    </div>
  );
}
