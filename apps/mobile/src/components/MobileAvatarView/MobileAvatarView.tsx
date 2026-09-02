import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export interface MobileAvatarViewProps {
  avatarGlbUrl?: string;
  expression?: string;
  gesture?: string;
  peerName?: string;
}

export const MobileAvatarView: React.FC<MobileAvatarViewProps> = ({
  avatarGlbUrl = 'https://models.readyplayer.me/6460d375e840d8d4ce946328.glb',
  expression = 'smile',
  gesture,
  peerName = 'Peer 3D Avatar'
}) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body { margin: 0; padding: 0; overflow: hidden; background: #0f172a; }
          #canvas { width: 100vw; height: 100vh; display: block; }
        </style>
        <script type="importmap">
          {
            "imports": {
              "three": "https://unpkg.com/three@0.173.0/build/three.module.js",
              "three/examples/jsm/loaders/GLTFLoader.js": "https://unpkg.com/three@0.173.0/examples/jsm/loaders/GLTFLoader.js"
            }
          }
        </script>
      </head>
      <body>
        <div id="canvas"></div>
        <script type="module">
          import * as THREE from 'three';
          import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

          const container = document.getElementById('canvas');
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
          camera.position.set(0, 1.42, 1.05);
          camera.lookAt(0, 1.35, 0);

          const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          container.appendChild(renderer.domElement);

          const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
          keyLight.position.set(-1, 2, 2);
          scene.add(keyLight);

          const fillLight = new THREE.DirectionalLight(0x90e0ef, 0.8);
          fillLight.position.set(1, 1.5, 1.5);
          scene.add(fillLight);

          const rimLight = new THREE.DirectionalLight(0x3b82f6, 1.2);
          rimLight.position.set(0, 2, -2);
          scene.add(rimLight);

          scene.add(new THREE.AmbientLight(0xffffff, 0.6));

          const loader = new GLTFLoader();
          loader.load('${avatarGlbUrl}', (gltf) => {
            scene.add(gltf.scene);
          });

          function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
          }
          animate();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <View style={styles.headerPill}>
        <Text style={styles.headerText}>🎭 {peerName}</Text>
      </View>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    backgroundColor: '#0f172a',
    position: 'relative'
  },
  headerPill: {
    position: 'absolute',
    top: 12,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  headerText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  webview: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  }
});
