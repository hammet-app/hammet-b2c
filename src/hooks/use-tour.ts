import { useCallback, useEffect, useRef } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { hammetDashboardSteps } from '@/lib/onboarding/tours/hammet-admin'

const TOURS = {

  "hammet-dashboard": hammetDashboardSteps,
}

export type TourId = keyof typeof TOURS;


interface UseTourOptions {
  onComplete: () => void
}

function scrollTourTargetIntoView(element: Element | string) {
  const target =
    typeof element === "string"
      ? document.querySelector(element)
      : element;

  if (!target) return;

  const scrollContainer = document.getElementById("lesson-scroll");

  if (!scrollContainer) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    return;
  }

  const containerRect = scrollContainer.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const targetTop = targetRect.top - containerRect.top;
  const targetBottom = targetRect.bottom - containerRect.top;

  const isAbove = targetTop < 0;
  const isBelow = targetBottom > containerRect.height;

  if (isAbove || isBelow) {
    scrollContainer.scrollTo({
      top:
        scrollContainer.scrollTop +
        targetTop -
        containerRect.height / 2 +
        targetRect.height / 2,
      behavior: "smooth",
    });
  }
}

export function useTour({ onComplete }: UseTourOptions) {
  const driverRef = useRef<ReturnType<typeof driver> | null>(null)
  const scrollPositionRef = useRef(0)

  useEffect(() => {
    const handleResize = () => {
      driverRef.current?.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const startTour = useCallback(
    (tourId: TourId) => {
      driverRef.current?.destroy();

      const scrollContainer = document.getElementById("lesson-scroll");

      const previousScrollTop = scrollContainer?.scrollTop ?? 0;

      driverRef.current = driver({
        animate: true,
        smoothScroll: true,

        showProgress: true,
        progressText: "{{current}} of {{total}}",
        nextBtnText: "Next →",
        prevBtnText: "← Back",
        doneBtnText: "Done",

        overlayColor: "#1a0533",
        overlayOpacity: 0.4,
        popoverClass: "hammet-tour-popover",

        onHighlightStarted: (element) => {
          if (element) {
            scrollTourTargetIntoView(element);
          }
        },

        onDestroyStarted: () => {
          driverRef.current?.destroy();
        },

        onDestroyed: () => {
          if (scrollContainer) {
            scrollContainer.scrollTo({
              top: previousScrollTop,
              behavior: "smooth",
            });
          }

          onComplete();
        },

        steps: TOURS[tourId],
      });

      driverRef.current.drive();
    },
    [onComplete]
  );  

  return { startTour }
}