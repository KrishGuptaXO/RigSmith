import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/Splash/SplashScreen";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import authStore from "./store/authStore";
import wishlistStore from "./store/wishlistStore";
import useWishlistStore from "./store/wishlistStore";

function App(){
  const [loading, setLoading] = useState(true);
  
  const hasHydrated = authStore(
    (state) => state.hasHydrated
  );
  
  const restoreSession = authStore(
    (state) => state.restoreSession
  );
  
  const fetchWishlist = useWishlistStore(
    (state) => state.fetchWishlist
  );

  useEffect(() => {
    if (!hasHydrated) return;

    const initializeApp = async () => {
      const sessionRestored = await restoreSession();

      if (sessionRestored) {
        await fetchWishlist();
      }

      setLoading(false);
    };

    initializeApp();
  }, [hasHydrated, restoreSession, fetchWishlist]);


  return (
    <>

      {loading && (
        <SplashScreen onFinish={()=>setLoading(false)} />
      )}

      <Toaster position="bottom-right" />

      <AppRoutes />

    </>
  );
}

export default App;