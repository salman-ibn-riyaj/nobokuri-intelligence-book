import { Baloo_Da_2, Hind_Siliguri } from "next/font/google";

/** শিরোনামের জন্য (শুধু 600 ও 800 weight: font-semibold / font-extrabold) */
export const baloo = Baloo_Da_2({ subsets: ["bengali", "latin"], weight: ["600", "800"], display: "swap" });

/** বডি টেক্সটের জন্য */
export const hind = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"], display: "swap" });