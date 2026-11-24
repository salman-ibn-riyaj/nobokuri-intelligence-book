"use client";

import { useEffect } from "react";
import { initPixel } from "./pixel";

/** পেজে একবার বসান: <MetaPixel pixelId="123456789" /> */
export default function MetaPixel({ pixelId }: { pixelId: string }) {
  useEffect(() => {
    initPixel(pixelId);
  }, [pixelId]);
  return null;
}