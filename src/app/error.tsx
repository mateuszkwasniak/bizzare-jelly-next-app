"use client";
import DefaultButton from "./components/customizable/DefaultButton";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-full h-[calc(100vh-40px)] md:h-[calc(100vh-76px)] flex flex-col justify-center items-center">
      <h2 className="mb-4 text-3xl">Something went wrong!</h2>
      <div className="flex items-center gap-4">
        <DefaultButton
          onClick={() => reset()}
          text="Try again"
          className="!w-fit bg-white !text-black-nav hover:!text-white"
        />
        <DefaultButton variant="link" href="/" text="Return Home" />
      </div>
    </div>
  );
}
