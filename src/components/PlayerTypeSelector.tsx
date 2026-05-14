import { Mountain, Swords, Zap } from "lucide-react";

export default function PlayerType({ selected }: { selected: number }) {
  return (
    <div className="flex justify-center items-center gap-2">
      <div className="hover:after:content-['Aventurier'] hover:after:-translate-y-22 hover:after:-translate-x-1/4 hover:after:absolute hover:after:bg-(--modringht-bg-raised) hover:after:p-2 hover:after:border hover:after:border-solid hover:after:border-(--modringht-border-strong) hover:after:rounded-md text-(--modringht-text-primary)">
        <Mountain
          size={22}
          className={
            "border border-solid rounded-lg p-2 box-content cursor-pointer bg-(--modringht-bg-super-raised) transition-all duration-75 active:scale-95 " +
            (selected === 0
              ? "text-(--modringht-brand) border-(--modringht-brand)"
              : "border-(--modringht-border-strong) text-white")
          }
        />
      </div>
      <div className="hover:after:content-['Technicien'] hover:after:-translate-y-22 hover:after:-translate-x-1/4 hover:after:absolute hover:after:bg-(--modringht-bg-raised) hover:after:p-2 hover:after:border hover:after:border-solid hover:after:border-(--modringht-border-strong) hover:after:rounded-md text-(--modringht-text-primary)">
        <Zap
          size={22}
          className={
            "border border-solid rounded-lg p-2 box-content cursor-pointer bg-(--modringht-bg-super-raised) transition-all duration-75 active:scale-95 " +
            (selected === 1
              ? "text-(--modringht-brand) border-(--modringht-brand)"
              : "border-(--modringht-border-strong) text-white")
          }
        />
      </div>
      <div className="hover:after:content-['Combattant'] hover:after:-translate-y-22 hover:after:-translate-x-1/4 hover:after:absolute hover:after:bg-(--modringht-bg-raised) hover:after:p-2 hover:after:border hover:after:border-solid hover:after:border-(--modringht-border-strong) hover:after:rounded-md text-(--modringht-text-primary)">
        <Swords
          size={22}
          className={
            "border border-solid rounded-lg p-2 box-content cursor-pointer bg-(--modringht-bg-super-raised) transition-all duration-75 active:scale-95 " +
            (selected === 2
              ? "text-(--modringht-brand) border-(--modringht-brand)"
              : "border-(--modringht-border-strong) text-white")
          }
        />
      </div>
    </div>
  );
}
