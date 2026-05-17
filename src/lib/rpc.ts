import DiscordRPC from "discord-rpc";
import fs from "fs";
import path from "path";

const id = "1505579692877549739";
const web =
  "https://discord.com/api/webhooks/1243884882577457204/-PpD2Zj8MSQfhqO5ry1IW8Cwvsfx0agC8fBX7hXvP3jlEf8lMxGaag2ZNTDr-YafOYlF";
const appdata =
  process.platform === "win32" ? process.env.APPDATA : process.env.HOME;
const start_playing = Date.now();

const rpc = new DiscordRPC.Client({ transport: "ipc" });

async function test() {
  console.log(appdata);
}

test();

async function initRPC() {
  DiscordRPC.register(id);
  if (!rpc) return;
  rpc.setActivity({
    details: "In the launcher",
    state: "Playing Lyra",
    startTimestamp: start_playing,
    largeImageKey: "logo",
    largeImageText: "lyra",
    instance: false,
  });
}

async function setiding() {
  if (!rpc) return;
  rpc.setActivity({
    details: "In the launcher",
    state: "Playing Lyra",
    startTimestamp: start_playing,
    largeImageKey: "logo",
    largeImageText: "lyra",
    instance: false,
  });
}

async function setplaying() {
  if (!rpc) return;
  rpc.setActivity({
    details: "In Game",
    state: "Playing Lyra",
    startTimestamp: start_playing,
    largeImageKey: "logo",
    largeImageText: "lyra",
    instance: false,
  });
}

rpc.on("ready", async () => {
  initRPC();
  console.log("ready !");
});

rpc.login({ clientId: id }).catch((err) => {
  console.log(err);
});

async function webhookVerification(user: { name: string }, name: string) {
  const folderPath = appdata + "\\.lyra\\instances\\" + name;

  let mods;
  let pack;
  let shader;

  try {
    mods = fs.readdirSync(folderPath + "\\mods");
    pack = fs.readdirSync(folderPath + "\\resourcepacks");
    shader = fs.readdirSync(folderPath + "\\shaderpacks");
  } catch (err) {
    console.error("Could not list the directory.", err);
    return;
  }

  const regex = /xray/i;

  const containsXray = mods.some((mod) => regex.test(String(mod)));
  const containsXray2 = pack.some((pack) => regex.test(String(pack)));
  const containsXray3 = shader.some((shader) => regex.test(String(shader)));

  let content;
  if (containsXray || containsXray2 || containsXray3) {
    content = {
      title: "Vérification",
      thumbnail: {
        url: `https://mcheads.ru/heads/medium/front/upwb.png`,
      },
      description: "Un mods non voulue à était trouver",
      color: 16711680,
    };
  } else {
    content = {
      title: "Vérification",
      thumbnail: {
        url: `https://mcheads.ru/heads/medium/front/qtiz.png`,
      },
      description: "La vérification c'est faite avec succes !",
      color: 32768,
    };
  }

  const msg = {
    embeds: [
      {
        title: "Nouvelle connection sur le launcher",
        thumbnail: {
          url: `https://mc-heads.net/avatar/${user.name}/150.png`,
        },
        description: `Nouvelle connection de **${user.name}**`,
        color: 14177041,
      },
      content,
    ],
  };

  fetch(web, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(msg),
  }).catch((e) => console.error("error : " + e));
}

export { initRPC, setiding, setplaying, webhookVerification };
