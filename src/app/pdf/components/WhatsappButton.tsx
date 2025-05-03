import { MessageCircleMore } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <>
      <a
        href="https://wa.me/541134684381"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircleMore size={24} />
      </a>
    </>
  );
}
