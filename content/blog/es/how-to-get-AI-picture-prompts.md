---
date: 2025-03-16
title: Cómo Extraer Prompts de Imágenes AI de Imágenes Generadas con EasyImage.work
---

¿Te has preguntado alguna vez cómo extraer los prompts y parámetros originales de una imagen generada por IA? ¿O has querido entender la configuración exacta utilizada para crear esa obra de arte impresionante? En EasyImage.work, hemos desarrollado una herramienta de análisis de IA sofisticada que puede extraer información detallada de prompts directamente de imágenes generadas por IA. ¡Hoy, vamos a profundizar en la implementación técnica de cómo extraer prompts de imágenes AI de metadatos de imagen, tal como lo hemos hecho en EasyImage.work!

## La Importancia de la Extracción de Prompts de IA

Las imágenes generadas por IA se han vuelto cada vez más populares, y entender cómo fueron creadas es valioso por varias razones:

- **Aprendizaje y Mejora:** Al analizar prompts exitosos, puedes aprender qué funciona y mejorar tus propias habilidades de generación de arte con IA.
- **Reproducción y Variación:** Extraer prompts te permite recrear imágenes similares o crear variaciones con modificaciones ligeras.
- **Documentación y Compartir:** Tener los prompts originales ayuda a documentar tu proceso creativo y compartir técnicas con otros.
- **Evaluación de Calidad:** Entender los parámetros utilizados puede ayudar a evaluar la calidad y complejidad de las obras de arte generadas por IA.

Sin embargo, es crucial notar que **solo las imágenes generadas por IA originales pueden extraer prompts exitosamente**. Una vez que una imagen ha sido editada, redimensionada o convertida a diferentes formatos, los metadatos que contienen la información del prompt pueden perderse o corromperse, haciendo imposible la extracción.

## Perspectivas Técnicas Detrás del Análisis de IA de EasyImage.work

Podrías tener curiosidad sobre cómo EasyImage.work extrae información detallada de prompts directamente de imágenes generadas por IA en el navegador. Hoy, revelaremos el secreto examinando el código JavaScript central que impulsa nuestra funcionalidad de análisis de IA.

```js
// Extraer información de IA del archivo
const extractAIInfoFromFile = async (file: File): Promise<AIInfo | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let extractedText = "";

    // Usar diferentes métodos de extracción basados en el tipo de archivo
    if (file.type === "image/png" || file.name.toLowerCase().endsWith(".png")) {
      extractedText = extractPNGText(uint8Array);
    } else if (
      file.type.startsWith("image/jpeg") ||
      file.name.toLowerCase().match(/\.(jpg|jpeg)$/)
    ) {
      extractedText = extractJPEGText(uint8Array);
    }

    if (!extractedText.trim()) {
      console.log(`[DEBUG] File ${file.name} has no extracted text`);
      return null;
    }

    // Verificar si el texto contiene palabras clave de IA
    const aiKeywords = [
      "Steps:",
      "Sampler:",
      "CFG scale:",
      "Seed:",
      "Size:",
      "Model:",
      "Negative prompt:",
      "parameters",
      "DPM++",
      "Euler",
    ];

    const hasAI = aiKeywords.some((keyword) => extractedText.includes(keyword));

    if (!hasAI) {
      console.log(`[DEBUG] File ${file.name} does not contain AI keywords`);
      return null;
    }

    // Limpiar y formatear el texto
    const cleanText = extractedText
      .replace(/\0/g, "")
      .replace(/\r/g, "")
      .trim();

    // Formatear información de IA
    const formattedText = formatAIText(cleanText);

    return {
      rawText: formattedText,
    };
  } catch (error) {
    console.error(`Error analyzing file ${file.name}:`, error);
    return null;
  }
};
```

## Extracción de Texto PNG

Para imágenes PNG, las herramientas de IA a menudo almacenan información de prompts en fragmentos de texto dentro del archivo de imagen. Aquí está cómo extraemos estos datos:

