import { Suspense } from "react";
import ListenerHome from "@/components/ui/home";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="text-white p-6">Loading home...</div>}>
      <ListenerHome />
    </Suspense>
  );
}
