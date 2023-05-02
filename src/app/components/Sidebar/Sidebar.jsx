import Link from "next/link";

export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <img className="logo" src="./logo.png" alt="logo" />
        <ul>
          <li>
            <Link href="/" legacyBehavior>
              <a>Map &amp; Data</a>
            </Link>
          </li>
          <li>
            <Link href="/graph" legacyBehavior>
              <a>Graph</a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
