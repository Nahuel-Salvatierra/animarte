import { Loader2Icon } from 'lucide-react';

export default function SpinnerScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2Icon className="animate-spin text-blue-500" size={48} />
    </div>
  );
}
