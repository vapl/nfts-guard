import React, { ReactNode, useState, useRef, useEffect } from "react";
import { RiRobot3Fill } from "react-icons/ri";

interface TooltipInfoProps {
  content: ReactNode;
}

const TooltipInfo: React.FC<TooltipInfoProps> = ({ content }) => {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
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
    <div ref={wrapperRef} className="inline-block">
      <RiRobot3Fill
        className={`${
          visible ? "text-purple-600" : "text-gray-400"
        } cursor-pointer`}
        onClick={() => setVisible((prev) => !prev)}
      />

      {visible && (
        <div
          className={`
              absolute bottom-full -mb-4.5 left-1/2 -translate-x-1/2
              w-[400px] sm:left-1/2 sm:-translate-x-1/2 sm:right-auto
              max-w-[80vw] sm:max-w-[350px] 
              p-3 border border-purple-600 text-paragraph text-sm
              rounded-md drop-shadow-lg z-50 whitespace-normal
              bg-card opacity-95
            `}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default TooltipInfo;
