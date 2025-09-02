import { useLocation } from "react-router-dom";
import MobileBottomNav from "./MobileBottomNav";

const MobileBottomNavWrapper = () => {
  const location = useLocation();
  
  // Don't show mobile nav on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return <MobileBottomNav />;
};

export default MobileBottomNavWrapper;