```js
// Extraer texto PNG
const extractPNGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 8; // Saltar firma PNG

    while (offset < uint8Array.length - 8) {
      const length =
        (uint8Array[offset] << 24) |
        (uint8Array[offset + 1] << 16) |
        (uint8Array[offset + 2] << 8) |
        uint8Array[offset + 3];
      const type = String.fromCharCode(
        uint8Array[offset + 4],
        uint8Array[offset + 5],
        uint8Array[offset + 6],
        uint8Array[offset + 7]
      );

      if (type === "tEXt" || type === "iTXt") {
        const data = uint8Array.slice(offset + 8, offset + 8 + length);
        const chunkText = new TextDecoder("utf-8", { fatal: false }).decode(
          data
        );
        text += chunkText + "\n";
        console.log(`[DEBUG] Found PNG ${type} chunk:`, chunkText.substring(0, 200));
      }

      offset += 12 + length;
      if (type === "IEND") break;
    }

    return text;
  } catch (error) {
    console.error("PNG text extraction failed:", error);
    return "";
  }
};
```

## Extracción de Texto JPEG

Para imágenes JPEG, los metadatos de IA típicamente se almacenan en datos EXIF dentro de segmentos APP1:

```js
// Extraer texto JPEG
const extractJPEGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 2; // Saltar marcador SOI

    while (offset < uint8Array.length - 4) {
      const marker = (uint8Array[offset] << 8) | uint8Array[offset + 1];

      if (marker === 0xffe1) {
        // Segmento APP1
        const length = (uint8Array[offset + 2] << 8) | uint8Array[offset + 3];
        const data = uint8Array.slice(offset + 4, offset + 2 + length);
        const segmentText = new TextDecoder("utf-8", { fatal: false }).decode(
          data
        );
        text += segmentText + "\n";
        console.log(
          `[DEBUG] Found JPEG APP1 segment:`,
          segmentText.substring(0, 200)
        );
      }

      const segmentLength =
        (uint8Array[offset + 2] << 8) | uint8Array[offset + 3];
      offset += 2 + segmentLength;

      // Detenerse al llegar a datos de imagen
      if (
        marker >= 0xffc0 &&
        marker <= 0xffcf &&
        marker !== 0xffc4 &&
        marker !== 0xffc8
      ) {
        break;
      }
    }

    return text;
  } catch (error) {
    console.error("JPEG text extraction failed:", error);
    return "";
  }
};
```

## Formateo de Texto de IA

Una vez que extraemos el texto crudo, necesitamos formatearlo correctamente para hacerlo legible y organizado:

```js
// Formatear texto de IA
const formatAIText = (rawText: string): string => {
  let formattedText = "";

  // Buscar sección de parámetros
  const paramMatch = rawText.match(/parameters[:\s]*(.*)/is);
  if (paramMatch && paramMatch[1]) {
    const fullContent = paramMatch[1].trim();

    // Dividir contenido: Prompt, Prompt negativo, Parámetros
    const sections = fullContent.split(/(?=Negative prompt:|Steps:)/);

    // Procesar sección de Prompt
    if (sections[0]) {
      const promptText = sections[0].replace(/\n+/g, " ").trim();

      if (
        promptText &&
        !promptText.toLowerCase().startsWith("negative prompt")
      ) {
        formattedText += `Prompt:\n${promptText}\n\n`;
      }
    }

    // Procesar sección de Prompt negativo
    const negativeSection = sections.find((s) =>
      s.trim().startsWith("Negative prompt:")
    );
    if (negativeSection) {
      const negativeMatch = negativeSection.match(
        /Negative prompt:\s*(.*?)(?=\n*Steps:|$)/s
      );
      if (negativeMatch && negativeMatch[1]) {
        const negativeText = negativeMatch[1].replace(/\n+/g, " ").trim();
        formattedText += `Negative prompt:\n${negativeText}\n\n`;
      }
    }

    // Procesar sección de Parámetros
    const paramSection = sections.find((s) => s.includes("Steps:"));
    if (paramSection) {
      formattedText += "Parameters:\n";

      // Extraer líneas de parámetros
      const paramText = paramSection.replace(/^.*?(Steps:)/s, "Steps:");

      // Convertir parámetros separados por comas a separados por líneas
      const params = paramText.split(/,\s*(?=[A-Za-z])/);

      params.forEach((param) => {
        const trimmedParam = param.trim();
        if (trimmedParam) {
          formattedText += `${trimmedParam}\n`;
        }
      });
    }
  }

  return formattedText.trim();
};
```

