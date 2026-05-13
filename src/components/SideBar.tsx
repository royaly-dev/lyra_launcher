import { ArrowLeft, Home, PersonStanding, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "./Button";
import CharacterPreview from "./CharacterPreview";
import { MyPlayer } from "./VideoPlayer";
import Settings_section from "./Settings";

export default function SideBar() {
  const previewUsername = "royaly_games";
  const [isOpen, setIsOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<
    "home" | "character" | "settings"
  >("home");
  const [lastCurrentSection, setLastCurrentSection] = useState<
    "home" | "character" | "settings"
  >("home");
  const [startAnimationMilis, setStartAnimationMilis] = useState<number>(0);
  const [currentAnimationDelay, setCurrentAnimationDelay] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isReturningHome = currentSection === "home";
  const showCharacterPanel =
    currentSection === "character" ||
    (isReturningHome && lastCurrentSection === "character");
  const showSettingsPanel =
    currentSection === "settings" ||
    (isReturningHome && lastCurrentSection === "settings");

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="overflow-hidden relative h-screen w-screen">
      {isPlaying && (
        <div className="absolute inset-0 z-0">
          <MyPlayer src="https://upload.royaly.dev/data/lyra_teaser_v2.mp4" />
          <div className="absolute w-full bottom-0 h-28 backdrop-blur-md flex justify-between items-center flex-row border-t border-white/10">
            <div className="ml-4 flex-1">
              <Button
                label="Retour"
                onClick={() => {
                  setIsPlaying(false);
                }}
                icon={<ArrowLeft size={18} />}
              />
            </div>
            <div className="flex justify-center items-center flex-col flex-1">
              <p className="font-[Minecraft] text-2xl text-white">
                Telechargement du jeux...
              </p>
              <p className="font-[Minecraft] text-lg text-white">
                Telechargement de java : 15 %
              </p>
            </div>
            <p className="flex-1"></p>
          </div>
        </div>
      )}
      {!isPlaying && (
        <iframe
          src="https://jungle.mystrator.com/s/demo/#overworld:175:51:36:160:0:0:0:1:flat"
          className="absolute inset-0 z-10 w-screen h-screen scale-[1.15] pointer-events-none select-none"
        />
      )}
      <img
        src="https://upload.royaly.dev/data/logo.png"
        alt="Lyra The Fallout"
        className={
          "w-72 transition-all duration-500 absolute z-50 top-8 right-1/2 translate-x-1/2 " +
          (startAnimationMilis != 0
            ? isOpen
              ? "animate-logoslide "
              : "animate-logoslide-reverse "
            : "") +
          (isPlaying ? "-translate-y-48! " : "") +
          (isLoading ? "-translate-y-48!" : "")
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
          (isPlaying ? "translate-y-48!" : "") +
          (isLoading ? "translate-y-48!" : "")
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
        key={isOpen ? "open" : "closed"}
        style={{
          animationDelay:
            currentAnimationDelay > 0 ? `-${currentAnimationDelay}ms` : "0ms",
        }}
        className={
          "bg-[rgb(39,41,46)] flex justify-end items-center transition-all duration-500 z-10 h-72 absolute left-7 top-1/2 -translate-y-1/2 w-18.5 rounded-[1.25rem] border-[rgb(66,68,74)] border-solid overflow-hidden border " +
          (startAnimationMilis != 0
            ? isOpen
              ? "animate-sidebar "
              : "animate-sidebar-reverse "
            : "") +
          (isPlaying ? "-translate-x-56!" : "") +
          (isLoading ? "-translate-x-56!" : "")
        }
      >
        <div
          className={
            "absolute w-246 h-full rounded-[1.25rem] flex justify-start items-start flex-col overflow-hidden transition-all duration-1000" +
            (showCharacterPanel
              ? " z-10 opacity-100"
              : " z-0 opacity-0")
          }
        >
          <h1 className="w-246 min-w-246 text-center justify-self-start font-[Minecraft] text-4xl py-4 text-white">
            Personnage
          </h1>
          <div className="w-246 min-w-246 h-full justify-self-start px-8 pb-6">
            <CharacterPreview
              className="rounded-xl overflow-hidden"
              minecraftUsername={previewUsername}
              textureSrc={`https://minotar.net/skin/${previewUsername}`}
              nametag={previewUsername}
              variant="CLASSIC"
            />
          </div>
        </div>
        <div
          className={
            "absolute w-246 h-full rounded-[1.25rem] flex justify-start items-start flex-col overflow-hidden transition-all duration-1000" +
            (showSettingsPanel
              ? " z-10 opacity-100"
              : " z-0 opacity-0")
          }
        >
          <h1 className="w-246 min-w-246 text-center justify-self-start font-[Minecraft] text-4xl py-4 text-white">
            Parametre
          </h1>
          <div className="w-246 min-w-246 h-full justify-self-start flex justify-center items-start">
            <Settings_section />
          </div>
        </div>
      </div>
      <div
        className={
          "bg-[#16181c] transition-all duration-500 z-20 rounded-[1.25rem] border-[rgb(66,68,74)] border-solid border w-fit p-1 absolute left-7 top-1/2 -translate-y-1/2 h-72 flex justify-around items-center flex-col " +
          (isPlaying ? "-translate-x-56!" : "") +
          (isLoading ? "-translate-x-56!" : "")
        }
      >
        <Home
          size={32}
          className="p-4 box-content rounded-full text-[rgb(160,170,182)] transition-all duration-75 cursor-pointer hover:bg-[rgb(52,54,60)] hover:text-[rgb(242,246,250)] active:scale-95"
          onClick={() => {
            setLastCurrentSection(currentSection);
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
            setLastCurrentSection(currentSection);
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
            setLastCurrentSection(currentSection);
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
              } else {
                setStartAnimationMilis(Date.now());
              }
              setIsOpen(true);
            }
          }}
        />
      </div>
    </div>
  );
}
