import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1 space-y-5 max-w-2xl mx-auto px-4">
      <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight">
        @fydemy/ui <br /> A lightweight UI-kit library
      </h1>
      <p className="text-balance">
        Built for modern design and current trends.
      </p>
      <div className="space-x-2 space-y-2">
        <Link href="/docs" className={buttonVariants({ variant: "primary" })}>
          Get started
        </Link>
        <Link
          href="/docs/components/accordion"
          className={buttonVariants({ variant: "ghost" })}
        >
          View components
        </Link>
      </div>
    </div>
  );
}
