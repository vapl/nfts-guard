import { ScanResultCardProps } from "@/types/apiTypes/globalApiTypes";
import Image from "next/image";

const COLORS = {
  secure: "#8b5cf6",
  caution: "#f59e0b",
  dangerous: "#f43f5e",
};

export function ScanResultCard({
  title,
  value,
  highlight,
  details,
  image,
  icon,
  variant,
  chart,
}: ScanResultCardProps) {
  return (
    <>
      <div
        className={`bg-[#1c1c3c] rounded-xl p-6 shadow-md border
    ]`}
        style={{
          borderColor:
            variant === "Dangerous"
              ? COLORS.dangerous
              : variant === "Coution"
              ? COLORS.caution
              : COLORS.secure,
        }}
      >
        <div className="flex justify-between w-full">
          <div className="flex-1">
            <h4 className="text-gray-400 text-sm mb-1">{title}</h4>
            <div className="text-2xl font-bold text-white">{value}</div>
          </div>
          <div className="flex flex-col justify-center items-center">
            {icon && (
              <div
                className="mb-2 text-purple-400 h-6"
                style={{
                  color:
                    variant === "Dangerous"
                      ? COLORS.dangerous
                      : variant === "Caution"
                      ? COLORS.caution
                      : COLORS.secure,
                }}
              >
                {icon}
              </div>
            )}
            {variant && (
              <div
                className="mb-2"
                style={{
                  color:
                    variant === "Dangerous"
                      ? COLORS.dangerous
                      : variant === "Caution"
                      ? COLORS.caution
                      : COLORS.secure,
                }}
              >
                {variant}
              </div>
            )}
          </div>
        </div>
        {highlight && (
          <span
            className={`inline-block mt-1 text-sm font-semibold px-3 py-1 rounded-full bg-red-600 ${
              variant === "Dangerous"
                ? "bg-red-600"
                : variant === "Caution"
                ? "bg-yellow-600"
                : "bg-green-600"
            }`}
          >
            {highlight}
          </span>
        )}
        {image && (
          <Image
            src={image}
            alt="NFT"
            width={250}
            height={250}
            className="rounded-md mt-4 w-full h-32 object-cover"
          />
        )}
        {details && (
          <ul className="flex mt-4 text-sm text-gray-400 gap-3">
            {details.map((d, idx) => (
              <li key={idx}> {d}</li>
            ))}
          </ul>
        )}

        {chart && <div>{chart}</div>}
      </div>
    </>
  );
}
