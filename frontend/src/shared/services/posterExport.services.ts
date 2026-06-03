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

/**
 * Converts a data URL to a Blob without using fetch()
 * This is essential for iOS compatibility where fetch() on data URLs fails
 * Works on all browsers and devices
 */
const dataUrlToBlob = (dataUrl: string): Blob => {
  console.log('[posterExport] dataUrlToBlob: Starting conversion');
  console.log('[posterExport] dataUrlToBlob: Data URL length:', dataUrl.length);

  try {
    const parts = dataUrl.split(',');
    console.log(
      '[posterExport] dataUrlToBlob: Split parts count:',
      parts.length,
    );

    if (parts.length !== 2) {
      throw new Error(
        `Invalid data URL format - expected 2 parts, got ${parts.length}`,
      );
    }

    const header = parts[0];
    const data = parts[1];

    console.log('[posterExport] dataUrlToBlob: Header:', header);
    console.log('[posterExport] dataUrlToBlob: Data length:', data.length);

    // Decode base64
    let bstr: string;
    try {
      bstr = atob(data);
      console.log(
        '[posterExport] dataUrlToBlob: atob successful, decoded length:',
        bstr.length,
      );
    } catch (e) {
      console.error('[posterExport] dataUrlToBlob: atob failed:', e);
      throw new Error(`Failed to decode base64 data: ${e}`);
    }

    const n = bstr.length;
    const u8arr = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    console.log(
      '[posterExport] dataUrlToBlob: Created Uint8Array of length:',
      u8arr.length,
    );

    // Extract MIME type from header
    const mimeMatch = header.match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

    console.log('[posterExport] dataUrlToBlob: Detected MIME type:', mimeType);

    const blob = new Blob([u8arr], { type: mimeType });
    console.log(
      '[posterExport] dataUrlToBlob: Blob created successfully, size:',
      blob.size,
    );

    return blob;
  } catch (error) {
    console.error('[posterExport] dataUrlToBlob: FATAL ERROR:', error);
    throw error;
  }
};

export const exportPosterAsFile = async (
  node: HTMLElement | null,
  fileName: string,
): Promise<File | null> => {
  console.log(
    '[posterExport] exportPosterAsFile: Starting with fileName:',
    fileName,
  );

  if (!node) {
    console.warn('[posterExport] exportPosterAsFile: No HTML node provided');
    return null;
  }

  console.log(
    '[posterExport] exportPosterAsFile: Node found, generating PNG...',
  );

  try {
    const dataUrl = await toPng(node, {
      quality: 1,
      pixelRatio: 1,
      cacheBust: false,
    });

    console.log(
      '[posterExport] exportPosterAsFile: toPng succeeded, dataUrl length:',
      dataUrl.length,
    );

    if (!dataUrl) {
      console.warn(
        '[posterExport] exportPosterAsFile: toPng returned empty data URL',
      );
      return null;
    }

    console.log(
      '[posterExport] exportPosterAsFile: Converting data URL to Blob...',
    );

    // Use direct conversion instead of fetch() for iOS Safari compatibility
    let blob: Blob;
    try {
      blob = dataUrlToBlob(dataUrl);
      console.log(
        '[posterExport] exportPosterAsFile: Blob conversion succeeded',
      );
    } catch (error) {
      console.error(
        '[posterExport] exportPosterAsFile: Blob conversion failed:',
        error,
      );
      return null;
    }

    console.log('[posterExport] exportPosterAsFile: Creating File object...');

    const file = new File([blob], `${fileName}.png`, {
      type: 'image/png',
    });

    console.log(
      '[posterExport] exportPosterAsFile: File created successfully',
      {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    );

    return file;
  } catch (error) {
    console.error('[posterExport] exportPosterAsFile: CRITICAL ERROR:', error);
    console.error(
      '[posterExport] exportPosterAsFile: Error stack:',
      error instanceof Error ? error.stack : 'No stack',
    );
    return null;
  }
};

export const exportPosterAsPdfColor = async (
  source: PosterSource,
  fileName: string,
  format: string = 'letter',
) => {
  console.log(
    '[posterExport] exportPosterAsPdfColor: Starting with fileName:',
    fileName,
    'format:',
    format,
  );

  if (!source) {
    console.warn('[posterExport] exportPosterAsPdfColor: No source provided');
    return;
  }

  try {
    const image = await loadImageFromSource(source);
    if (!image) {
      console.warn(
        '[posterExport] exportPosterAsPdfColor: Failed to load image',
      );
      return;
    }

    console.log('[posterExport] exportPosterAsPdfColor: Image loaded', {
      width: image.width,
      height: image.height,
    });

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

    if (!ctx) {
      console.error(
        '[posterExport] exportPosterAsPdfColor: Could not get canvas context',
      );
      return;
    }

    ctx.drawImage(image, 0, 0);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 1);
    console.log(
      '[posterExport] exportPosterAsPdfColor: Canvas converted to data URL',
    );

    addCenteredImageToPdf(
      pdf,
      imageDataUrl,
      imageWidth,
      imageHeight,
      pageWidth,
      pageHeight,
    );

    pdf.save(`${fileName}.pdf`);
    console.log(
      '[posterExport] exportPosterAsPdfColor: PDF saved successfully',
    );
  } catch (error) {
    console.error('[posterExport] exportPosterAsPdfColor: ERROR:', error);
  }
};

export const exportPosterAsPdfBlackAndWhite = async (
  source: PosterSource,
  fileName: string,
  format: string = 'a5',
) => {
  console.log(
    '[posterExport] exportPosterAsPdfBlackAndWhite: Starting with fileName:',
    fileName,
    'format:',
    format,
  );

  if (!source) {
    console.warn(
      '[posterExport] exportPosterAsPdfBlackAndWhite: No source provided',
    );
    return;
  }

  try {
    const image = await loadImageFromSource(source);
    if (!image) {
      console.warn(
        '[posterExport] exportPosterAsPdfBlackAndWhite: Failed to load image',
      );
      return;
    }

    console.log('[posterExport] exportPosterAsPdfBlackAndWhite: Image loaded');

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error(
        '[posterExport] exportPosterAsPdfBlackAndWhite: Could not get canvas context',
      );
      return;
    }

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
    console.log(
      '[posterExport] exportPosterAsPdfBlackAndWhite: B&W conversion complete',
    );

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
    console.log(
      '[posterExport] exportPosterAsPdfBlackAndWhite: PDF saved successfully',
    );
  } catch (error) {
    console.error(
      '[posterExport] exportPosterAsPdfBlackAndWhite: ERROR:',
      error,
    );
  }
};
