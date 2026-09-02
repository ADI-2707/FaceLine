import * as ScreenCapture from 'expo-screen-capture';

export async function enableScreenProtection(): Promise<void> {
  try {
    await ScreenCapture.preventScreenCaptureAsync();
  } catch {}
}

export function listenForScreenshots(onScreenshot: () => void): () => void {
  try {
    const subscription = ScreenCapture.addScreenshotListener(() => {
      onScreenshot();
    });
    return () => subscription.remove();
  } catch {
    return () => {};
  }
}
