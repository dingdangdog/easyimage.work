---
date: 2025-08-17
title: Como Extrair Prompts de Imagens AI de Imagens Geradas com EasyImage.work
---

Você já se perguntou como extrair os prompts e parâmetros originais de uma imagem gerada por IA? Ou quis entender as configurações exatas usadas para criar aquela obra de arte impressionante? No EasyImage.work, desenvolvemos uma ferramenta de análise de IA sofisticada que pode extrair informações detalhadas de prompts diretamente de imagens geradas por IA. Hoje, vamos mergulhar fundo na implementação técnica de como extrair prompts de imagens AI de metadados de imagem, exatamente como fizemos no EasyImage.work!

## A Importância da Extração de Prompts de IA

As imagens geradas por IA se tornaram cada vez mais populares, e entender como elas foram criadas é valioso por várias razões:

- **Aprendizado e Melhoria:** Analisando prompts bem-sucedidos, você pode aprender o que funciona e melhorar suas próprias habilidades de geração de arte com IA.
- **Reprodução e Variação:** Extrair prompts permite recriar imagens similares ou criar variações com modificações sutis.
- **Documentação e Compartilhamento:** Ter os prompts originais ajuda a documentar seu processo criativo e compartilhar técnicas com outros.
- **Avaliação de Qualidade:** Entender os parâmetros usados pode ajudar a avaliar a qualidade e complexidade de obras de arte geradas por IA.

No entanto, é crucial notar que **apenas imagens geradas por IA originais podem extrair prompts com sucesso**. Uma vez que uma imagem é editada, redimensionada ou convertida para diferentes formatos, os metadados contendo as informações do prompt podem ser perdidos ou corrompidos, tornando a extração impossível.

## Insights Técnicos Por Trás da Análise de IA do EasyImage.work

Você pode estar curioso sobre como o EasyImage.work extrai informações detalhadas de prompts diretamente de imagens geradas por IA no navegador. Hoje, vamos revelar o segredo examinando o código JavaScript central que alimenta nossa funcionalidade de análise de IA.

```js
// Extrair informações de IA do arquivo
const extractAIInfoFromFile = async (file: File): Promise<AIInfo | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let extractedText = "";

    // Usar diferentes métodos de extração baseados no tipo de arquivo
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

    // Verificar se o texto contém palavras-chave de IA
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

    // Limpar e formatar o texto
    const cleanText = extractedText
      .replace(/\0/g, "")
      .replace(/\r/g, "")
      .trim();

    // Formatar informações de IA
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

## Extração de Texto PNG

Para imagens PNG, as ferramentas de IA frequentemente armazenam informações de prompts em chunks de texto dentro do arquivo de imagem. Aqui está como extraímos esses dados:

```js
// Extrair texto PNG
const extractPNGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 8; // Pular assinatura PNG

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

## Extração de Texto JPEG

Para imagens JPEG, os metadados de IA são tipicamente armazenados em dados EXIF dentro de segmentos APP1:

