import { Pause, Volume2, VolumeOff } from "lucide-react";
import { useState } from "react";

interface MyPlayerProps {
  src: string;
}

export const MyPlayer = ({ src }: MyPlayerProps) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const VolumeIcon = isMuted ? VolumeOff : Volume2;

  return (
    <div className="h-full relative select-none">
      <VolumeIcon
        size={32}
        className="p-4 box-content z-30 absolute top-2 left-2 rounded-full text-[rgb(160,170,182,0.1)] transition-all duration-75 cursor-pointer hover:bg-[rgb(52,54,60)] hover:text-[rgb(242,246,250)] active:scale-95"
        onClick={() => {
          setIsMuted((prev) => !prev);
        }}
      />
      <video
        className="w-full! h-full! object-cover pointer-events-none"
        src={src}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
      />
    </div>
  );
};
