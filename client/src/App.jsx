import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/Splash/SplashScreen";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import authStore from "./store/authStore";

function App(){
  const [loading, setLoading] = useState(true);
  
  const hasHydrated = authStore(
    (state) => state.hasHydrated
  );
  
  const restoreSession = authStore(
    (state) => state.restoreSession
  );

  useEffect(() => {
    if (!hasHydrated) return;

    const initializeApp = async () => {
      await restoreSession();
      setLoading(false);
    };

    initializeApp();
  }, [hasHydrated, restoreSession]);

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