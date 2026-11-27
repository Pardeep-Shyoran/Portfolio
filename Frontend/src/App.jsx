import { useEffect, lazy } from "react";
import Header from "./components/Header/Header";
import MainRoutes from "./routes/MainRoutes";
import CanvasBackground from "./components/CanvasBackground/CanvasBackground";
import ShuttleLight from "./components/CanvasBackground/ShuttleLight";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import DeferredSection from "./components/DeferredSection/DeferredSection";
import { AgentBridge } from "./agent/webmcp";

const Footer = lazy(() => import("./components/Footer/Footer"));

const App = () => {
  // Clean up static pre-rendered head tags once React & react-helmet take ownership
  useEffect(() => {
    const prerenderedTags = document.head.querySelectorAll('[data-prerendered="true"]');
    prerenderedTags.forEach((node) => node.remove());
  }, []);

  // Load GSAP ScrollSmoother only on desktop fine-pointer devices when motion is enabled
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const isDesktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isAutomatedBrowser = typeof navigator !== "undefined" && Boolean(navigator.webdriver);

    if (!isDesktop || reduceMotion || isAutomatedBrowser) {
      return undefined;
    }

    let cancelled = false;
    let smoother = null;

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/ScrollSmoother"),
    ]).then(([gsapMod, stMod, ssMod]) => {
      if (cancelled) return;
      const gsap = gsapMod.default || gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
      const ScrollSmoother = ssMod.ScrollSmoother || ssMod.default;
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
      gsap.ticker.lagSmoothing(1000, 16);
      window.__PORTFOLIO_SCROLL_TRIGGER__ = ScrollTrigger;
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 0.9,
        effects: true,
        smoothTouch: false,
        normalizeScroll: false,
        ignoreMobileResize: true,
      });
      window.__PORTFOLIO_SMOOTHER__ = smoother;
    });

    return () => {
      cancelled = true;
      if (smoother) {
        smoother.kill();
      }
      if (window.__PORTFOLIO_SMOOTHER__ === smoother) {
        delete window.__PORTFOLIO_SMOOTHER__;
      }
    };
  }, []);

  return (
    <>
      <AgentBridge />
      <ScrollToTop />
      <CanvasBackground cellSize={49} opacity={0.35} lineWidth={1} />
      <ShuttleLight />
      <Header />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main id="main-content">
            <MainRoutes />
          </main>
          <DeferredSection
            id="site-footer"
            minHeight="320px"
            rootMargin="500px"
            render={() => <Footer />}
          />
        </div>
      </div>
    </>
  );
};

export default App;
