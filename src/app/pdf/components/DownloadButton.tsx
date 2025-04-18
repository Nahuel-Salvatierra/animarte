// components/pdf/DownloadButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { DownloadCloud } from "lucide-react";
import html2pdf from "html2pdf.js";

export default function DownloadButton({
  onDownload,
}: {
  onDownload?: () => void;
}) {
  const fileName = `factura-${"asdf"}.pdf`;

  const handleClick = () => {
    const element = document.querySelector("#catalog-pdf");
    if (element) html2pdf(element);
    onDownload?.();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant="default"
        className="md:max-w-[30%]"
      >
        Descargar {fileName}
        <DownloadCloud />
      </Button>
    </>
  );
}
