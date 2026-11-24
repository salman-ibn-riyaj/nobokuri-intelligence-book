"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "motion/react";
import { track } from "./pixel";
import { baloo } from "./fonts";
import { field, wrap } from "./ui";

/* ───────────── ডাটা ───────────── */
const DELIVERY = { dhaka: 100, outside: 120 } as const;

type PackageId = "single" | "combo";
type Area = keyof typeof DELIVERY;
type Status = "idle" | "loading" | "done" | "error";
type Errors = Partial<Record<"name" | "phone" | "address", string>>;

interface Pkg {
  id: PackageId;
  name: string;
  price: number;
  badge?: string;
  items: string[];
}

const PACKAGES: Pkg[] = [
  {
    id: "single",
    name: "শুধু বই",
    price: 890,
    items: ["নব কুঁড়ি ইন্টেলিজেন্স টকিং বুক", "স্মার্ট পেন", "চার্জিং ক্যাবল"],
  },
  {
    id: "combo",
    name: "কম্বো প্যাকেজ",
    price: 1090,
    badge: "সেরা অফার",
    items: [
      "৬২ পেজের টকিং বুক",
      "স্মার্ট পেন — বইয়ের একপাশে লেখা যায়, মুছেও ফেলা যায়",
      "টাইপ-সি চার্জিং ক্যাবল",
      "লেখার জন্য ট্যাব ও ট্যাব পেন",
    ],
  },
];

/* ───────────── Helpers ───────────── */
const BN = "০১২translateX৫৬৭৮৯";
const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
const normalizePhone = (v: string) =>
  v
    .replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)))
    .replace(/[\s-]/g, "")
    .replace(/^(\+?88)/, "");

