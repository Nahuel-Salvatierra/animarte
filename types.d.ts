declare module "html2pdf.js" {
  const html2pdf: (element: Element) => Promise<void>;
  export default html2pdf;
}
