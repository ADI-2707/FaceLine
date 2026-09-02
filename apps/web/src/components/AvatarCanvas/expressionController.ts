import * as THREE from 'three';

export type ExpressionType = 'neutral' | 'smile' | 'sarcastic_smirk' | 'surprise' | 'laugh';

export interface ExpressionPreset {
  [morphName: string]: number;
}

export const EXPRESSION_PRESETS: Record<ExpressionType, ExpressionPreset> = {
  neutral: {},
  smile: {
    mouthSmile: 0.8,
    mouthSmileLeft: 0.8,
    mouthSmileRight: 0.8,
    eyeSquintLeft: 0.3,
    eyeSquintRight: 0.3
  },
  sarcastic_smirk: {
    mouthSmileLeft: 0.85,
    browInnerUp: 0.5,
    browOuterUpLeft: 0.6,
    eyeSquintLeft: 0.4
  },
  surprise: {
    jawOpen: 0.55,
    browInnerUp: 0.85,
    eyeWideLeft: 0.7,
    eyeWideRight: 0.7
  },
  laugh: {
    mouthSmile: 1.0,
    jawOpen: 0.45,
    eyeBlinkLeft: 0.6,
    eyeBlinkRight: 0.6
  }
};

export class ExpressionController {
  private targetInfluences: Map<number, number> = new Map();

  public setExpression(headMesh: THREE.Mesh, expression: ExpressionType): void {
    if (!headMesh || !headMesh.morphTargetDictionary || !headMesh.morphTargetInfluences) return;

    this.targetInfluences.clear();
    const preset = EXPRESSION_PRESETS[expression] || EXPRESSION_PRESETS.neutral;
    const dict = headMesh.morphTargetDictionary;

    for (const [key, value] of Object.entries(preset)) {
      if (dict[key] !== undefined) {
        this.targetInfluences.set(dict[key], value);
      }
    }
  }

  public update(headMesh: THREE.Mesh, delta: number): void {
    if (!headMesh || !headMesh.morphTargetInfluences) return;

    const influences = headMesh.morphTargetInfluences;
    const lerpSpeed = Math.min(delta * 12, 1);

    for (let i = 0; i < influences.length; i++) {
      const target = this.targetInfluences.get(i) || 0;
      influences[i] = THREE.MathUtils.lerp(influences[i], target, lerpSpeed);
    }
  }
}
