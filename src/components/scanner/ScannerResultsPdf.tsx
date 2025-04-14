/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const handleDownloadPDF = async () => {
  const element = document.getElementById("scan-result-section");
  if (!element) return;

  // ✅ Rekursīvi nomaina oklch stilus uz hex (pirms html2canvas)
  const sanitizeColors = (node: HTMLElement) => {
    const style = window.getComputedStyle(node);
    for (const key of style) {
      const value = style.getPropertyValue(key);
      if (value.includes("oklch")) {
        (node.style as any)[key] = "#888888"; // fallback krāsa
      }
    }
    [...node.children].forEach((child) => sanitizeColors(child as HTMLElement));
  };

  sanitizeColors(element);

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("nft-scan-result.pdf");
  } catch (err) {
    console.error("❌ PDF generation failed:", err);
  }
};
