'use client';

import SafeImage from '@/components/SafeImage';
import { CartItem } from '@/store/useCartStore';

const CatalogPDF = ({ cartItems }: { cartItems: CartItem[] }) => {
  return (
    <div id="catalog-pdf">
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cartItems.map((item) => (
            <div
              key={item.reference.id}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}
            >
              {
                <SafeImage
                  style={{ width: 70, height: 70 }}
                  src={item.reference.images[0]}
                  width={70}
                  height={70}
                  alt={item.reference.name}
                />
              }
              <div>
                <p>{item.reference.name}</p>
                <p>Cantidad: {item.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogPDF;
