import { Loader2 } from "lucide-react";

export default function FullScreenLoader({ label }: { label: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F9FC]">
      <div className="flex items-center gap-3 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>{label}</span>
      </div>
    </div>
  );
}
