export interface BaseImage {
  original: string; // 原始分辨率图片的DataURL
  thumbnail: string; // 缩略图的DataURL
  name: string; // 文件名
}

export interface WatermarkImage extends BaseImage {}

export interface ResizeImage extends BaseImage {
  width: number;
  height: number;
}

export interface ConverterImage extends BaseImage {
  type: string;
}
