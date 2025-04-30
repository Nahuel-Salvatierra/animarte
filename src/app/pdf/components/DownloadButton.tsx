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

  const generateAndSendPDF = async (element: Element) => {
    const pdfBlob = await html2pdf().from(element).outputPdf('blob');

    const formData = new FormData();
    formData.append('file', pdfBlob, fileName);

    await Promise.all([
      fetch('/upload', { method: 'POST', body: formData }),
      new Promise<void>((resolve) => {
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        resolve();
      }),
    ]);
  };

  const handleClick = async () => {
    setLoading(true);
    const element = document.querySelector('#catalog-pdf');
    if (element) {
      try {
        await generateAndSendPDF(element);
        onSuccess?.();
      } catch (error) {
        console.error('Error al generar o enviar el PDF:', error);
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
        <>
          <div className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full" />
          <div>Procesando...</div>
        </>
      ) : (
        <div className="flex truncate items-center gap-2">
          Descargar y Enviar <SendIcon />
        </div>
      )}
    </Button>
  );
}
