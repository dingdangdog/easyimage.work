---
date: 2025-03-09
title: Como usar JavaScript para empacotar arquivos em um pacote comprimido (.zip)
---

No desenvolvimento web moderno, comprimir arquivos é um requisito comum. Os usuários podem precisar combinar vários arquivos em um pacote comprimido para download, ou gerar arquivos através de uma aplicação web e exportá-los como um arquivo `.zip`. Este post do blog fornecerá um guia detalhado sobre como implementar operações de empacotamento e compressão de arquivos no navegador usando JavaScript. Realizaremos isso usando a popular biblioteca JavaScript JSZip e aproveitando o FileSaver.js para downloads de arquivos.

## Preparação

Primeiro, precisamos instalar duas bibliotecas comumente usadas:

1. JSZip: Esta é uma biblioteca JavaScript leve usada para criar e manipular arquivos `.zip`.
2. FileSaver.js: Esta biblioteca fornece uma maneira compatível com vários navegadores para acionar downloads de arquivos.

Você pode instalar essas bibliotecas em seu projeto usando:

```bash
npm install jszip file-saver
```

Ou incluí-las via CDN (para uso em HTML):

```html
<script src="https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>
```

## Implementação da Função Utilitária

Em seguida, vamos escrever uma função utilitária encapsulada para empacotar vários arquivos em um arquivo `.zip` e acionar um download. Digamos que queremos empacotar uma série de imagens, que podem ser arquivos originais ou arquivos processados.

### Função Genérica `downloadFilesAsZip`

```js
import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * Baixar vários arquivos empacotados como um arquivo Zip
 * @param {Array} files - Array de objetos de arquivo, cada um contendo uma URL e um nome de arquivo
 * @param {string} zipName - Nome do arquivo Zip gerado, padrão é 'download.zip'
 */
export const downloadFilesAsZip = async (files, zipName = "download.zip") => {
  // Criar uma nova instância JSZip
  const zip = new JSZip();

  // Usar map para criar um array de Promessas para processar cada arquivo
  const fetchPromises = files.map(async (file) => {
    try {
      // Solicitar o recurso do arquivo, assumindo que o arquivo é fornecido via URL
      const response = await fetch(file.url); // Obter o recurso do arquivo
      const blob = await response.blob(); // Converter a resposta para um objeto Blob

      // Adicionar o arquivo ao pacote zip, usando o nome de arquivo fornecido
      zip.file(file.name, blob);
    } catch (error) {
      console.error(`Falha ao adicionar arquivo: ${file.name}`, error);
    }
  });

  // Aguardar que todos os arquivos sejam baixados e adicionados ao Zip
  await Promise.all(fetchPromises);

  // Gerar o conteúdo do pacote zip (tipo blob)
  const content = await zip.generateAsync({ type: "blob" });

  // Usar FileSaver.js para baixar o pacote zip
  saveAs(content, zipName);
};
```

### Explicação do Código

- Criando uma instância `JSZip`: `const zip = new JSZip();` — Cria uma nova instância de arquivo Zip, todos os arquivos serão adicionados a esta instância.
- Download e empacotamento de arquivos: Usa a função `fetch()` para obter o conteúdo do arquivo a partir da URL, depois o converte para o formato `blob`. Isso ocorre porque o `JSZip` suporta o processamento de arquivos no formato `blob`.
- Gerando o arquivo `.zip`: Através de `zip.generateAsync({ type: "blob" })`, todos os arquivos adicionados ao objeto `zip` são comprimidos em um arquivo `.zip`, retornando um objeto `blob`.
- Salvando o arquivo: Usando `saveAs(content, zipName)` com FileSaver.js para acionar o download do arquivo, onde `content` é o pacote zip gerado e `zipName` é o nome do arquivo de download.

## Como Usar Esta Função Utilitária

Suponha que temos um conjunto de URLs de imagens e queremos empacotá-las em um arquivo `.zip` para download. Aqui está um exemplo de como chamar a função `downloadFilesAsZip`:

```js
// Dados de exemplo de arquivo: contém URL do arquivo e nome do arquivo
const files = [
  { url: "https://example.com/image1.jpg", name: "image1.jpg" },
  { url: "https://example.com/image2.jpg", name: "image2.jpg" },
  { url: "https://example.com/image3.jpg", name: "image3.jpg" },
];

// Chamar a função para baixar arquivos e empacotar como um arquivo zip
downloadFilesAsZip(files, "images.zip");
```

Neste exemplo, fornecemos um array de objetos contendo URLs de imagens e nomes de arquivos. Após chamar a função `downloadFilesAsZip`, o navegador automaticamente acionará uma operação de download e empacotará essas imagens em um arquivo comprimido chamado `images.zip`.

## Problemas Comuns e Soluções

1. Problemas de Origem Cruzada
   Se os arquivos vierem de domínios diferentes, certifique-se de que o servidor tenha definido os cabeçalhos corretos de Compartilhamento de Recursos de Origem Cruzada (CORS). Caso contrário, o navegador bloqueará as solicitações `fetch()`, impedindo os downloads de arquivos.
2. Downloads de Arquivos Grandes
   Se os arquivos sendo baixados forem grandes, você pode precisar otimizar o processo de download, como implementar downloads em partes ou exibir barras de progresso.
3. Suporte do Navegador
   Este método depende de `fetch()` e `FileSaver.js`, então requer navegadores modernos que suportem essas APIs. Se você precisa suportar navegadores mais antigos, considere usar polyfills.

## Soluções Alternativas

Além de usar `JSZip` e `FileSaver.js`, existem várias outras soluções comuns para implementar compressão e empacotamento de arquivos no navegador:

1. **Pako.js**: `Pako` é uma biblioteca de compressão zlib para JavaScript, suportando formatos gzip e deflate. É adequada para comprimir arquivos menores e é relativamente simples de usar.
2. **Archiver.js**: `Archiver.js` é uma biblioteca rica em recursos que suporta compressão para formatos como `.tar`, `.zip`, etc. Pode realizar compressão de arquivos no navegador e fornece mais opções de controle.
3. **zip.js**: `zip.js` é uma biblioteca JavaScript que suporta descompressão e compressão em streaming, capaz de lidar com arquivos maiores e fornecendo funcionalidade para comprimir para arquivos `.zip`.
4. **BrowserFS + zip-lib**: `BrowserFS` é uma biblioteca que fornece simulação de sistema de arquivos no navegador. Combinado com `zip-lib`, pode criar e baixar arquivos `.zip`, adequado para aplicações que precisam simular um sistema de arquivos.
