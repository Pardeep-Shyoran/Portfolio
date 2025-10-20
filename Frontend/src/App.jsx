import Footer from "./components/Footer/Footer"
import Header from "./components/Header/Header"
import MainRoutes from "./routes/MainRoutes"
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import CanvasBackground from "./components/CanvasBackground/CanvasBackground";
import ShuttleLight from "./components/CanvasBackground/ShuttleLight";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const App = () => {

  useGSAP(() => {
    ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.2,
      effects: true,
      smoothTouch: 0.1,
      normalizeScroll: true,
    })
  }, []);

  return (
    <>
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