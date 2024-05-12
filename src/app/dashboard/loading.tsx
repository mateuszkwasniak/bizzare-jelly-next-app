import { BearLoader } from "../components/loaders/Loader";

export default function Loading() {
  return (
    <div className="w-full h-[calc(100vh-300px)] flex justify-center items-center">
      <BearLoader />
    </div>
  );
}
