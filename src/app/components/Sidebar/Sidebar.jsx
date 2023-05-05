import Link from "next/link";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const router = useRouter();

  return (
    <div className="sidebar">
      <div className="sidebar-content">
      <Link href="/" legacyBehavior>
        <img className="logo" src="./logo.png" alt="logo" />
        </Link>
      </div>
    </div>
  );
}
