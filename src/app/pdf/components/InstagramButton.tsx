import { Instagram } from 'lucide-react';

export default function InstagramButton() {
  return (
    <>
      <a
        href="https://instagram.com/tienda.animarte92"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white p-3 rounded-full shadow-lg hover:opacity-90 transition"
        aria-label="Visitar Instagram"
      >
        <Instagram size={24} />
      </a>
    </>
  );
}
