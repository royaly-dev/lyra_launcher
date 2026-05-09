import { Home, PersonStanding, Settings } from "lucide-react";
import { useState } from "react";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <div
        key={isOpen ? "open" : "closed"}
        className={
          "bg-[rgb(39,41,46)] z-10 h-72 absolute left-7 top-1/2 -translate-y-1/2 w-18.5 rounded-[1.25rem] border-[rgb(66,68,74)] border-solid border " +
          (isOpen ? "animate-sidebar" : "animate-sidebar-reverse")
        }
      ></div>
      <div className="bg-[#16181c] z-20 rounded-[1.25rem] border-[rgb(66,68,74)] border-solid border w-fit p-1 absolute left-7 top-1/2 -translate-y-1/2 h-72 flex justify-around items-center flex-col">
        <Home
          size={32}
          className="p-4 box-content rounded-full text-[rgb(160,170,182)] transition-all duration-75 cursor-pointer hover:bg-[rgb(52,54,60)] hover:text-[rgb(242,246,250)] active:scale-95"
          onClick={() => setIsOpen(!isOpen)}
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
    </div>
  );
}
