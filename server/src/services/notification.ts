export interface ExpoPushMessage {
  to: string;
  sound?: 'default';
  title: string;
  body: string;
  data?: Record<string, any>;
}

export async function sendExpoPushNotification(message: ExpoPushMessage): Promise<boolean> {
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([message])
    });
    return response.ok;
  } catch {
    return false;
  }
}
