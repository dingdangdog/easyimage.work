import JSZip from "jszip";
import { saveAs } from "file-saver";

export const downloadWatermarkAsZip = async (
  images: WatermarkImage[],
  zipName = "images.zip"
) => {
  const zip = new JSZip();
  const fetchPromises = images.map(async (image) => {
    const response = await fetch(image.original);
    const blob = await response.blob();
    zip.file(`watermark_${image.name}`, blob);
  });

  await Promise.all(fetchPromises);
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, zipName);
};

export const downloadResizeAsZip = async (
  images: ResizeImage[],
  zipName = "images.zip"
) => {
  const zip = new JSZip();
  const fetchPromises = images.map(async (image) => {
    const response = await fetch(image.original);
    const blob = await response.blob();
    zip.file(`resize_${image.name}`, blob);
  });

  await Promise.all(fetchPromises);
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, zipName);
};

export const downloadConvertAsZip = async (
  images: ConverterImage[],
  zipName = "images.zip"
) => {
  const zip = new JSZip();
  const fetchPromises = images.map(async (image) => {
    const response = await fetch(image.original);
    const blob = await response.blob();
    zip.file(`convert_${image.name}.${image.type}`, blob);
  });

  await Promise.all(fetchPromises);
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, zipName);
};
