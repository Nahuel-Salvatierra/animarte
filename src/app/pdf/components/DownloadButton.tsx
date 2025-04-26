'use client';

import html2pdf from 'html2pdf.js';
import { SendIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export default function DownloadButton({
  onDownload,
}: {
  onDownload?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const fileName = `pedido-${new Date().toDateString()}.pdf`;

  const handleClick = async () => {
    setLoading(true);
    const element = document.querySelector('#catalog-pdf');

    if (element) {
      try {
        const pdfBlob = await html2pdf().from(element).outputPdf('blob');

        const formData = new FormData();
        formData.append('file', pdfBlob, fileName);

        await fetch('/upload', {
          method: 'POST',
          body: formData,
        });
        onDownload?.();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Button
      disabled={loading}
      onClick={handleClick}
      variant="default"
      className="md:max-w-[30%]"
    >
      {loading ? (
        <div className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full" />
      ) : (
        <div className="flex truncate items-center gap-2">
          Enviar <SendIcon />
        </div>
      )}
    </Button>
  );
}
