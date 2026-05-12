interface MyPlayerProps {
  src: string;
}

export const MyPlayer = ({ src }: MyPlayerProps) => {
  return (
    <div className="pointer-events-none h-full">
      <video
        className="w-full! h-full! object-cover"
        src={src}
        autoPlay
        loop
        playsInline
        preload="auto"
      />
    </div>
  );
};
