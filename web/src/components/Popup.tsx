import React from "react";

interface PopupProps {
  children: React.ReactNode;
  active: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const Popup: React.FC<PopupProps> = ({ children, active, onClose }) => {
  if (!active) {
    return null;
  }

  return (
    <div>
      {children}
      <button onClick={() => onClose(true)}>Accept</button>
      <button onClick={() => onClose(false)}>Close</button>
    </div>
  );
};

export default Popup;
