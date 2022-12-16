import React, { useEffect } from "react";
import { IDE } from "./components/IDE";
import "bootstrap/dist/css/bootstrap.min.css";
import { useStoreActions } from "./store";

function App() {
  const bootDependencies = useStoreActions((a) => a.dependencies.boot);

  useEffect(() => {
    bootDependencies();
  });

  return (
    <div className="App">
      <IDE />
    </div>
  );
}

export default App;
