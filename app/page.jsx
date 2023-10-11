import Image from 'next/image'
import Link from "next/link";
import TubeTrends from "./components/TubeTrends";
import { BsYoutube } from "react-icons/bs";

export default function Home() {
  return (
    <main className="grid w-full">
      <div className="gradient"></div>
      <div className="grid  ">
        <h1 className=" p-6 head_text">
          Analyze Youtuber upload data with <br />
          <span className=" orange_gradient">YouWhen</span>
        </h1>
        <div className="grid pb-6">
          <div className="text-2xl font-medium px-4 text-center">
            Add up to four youtubers and analyze their recent upload data!
          </div>
        </div>
      </div>
      <TubeTrends />
    </main>
  );
}
