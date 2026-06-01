import {
  ArrowLeft,
  ArrowUpLeftFromCircleIcon,
  Home,
  PersonStanding,
  Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import CharacterPreview from "./CharacterPreview";
import { MyPlayer } from "./VideoPlayer";
import Settings_section from "./Settings";
import Input from "./Input";
import PlayerType from "./PlayerTypeSelector";
import InfoModal from "./InfoModal";
import { Login } from "./Login";
import { string } from "three/src/nodes/tsl/TSLCore";

export default function SideBar() {
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
  const [displayInfoModal, setDisplayInfoModal] = useState<{
    open: boolean;
    content: { title: string; desc: string };
    type: "success" | "Connect_error" | "Game_error" | "error";
  }>({ open: false, content: { desc: "", title: "" }, type: "success" });
  const [statusText, setStatusText] = useState<{
    title: string;
    subTitle: string;
  }>({ title: "", subTitle: "" });
  const [isLoged, setIsLoged] = useState<boolean>(false);
  const [skin, setSkin] = useState<{
    uuid: string;
    name: string;
    type: number;
    skin?: string;
    job: string;
  }>({ uuid: "default", name: "", job: "", type: 0 });
  const [maintenanceStatus, setMaintenanceStatus] = useState<{
    maintenance: boolean;
    maintenance_message: string;
  }>();

  const isReturningHome = currentSection === "home";
  const showCharacterPanel =
    currentSection === "character" ||
    (isReturningHome && lastCurrentSection === "character");
  const showSettingsPanel =
    currentSection === "settings" ||
    (isReturningHome && lastCurrentSection === "settings");

  const w = useRef<Window>(null);

  useEffect(() => {
    if (!w.current) {
      w.current = window;
    }
    if (w.current) {
      w.current.lyra.onGameStatus((data) => {
        switch (data.type) {
          case "download":
            setStatusText({
              title: "Telechargement du jeu...",
              subTitle:
                "Telechargement " +
                (data.element === "Java" ? "de " : "des ") +
                data.element +
                " : " +
                data.status +
                "%",
            });
            break;
          case "patch":
            setStatusText({
              title: "Instalation du jeu...",
              subTitle: "Instalation du jeu en cour...",
            });
            break;
          case "check":
            setStatusText({
              title: "Verification des ressources...",
              subTitle: "Verification des ressources : " + data.status + "%",
            });
            break;
          case "extract":
            setStatusText({
              title: "Extraction du jeu...",
              subTitle: "Extraction du jeu en cour...",
            });
            break;
          case "start":
            setStatusText({
              title: "Demarrage du jeu...",
              subTitle: "Demarrage du jeu en cour...",
            });
            break;
          case "start_end":
            w.current.close();
            break;
        }
      });

      w.current.lyra.onErrorStatus((data) => {
        setDisplayInfoModal({
          open: true,
          type: data.message,
          content: {
            desc:
              data.message === "Game_error"
                ? "Voulez vous envoyer l'erreur à l'admin ?"
                : "Voulez vous relancez le téléchargement",
            title: "Une erreur est survenue !",
          },
        });
      });

      w.current.lyra.onRefreshRequest(() => {
        w.current.location.reload();
      });

      getLoginStatus();
      getMaintenanceStatus();
    }
  }, []);

  const getLoginStatus = async () => {
    if (!w.current) return;
    const status = await w.current.lyra.isLoged();
    setIsLoged(status);
    if (status) {
      setIsLoading(false);
      getPlayerInfo();
    }
  };

  const getPlayerInfo = async () => {
    if (!w.current) return;

    const playerData = await w.current.lyra.getPlayerData();

    if (!playerData.confirm) return;

    setSkin(playerData.data);
  };

  const getMaintenanceStatus = async () => {
    const status = await fetch("https://lyra.royaly.dev/api/config/get", {
      method: "GET",
    });

    const parsedStatus: {
      confirm: boolean;
      data: {
        maintenance: boolean;
        maintenance_message: string;
      };
    } = await status.json();

    if (!parsedStatus.confirm) return;

    setMaintenanceStatus(parsedStatus.data);
  };

  return (
    <div className="overflow-hidden relative h-screen w-screen">
      {!isLoged && <Login />}
      <InfoModal
        content={{
          title: displayInfoModal.content.title,
          desc: displayInfoModal.content.desc,
        }}
        type={displayInfoModal.type}
        onButtonPressedSend={(type) => {
          switch (type) {
            case "continue":
              setDisplayInfoModal({ ...displayInfoModal, open: false });
              setIsPlaying(false);
              break;
            case "relaunche":
              w.current.lyra.relaunche_app();
              break;
            case "send":
              w.current.lyra.send_error_log();
              setIsPlaying(false);
              break;
          }
        }}
        open={displayInfoModal.open}
      />
      {isPlaying && (
        <div className="absolute inset-0 z-0">
          <MyPlayer src="https://upload.royaly.dev/data/lyra_teaser_v2.mp4" />
          <div className="absolute w-full bottom-0 h-28 backdrop-blur-md flex justify-center items-center flex-row border-t border-white/10">
            <div className="flex justify-center items-center flex-col">
              <p className="font-[Minecraft] text-2xl text-white">
                {statusText.title}
              </p>
              <p className="font-[Minecraft] text-lg text-white">
                {statusText.subTitle}
              </p>
            </div>
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
          "w-72 transition-all duration-500 absolute z-40 top-8 right-1/2 translate-x-1/2 " +
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
        onClick={() => {
          if (w.current && !maintenanceStatus?.maintenance) {
            w.current.lyra.startGame();
          } else if (maintenanceStatus?.maintenance) {
            setDisplayInfoModal({
              open: true,
              type: "error",
              content: {
                title: "Maintenance en cour...",
                desc: maintenanceStatus?.maintenance_message,
              },
            });
          }
        }}
      >
        <a
          href="#"
          className="minecraft-button"
          onClick={() => {
            if (!maintenanceStatus.maintenance) {
              setStartAnimationMilis(0);
              setCurrentAnimationDelay(0);
              setTimeout(() => {
                setIsPlaying(true);
              }, 50);
            }
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
            (showCharacterPanel ? " z-10 opacity-100" : " z-0 opacity-0")
          }
        >
          <h1 className="w-246 min-w-246 text-center justify-self-start font-[Minecraft] text-4xl py-4 text-white">
            Personnage
          </h1>
          <div className="w-246 min-w-246 h-full justify-self-start px-8 pb-6 flex justify-around items-center flex-row">
            <CharacterPreview
              className="rounded-xl overflow-hidden flex-1"
              minecraftUsername={!skin?.skin ? skin.name : undefined}
              textureSrc={skin?.skin}
              nametag={skin.name}
              variant="CLASSIC"
            />
            <div className="flex justify-center items-center flex-col h-full gap-4 w-[75%] flex-1">
              <div className="flex flex-col gap-2 self-start w-full">
                <span className="font-[Minecraft] font-semibold text-xl self-start text-(--modringht-text-default) tracking-wide">
                  username :
                </span>
                <Input
                  OnChnage={() => {
                    console.log("");
                  }}
                  placeholder={"username"}
                  type={"text"}
                  value={skin?.name}
                />
              </div>
              <div className="flex justify-between items-center gap-6">
                <div className="flex justify-center items-start flex-col">
                  <span className="font-[Minecraft] font-semibold text-xl self-start text-(--modringht-text-default) tracking-wide">
                    jobs :
                  </span>
                  <Input
                    OnChnage={() => {
                      console.log("");
                    }}
                    placeholder={"job"}
                    type={"text"}
                    value={skin?.job}
                  />
                </div>
                <div className="flex justify-center items-start flex-col">
                  <span className="font-[Minecraft] font-semibold text-xl self-start text-(--modringht-text-default) tracking-wide">
                    Type :
                  </span>
                  <PlayerType selected={skin?.type} />
                </div>
              </div>
              <span className="font-[Minecraft] font-semibold text-xl self-start text-(--modringht-text-default) tracking-wide">
                texture :
              </span>
              <div
                onClick={() => {
                  if (!w.current) return;
                  w.current.lyra.openLink("https://lyra.royaly.dev/account");
                }}
                className="rounded-md cursor-pointer border border-dashed border-(--modringht-border-strong) bg-(--modringht-bg-super-raised) p-6 flex justify-center items-center flex-col gap-1 w-full"
              >
                <img
                  src={
                    skin?.skin || "https://api.mcheads.org/skin/" + skin?.name
                  }
                  className="h-16 w-16 rounded-md my-3"
                />
                <span className="text-base text-(--modringht-text-default)">
                  Click pour la changer
                </span>
                <span className="text-xs text-(--modringht-text-muted)">
                  PNG (64px X 64px)
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            "absolute w-246 h-full rounded-[1.25rem] flex justify-start items-start flex-col overflow-hidden transition-all duration-1000" +
            (showSettingsPanel ? " z-10 opacity-100" : " z-0 opacity-0")
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
