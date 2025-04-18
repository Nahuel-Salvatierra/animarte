import { CircleArrowOutUpRight } from "lucide-react";

export default function SpinnerScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
      <CircleArrowOutUpRight className="animate-spin text-blue-500" size={48} />
    </div>
  );
}
