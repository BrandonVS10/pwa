import { useEffect, useState } from "react";

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    setTimeout(onFinish, 3000); // Duración del splash
  }, [onFinish]);

  return (
    <div className="splash-container">
      <h1 className="splash-text">Cargando<span className="dots">...</span></h1>
    </div>
  );
};

export default SplashScreen;
