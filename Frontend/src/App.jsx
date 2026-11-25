import Footer from "./components/Footer/Footer"
import Header from "./components/Header/Header"
import MainRoutes from "./routes/MainRoutes"
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import CanvasBackground from "./components/CanvasBackground/CanvasBackground";
import ShuttleLight from "./components/CanvasBackground/ShuttleLight";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { AgentBridge } from "./agent/webmcp";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

const App = () => {

  useGSAP(() => {
    gsap.ticker.lagSmoothing(1000, 16);

    const mm = gsap.matchMedia();

    // Enable ScrollSmoother only on desktop devices with fine pointers
    // when reduced motion is NOT requested. Mobile & touch devices use native
    // momentum scrolling to avoid scroll-locking and touch latency.
    mm.add(
      {
        isDesktop: "(min-width: 1024px) and (pointer: fine)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions;
        const isAutomatedBrowser = typeof navigator !== "undefined" && Boolean(navigator.webdriver);

        if (!isDesktop || reduceMotion || isAutomatedBrowser) {
          return undefined;
        }

        const smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 0.9, // Subtle, responsive, luxurious feel without sluggish float
          effects: true,
          smoothTouch: false, // Do not hijack touch devices
          normalizeScroll: false, // Do not hijack native wheel/trackpad scrolling
          ignoreMobileResize: true,
        });

        return () => {
          smoother.kill();
        };
      }
    );

    return () => {
      mm.revert();
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
          <Footer />
        </div>
      </div>
    </>
  );
};

export default App