import { ScanResultCardProps } from "@/types/apiTypes/globalApiTypes";
import Image from "next/image";
import TooltipInfo from "../tooltips/TooltipInfo";

interface ExtendedScanResultCardProps extends ScanResultCardProps {
  tooltipInfo?: string;
}

export function ScanResultCard({
  title,
  value,
  highlight,
  details,
  image,
  icon,
  variant,
  chart,
  tooltipInfo,
}: ExtendedScanResultCardProps) {
  return (
    <>
      <div
        className={`relative bg-card rounded-xl p-6 drop-shadow-lg border
    ]`}
        style={{
          borderColor:
            variant === "Dangerous"
              ? "rgb(var(--danger))"
              : variant === "Coution"
              ? "rgb(var(--warning))"
              : "transparent",
        }}
      >
        <div className="flex justify-between w-full">
          <div className="flex-1">
            <div className="flex-1 flex gap-3">
              <h4 className="text-paragraph text-sm mb-1">{title}</h4>
              <TooltipInfo content={tooltipInfo} />
            </div>
            <div className="text-2xl font-bold text-heading">{value}</div>
          </div>
          <div className="flex flex-col justify-between items-center">
            {icon && (
              <div
                className="mb-2 text-accent-purple h-6"
                style={{
                  color:
                    variant === "Dangerous"
                      ? "rgb(var(--danger))"
                      : variant === "Caution"
                      ? "rgb(var(--warning))"
                      : "rgb(var(--success))",
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
                      ? "rgb(var(--danger))"
                      : variant === "Caution"
                      ? "rgb(var(--warning))"
                      : "rgb(var(--success))",
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
          <ul className="flex mt-4 text-paragraph gap-6">
            {details.map((d, idx) => (
              <li key={idx} className="flex flex-col text-wrap">
                <span className="flex text-xs text-wrap pb-0.5 border-b-1 min-h-10 items-end border-gray-600">
                  {d.label}
                </span>
                <span className="text-md text-paragraph font-semibold text-nowrap">
                  {d.value}
                </span>
              </li>
            ))}
          </ul>
        )}

        {chart && <div>{chart}</div>}
      </div>
    </>
  );
}
