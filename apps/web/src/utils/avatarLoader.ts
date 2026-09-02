import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export const DEFAULT_AVATAR_GLB_URL = 'https://models.readyplayer.me/6460d375e840d8d4ce946328.glb';

export interface LoadedAvatarModel {
  gltf: GLTF;
  headMesh?: THREE.Mesh;
  morphTargetDictionary?: { [key: string]: number };
  morphTargetInfluences?: number[];
}

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
gltfLoader.setDRACOLoader(dracoLoader);

const modelCache = new Map<string, GLTF>();

export async function loadAvatarModel(url: string = DEFAULT_AVATAR_GLB_URL): Promise<LoadedAvatarModel> {
  const targetUrl = url || DEFAULT_AVATAR_GLB_URL;

  let gltf: GLTF;
  if (modelCache.has(targetUrl)) {
    gltf = modelCache.get(targetUrl)!;
  } else {
    gltf = await new Promise<GLTF>((resolve, reject) => {
      gltfLoader.load(
        targetUrl,
        (data) => resolve(data),
        undefined,
        (error) => reject(error)
      );
    });
    modelCache.set(targetUrl, gltf);
  }

  let headMesh: THREE.Mesh | undefined;
  gltf.scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).morphTargetDictionary) {
      if (child.name.toLowerCase().includes('head') || child.name.toLowerCase().includes('face') || !headMesh) {
        headMesh = child as THREE.Mesh;
      }
    }
  });

  return {
    gltf,
    headMesh,
    morphTargetDictionary: headMesh?.morphTargetDictionary,
    morphTargetInfluences: headMesh?.morphTargetInfluences
  };
}
