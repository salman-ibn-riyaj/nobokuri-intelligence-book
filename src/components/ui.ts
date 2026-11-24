/** একাধিক জায়গায় ব্যবহৃত Tailwind class */

export const wrap = "mx-auto max-w-[1080px] px-5";

const btnBase =
  "inline-block cursor-pointer rounded-[14px] border-2 border-ink font-bold leading-normal no-underline shadow-hard " +
  "transition-[transform,box-shadow] duration-100 motion-reduce:transition-none " +
  "hover:-translate-x-px hover:-translate-y-px hover:shadow-hard-md " +
  "active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_var(--color-ink)] " +
  "disabled:cursor-wait disabled:opacity-60 " +
  "focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-coral";

/** হলুদ ছোট বাটন */
export const btnSun = `${btnBase} bg-sun px-[22px] py-[9px] text-[17px] text-ink`;

/** লাল বড় বাটন (CTA / submit) */
export const btnCoralBig = `${btnBase} bg-coral px-[30px] py-[13px] text-[19px] text-white`;

export const field =
  "mt-1.5 block w-full rounded-xl border-2 border-ink bg-paper px-3.5 py-[11px] text-[17px] text-ink " +
  "focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-coral";