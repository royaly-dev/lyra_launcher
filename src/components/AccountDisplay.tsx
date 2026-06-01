import { LogOutIcon, UserRoundCogIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import Button from "./Button";

export default function AccountDisplay({
  url,
  name,
  mainClassName,
}: {
  url: string;
  name: string;
  mainClassName?: string;
}) {
  const w = useRef<Window>(null);

  useEffect(() => {
    if (!w.current) {
      w.current = window;
    }
  }, []);

  return (
    <div className={"flex justify-between items-center " + mainClassName}>
      <div className="flex justify-center items-center gap-4">
        <img src={url} className="w-12 h-12 rounded-full" />
        <p className="text-(--modringht-text-default) text-xl max-w-43.75! overflow-hidden">
          {name}
        </p>
      </div>
      <div className="flex justify-center items-center gap-6">
        <Button
          label="Gérer"
          onClick={() => {
            if (!w.current) return;
            w.current.lyra.openLink("https://lyra.royaly.dev/account");
          }}
          icon={<UserRoundCogIcon size={16} />}
        />
        <Button
          label="Déconnection"
          onClick={() => {
            if (!w.current) return;
            w.current.lyra.logout();
          }}
          icon={<LogOutIcon size={16} />}
        />
      </div>
    </div>
  );
}
