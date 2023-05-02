import Link from "next/link";
import { useRouter } from "next/navigation";
import { TbMap2 } from "react-icons/tb";
import { AiOutlineLineChart } from "react-icons/ai";

export function Sidebar() {
  const router = useRouter();

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <img className="logo" src="./logo.png" alt="logo" />
        <ul>
          <li>
            <Link href="/" legacyBehavior>
              <a className={router.pathname === "/" ? "active" : ""}>
                <TbMap2 size={30} />
                Risk Map &amp; Data
              </a>
            </Link>
          </li>
          <li>
            <Link href="/graph" legacyBehavior>
              <a className={router.pathname === "/graph" ? "active" : ""}>
                <AiOutlineLineChart size={30} />
                Risk Movement
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
