import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Hook para animar números con efecto de contador
 * Usa GSAP para animar desde 0 hasta el valor final
 */
export function useCounterAnimation(
  endValue: number,
  duration: number = 1.5,
  delay: number = 0,
  decimals: number = 0
) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!nodeRef.current) return;

    const obj = { value: 0 };

    // Cancelar animación anterior si existe
    if (animationRef.current) {
      animationRef.current.kill();
    }

    animationRef.current = gsap.to(obj, {
      value: endValue,
      duration,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        if (nodeRef.current) {
          nodeRef.current.textContent = obj.value.toFixed(decimals);
        }
      },
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [endValue, duration, delay, decimals]);

  return nodeRef;
}

/**
 * Hook para animar números grandes con formato (12.5M)
 */
export function useFormattedCounterAnimation(
  endValue: number,
  duration: number = 1.5,
  delay: number = 0,
  formatter: (value: number) => string
) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!nodeRef.current) return;

    const obj = { value: 0 };

    // Cancelar animación anterior si existe
    if (animationRef.current) {
      animationRef.current.kill();
    }

    animationRef.current = gsap.to(obj, {
      value: endValue,
      duration,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        if (nodeRef.current) {
          nodeRef.current.textContent = formatter(obj.value);
        }
      },
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [endValue, duration, delay, formatter]);

  return nodeRef;
}
