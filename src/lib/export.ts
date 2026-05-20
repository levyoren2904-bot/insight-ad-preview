import { toPng } from "html-to-image";

export async function exportToPng(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const dataUrl = await toPng(element, {
    quality: 1,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
  });

  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}

export async function exportToPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const dataUrl = await toPng(element, {
    quality: 1,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
  });

  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          @page { margin: 20mm; }
          body { margin: 0; display: flex; justify-content: center; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" />
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
}
