import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header style={{ backgroundColor: "#fff" }}>
      <div className="mx-auto max-w-5xl px-6 py-4">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Re'Story"
            width={140}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
      </div>
      <div style={{ height: 3, backgroundColor: "#1a1a1a" }} />
    </header>
  );
}
