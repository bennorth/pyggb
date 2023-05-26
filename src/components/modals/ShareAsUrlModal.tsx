import { Spinner, Button } from "react-bootstrap";
import React, { useState } from "react";

const BodyComputing = () => {
  return (
    <div className="ShareAsUrlModalBody computing">
      <Spinner></Spinner>
    </div>
  );
};

type BodyReadyProps = { url: string };
const BodyReady: React.FC<BodyReadyProps> = ({ url }) => {
  const [showCopiedIndicator, setShowCopiedIndicator] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setShowCopiedIndicator(true);
    setTimeout(() => setShowCopiedIndicator(false), 1200);
  };

  const buttonLabel = showCopiedIndicator ? "✓" : "Copy";
  return (
    <div className="ShareAsUrlModalBody ready">
      <input className="shareUrl" readOnly size={45} value={url} />
      <Button onClick={copy}>{buttonLabel}</Button>
    </div>
  );
};
