import { useEffect } from "react";
import { useLocation, useNavigation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") {
      const main = document.querySelector("main");
      if (main) main.scrollTop = 0;
      window.scrollTo(0, 0);
    }
  }, [pathname, navigation.state]);

  return null;
};

export default ScrollToTop;
