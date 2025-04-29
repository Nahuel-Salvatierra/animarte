import PDFGuard from './components/pdfLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PDFGuard>{children}</PDFGuard>;
}
