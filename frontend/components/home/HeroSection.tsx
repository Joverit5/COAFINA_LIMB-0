"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Sección hero del Home
 * Muestra el título grande "LIMB-O" con animación
 */
export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current || !containerRef.current) return;

    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    // Animación del contenedor
    timeline.fromTo(
      containerRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.5,
      }
    );

    // Animación del título
    timeline.fromTo(
      titleRef.current,
      {
        opacity: 0,
        y: 100,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.4,
        ease: "power4.out",
      },
      "-=0.3"
    );

    // Animación del subtítulo
    timeline.fromTo(
      subtitleRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
      },
      "-=0.4"
    );

    // Cleanup
    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-end justify-start pointer-events-none opacity-0"
    >
      <div className="p-10">
        <h2
          ref={titleRef}
          className="font-unbounded font-medium text-[6rem] md:text-[8rem] lg:text-[10rem]
                     leading-none text-flamingo-400"
        >
          LIMB-0
        </h2>
        <p
          ref={subtitleRef}
          className="font-sans text-base md:text-lg text-flamingo-400 mt-4 ml-2"
        >
          Visualización de datos de residuos electrónicos
        </p>
      </div>
    </div>
  );
}
