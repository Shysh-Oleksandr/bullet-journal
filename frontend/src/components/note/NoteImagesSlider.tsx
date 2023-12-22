import { memo } from 'react';
import { Image } from '../../features/journal/types';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface Props {
  images?: Image[];
}

const NoteImagesSlider = ({ images }: Props) => {
  if (!images) return null;

  const isOneImage = images.length === 1;

  return (
    <div className="flex w-full justify-between overflow-x-auto sm:mb-4 mb-3 no-scrollbar rounded-t-[10px]">
      {images.map((image) => (
        <div className={`overflow-hidden lg:max-h-48 max-h-52 ${isOneImage ? "min-w-fit" : "min-w-[33.33%] lg:aspect-video"}`} key={image._id}>
          <LazyLoadImage
            visibleByDefault
            src={image.url} />
        </div>
      ))}
    </div>
  );
};

export default memo(NoteImagesSlider);
