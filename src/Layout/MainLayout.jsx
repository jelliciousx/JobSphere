import { useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  const mainRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the <main> element directly
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    // Also try window as fallback
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="main-layout">
      <Navbar />
      <main ref={mainRef} className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
