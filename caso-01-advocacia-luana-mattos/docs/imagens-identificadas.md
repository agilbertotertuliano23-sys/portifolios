# Imagens identificadas e modelo gerado

Referência visual: [`../reference.jfif`](../reference.jfif). Modelo com as novas imagens: [`../index.html`](../index.html).

Foram identificados seis elementos fotográficos/decorativos e um mapa. Os seis elementos foram recriados com a ferramenta integrada `image_gen`, usando os recortes locais como referências. Os retratos são reconstruções geradas por IA a partir das imagens fornecidas, não novos registros fotográficos da pessoa.

| Elemento na referência | Identificação visual | Arquivo de referência | Imagem gerada usada na página |
| --- | --- | --- | --- |
| Abertura, à direita | Advogada com blazer preto, apoiando o queixo na mão e segurando óculos; cadeira de couro e estante | `assets/hero-luana.jpg` | [`hero-luana-v2.webp`](../assets/hero-luana-v2.webp) |
| Seção Sobre, à esquerda | A mesma advogada segurando documentos; notebook e tablet sobre a mesa | `assets/bio-luana.jpg` | [`bio-luana-v2.webp`](../assets/bio-luana-v2.webp) |
| Elemento decorativo nas áreas e na abertura | Folhas de documentos flutuando, com iluminação rosada | `assets/papeis.jpg` | [`papeis-v2.webp`](../assets/papeis-v2.webp), com transparência |
| Primeiro artigo | Consulta com contratos sobre uma mesa de madeira e xícaras de café | `assets/tema-contratos.jpg` | [`tema-contratos-v2.webp`](../assets/tema-contratos-v2.webp) |
| Segundo artigo | Mãos de uma pessoa assinando um documento, com blusa clara | `assets/tema-assinatura.jpg` | [`tema-assinatura-v2.webp`](../assets/tema-assinatura-v2.webp) |
| Terceiro artigo | Mesa clara vista de cima, teclado, óculos e papéis | `assets/tema-escritorio.jpg` | [`tema-escritorio-v2.webp`](../assets/tema-escritorio-v2.webp) |
| Contato | Mapa da região central de Dourados/MS | `assets/map.png` e mapa na referência | Mantido o Google Maps incorporado no HTML |

Os arquivos `hero_lawyer.png`, `bio_lawyer.png` e `post1.png` a `post3.png` também são recortes da referência encontrados no projeto. As fotos JPG originais e esses recortes continuam disponíveis. Ícones de contratos, martelo, tribunal, abrangência nacional e contatos são elementos SVG; a marca é texto tipográfico.

## Entrega

- Cinco fotografias: 1536 × 1024 pixels cada.
- Papéis decorativos: 1254 × 1254 pixels, canal alfa preservado em PNG e WebP.
- Os seis PNGs originais da geração estão em `assets/`, com o mesmo nome das versões WebP e extensão `.png`.
- Os seis WebPs usados pelo modelo somam 641.700 bytes, aproximadamente 627 KiB. A conversão apenas otimiza a entrega; não altera a composição.
- Prompts completos, referências e opções de transparência: [`prompts-imagens.json`](prompts-imagens.json).
- Prévia no computador: [`preview-desktop.png`](preview-desktop.png).
- Prévia no celular: [`preview-mobile.png`](preview-mobile.png).
- Resultado das verificações no navegador: [`validacao-visual.json`](validacao-visual.json).

## Aplicação ao modelo

O HTML e o CSS agora usam os arquivos `-v2.webp`. O retrato de abertura tem carregamento prioritário; as imagens dos artigos têm carregamento adiado e dimensões declaradas. Os papéis transparentes compõem a abertura e a seção de áreas. O enquadramento dos retratos e a largura do texto foram ajustados para telas intermediárias e celulares.

Para abrir localmente, use o arquivo `index.html` na raiz do projeto. As imagens são locais; fontes do Google e o mapa incorporado dependem de conexão.
