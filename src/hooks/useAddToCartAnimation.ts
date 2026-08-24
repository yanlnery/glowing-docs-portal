import { useRef, useCallback } from "react";
import { animate, arc, motionValue } from "motion";

const strength = 0.5;
const peak = 0.15;
const rotate = 0.9;
const duration = 0.45;
const basketVelocityFactor = 0.05;
const direction = "cw" as const;
const ease = [0.74, 0.18, 0.93, 0.69] as const;
const PRODUCT_SIZE = 120;
const BASKET_BOX = 44;
const FLY_SCALE = BASKET_BOX / PRODUCT_SIZE;

export function useAddToCartAnimation() {
  const isFlying = useRef(false);

  const triggerFlyAnimation = useCallback(
    async (
      productEl: HTMLElement,
      basketEl: HTMLElement,
      ringEl: HTMLElement,
      onComplete?: () => void
    ) => {
      if (isFlying.current) return;
      isFlying.current = true;

      try {
        const from = productEl.getBoundingClientRect();
        const to = basketEl.getBoundingClientRect();

        const dx = to.left + to.width / 2 - (from.left + from.width / 2);
        const dy = to.top + to.height / 2 - (from.top + from.height / 2);

        const probeX = motionValue(0);
        const probeY = motionValue(0);

        await Promise.all([
          animate(
            productEl,
            { x: dx, y: dy, scale: FLY_SCALE, opacity: [1, 1, 0] },
            {
              duration,
              ease: ease as unknown as number[],
              path: arc({ strength, peak, rotate, direction }),
              opacity: { inherit: true, times: [0, 0.95, 1] },
            } as any
          ),
          animate(probeX, dx, { duration, ease: ease as unknown as number[] }),
          animate(probeY, dy, { duration, ease: ease as unknown as number[] }),
        ]);

        animate(
          basketEl,
          { x: 0, y: 0 },
          {
            type: "spring",
            stiffness: 500,
            damping: 12,
            x: { inherit: true, velocity: probeX.getVelocity() * basketVelocityFactor },
            y: { inherit: true, velocity: probeY.getVelocity() * basketVelocityFactor },
          } as any
        );

        animate(
          ringEl,
          { scale: [1, 2.4], opacity: [0.8, 0] },
          { duration: 0.5, ease: "easeOut" }
        );

        animate(
          productEl,
          { x: 0, y: 0, scale: 0.9, rotate: 0, opacity: 0 },
          { duration: 0 }
        );

        await animate(
          productEl,
          { opacity: 1, scale: 1 },
          {
            scale: { type: "spring", visualDuration: 0.4, bounce: 0.35 },
            opacity: { duration: 0.25, ease: "easeOut" },
          } as any
        );

        onComplete?.();
      } finally {
        isFlying.current = false;
      }
    },
    []
  );

  return { triggerFlyAnimation };
}

export const cartIconRef = { current: null as HTMLElement | null };
export const cartRingRef = { current: null as HTMLElement | null };
