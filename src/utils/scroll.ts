let activeScrollToken = 0;

function waitForScrollEndFallback(): Promise<void> {
  return new Promise((resolve) => {
    let idleTimer = 0;

    const finish = () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener('scrollend', finish);
      window.removeEventListener('scroll', onScroll);
      resolve();
    };

    const onScroll = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(finish, 140);
    };

    window.addEventListener('scrollend', finish, { once: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    idleTimer = window.setTimeout(finish, 140);
  });
}

async function waitForWindowScroll(targetY: number, behavior: ScrollBehavior): Promise<void> {
  const result = window.scrollTo({ top: targetY, behavior }) as unknown;
  if (behavior === 'auto' || Math.abs(window.scrollY - targetY) <= 2) {
    return;
  }

  if (result instanceof Promise) {
    await result;
    // Root scroller scroll promises can resolve early before reaching targetY
    if (Math.abs(window.scrollY - targetY) <= 12) {
      return;
    }
  }

  await waitForScrollEndFallback();
}

function getEffectiveOffset(element: HTMLElement, explicitOffset?: number): number {
  if (typeof explicitOffset === 'number') return explicitOffset;
  const computedMarginTop = parseFloat(window.getComputedStyle(element).scrollMarginTop);
  return Number.isFinite(computedMarginTop) ? computedMarginTop : 0;
}

/**
 * Smoothly scrolls to a target element with cancellation support for rapid clicks
 * and a post-scroll settlement check in case lazy content shifts mid-scroll.
 */
export async function scrollToElement(
  element: HTMLElement | null,
  explicitOffset?: number,
  immediate = false
): Promise<void> {
  if (!element || typeof window === 'undefined') return;

  const token = ++activeScrollToken;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior: ScrollBehavior = immediate || prefersReducedMotion ? 'auto' : 'smooth';
  const offset = getEffectiveOffset(element, explicitOffset);

  const initialTop = Math.max(
    0,
    Math.round(element.getBoundingClientRect().top + window.scrollY - offset)
  );

  await waitForWindowScroll(initialTop, behavior);
  if (token !== activeScrollToken || !element.isConnected) return;

  const drift = element.getBoundingClientRect().top - offset;
  if (Math.abs(drift) > 6) {
    const correctedTop = Math.max(0, Math.round(window.scrollY + drift));
    window.scrollTo({ top: correctedTop, behavior: 'auto' });
  }
}

export function scrollToElementById(
  id: string,
  explicitOffset?: number,
  immediate = false
): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  return scrollToElement(document.getElementById(id), explicitOffset, immediate);
}