/* ───────────── Component ───────────── */
export default function OrderSection({ formUrl }: { formUrl: string }) {
  const checkoutSent = useRef(false);

  const [pkgId, setPkgId] = useState<PackageId>("combo");
  const [area, setArea] = useState<Area>("dhaka");
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const pkg = PACKAGES.find((p) => p.id === pkgId)!;
  const delivery = DELIVERY[area];
  const total = pkg.price + delivery;

  const setField =
    (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((er) => ({ ...er, [key]: undefined }));
    };

  const onFormFocus = () => {
    if (checkoutSent.current) return;
    checkoutSent.current = true;
    track("InitiateCheckout", { value: total, currency: "BDT", content_ids: [pkg.id], num_items: 1 });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;

    const phone = normalizePhone(form.phone);
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "আপনার নাম লিখুন";
    if (!/^01[3-9]\d{8}$/.test(phone)) next.phone = "সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (যেমন 01712345678)";
    if (form.address.trim().length < 10) next.address = "বাসা/রোড, এলাকা ও জেলাসহ পূর্ণ ঠিকানা লিখুন";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("loading");
    try {
      const res = await fetch(formUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `নতুন অর্ডার — ${form.name.trim()} (${pkg.name})`,
          নাম: form.name.trim(),
          মোবাইল: phone,
          ঠিকানা: form.address.trim(),
          এলাকা: area === "dhaka" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে",
          প্যাকেজ: pkg.name,
          প্যাকেজ_মূল্য: pkg.price,
          ডেলিভারি_চার্জ: delivery,
          সর্বমোট: total,
        }),
      });
      if (!res.ok) throw new Error("submit failed");

      // Meta Pixel: অর্ডার সফলভাবে গেলে Purchase event
      track(
        "Purchase",
        { value: total, currency: "BDT", content_ids: [pkg.id], content_name: pkg.name, content_type: "product", num_items: 1 },
        `order-${Date.now()}`
      );
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const closeDone = () => {
    setForm({ name: "", phone: "", address: "" });
    setStatus("idle");
  };

  return (
    <section id="order" className="scroll-mt-[62px] border-t-2 border-slate-900 bg-sky-50 pt-12 pb-14 md:pt-16 md:pb-20">
      <div className={wrap}>
        <h2 className={`${baloo.className} text-[clamp(26px,4.5vw,40px)] leading-tight font-extrabold text-slate-900`}>
          📩 আপনার সন্তানের জন্য এখনই অর্ডার করুন
        </h2>
        <p className="mt-1.5 text-slate-600">প্যাকেজ বেছে নিন, তথ্য দিন — ক্যাশ অন ডেলিভারিতে পণ্য হাতে পেয়ে টাকা দিন।</p>

        <div className="mt-[30px] mb-[26px] grid gap-[22px] md:grid-cols-2" role="radiogroup" aria-label="প্যাকেজ">
          {PACKAGES.map((p) => {
            const active = p.id === pkgId;
            return (
              <motion.button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={active}
                className="relative cursor-pointer rounded-[18px] border-2 border-slate-900 bg-white p-[22px] text-left shadow-[4px_4px_0px_#0f172a] focus-visible:outline-[3px] focus-visible:outline-offset-[10px] focus-visible:outline-rose-500"
                onClick={() => setPkgId(p.id)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {active && (
                  <motion.span
                    layoutId="pkg-ring"
                    className="pointer-events-none absolute -inset-2 rounded-3xl border-4 border-rose-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                {/* প্যাকেজের নাম এবং সেরা অফার ট্যাগ (সঠিক ভিজিবিলিটি সহ) */}
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`${baloo.className} text-[22px] leading-tight font-extrabold text-slate-900`}>{p.name}</h3>
                  {p.badge && (
                    <span className="inline-block rounded-lg border-2 border-slate-900 bg-amber-400 px-3 py-1 text-xs font-black tracking-wide text-slate-900 shadow-[2px_2px_0px_#0f172a]">
                      🔥 {p.badge}
                    </span>
                  )}
                </div>

                <div className={`${baloo.className} mt-1 text-[40px] leading-tight font-extrabold text-rose-600`}>৳{toBn(p.price)}/-</div>
                <ul className="mt-2.5 grid gap-1.5">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2 text-slate-800 before:font-extrabold before:text-emerald-600 before:content-['✓']">
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.button>
            );
          })}
        </div>

        <form
          className="grid gap-[30px] rounded-[20px] border-2 border-slate-900 bg-white p-[26px] shadow-[6px_6px_0px_#0f172a] md:grid-cols-[1.2fr_.8fr]"
          onSubmit={onSubmit}
          onFocusCapture={onFormFocus}
          noValidate
        >
          <div>
            <p className="mb-2 font-bold text-slate-900">ডেলিভারি এলাকা</p>
            
            {/* প্রফেশনাল ও ইউজার ফ্রেন্ডলি রেডিও বাটন কার্ড ডিজাইন */}
            <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="ডেলিভারি এলাকা">
              {(["dhaka", "outside"] as Area[]).map((a) => {
                const isSelected = area === a;
                return (
                  <label
                    key={a}
                    onClick={() => setArea(a)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-3.5 transition-all ${
                      isSelected
                        ? "border-slate-900 bg-amber-50 shadow-[3px_3px_0px_#0f172a]"
                        : "border-slate-300 bg-slate-50 hover:border-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="deliveryArea"
                        value={a}
                        checked={isSelected}
                        onChange={() => setArea(a)}
                        className="h-4 w-4 accent-rose-600 cursor-pointer"
                      />
                      <span className="font-semibold text-slate-900 text-sm sm:text-base">
                        {a === "dhaka" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"}
                      </span>
                    </div>
                    <span className="font-bold text-rose-600 text-sm sm:text-base">
                      ৳{toBn(DELIVERY[a])}
                    </span>
                  </label>
                );
              })}
            </div>

            <label className="mb-3.5 block font-semibold text-slate-900">
              আপনার নাম
              <input className={field} value={form.name} onChange={setField("name")} autoComplete="name" placeholder="এখানে আপনার নাম লিখুন" />
              {errors.name && <span className="mt-[5px] block text-sm font-medium text-red-600">{errors.name}</span>}
            </label>
            <label className="mb-3.5 block font-semibold text-slate-900">
              মোবাইল নম্বর
              <input
                className={field}
                value={form.phone}
                onChange={setField("phone")}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="01XXXXXXXXX"
              />
              {errors.phone && <span className="mt-[5px] block text-sm font-medium text-red-600">{errors.phone}</span>}
            </label>
            <label className="mb-3.5 block font-semibold text-slate-900">
              পূর্ণ ঠিকানা
              <textarea
                className={`${field} resize-y`}
                value={form.address}
                onChange={setField("address")}
                rows={3}
                autoComplete="street-address"
                placeholder="বাসা/রোড, এলাকা, থানা, জেলা"
              />
              {errors.address && <span className="mt-[5px] block text-sm font-medium text-red-600">{errors.address}</span>}
            </label>
          </div>

          <div className="self-start rounded-2xl border-2 border-dashed border-slate-900 bg-slate-50 p-5">
            <h3 className={`${baloo.className} mb-2 text-[22px] leading-tight font-extrabold text-slate-900`}>অর্ডার সামারি</h3>
            <div className="flex items-center justify-between py-1.5 text-slate-800">
              <span>{pkg.name}</span>
              <motion.b key={pkg.price} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                ৳{toBn(pkg.price)}
              </motion.b>
            </div>
            <div className="flex items-center justify-between py-1.5 text-slate-800">
              <span>ডেলিভারি চার্জ</span>
              <motion.b key={delivery} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                ৳{toBn(delivery)}
              </motion.b>
            </div>
            <div className="mt-2 flex items-center justify-between border-t-2 border-slate-900 pt-3 pb-1.5 text-[23px] font-extrabold text-slate-900">
              <span>সর্বমোট</span>
              <motion.b
                key={total}
                initial={{ y: 14, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
              >
                ৳{toBn(total)}
              </motion.b>
            </div>

            {/* দৃশ্যমান এবং আকর্ষণীয় সাবমিট বাটন */}
            <button
              className="mt-[18px] flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 bg-rose-600 px-6 py-4 text-lg font-extrabold text-white shadow-[4px_4px_0px_#0f172a] transition-all hover:bg-rose-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "পাঠানো হচ্ছে…" : "অর্ডার কনফার্ম করুন 🛒"}
            </button>
            
            {status === "error" && (
              <p className="mt-[5px] block text-sm font-medium text-red-600" role="alert">
                অর্ডার পাঠানো যায়নি। ইন্টারনেট কানেকশন চেক করে আবার চেষ্টা করুন।
              </p>
            )}
            <p className="mt-3 text-center text-sm text-slate-600">🚚 ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে টাকা দিন</p>
          </div>
        </form>
      </div>

      {status === "done" && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-5" role="dialog" aria-modal="true" aria-label="অর্ডার সম্পন্ন">
          <motion.div
            className="max-w-[420px] rounded-[22px] border-2 border-slate-900 bg-white p-[30px] text-center shadow-[8px_8px_0px_#0f172a]"
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="mb-2 text-4xl leading-none">🎉</div>
            <h3 className={`${baloo.className} mb-1.5 text-[26px] leading-tight font-extrabold text-slate-900`}>অর্ডার পেয়েছি, ধন্যবাদ!</h3>
            <p className="mb-5 text-slate-600">আমরা শীঘ্রই আপনাকে ফোন করে অর্ডারটি কনফার্ম করব।</p>
            
            {/* পপ-আপের দৃশ্যমান ঠিক আছে বাটন */}
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border-2 border-slate-900 bg-amber-400 px-8 py-3 text-base font-extrabold text-slate-900 shadow-[3px_3px_0px_#0f172a] transition-all hover:bg-amber-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              onClick={closeDone}
            >
              ঠিক আছে
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
}