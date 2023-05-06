import React, { useEffect } from "react";
import { IDE } from "./components/IDE";
import "bootstrap/dist/css/bootstrap.min.css";
import { useStoreActions } from "./store";
import { FileChooserModal } from "./components/modals/FileChooserModal";
import { NewFileModal } from "./components/modals/NewFileModal";
import { DownloadPythonModal } from "./components/modals/DownloadPythonModal";
import { AboutPyGgbModal } from "./components/modals/AboutPyGgbModal";

function App() {
  const bootDependencies = useStoreActions((a) => a.dependencies.boot);

  useEffect(() => {
    bootDependencies();
  });

  return (
    <div className="App">
      <FileChooserModal />
      <NewFileModal />
      <DownloadPythonModal />
      <AboutPyGgbModal />
      <IDE />
    </div>
  );
}

export default App;
