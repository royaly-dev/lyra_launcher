import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

import classicPlayerModelGltf from "@/assets/models/classic-player.gltf";
import slimPlayerModelGltf from "@/assets/models/slim-player.gltf";

type SkinVariant = "CLASSIC" | "SLIM" | "UNKNOWN";

type CharacterPreviewProps = {
  textureSrc?: string;
  capeSrc?: string;
  minecraftUsername?: string;
  variant?: SkinVariant;
  className?: string;
  nametag?: string;
  scale?: number;
  fov?: number;
  initialRotation?: number;
};

const modelCache = new Map<string, Promise<GLTF>>();
const TRANSPARENT_PNG_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9s7YQDkAAAAASUVORK5CYII=";

function parseGltf(modelText: string): Promise<GLTF> {
  const cached = modelCache.get(modelText);
  if (cached) return cached;

  const manager = new THREE.LoadingManager();
  manager.setURLModifier((url) => {
    if (url === "steve.png" || url === "sunny.png" || url === "cape") {
      return TRANSPARENT_PNG_DATA_URL;
    }
    return url;
  });

  const loader = new GLTFLoader(manager);
  const promise = new Promise<GLTF>((resolve, reject) => {
    loader.parse(
      modelText,
      "",
      (gltf) => resolve(gltf),
      (error) =>
        reject(
          error instanceof Error
            ? error
            : new Error("Unable to parse glTF model"),
        ),
    );
  });

  modelCache.set(modelText, promise);
  return promise;
}

function createTransparentTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.clearRect(0, 0, 1, 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

type SupportedSkinMaterial = THREE.Material & {
  name?: string;
  map?: THREE.Texture | null;
  transparent?: boolean;
  visible?: boolean;
  metalness?: number;
  color?: THREE.Color;
  toneMapped?: boolean;
  flatShading?: boolean;
  roughness?: number;
  needsUpdate?: boolean;
  depthTest?: boolean;
  depthWrite?: boolean;
  side?: THREE.Side;
  alphaTest?: number;
};

function configureSkinMaterial(material: SupportedSkinMaterial) {
  if ("metalness" in material && typeof material.metalness === "number") {
    material.metalness = 0;
  }
  if ("color" in material && material.color instanceof THREE.Color) {
    material.color.set(0xffffff);
  }
  if ("toneMapped" in material) material.toneMapped = false;
  if ("flatShading" in material) material.flatShading = true;
  if ("roughness" in material && typeof material.roughness === "number") {
    material.roughness = 1;
  }
  if ("depthTest" in material) material.depthTest = true;
  if ("depthWrite" in material) material.depthWrite = true;
  if ("side" in material) material.side = THREE.DoubleSide;
  if ("alphaTest" in material) material.alphaTest = 0.1;
  material.needsUpdate = true;
}

function applySkinTexture(model: THREE.Object3D, texture: THREE.Texture) {
  model.traverse((node) => {
    if (!(node as THREE.Mesh).isMesh) return;
    const mesh = node as THREE.Mesh;
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];
    materials.forEach((material) => {
      const skinMaterial = material as SupportedSkinMaterial;
      if (skinMaterial.name === "cape") return;
      if (!("map" in skinMaterial)) return;
      skinMaterial.map = texture;
      configureSkinMaterial(skinMaterial);
    });
  });
}

function applyCapeTexture(
  model: THREE.Object3D,
  capeTexture: THREE.Texture | null,
  transparentTexture: THREE.Texture,
) {
  model.traverse((node) => {
    if (!(node as THREE.Mesh).isMesh) return;
    const mesh = node as THREE.Mesh;
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];
    materials.forEach((material) => {
      const skinMaterial = material as SupportedSkinMaterial;
      if (skinMaterial.name !== "cape") return;
      if (!("map" in skinMaterial)) return;
      skinMaterial.map = capeTexture ?? transparentTexture;
      if ("transparent" in skinMaterial) skinMaterial.transparent = !capeTexture;
      if ("visible" in skinMaterial) skinMaterial.visible = Boolean(capeTexture);
      configureSkinMaterial(skinMaterial);
    });
  });
}

function loadTexture(url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = false;
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        resolve(texture);
      },
      undefined,
      (error) =>
        reject(
          error instanceof Error ? error : new Error("Unable to load texture"),
        ),
    );
  });
}

