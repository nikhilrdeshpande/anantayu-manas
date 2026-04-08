import html2canvas from 'html2canvas';

export async function captureElement(element: HTMLElement): Promise<Blob> {
  const canvas = await html2canvas(element);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png');
  });
}

export async function shareResults(url: string, title: string, text: string) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
    } catch {
      // User cancelled or share failed
    }
  } else {
    await navigator.clipboard.writeText(url);
  }
}