```js
// Extrair texto JPEG
const extractJPEGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 2; // Pular marcador SOI

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

      // Parar ao atingir dados de imagem
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

## Formatação de Texto de IA

Uma vez que extraímos o texto bruto, precisamos formatá-lo adequadamente para torná-lo legível e organizado:

```js
// Formatar texto de IA
const formatAIText = (rawText: string): string => {
  let formattedText = "";

  // Procurar seção de parâmetros
  const paramMatch = rawText.match(/parameters[:\s]*(.*)/is);
  if (paramMatch && paramMatch[1]) {
    const fullContent = paramMatch[1].trim();

    // Dividir conteúdo: Prompt, Prompt negativo, Parâmetros
    const sections = fullContent.split(/(?=Negative prompt:|Steps:)/);

    // Processar seção de Prompt
    if (sections[0]) {
      const promptText = sections[0].replace(/\n+/g, " ").trim();

      if (
        promptText &&
        !promptText.toLowerCase().startsWith("negative prompt")
      ) {
        formattedText += `Prompt:\n${promptText}\n\n`;
      }
    }

    // Processar seção de Prompt negativo
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

    // Processar seção de Parâmetros
    const paramSection = sections.find((s) => s.includes("Steps:"));
    if (paramSection) {
      formattedText += "Parameters:\n";

      // Extrair linhas de parâmetros
      const paramText = paramSection.replace(/^.*?(Steps:)/s, "Steps:");

      // Converter parâmetros separados por vírgula para separados por linha
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

## Explicação do Código

1. **Detecção de Tipo de Arquivo:** O código primeiro determina se o arquivo enviado é uma imagem PNG ou JPEG, pois diferentes formatos armazenam metadados de forma diferente.

2. **Processamento de Dados Binários:** O arquivo é convertido para um `Uint8Array` para processar os dados binários brutos e extrair informações de texto incorporadas.

3. **Extração Específica de Formato:** 
   - Para arquivos PNG, o código procura por chunks `tEXt` e `iTXt` que contêm metadados de texto
   - Para arquivos JPEG, ele procura por segmentos APP1 que contêm dados EXIF com parâmetros de IA

4. **Detecção de Palavras-chave de IA:** O texto extraído é analisado para palavras-chave específicas relacionadas à IA como "Steps:", "Sampler:", "CFG scale:", etc., para confirmar que contém parâmetros de geração de IA.

5. **Formatação de Texto:** O texto extraído bruto é limpo e formatado em uma estrutura legível com seções claras para Prompt, Prompt negativo e Parâmetros.

6. **Validação de Resultados:** Apenas arquivos que contêm metadados de IA válidos são processados e exibidos ao usuário.

## Requisitos Críticos para Extração Bem-sucedida

**Importante:** Este processo de extração só funciona com **imagens geradas por IA originais**. Aqui está o porquê:

- **Preservação de Metadados:** Ferramentas de IA como Stable Diffusion, Midjourney e DALL-E incorporam informações de prompts diretamente nos metadados do arquivo de imagem quando a imagem é gerada pela primeira vez.

- **Perda de Dados Durante o Processamento:** Quando imagens são editadas, redimensionadas, convertidas para diferentes formatos ou processadas através de software de edição de imagem, os metadados contendo as informações do prompt frequentemente são removidos ou corrompidos.

- **Limitações de Formato:** Apenas formatos PNG e JPEG são suportados, pois estes são os formatos que as ferramentas de IA tipicamente usam para armazenar metadados.

- **Requisito de Fonte Original:** Imagens que foram baixadas de redes sociais, capturadas como screenshot ou processadas através de aplicações web podem perder seus metadados originais.

## Vantagens da Análise de IA do EasyImage.work

Este código representa apenas um componente da funcionalidade abrangente de análise de IA do EasyImage.work. Em nossa implementação prática, fizemos numerosas otimizações e melhorias:

- **Suporte Multi-formato:** O EasyImage.work suporta tanto formatos PNG quanto JPEG, cobrindo os tipos mais comuns de imagens geradas por IA.

- **Detecção Inteligente:** Nosso sistema detecta automaticamente se uma imagem contém metadados de IA e fornece feedback claro quando nenhuma informação é encontrada.

- **Interface Amigável ao Usuário:** Com o EasyImage.work, você não precisa entender os detalhes técnicos. Simplesmente faça upload de sua imagem gerada por IA e veja instantaneamente os prompts e parâmetros extraídos.

- **Funcionalidade de Exportação:** Você pode facilmente copiar os prompts extraídos ou exportar todos os resultados como arquivos JSON para análise adicional.

- **Processamento em Lote:** Processe múltiplas imagens de uma vez para extrair prompts de coleções inteiras de obras de arte geradas por IA.

## Conclusão

Através desta imersão técnica profunda, você agora entende como extrair prompts de imagens AI de imagens geradas. Este processo depende de analisar cuidadosamente os metadados de imagem que as ferramentas de IA incorporam durante o processo de geração.

**Lembre-se:** A chave para extração bem-sucedida de prompts é usar **imagens geradas por IA originais e não modificadas**. Uma vez que uma imagem é processada, editada ou convertida, as valiosas informações do prompt podem ser permanentemente perdidas.

Se você precisa de uma ferramenta simples, eficiente e poderosa para extrair prompts de IA de suas imagens geradas, lembre-se do [EasyImage.work](https://easyimage.work)! Continuaremos trabalhando arduamente para trazer mais recursos de análise de IA convenientes e práticos, ajudando você a desbloquear os segredos por trás de suas obras de arte geradas por IA favoritas!
