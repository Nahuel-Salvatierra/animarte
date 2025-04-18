"use client";

import { useCartStore } from "@/store/useCartStore";
import { useMemo } from "react";
import CatalogPDF from "./components/CatalogPDF";
import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";

const DownloadButton = dynamic(() => import("./components/DownloadButton"), {
  ssr: false,
});

export default function Page() {
  const cartItemsRaw = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  const cartItems = useMemo(
    () =>
      Object.entries(cartItemsRaw).map(([key, value]) => ({
        id: key,
        ...value,
      })),
    [cartItemsRaw]
  );

  const handleOnDownload = () => {
    clearCart();
    router.push("/");
  };

  return (
    <div className="p-5 h-[90vh] gap-4 flex flex-col container">
      <DownloadButton onDownload={handleOnDownload} />
      <h1 className="text-2xl mb-4">Vista previa</h1>
      {cartItems.length > 0 && (
        <div className="w-full h-full">
          <div className="w-full h-[90%]">
            <CatalogPDF cartItems={cartItems} />
          </div>
        </div>
      )}
    </div>
  );
}
