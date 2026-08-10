import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/Splash/SplashScreen";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

function App(){
  const [loading, setLoading] = useState(true);

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