import { Home, PersonStanding, Settings } from "lucide-react";
import { useState } from "react";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<
    "home" | "character" | "settings"
  >("home");
  const [startAnimationMilis, setStartAnimationMilis] = useState<number>(0);
  const [currentAnimationDelay, setCurrentAnimationDelay] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <div className="overflow-hidden relative">
      <div
        key={isOpen ? "open" : "closed"}
        style={{
          animationDelay:
            currentAnimationDelay > 0 ? `-${currentAnimationDelay}ms` : "0ms",
        }}
        className={
          "bg-[rgb(39,41,46)] transition-all duration-500 z-10 h-72 absolute left-7 top-1/2 -translate-y-1/2 w-18.5 rounded-[1.25rem] border-[rgb(66,68,74)] border-solid border " +
          (startAnimationMilis != 0
            ? isOpen
              ? "animate-sidebar "
              : "animate-sidebar-reverse "
            : "") +
          (isPlaying ? "-translate-x-56!" : "")
        }
      ></div>
      <iframe
        src="https://jungle.mystrator.com/s/demo/#overworld:175:51:36:160:0:0:0:1:flat"
        className="w-screen h-screen scale-[1.15] pointer-events-none select-none"
      />
      <img
        src="https://upload.royaly.dev/data/logo.png"
        alt="Lyra The Fallout"
        className={
          "w-72 absolute z-50 top-8 right-1/2 translate-x-1/2 " +
          (startAnimationMilis != 0
            ? isOpen
              ? "animate-logoslide "
              : "animate-logoslide-reverse "
            : "") +
          (isPlaying ? "-translate-y-48! transition-all duration-500 " : "")
        }
        key={isOpen ? "open-logo" : "closed-logo"}
        style={{
          animationDelay:
            currentAnimationDelay > 0 ? `-${currentAnimationDelay}ms` : "0ms",
        }}
      />
      <div
        className={
          "absolute bottom-9 left-1/2 z-30 -translate-x-1/2 transition-all duration-500 " +
          (startAnimationMilis != 0
            ? isOpen
              ? "animate-buttonslide "
              : "animate-buttonslide-reverse "
            : "") +
          (isPlaying ? "translate-y-48!" : "")
        }
        key={isOpen ? "open-button" : "closed-button"}
        style={{
          animationDelay:
            currentAnimationDelay > 0 ? `-${currentAnimationDelay}ms` : "0ms",
        }}
      >
        <a
          href="#"
          className="minecraft-button"
          onClick={() => {
            setStartAnimationMilis(0);
            setCurrentAnimationDelay(0);
            setTimeout(() => {
              setIsPlaying(true);
            }, 50);
          }}
        >
          Play
        </a>
      </div>
      <div
        className={
          "bg-[#16181c] transition-all duration-500 z-20 rounded-[1.25rem] border-[rgb(66,68,74)] border-solid border w-fit p-1 absolute left-7 top-1/2 -translate-y-1/2 h-72 flex justify-around items-center flex-col " +
          (isPlaying ? "-translate-x-56!" : "")
        }
      >
        <Home
          size={32}
          className="p-4 box-content rounded-full text-[rgb(160,170,182)] transition-all duration-75 cursor-pointer hover:bg-[rgb(52,54,60)] hover:text-[rgb(242,246,250)] active:scale-95"
          onClick={() => {
            setCurrentSection("home");
            if (isOpen) {
              if (startAnimationMilis > 0) {
                const delay = Date.now() - startAnimationMilis;
                if (delay < 2000) {
                  const newDelay = 2000 - delay;
                  setCurrentAnimationDelay(newDelay);
                  setStartAnimationMilis(Date.now() - newDelay);
                } else {
                  setCurrentAnimationDelay(0);
                  setStartAnimationMilis(Date.now());
                }
              }
              setIsOpen(false);
            }
          }}
        />
        <PersonStanding
          size={32}
          className="p-4 box-content rounded-full text-[rgb(160,170,182)] transition-all duration-75 cursor-pointer hover:bg-[rgb(52,54,60)] hover:text-[rgb(242,246,250)] active:scale-95"
          onClick={() => {
            setCurrentSection("character");
            if (!isOpen) {
              if (startAnimationMilis > 0) {
                const delay = Date.now() - startAnimationMilis;
                if (delay < 2000) {
                  const newDelay = 2000 - delay;
                  setCurrentAnimationDelay(newDelay);
                  setStartAnimationMilis(Date.now() - newDelay);
                } else {
                  setCurrentAnimationDelay(0);
                  setStartAnimationMilis(Date.now());
                }
              } else {
                setStartAnimationMilis(Date.now());
              }
              setIsOpen(true);
            }
          }}
        />
        <Settings
          size={32}
          className="p-4 box-content rounded-full text-[rgb(160,170,182)] transition-all duration-75 cursor-pointer hover:bg-[rgb(52,54,60)] hover:text-[rgb(242,246,250)] active:scale-95"
          onClick={() => {
            setCurrentSection("settings");
            if (!isOpen) {
              if (startAnimationMilis > 0) {
                const delay = Date.now() - startAnimationMilis;
                if (delay < 2000) {
                  const newDelay = 2000 - delay;
                  setCurrentAnimationDelay(newDelay);
                  setStartAnimationMilis(Date.now() - newDelay);
                } else {
                  setCurrentAnimationDelay(0);
                  setStartAnimationMilis(Date.now());
                }
              }
              setIsOpen(true);
            }
          }}
        />
      </div>
    </div>
  );
}
