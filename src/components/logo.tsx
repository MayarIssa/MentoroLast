import Image from "next/image";
import Link from "next/link";
import robot from "@/assets/robot.png";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image src={robot} alt="Mentoro" className="w-10" />
      <h3 className="text-lg font-bold select-none">Mentoro</h3>
    </Link>
  );
}
