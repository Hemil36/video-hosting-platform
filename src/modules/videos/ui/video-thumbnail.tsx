import Image from 'next/image';


interface VideoThumbnailProps {
    thumbnailUrl?: string | null;
    previewUrl?: string | null;
    duration : number
}

export const VideoThumbnail = ({thumbnailUrl , previewUrl, duration} : VideoThumbnailProps) => {
  return (
    
    <div className="relative group">
      {/* Thumbnail wrapper */}
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={thumbnailUrl ? `${thumbnailUrl}` :  "/placeholder.svg"}
          alt="Thumbnail"
          fill
          sizes='50vw'

          className="h-full w-full object-cover group-hover:opacity-0 group-hover:hidden"
        />
         <Image
          src={previewUrl ? `${previewUrl}` :  "/placeholder.svg"}
          alt="Thumbnail"
          fill
          sizes='50vw'
          className="h-full w-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>

      {/* Duration badge */}
      <div className=' absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded'>
        {duration ? `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}` : '00:00'}

      </div>

    </div>
  );
};
