import React, { useEffect } from "react";
import { IDE } from "./components/IDE";
import "bootstrap/dist/css/bootstrap.min.css";
import { useStoreActions } from "./store";
import { FileChooserModal } from "./components/modals/FileChooserModal";
import { NewFileModal } from "./components/modals/NewFileModal";
import { DownloadPythonModal } from "./components/modals/DownloadPythonModal";
import { AboutPyGgbModal } from "./components/modals/AboutPyGgbModal";
import { NewFileFromQueryModal } from "./components/modals/NewFileFromQueryModal";
import { ShareAsUrlModal } from "./components/modals/ShareAsUrlModal";

function App() {
  const bootDependencies = useStoreActions((a) => a.dependencies.boot);

  useEffect(() => {
    const url = new URL(window.location.href);
    bootDependencies(url.searchParams);
  });

  return (
    <div className="App">
      <ShareAsUrlModal />
      <NewFileFromQueryModal />
      <FileChooserModal />
      <NewFileModal />
      <DownloadPythonModal />
      <AboutPyGgbModal />
      <IDE />
    </div>
  );
}

export default App;