## Explicación del Código

1. **Detección de Tipo de Archivo:** El código primero determina si el archivo subido es una imagen PNG o JPEG, ya que diferentes formatos almacenan metadatos de manera diferente.

2. **Procesamiento de Datos Binarios:** El archivo se convierte a un `Uint8Array` para procesar los datos binarios crudos y extraer información de texto incrustada.

3. **Extracción Específica de Formato:** 
   - Para archivos PNG, el código busca fragmentos `tEXt` e `iTXt` que contienen metadatos de texto
   - Para archivos JPEG, busca segmentos APP1 que contienen datos EXIF con parámetros de IA

4. **Detección de Palabras Clave de IA:** El texto extraído se analiza para palabras clave específicas relacionadas con IA como "Steps:", "Sampler:", "CFG scale:", etc., para confirmar que contiene parámetros de generación de IA.

5. **Formateo de Texto:** El texto extraído crudo se limpia y formatea en una estructura legible con secciones claras para Prompt, Prompt negativo y Parámetros.

6. **Validación de Resultados:** Solo los archivos que contienen metadatos de IA válidos se procesan y muestran al usuario.

## Requisitos Críticos para Extracción Exitosa

**Importante:** Este proceso de extracción solo funciona con **imágenes generadas por IA originales**. Aquí está por qué:

- **Preservación de Metadatos:** Las herramientas de IA como Stable Diffusion, Midjourney y DALL-E incrustan información de prompts directamente en los metadatos del archivo de imagen cuando la imagen se genera por primera vez.

- **Pérdida de Datos Durante el Procesamiento:** Cuando las imágenes se editan, redimensionan, convierten a diferentes formatos o se procesan a través de software de edición de imágenes, los metadatos que contienen la información del prompt a menudo se eliminan o corrompen.

- **Limitaciones de Formato:** Solo se admiten formatos PNG y JPEG, ya que estos son los formatos que las herramientas de IA típicamente usan para almacenar metadatos.

- **Requisito de Fuente Original:** Las imágenes que han sido descargadas de redes sociales, capturadas como pantalla o procesadas a través de aplicaciones web pueden perder sus metadatos originales.

## Ventajas del Análisis de IA de EasyImage.work

Este código representa solo un componente de la funcionalidad integral de análisis de IA de EasyImage.work. En nuestra implementación práctica, hemos hecho numerosas optimizaciones y mejoras:

- **Soporte Multi-Formato:** EasyImage.work admite tanto formatos PNG como JPEG, cubriendo los tipos más comunes de imágenes generadas por IA.

- **Detección Inteligente:** Nuestro sistema detecta automáticamente si una imagen contiene metadatos de IA y proporciona retroalimentación clara cuando no se encuentra información.

- **Interfaz Amigable para el Usuario:** Con EasyImage.work, no necesitas entender los detalles técnicos. Simplemente sube tu imagen generada por IA y ve instantáneamente los prompts y parámetros extraídos.

- **Funcionalidad de Exportación:** Puedes copiar fácilmente los prompts extraídos o exportar todos los resultados como archivos JSON para análisis adicional.

- **Procesamiento por Lotes:** Procesa múltiples imágenes a la vez para extraer prompts de colecciones completas de obras de arte generadas por IA.

## Conclusión

A través de esta inmersión técnica profunda, ahora entiendes cómo extraer prompts de imágenes AI de imágenes generadas. Este proceso se basa en analizar cuidadosamente los metadatos de imagen que las herramientas de IA incrustan durante el proceso de generación.

**Recuerda:** La clave para la extracción exitosa de prompts es usar **imágenes generadas por IA originales y no modificadas**. Una vez que una imagen ha sido procesada, editada o convertida, la valiosa información del prompt puede perderse permanentemente.

¡Si necesitas una herramienta simple, eficiente y poderosa para extraer prompts de IA de tus imágenes generadas, recuerda [EasyImage.work](https://easyimage.work)! Continuaremos trabajando arduamente para traerte más características de análisis de IA convenientes y prácticas, ayudándote a desbloquear los secretos detrás de tus obras de arte generadas por IA favoritas!