function inferCapeUrlFromSkinUrl(textureUrl?: string): string | undefined {
  if (!textureUrl) return undefined;
  const minotarMatch = textureUrl.match(/minotar\.net\/skin\/([^/?#]+)/i);
  if (minotarMatch?.[1]) {
    return `https://minotar.net/cape/${minotarMatch[1]}`;
  }
  return undefined;
}

async function fetchMinecraftTexturesByUsername(username: string): Promise<{
  skin?: string;
  cape?: string;
}> {
  const profileRes = await fetch(
    `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`,
  );
  if (!profileRes.ok) return {};

  const profile = (await profileRes.json()) as { id?: string };
  if (!profile.id) return {};

  const sessionRes = await fetch(
    `https://sessionserver.mojang.com/session/minecraft/profile/${profile.id}`,
  );
  if (!sessionRes.ok) return {};

  const session = (await sessionRes.json()) as {
    properties?: Array<{ name?: string; value?: string }>;
  };
  const texturesProp = session.properties?.find((prop) => prop.name === "textures")?.value;
  if (!texturesProp) return {};

  const texturesPayload = JSON.parse(atob(texturesProp)) as {
    textures?: { SKIN?: { url?: string }; CAPE?: { url?: string } };
  };

  return {
    skin: texturesPayload.textures?.SKIN?.url,
    cape: texturesPayload.textures?.CAPE?.url,
  };
}

export default function CharacterPreview({
  textureSrc,
  capeSrc,
  minecraftUsername,
  variant = "CLASSIC",
  className,
  nametag,
  scale = 1,
  fov = 40,
  initialRotation = Math.PI / 8,
}: CharacterPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [resolvedTextureSrc, setResolvedTextureSrc] = useState<string | undefined>(
    textureSrc,
  );
  const [resolvedCapeSrc, setResolvedCapeSrc] = useState<string | undefined>(capeSrc);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (minecraftUsername) {
        try {
          const accountTextures =
            await fetchMinecraftTexturesByUsername(minecraftUsername);
          if (cancelled) return;

          setResolvedTextureSrc(accountTextures.skin ?? textureSrc);
          setResolvedCapeSrc(capeSrc ?? accountTextures.cape);
          return;
        } catch (error) {
          console.warn("Failed to resolve textures from Mojang API:", error);
        }
      }

      if (!cancelled) {
        setResolvedTextureSrc(textureSrc);
        setResolvedCapeSrc(capeSrc ?? inferCapeUrlFromSkinUrl(textureSrc));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [capeSrc, minecraftUsername, textureSrc]);

  useEffect(() => {
    if (!resolvedTextureSrc) return;

    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let rafId = 0;
    let isDragging = false;
    let previousX = 0;
    let lastWidth = 0;
    let lastHeight = 0;
    let mixer: THREE.AnimationMixer | null = null;
    const transparentTexture = createTransparentTexture();

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 10;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 1000);
    camera.position.set(0, 1.5, -3.25);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(-3, 4, -2);
    scene.add(ambientLight);
    scene.add(directionalLight);

    const syncRendererSize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      if (width === lastWidth && height === lastHeight) return;
      lastWidth = width;
      lastHeight = height;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    syncRendererSize();

    const onPointerDown = (event: PointerEvent) => {
      isDragging = true;
      previousX = event.clientX;
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!isDragging || !modelGroupRef.current) return;
      const deltaX = event.clientX - previousX;
      modelGroupRef.current.rotation.y += deltaX * 0.01;
      previousX = event.clientX;
    };
    const onPointerUp = (event: PointerEvent) => {
      isDragging = false;
      renderer.domElement.releasePointerCapture(event.pointerId);
    };

    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointerleave", onPointerUp);

    const timer = new THREE.Timer();
    const animate = () => {
      if (disposed) return;
      rafId = requestAnimationFrame(animate);
      syncRendererSize();
      timer.update();
      if (mixer) mixer.update(timer.getDelta());
      renderer.render(scene, camera);
    };

    const modelSrc =
      variant === "SLIM" ? slimPlayerModelGltf : classicPlayerModelGltf;

    (async () => {
      try {
        setIsReady(false);

        const [{ scene: sourceScene, animations }, skinTexture, capeTexture] =
          await Promise.all([
            parseGltf(modelSrc),
            loadTexture(resolvedTextureSrc),
            resolvedCapeSrc
              ? loadTexture(resolvedCapeSrc)
              : Promise.resolve<THREE.Texture | null>(null),
          ]);

        if (disposed) return;

        const model = clone(sourceScene);
        applySkinTexture(model, skinTexture);
        applyCapeTexture(model, capeTexture, transparentTexture);

        const root = new THREE.Group();
        root.position.set(0, -0.05 * scale, 1.95);
        root.scale.set(0.8 * scale, 0.8 * scale, 0.8 * scale);
        root.rotation.y = initialRotation + Math.PI;
        root.add(model);
        scene.add(root);
        modelGroupRef.current = root;

        const bbox = new THREE.Box3().setFromObject(root);
        const center = bbox.getCenter(new THREE.Vector3());
        camera.lookAt(center);

        if (animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const idle =
            animations.find((clip) => clip.name === "idle") ??
            animations.find((clip) =>
              clip.name.toLowerCase().includes("idle"),
            ) ??
            animations[0];
          const action = mixer.clipAction(idle);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
        }

        setIsReady(true);
        animate();
      } catch (error) {
        console.error("Failed to initialize character preview:", error);
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);

      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointerleave", onPointerUp);

      renderer.dispose();

      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }

      scene.traverse((node) => {
        if (!(node as THREE.Mesh).isMesh) return;
        const mesh = node as THREE.Mesh;
        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((material) => {
          if (!(material instanceof THREE.Material)) return;
          const map = (material as THREE.MeshStandardMaterial).map;
          map?.dispose();
          material.dispose();
        });
      });
      modelGroupRef.current = null;
    };
  }, [
    fov,
    initialRotation,
    resolvedCapeSrc,
    resolvedTextureSrc,
    scale,
    variant,
  ]);

  return (
    <div className={"relative w-full h-full " + (className ?? "")}>
      {nametag && (
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 z-10 rounded-md px-3 py-1 pointer-events-none bg-black/30 text-(--modringht-text-default) font-[Minecraft]">
          {nametag}
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center text-(--modringht-text-muted)">
          Chargement du personnage...
        </div>
      )}
    </div>
  );
}
