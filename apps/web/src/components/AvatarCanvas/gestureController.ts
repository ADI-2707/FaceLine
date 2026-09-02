import * as THREE from 'three';

export type GestureType = 'wave' | 'thumbs_up' | 'clap' | 'peace_sign' | 'point';

export class GestureController {
  private mixer?: THREE.AnimationMixer;
  private activeAction?: THREE.AnimationAction;

  public init(root: THREE.Object3D, animations: THREE.AnimationClip[]): void {
    this.mixer = new THREE.AnimationMixer(root);
  }

  public playGesture(root: THREE.Object3D, gesture: GestureType, animations: THREE.AnimationClip[] = []): void {
    if (!this.mixer) {
      this.mixer = new THREE.AnimationMixer(root);
    }

    const clip = animations.find(
      (a) => a.name.toLowerCase().includes(gesture) || a.name.toLowerCase().includes(gesture.replace('_', ''))
    );

    if (clip) {
      if (this.activeAction) {
        this.activeAction.fadeOut(0.3);
      }
      const action = this.mixer.clipAction(clip);
      action.reset();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.fadeIn(0.3);
      action.play();
      this.activeAction = action;
    } else {
      this.triggerProceduralGesture(root, gesture);
    }
  }

  private triggerProceduralGesture(root: THREE.Object3D, gesture: GestureType): void {
    let rightArmBone: THREE.Object3D | undefined;
    root.traverse((child) => {
      if (child.name.toLowerCase().includes('rightarm') || child.name.toLowerCase().includes('rightshoulder')) {
        rightArmBone = child;
      }
    });

    if (rightArmBone) {
      const initialRotationZ = rightArmBone.rotation.z;
      const targetRotationZ = gesture === 'wave' ? initialRotationZ - 0.8 : initialRotationZ - 0.5;

      const startTime = performance.now();
      const animateArm = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        if (elapsed < 0.4) {
          rightArmBone!.rotation.z = THREE.MathUtils.lerp(initialRotationZ, targetRotationZ, elapsed / 0.4);
          requestAnimationFrame(animateArm);
        } else if (elapsed < 1.2) {
          rightArmBone!.rotation.z = targetRotationZ + Math.sin(elapsed * 10) * 0.15;
          requestAnimationFrame(animateArm);
        } else if (elapsed < 1.6) {
          rightArmBone!.rotation.z = THREE.MathUtils.lerp(targetRotationZ, initialRotationZ, (elapsed - 1.2) / 0.4);
          requestAnimationFrame(animateArm);
        } else {
          rightArmBone!.rotation.z = initialRotationZ;
        }
      };
      animateArm();
    }
  }

  public update(delta: number): void {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }
}
