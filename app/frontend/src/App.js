import React, { useState } from "react";
import HomePage from "./Homepage";
import Login from "./Login";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div>
      {showLogin ? <Login /> : <HomePage setShowLogin={setShowLogin} />}
    </div>
  );
};

export default App;
