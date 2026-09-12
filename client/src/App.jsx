import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/Splash/SplashScreen";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import authStore from "./store/authStore";
import useWishlistStore from "./store/wishlistStore";
import useCartStore from "./store/useCartStore";

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

  const fetchCart = useCartStore(
    (state) => state.fetchCart
  );

  useEffect(() => {
    if (!hasHydrated) return;

    const initializeApp = async () => {
      const sessionRestored = await restoreSession();

      if (sessionRestored) {
        await fetchWishlist();
        await fetchCart();
      }

      setLoading(false);
    };

    initializeApp();
  }, [hasHydrated, restoreSession, fetchWishlist, fetchCart,]);


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