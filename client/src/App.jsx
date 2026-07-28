import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./components/Splash/SplashScreen";
import { useState } from "react";

function App(){
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <SplashScreen onFinish={()=>setLoading(false)} />
      )}
      {/* <Layout /> */}
      <AppRoutes />;
    </>
  );
}

export default App;