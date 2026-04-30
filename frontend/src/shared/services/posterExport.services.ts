import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

export const exportPosterAsFile = async (
  node: HTMLElement | null,
  fileName: string,
): Promise<File | null> => {
  if (!node) return null;

  const dataUrl = await toPng(node, {
    quality: 1,
    pixelRatio: 1,
    cacheBust: false,
  });

  // Convert base64 to Blob
  const res = await fetch(dataUrl);
  const blob = await res.blob();

  // Create File from Blob
  const file = new File([blob], `${fileName}.png`, {
    type: 'image/png',
  });

  return file;
};

export const exportPosterAsPdfColor = async (
  node: HTMLElement | null,
  fileName: string,
) => {
  if (!node) return;

  const dataUrl = await toJpeg(node, {
    quality: 1,
    pixelRatio: 3,
    cacheBust: true,
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;

  let imgWidth = pageWidth;
  let imgHeight = (1350 * imgWidth) / 1080;

  if (imgHeight > pageHeight) {
    imgHeight = pageHeight;
    imgWidth = (1080 * imgHeight) / 1350;
  }

  const x = (pageWidth - imgWidth) / 2;
  const y = (pageHeight - imgHeight) / 2;

  pdf.addImage(dataUrl, 'JPEG', x, y, imgWidth, imgHeight);
  pdf.save(`${fileName}.pdf`);
};

export const exportPosterAsPdfBlackAndWhite = async (
  node: HTMLElement | null,
  fileName: string,
) => {
  if (!node) return;

  const dataUrl = await toJpeg(node, {
    quality: 1,
    pixelRatio: 3,
    cacheBust: true,
  });

  const img = new Image();
  img.src = dataUrl;

  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }

    ctx.putImageData(imageData, 0, 0);

    const bwDataUrl = canvas.toDataURL('image/jpeg', 1);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;

    let imgWidth = pageWidth;
    let imgHeight = (1350 * imgWidth) / 1080;

    if (imgHeight > pageHeight) {
      imgHeight = pageHeight;
      imgWidth = (1080 * imgHeight) / 1350;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(bwDataUrl, 'JPEG', x, y, imgWidth, imgHeight);
    pdf.save(`${fileName}.pdf`);
  };
};
