'use client';

import SafeImage from '@/components/SafeImage';
import { resolveCatalogAssetUrl } from '@/catalog/cdn';
import { CartItem } from '@/store/useCartStore';

const CatalogPDF = ({
  cartItems,
  name,
}: {
  cartItems: CartItem[];
  name: string;
}) => {
  return (
    <div id="catalog-pdf">
      <p className="mb-2 font-semibold">Animarte</p>
      <p>
        <strong>Nombre de la tienda:</strong> {name}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {cartItems.map((item) => (
          <div
            key={item.reference.id}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            <SafeImage
              style={{ width: 70, height: 70 }}
              src={resolveCatalogAssetUrl(item.reference.coverPath)}
              width={70}
              height={70}
              alt={item.reference.title}
            />
            <div>
              <p>{item.reference.title}</p>
              <p>Cantidad: {item.amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogPDF;
