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

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

const App = () => {

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    gsap.ticker.lagSmoothing(1000, 16);

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: isTouchDevice ? 0.35 : 1.2,
      effects: !isTouchDevice,
      smoothTouch: isTouchDevice ? 0.05 : 0.1,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });

    return () => {
      smoother.kill();
    };
  }, []);

  return (
    <>
        <ScrollToTop />
        <CanvasBackground cellSize={49} opacity={0.4} lineWidth={1} />
        <ShuttleLight />
        <Header />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <MainRoutes />
            <Footer />
          </div>
        </div>
    </>
  )
}

export default App