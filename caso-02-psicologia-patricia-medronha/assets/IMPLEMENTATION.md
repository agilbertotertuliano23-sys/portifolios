# Refinamento da landing page

HTML, CSS e JavaScript estáticos. Não há instalação de dependências nem build para usar a página.

## Visualizar

Na pasta `C:\Users\agilb\web\psicologia-landing-page`, execute:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Abra http://127.0.0.1:4173. O servidor HTTP permite carregar os módulos locais do Three.js. Ao abrir `index.html` diretamente por `file://`, a página mantém o notebook alternativo em HTML/CSS. Essa alternativa também aparece quando WebGL não está disponível.

## Referência e implementação

- Referência preservada: `../reference.jfif`.
- Orientações consultadas: [img-to-html do repositório solicitado](https://github.com/rtadewald/skills/blob/main/img-to-html/SKILL.md). Aplicadas à revisão integrada do projeto existente: composição, fundos, tipografia, recortes e comparação no navegador.
- Hero: `clipPath` e máscara SVG na foto, curva Bézier assimétrica com contorno dourado na transição de seção.
- Benefícios: separadores verticais; sintomas: esferas douradas e linhas finas; faixa de chamada e rodapé com gradiente champanhe.
- Cérebro e biografia: enquadramentos SVG da referência original, recuperando as partes ausentes nos antigos PNGs. A resolução das fotografias continua limitada à referência fornecida.
- Tipografia: Manrope, aproximação visual da fonte da referência, carregada pelo Google Fonts.
- Notebook: geometria tridimensional local, materiais de alumínio, teclado, dobradiça, iluminação e tela personalizada. Carregamento próximo à seção; renderização sob demanda; pausa fora da tela; suporte a movimento reduzido e teclado.
- Teclado do notebook: setas esquerda/direita para girar; Home para restaurar.
- Depoimentos: três colunas no desktop e carrossel com botões e deslize no celular.

## Agendamento

O número de WhatsApp original era fictício (`5500000000000`). Defina o número real em `WHATSAPP_NUMBER`, no início de `app.js`, apenas com dígitos: país + DDD + telefone.

Enquanto vazio, os botões levam à seção de contato com o Instagram existente. Ao configurar o número, todos os botões passam a abrir a conversa e o botão flutuante é exibido. O link Zenklub permanece o endereço genérico que já existia no projeto.

## Código aberto utilizado

### MacBook Studio

- Origem: https://github.com/Emanuele-web04/macbook-studio
- Commit: `1edcfc8f1cc3704931a9a54140f880866113ab15`
- Autor: Emanuele Di Pietro, 2026.
- Licença MIT, preservada em `licenses/macbook-studio-MIT.txt`.
- Geometria e materiais em `vendor/macbook-studio/`; arquivos TypeScript e versões JavaScript locais.
- Adaptações: imports locais, teclas F1–F12 com texto simples, tela própria de atendimento e integração com a cena da landing page.
- Os SF Symbols da Apple e os recursos com licença separada NÃO foram incorporados.
- A cena é procedural: não depende de GLB externo ou de um serviço remoto.

### Three.js

- Origem: https://github.com/mrdoob/three.js/tree/r180
- Versão fixa: `0.180.0`, incluindo `RoomEnvironment`.
- Licença MIT em `licenses/three-MIT.txt`.
- Módulos servidos localmente em `vendor/three/`.

## Manutenção e conferência

`vendor/prepare-model.mjs` é uma ferramenta opcional para converter as fontes TypeScript do modelo para JavaScript nativo com Node 22.13+. A página entregue já contém os módulos prontos.

As capturas e o relatório da revisão estão em `previews/`. O helper `verify-preview.mjs` usa uma instalação externa de Puppeteer indicada pela variável `PREVIEW_BROWSER_TOOLING`; não é dependência da página.
