'use client';

import html2pdf from 'html2pdf.js';
import { SendIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export default function DownloadButton({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const fileName = `pedido-${new Date().toDateString()}.pdf`;

  const handleClick = async () => {
    setLoading(true);
    const element = document.querySelector('#catalog-pdf');

    if (element) {
      await html2pdf(element);
      try {
        const pdfBlob = await html2pdf().from(element).outputPdf('blob');

        const formData = new FormData();
        formData.append('file', pdfBlob, fileName);

        const uploadPromise = fetch('/upload', {
          method: 'POST',
          body: formData,
        });

        const downloadPromise = new Promise<void>((resolve) => {
          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(url);
          resolve();
        });

        await Promise.all([uploadPromise, downloadPromise]);

        onSuccess?.();
      } catch (error) {
        console.log('Error generating PDF:', error);
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
