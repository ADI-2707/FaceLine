import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { loadAvatarModel, LoadedAvatarModel } from '../../utils/avatarLoader.js';
import { ExpressionController, ExpressionType } from './expressionController.js';
import { GestureController, GestureType } from './gestureController.js';
import styles from './AvatarCanvas.module.css';

export interface AvatarCanvasProps {
  avatarGlbUrl?: string;
  expression?: ExpressionType;
  gesture?: GestureType;
  onLoaded?: () => void;
}

export const AvatarCanvas: React.FC<AvatarCanvasProps> = ({
  avatarGlbUrl,
  expression = 'neutral',
  gesture,
  onLoaded
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const loadedModelRef = useRef<LoadedAvatarModel | null>(null);

  const expressionCtrlRef = useRef<ExpressionController>(new ExpressionController());
  const gestureCtrlRef = useRef<GestureController>(new GestureController());

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.42, 1.05);
    camera.lookAt(0, 1.35, 0);

    let renderer: THREE.WebGLRenderer | undefined;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);
    } catch {
      renderer = undefined;
    }

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(-1, 2, 2);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x90e0ef, 0.8);
    fillLight.position.set(1, 1.5, 1.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x3b82f6, 1.2);
    rimLight.position.set(0, 2, -2);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    let animationFrameId: number;
    let clock = new THREE.Clock();
    let isDisposed = false;

    setIsLoading(true);

    loadAvatarModel(avatarGlbUrl)
      .then((loaded: LoadedAvatarModel) => {
        if (isDisposed) return;
        loadedModelRef.current = loaded;
        scene.add(loaded.gltf.scene);

        if (loaded.gltf.animations.length > 0) {
          gestureCtrlRef.current.init(loaded.gltf.scene, loaded.gltf.animations);
        }

        setIsLoading(false);
        if (onLoaded) onLoaded();
      })
      .catch(() => {
        if (!isDisposed) setIsLoading(false);
      });

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (loadedModelRef.current) {
        if (loadedModelRef.current.headMesh) {
          expressionCtrlRef.current.update(loadedModelRef.current.headMesh, delta);
        }
        if (loadedModelRef.current.gltf.scene) {
          gestureCtrlRef.current.update(delta);
        }
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [avatarGlbUrl]);

  useEffect(() => {
    if (loadedModelRef.current?.headMesh) {
      expressionCtrlRef.current.setExpression(loadedModelRef.current.headMesh, expression);
    }
  }, [expression]);

  useEffect(() => {
    if (gesture && loadedModelRef.current?.gltf.scene) {
      gestureCtrlRef.current.playGesture(
        loadedModelRef.current.gltf.scene,
        gesture,
        loadedModelRef.current.gltf.animations
      );
    }
  }, [gesture]);

  return (
    <div className={styles.container} ref={mountRef}>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
          <span>Loading 3D Avatar...</span>
        </div>
      )}
    </div>
  );
};
