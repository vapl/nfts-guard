import React, { ReactNode, useState, useRef, useEffect } from "react";
import { FaCircleInfo } from "react-icons/fa6";

interface TooltipInfoProps {
  content: ReactNode;
}

const TooltipInfo: React.FC<TooltipInfoProps> = ({ content }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      tooltipRef.current &&
      !tooltipRef.current.contains(event.target as Node)
    ) {
      setVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div ref={tooltipRef} className="relative inline-block">
      <FaCircleInfo
        className="text-gray-400 cursor-pointer"
        onClick={() => setVisible((prev) => !prev)}
      />

      {visible && (
        <div className="absolute bottom-full mb-2 w-56 p-2 border border-gray-400 bg-card text-paragraph text-sm rounded-md drop-shadow-2xl z-50">
          {content}
        </div>
      )}
    </div>
  );
};

export default TooltipInfo;
