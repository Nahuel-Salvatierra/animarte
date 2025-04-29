import PDFGuard from './components/PDFGuard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PDFGuard>{children}</PDFGuard>;
}
