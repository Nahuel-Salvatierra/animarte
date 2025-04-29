declare module 'html2pdf.js' {
  const html2pdf: {
    (element?: Element): any;
    set: (options: any) => void;
    from: (element: HTMLElement) => any;
    save: () => void;
    toPdf: () => any;
    outputPdf: (type: string) => Promise<any>;
  };
  export default html2pdf;
}
