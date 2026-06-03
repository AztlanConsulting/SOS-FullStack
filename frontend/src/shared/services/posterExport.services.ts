import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

type PosterSource = HTMLElement | string | File | null;

const loadImageFromSource = async (source: Exclude<PosterSource, null>) => {
  if (source instanceof HTMLElement) {
    if (source instanceof HTMLImageElement) {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = source.src;
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = (error) => reject(error);
      });
      return image;
    }

    const dataUrl = await toJpeg(source, {
      quality: 1,
      pixelRatio: 3,
      cacheBust: true,
    });

    const image = new Image();
    image.src = dataUrl;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = (error) => reject(error);
    });

    return image;
  }

  const image = new Image();
  image.crossOrigin = 'anonymous';

  if (source instanceof File) {
    const dataUrl = await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(source);
    });

    if (!dataUrl) {
      return null;
    }

    image.src = dataUrl;
  } else {
    image.src = source;
  }

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = (error) => reject(error);
  });

  return image;
};

const getPageSize = (format: string) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format });

  return {
    pdf,
    pageWidth: pdf.internal.pageSize.getWidth(),
    pageHeight: pdf.internal.pageSize.getHeight(),
  };
};

const addCenteredImageToPdf = (
  pdf: jsPDF,
  imageDataUrl: string,
  imageWidth: number,
  imageHeight: number,
  pageWidth: number,
  pageHeight: number,
) => {
  const x = (pageWidth - imageWidth) / 2;
  const y = (pageHeight - imageHeight) / 2;

  pdf.addImage(imageDataUrl, 'JPEG', x, y, imageWidth, imageHeight);
};

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

  const res = await fetch(dataUrl);
  const blob = await res.blob();

  const file = new File([blob], `${fileName}.png`, {
    type: 'image/png',
  });

  return file;
};

export const exportPosterAsPdfColor = async (
  source: PosterSource,
  fileName: string,
  format: string = 'letter',
) => {
  if (!source) return;

  const image = await loadImageFromSource(source);
  if (!image) return;

  const { pdf, pageWidth, pageHeight } = getPageSize(format);

  const imgAspect = image.width / image.height;
  const pageAspect = pageWidth / pageHeight;

  let imageWidth = pageWidth;
  let imageHeight = pageWidth / imgAspect;

  if (imageHeight > pageHeight) {
    imageHeight = pageHeight;
    imageWidth = imageHeight * imgAspect;
  }

  if (imgAspect > pageAspect) {
    imageWidth = pageWidth;
    imageHeight = imageWidth / imgAspect;
  }

  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  ctx.drawImage(image, 0, 0);

  const imageDataUrl = canvas.toDataURL('image/jpeg', 1);
  addCenteredImageToPdf(
    pdf,
    imageDataUrl,
    imageWidth,
    imageHeight,
    pageWidth,
    pageHeight,
  );
  pdf.save(`${fileName}.pdf`);
};

export const exportPosterAsPdfBlackAndWhite = async (
  source: PosterSource,
  fileName: string,
  format: string = 'a5',
) => {
  if (!source) return;

  const image = await loadImageFromSource(source);
  if (!image) return;

  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }

  ctx.putImageData(imageData, 0, 0);

  const bwDataUrl = canvas.toDataURL('image/jpeg', 1);

  const { pdf, pageWidth, pageHeight } = getPageSize(format);
  const imgAspect = image.width / image.height;

  let imageWidth = pageWidth;
  let imageHeight = imageWidth / imgAspect;

  if (imageHeight > pageHeight) {
    imageHeight = pageHeight;
    imageWidth = imageHeight * imgAspect;
  }

  addCenteredImageToPdf(
    pdf,
    bwDataUrl,
    imageWidth,
    imageHeight,
    pageWidth,
    pageHeight,
  );
  pdf.save(`${fileName}.pdf`);
};
