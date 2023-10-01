import Image from 'next/image'
import Link from "next/link";
import TubeTrends from "./components/TubeTrends";
import { BsYoutube } from "react-icons/bs";

export default function Home() {
  return (
    <main className="grid">
      <div className="flex text-4xl mx-auto justify-center p-6">
        <span className="self-center">
          <BsYoutube />
        </span>
        YouWhen
      </div>
      <div className="grid mx-auto pb-6">
        <div>Find out when your favorite channels post!</div>
        <div className="mx-auto">~last 50 videos~</div>
      </div>
      <TubeTrends />
    </main>
  );
}
