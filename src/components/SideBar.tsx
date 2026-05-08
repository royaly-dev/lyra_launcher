import { Home, PersonStanding, Settings } from "lucide-react";

export default function SideBar() {
  return (
    <div className="bg-[#16181c] rounded-[1.25rem] border-[rgb(66,68,74)] border-solid border w-fit p-1 absolute left-7 top-1/2 -translate-y-1/2 h-72 flex justify-around items-center flex-col">
      <Home
        size={32}
        className="p-4 box-content rounded-full text-[rgb(160,170,182)] transition-all duration-75 cursor-pointer hover:bg-[rgb(52,54,60)] hover:text-[rgb(242,246,250)] active:scale-95"
      />
      <PersonStanding
        size={32}
        className="p-4 box-content rounded-full text-[rgb(160,170,182)] transition-all duration-75 cursor-pointer hover:bg-[rgb(52,54,60)] hover:text-[rgb(242,246,250)] active:scale-95"
      />
      <Settings
        size={32}
        className="p-4 box-content rounded-full text-[rgb(160,170,182)] transition-all duration-75 cursor-pointer hover:bg-[rgb(52,54,60)] hover:text-[rgb(242,246,250)] active:scale-95"
      />
    </div>
  );
}
