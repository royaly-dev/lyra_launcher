import { LogInIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";

export function Login() {
  const [isLogin, setIslogin] = useState<boolean>(false);
  const w = useRef<Window>(null);

  useEffect(() => {
    if (!w.current && window) {
      w.current = window;
    }
  }, []);

  return (
    <div className="absolute w-screen h-screen flex justify-center items-center backdrop-blur-md z-50">
      <Button
        className="bg-(--modringht-brand-shadow)! border-(--modringht-brand-shadow)!"
        loading={isLogin}
        onClick={() => {
          if (!w.current || isLogin) return;
          setIslogin(true);
          w.current.lyra.openLink("https://lyra.royaly.dev/launcher/login");
        }}
        label="Login"
        icon={<LogInIcon className="text-white!" size={16} />}
      />
    </div>
  );
}
