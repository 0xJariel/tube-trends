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
        {process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}
      </div>
      <div className="grid mx-auto pb-6">
        <div className="text-2xl font-medium">
          Analyze a Youtubers last 50 videos!
        </div>
      </div>
      <TubeTrends />
    </main>
  );
}
