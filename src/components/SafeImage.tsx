'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SafeImage({
  src,
  alt,
  ...props
}: { src: string; alt: string } & React.ComponentProps<typeof Image>) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc('/error_load_image.png')}
    />
  );
}
