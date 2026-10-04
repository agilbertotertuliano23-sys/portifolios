# InovFit — imagens identificadas e novas seções

Modelo atualizado: [`../index.html`](../index.html). Referência original: [`../reference.jfif`](../reference.jfif).

Foram geradas oito imagens com a ferramenta integrada `image_gen`: cinco recriações dos elementos identificados na referência e três cenas adicionais para ampliar a página. Os PNGs originais da geração e as versões WebP estão na pasta `assets/`. Os cinco recortes anteriores foram preservados.

## Imagens da referência

| Local | Imagem identificada | Recorte original | Nova imagem aplicada |
| --- | --- | --- | --- |
| Abertura | Professor de camiseta preta, braços cruzados e expressão séria | `hero_alex.png`, 356 × 280 | [`hero-alex-v2.webp`](../assets/hero-alex-v2.webp) |
| Aula 1 — Avaliação Corporal | Professor observando aluno junto à parede de avaliação | `class1.png`, 155 × 190 | [`class1-v2.webp`](../assets/class1-v2.webp) |
| Aula 2 — Treino de Alta Intensidade | Atleta em prancha com apoio em dois halteres | `class2.png`, 155 × 190 | [`class2-v2.webp`](../assets/class2-v2.webp) |
| Aula 3 — Suplementação Esportiva | Mão segurando coqueteleira sobre uma anilha | `class3.png`, 155 × 190 | [`class3-v2.webp`](../assets/class3-v2.webp) |
| Professor | Professor sorrindo, com mãos unidas à frente do corpo | `instructor_alex.png`, 376 × 320 | [`instructor-alex-v2.webp`](../assets/instructor-alex-v2.webp) |

As cinco recriações têm 1122 × 1402 pixels. Os dois retratos têm fundo transparente, confirmado por canal alfa com valores de 0 a 255. Os selos de alunos, experiência e aulas são HTML/SVG; as formas cinza e roxas são CSS. Assim, esses elementos não ficam duplicados dentro das imagens.

## Três imagens e seções adicionais

| Seção | Cena gerada | Arquivo |
| --- | --- | --- |
| Entenda seu corpo. Treine com direção. | Professor orientando uma aluna durante um agachamento na academia | [`orientacao-treino-v2.webp`](../assets/orientacao-treino-v2.webp) |
| Mais organização para a sua rotina. | Planejamento de treino com caderno, tablet, faixa elástica e acessórios | [`materiais-apoio-v2.webp`](../assets/materiais-apoio-v2.webp) |
| Uma jornada que você compartilha. | Três pessoas conversando após um treino | [`comunidade-inovfit-v2.webp`](../assets/comunidade-inovfit-v2.webp) |

Essas três imagens têm 1536 × 1024 pixels. Os textos das novas seções desenvolvem os temas de orientação, planilhas, suporte e comunidade já presentes no projeto.

Os retratos são reconstruções por IA baseadas na referência, não novos registros fotográficos do professor. As cenas adicionais são ilustrativas; não documentam alunos, instalações ou materiais reais da InovFit.

## Arquivos e prévias

- [Prompts completos](prompts-imagens.json), incluindo as referências e opções de transparência.
- [Inventário técnico](arquivos-gerados.json), com dimensões, tamanhos e canal alfa.
- [Prévia no computador](preview-desktop.png).
- [Prévia no celular](preview-mobile.png).
- [Verificação no navegador](validacao-visual.json).

Os oito PNGs somam 16.198.116 bytes. Os oito WebPs usados na página somam 1.408.442 bytes: redução aproximada de 91%, sem redimensionar as imagens. Cada original PNG tem o mesmo nome-base da versão WebP e está disponível em `assets/`.

O retrato de abertura usa carregamento prioritário; as demais imagens usam carregamento adiado e dimensões explícitas. As fotos das aulas mantêm enquadramento vertical, e as novas seções alternam imagens e textos no computador e empilham o conteúdo no celular. Os links das seções levam ao formulário de inscrição.

Abra `index.html` localmente para ver o modelo. As imagens são locais; as fontes do Google dependem de conexão. Os formulários mantêm a demonstração local existente, sem integração de cadastro ou envio de e-mail.
