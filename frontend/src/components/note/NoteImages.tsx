import { memo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Image } from '../../features/journal/types';

interface Props {
  images?: Image[];
}

const NoteImages = ({ images }: Props) => {
  if (!images) return null;

  const isOneImage = images.length === 1;

  return (
    <div className={`flex ${isOneImage ? "basis-1/3" : "basis-1/2"} justify-end overflow-x-auto max-h-32`}>
      {images.map((image, index, array) => (
        <div className={`rounded-lg max-h-24 w-40 overflow-hidden ${isOneImage || index === array.length - 1 ? "" : "mr-2"}`} key={image._id}>
          <LazyLoadImage
            src={image.url} />
        </div>
      ))}
    </div>
  );
};

export default memo(NoteImages);
