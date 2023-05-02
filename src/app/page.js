"use client"

import { Sidebar } from "./components/Sidebar/Sidebar";
import { Homepage } from "./components/Homepage/Homepage";
import { useRouter } from "next/navigation"; // import next/navigation

export default function Home() {
  const router = useRouter(); // use useRouter from next/navigation

  const handleClick = () => {
    router.push("/graph");
  };
  
  return (
    <div>
       <button onClick={handleClick}>click me</button>
      <Sidebar />
      <Homepage />
    </div>
  );
}
