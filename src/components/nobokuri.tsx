/**
 * নব কুঁড়ি ইন্টেলিজেন্স টকিং বুক — Landing page (Server Component + Tailwind CSS v4)
 */
import Image from "next/image";
import Animations from "./Animations";
import MetaPixel from "./MetaPixel";
import OrderSection from "./OrderSection";
import { baloo, hind } from "./fonts";
import { wrap } from "./ui";

/* ───────────── এখানে আপনার তথ্য বসান ───────────── */
const FORMSPREE_URL = (process.env.FORMSPREE_URL as string) || ""; 
const PIXEL_ID = (process.env.PIXEL_ID as string) || "";
const IMAGE_SRC = "/Nobokuri Intelligence Book Showcase.png";

const FEATURES = [
  { icon: "🔤", text: "বাংলা, ইংরেজি ও আরবি বর্ণমালা", bg: "bg-[#fff3c4]" },
  { icon: "🔢", text: "সংখ্যা, শব্দ ও পশু-পাখির পরিচিতি", bg: "bg-[#d9f3ff]" },
  { icon: "🤲", text: "প্রয়োজনীয় দোয়া", bg: "bg-[#ffe0e0]" },
  { icon: "🖊️", text: "স্মার্ট পেনের মাধ্যমে অডিওতে শেখা", bg: "bg-[#d8f5ea]" },
  { icon: "🎮", text: "মজার গেম ও কুইজ", bg: "bg-[#fff3c4]" },
];

const heroIn = "hero-in motion-safe:opacity-0";

export default function Nobokuri() {
  return (
    <div className={`${hind.className} overflow-x-clip bg-[#fffdf7] leading-relaxed text-slate-900`}>
      <Animations />
      <MetaPixel pixelId={PIXEL_ID} />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b-2 border-slate-900 bg-[#fffdf7]">
        <div className={`${wrap} flex h-[62px] items-center justify-between`}>
          <span className={`${baloo.className} text-2xl font-extrabold text-slate-900`}>নব কুঁড়ি</span>
          {/* Header Button - আকর্ষণীয় হলুদ/অ্যাম্বার কালার */}
          <a
            className="inline-flex items-center justify-center rounded-xl border-2 border-slate-900 bg-amber-400 px-5 py-2 text-sm font-bold text-slate-900 shadow-[3px_3px_0px_#0f172a] transition-all hover:bg-amber-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            href="#order"
          >
            অর্ডার করুন
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b-2 border-slate-900 bg-sky-50 pt-8 pb-12 md:pt-12 md:pb-16">
        <div className={`${wrap} grid items-center gap-9 md:grid-cols-[1.1fr_.9fr]`}>
          <div>
            <p className={`${heroIn} mb-4 inline-block rounded-full border-2 border-slate-900 bg-white px-4 py-[3px] text-[15px] font-semibold text-slate-800 shadow-[2px_2px_0px_#0f172a]`}>
              🚚 ক্যাশ অন ডেলিভারি সুবিধা রয়েছে
            </p>
            <h1 className={`${heroIn} ${baloo.className} text-[clamp(34px,6vw,58px)] leading-tight font-extrabold text-slate-900`}>
              📚 নব কুঁড়ি ইন্টেলিজেন্স টকিং বুক
            </h1>
            <p className={`${heroIn} ${baloo.className} mt-3 mb-2 text-[clamp(20px,3vw,26px)] leading-tight font-semibold text-rose-600`}>
              আপনার সন্তানের শেখা হোক আরও আনন্দময়! ❤️
            </p>
            <p className={`${heroIn} mb-6 max-w-[520px] text-lg text-slate-600`}>
              মোবাইলের স্ক্রিন টাইম কমিয়ে শিশুকে শেখার প্রতি আগ্রহী করে তুলুন নব কুঁড়ি ইন্টেলিজেন্স টকিং বুকের মাধ্যমে।
            </p>
            
            {/* Hero Main CTA Button - স্পষ্ট এবং বোল্ড কোরাল/রোজ কালার */}
            <div className={heroIn}>
              <a
                className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-900 bg-rose-500 px-8 py-4 text-lg font-extrabold text-white shadow-[4px_4px_0px_#0f172a] transition-all hover:bg-rose-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                href="#order"
              >
                এখনই অর্ডার করুন 🛒
              </a>
            </div>
          </div>

          <div className="relative aspect-square w-full max-w-[460px] justify-self-center">
            <div className="hero-sun absolute inset-[7%] rounded-full border-2 border-slate-900 bg-amber-300 shadow-[6px_6px_0px_#0f172a] motion-safe:opacity-0" />
            <Image
              className="hero-img relative h-full w-full object-contain p-[6%] motion-safe:opacity-0"
              src={IMAGE_SRC}
              alt="নব কুঁড়ি ইন্টেলিজেন্স টকিং বুক"
              width={800}
              height={800}
              priority
            />
            <span className="hero-sticker absolute top-[4%] right-0 rotate-8 rounded-xl border-2 border-slate-900 bg-rose-500 px-3.5 py-1 font-bold text-white shadow-[3px_3px_0px_#0f172a] motion-safe:opacity-0">
              ৩+ বছর বয়সীদের জন্য
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16">
        <div className={wrap}>
          <h2 className={`${baloo.className} text-[clamp(26px,4.5vw,40px)] leading-tight font-extrabold text-slate-900`}>✨ এক বইয়েই থাকছে</h2>
          <div className="feat-grid mt-7 grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-[18px]">
            {FEATURES.map((f) => (
              <div key={f.text} className={`feat rounded-[18px] border-2 border-slate-900 p-5 font-medium text-slate-900 shadow-[4px_4px_0px_#0f172a] ${f.bg}`}>
                <div className="mb-2 text-4xl leading-none">{f.icon}</div>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section - ডার্ক ব্যাকগ্রাউন্ড ফিক্সড */}
      <section className="border-y-2 border-slate-900 bg-slate-900 py-[26px] text-center text-white">
        <div className={wrap}>
          <p className={`${baloo.className} text-[clamp(20px,3.4vw,28px)] leading-tight font-semibold`}>
            🎯 শুনে, দেখে ও হাতে-কলমে শেখার দারুণ অভিজ্ঞতা!
          </p>
        </div>
      </section>

      {/* Order (client component) */}
      <OrderSection formUrl={FORMSPREE_URL} />

      {/* Footer - ডার্ক ব্যাকগ্রাউন্ড ফিক্সড */}
      <footer className="border-t-2 border-slate-800 bg-slate-900 px-5 py-7 text-center text-white">
        <p className={`${baloo.className} text-[22px] leading-tight font-semibold`}>❤️ শিশুর শেখার আনন্দ শুরু হোক আজ থেকেই!</p>
      </footer>

      <noscript>
        <style>{`.hero-in,.hero-sun,.hero-img,.hero-sticker{opacity:1!important}`}</style>
      </noscript>
    </div>
  );
}