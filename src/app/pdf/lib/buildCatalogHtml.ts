export type PdfCatalogItem = {
  reference: { name: string };
  amount: number;
  imageDataUrl: string;
};

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function escapeDataUrl(dataUrl: string): string {
  return dataUrl.replace(/"/g, '&quot;');
}

export function buildCatalogHtml(
  name: string,
  cartItems: PdfCatalogItem[],
): string {
  const itemsHtml = cartItems
    .map(
      (item) => `
    <div style="display:flex;flex-direction:row;align-items:flex-start;gap:12px;margin-bottom:16px;">
      <img src="${escapeDataUrl(item.imageDataUrl)}" width="70" height="70" alt="" style="flex-shrink:0;object-fit:cover;border:1px solid #e8e8e8;" />
      <div>
        <p style="margin:0 0 4px;font-size:14px;color:#252525;font-family:system-ui,sans-serif;">${escapeHtml(item.reference.name)}</p>
        <p style="margin:0;font-size:14px;color:#666;">Cantidad: ${item.amount}</p>
      </div>
    </div>
  `,
    )
    .join('');

  const body = `
  <div style="width:596px;padding:24px;background:#fff;color:#252525;font-family:system-ui,sans-serif;">
    <p style="margin:0 0 20px;font-size:16px;">
      <strong style="color:#252525;">Nombre de la tienda:</strong> <span style="color:#252525;">${escapeHtml(name)}</span>
    </p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      ${itemsHtml}
    </div>
  </div>`.trim();

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pedido - Animarte</title>
</head>
<body style="margin:0;background:#fff;">
${body}
</body>
</html>`;
}
