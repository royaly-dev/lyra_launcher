import { Check, TriangleAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "./Button";

export default function InfoModal({
  type,
  content,
  onButtonPressedSend,
  open,
}: {
  open: boolean;
  type: "success" | "Connect_error" | "Game_error" | "error";
  content: { title: string; desc: string };
  onButtonPressedSend: (type: "send" | "continue" | "relaunche") => void;
}) {
  const [animationStart, setAnimationStart] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setAnimationStart(true);
    } else {
      setAnimationStart(false);
    }
  }, [open]);

  const onButtonPressed = (type: "send" | "continue" | "relaunche") => {
    onButtonPressedSend(type);
    setAnimationStart(false);
  };

  return (
    <div
      key="animation"
      className={
        "absolute w-screen h-screen flex justify-center items-center backdrop-blur-xs transition-all duration-300 " +
        (animationStart ? "opacity-100 z-50" : "opacity-0 z-0")
      }
    >
      <div
        className={
          "border border-solid border-(--modringht-border-strong) rounded-lg bg-(--modringht-bg-raised) w-[25%] h-[50%] flex justify-around items-center flex-col transition-all duration-300 " +
          (animationStart ? "opacity-100 scale-100" : "opacity-0 scale-75")
        }
      >
        {type === "success" ? (
          <Check
            size={32}
            className="text-white rounded-full p-4 bg-(--modringht-brand-shadow) box-content mt-4"
          />
        ) : (
          <TriangleAlertIcon
            size={32}
            className="text-white rounded-full p-4 bg-red-500 box-content mt-4"
          />
        )}
        <div className="flex justify-center items-center flex-col gap-2">
          <h1 className="text-xl text-white">{content.title}</h1>
          <span className="text-base text-(--modringht-text-default) text-center max-w-46.5">
            {content.desc}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <Button
            label={
              type === "success" || type === "error"
                ? "Continuer"
                : type === "Connect_error"
                  ? "Relancer"
                  : "Envoyer"
            }
            className={
              "text-(--modringht-text-primary)! mb-4 " +
              (type === "success"
                ? "bg-(--modringht-brand-shadow)!"
                : "bg-red-500!")
            }
            onClick={() =>
              onButtonPressed(
                type === "success"
                  ? "continue"
                  : type === "Connect_error"
                    ? "relaunche"
                    : "send",
              )
            }
          />
          {type !== "success" ? (
            <Button
              label="Annuler"
              className="text-(--modringht-text-primary)! mb-4"
              onClick={() => onButtonPressed("continue")}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
