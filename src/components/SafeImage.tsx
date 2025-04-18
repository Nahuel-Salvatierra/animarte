import Image from "next/image";
import { useState } from "react";

export default function SafeImage({
  src,
  alt,
  ...props
}: { src: string; alt: string } & React.ComponentProps<typeof Image>) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc("/error_load_image.png")}
    />
  );
}
