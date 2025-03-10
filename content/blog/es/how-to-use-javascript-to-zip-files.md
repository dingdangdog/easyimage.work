---
date: 2025-03-09
title: Cómo usar JavaScript para empaquetar archivos en un paquete comprimido (.zip)
---

En el desarrollo web moderno, comprimir archivos es un requisito común. Los usuarios pueden necesitar combinar múltiples archivos en un paquete comprimido para descargar, o generar archivos a través de una aplicación web y exportarlos como un archivo `.zip`. Esta entrada del blog proporcionará una guía detallada sobre cómo implementar operaciones de empaquetado y compresión de archivos en el navegador utilizando JavaScript. Lo lograremos utilizando la popular biblioteca JavaScript JSZip y aprovechando FileSaver.js para las descargas de archivos.

## Preparación

Primero, necesitamos instalar dos bibliotecas comúnmente utilizadas:

1. JSZip: Esta es una biblioteca JavaScript ligera utilizada para crear y manejar archivos `.zip`.
2. FileSaver.js: Esta biblioteca proporciona una forma compatible con todos los navegadores para activar descargas de archivos.

Puedes instalar estas bibliotecas en tu proyecto usando:

```bash
npm install jszip file-saver
```

O incluirlas a través de CDN (para usar en HTML):

```html
<script src="https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>
```

## Implementación de la Función de Utilidad

A continuación, escribiremos una función de utilidad encapsulada para empaquetar múltiples archivos en un archivo `.zip` y activar una descarga. Digamos que queremos empaquetar una serie de imágenes, que pueden ser archivos originales o archivos procesados.

### Función Genérica `downloadFilesAsZip`

```js
import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * Descargar múltiples archivos empaquetados como un archivo Zip
 * @param {Array} files - Array de objetos de archivo, cada uno contiene una URL y un nombre de archivo
 * @param {string} zipName - Nombre del archivo Zip generado, por defecto es 'download.zip'
 */
export const downloadFilesAsZip = async (files, zipName = "download.zip") => {
  // Crear una nueva instancia de JSZip
  const zip = new JSZip();

  // Usar map para crear un array de Promesas para procesar cada archivo
  const fetchPromises = files.map(async (file) => {
    try {
      // Solicitar el recurso del archivo, asumiendo que el archivo se proporciona a través de URL
      const response = await fetch(file.url); // Obtener el recurso del archivo
      const blob = await response.blob(); // Convertir la respuesta a un objeto Blob

      // Añadir el archivo al paquete zip, usando el nombre de archivo proporcionado
      zip.file(file.name, blob);
    } catch (error) {
      console.error(`Error al añadir el archivo: ${file.name}`, error);
    }
  });

  // Esperar a que todos los archivos sean descargados y añadidos al Zip
  await Promise.all(fetchPromises);

  // Generar el contenido del paquete zip (tipo blob)
  const content = await zip.generateAsync({ type: "blob" });

  // Usar FileSaver.js para descargar el paquete zip
  saveAs(content, zipName);
};
```

### Explicación del Código

- Creando una instancia de `JSZip`: `const zip = new JSZip();` — Crea una nueva instancia de archivo Zip, todos los archivos se añadirán a esta instancia.
- Descarga y empaquetado de archivos: Utiliza la función `fetch()` para obtener el contenido del archivo desde la URL, luego lo convierte a formato `blob`. Esto es porque `JSZip` admite el procesamiento de archivos en formato `blob`.
- Generando el archivo `.zip`: A través de `zip.generateAsync({ type: "blob" })`, todos los archivos añadidos al objeto `zip` se comprimen en un archivo `.zip`, devolviendo un objeto `blob`.
- Guardando el archivo: Usando `saveAs(content, zipName)` con FileSaver.js para activar la descarga del archivo, donde `content` es el paquete zip generado y `zipName` es el nombre del archivo de descarga.

## Cómo Usar Esta Función de Utilidad

Supongamos que tenemos un conjunto de URLs de imágenes y queremos empaquetarlas en un archivo `.zip` para descargar. Aquí hay un ejemplo de cómo llamar a la función `downloadFilesAsZip`:

```js
// Datos de ejemplo de archivos: contiene URL del archivo y nombre del archivo
const files = [
  { url: "https://example.com/image1.jpg", name: "image1.jpg" },
  { url: "https://example.com/image2.jpg", name: "image2.jpg" },
  { url: "https://example.com/image3.jpg", name: "image3.jpg" },
];

// Llamar a la función para descargar archivos y empaquetar como un archivo zip
downloadFilesAsZip(files, "images.zip");
```

En este ejemplo, proporcionamos un array de objetos que contienen URLs de imágenes y nombres de archivos. Después de llamar a la función `downloadFilesAsZip`, el navegador automáticamente activará una operación de descarga y empaquetará estas imágenes en un archivo comprimido llamado `images.zip`.

## Problemas Comunes y Soluciones

1. Problemas de Origen Cruzado
   Si los archivos provienen de diferentes dominios, asegúrate de que el servidor haya establecido los encabezados correctos de Compartición de Recursos de Origen Cruzado (CORS). De lo contrario, el navegador bloqueará las solicitudes `fetch()`, impidiendo las descargas de archivos.
2. Descargas de Archivos Grandes
   Si los archivos que se están descargando son grandes, es posible que necesites optimizar el proceso de descarga, como implementar descargas por fragmentos o mostrar barras de progreso.
3. Compatibilidad con Navegadores
   Este método depende de `fetch()` y `FileSaver.js`, por lo que requiere navegadores modernos que admitan estas APIs. Si necesitas admitir navegadores más antiguos, considera usar polyfills.

## Soluciones Alternativas

Además de usar `JSZip` y `FileSaver.js`, hay varias otras soluciones comunes para implementar la compresión y el empaquetado de archivos en el navegador:

1. **Pako.js**: `Pako` es una biblioteca de compresión zlib para JavaScript, que admite formatos gzip y deflate. Es adecuada para comprimir archivos más pequeños y es relativamente simple de usar.
2. **Archiver.js**: `Archiver.js` es una biblioteca rica en características que admite la compresión a formatos como `.tar`, `.zip`, etc. Puede realizar la compresión de archivos en el navegador y proporciona más opciones de control.
3. **zip.js**: `zip.js` es una biblioteca JavaScript que admite la descompresión y compresión en streaming, capaz de manejar archivos más grandes y proporcionar funcionalidad para comprimir a archivos `.zip`.
4. **BrowserFS + zip-lib**: `BrowserFS` es una biblioteca que proporciona simulación de sistema de archivos en el navegador. Combinado con `zip-lib`, puede crear y descargar archivos `.zip`, adecuado para aplicaciones que necesitan simular un sistema de archivos.
