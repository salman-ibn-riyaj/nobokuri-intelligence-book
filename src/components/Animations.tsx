"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Lenis (smooth scroll) + GSAP (hero ও features animation)
 * কিছু render করে না, শুধু পেজের server-rendered element গুলোকে animate করে।
 * Target class: .hero-in .hero-sun .hero-img .hero-sticker .feat .feat-grid
 */
export default function Animations() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    // `href="#order"` এর মতো anchor link গুলোও smooth scroll হবে
    const lenis = new Lenis({ duration: 1.1, anchors: { offset: -70 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-in", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 })
        .fromTo(".hero-sun", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.6)" }, 0.1)
        .fromTo(".hero-img", { y: 40, rotate: -8, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 0.8 }, 0.35)
        .fromTo(".hero-sticker", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.4)" }, 0.9);

      gsap.to(".hero-img", { y: -10, duration: 2.2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.7 });

      gsap.from(".feat", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".feat-grid", start: "top 80%", once: true },
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}