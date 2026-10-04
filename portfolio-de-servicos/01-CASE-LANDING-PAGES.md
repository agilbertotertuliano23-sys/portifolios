---
kind: case
servico: landing-pages
instancia: protocolo-regencia-v2
status: consolidado-revisado
maturidade: 100
data: 2026-07-30
---

# Case 01 — Landing Pages

Serviço-pivô do portfólio. Já era o único regido; esta versão corrige o
árbitro de performance (laboratório → campo) e instrumenta as métricas que
antes não tinham fonte de coleta.

---

## §E.1 — Filosofia do ativo

A landing page é um **funil vivo**, não uma página. Ela existe para converter
atenção comprada ou ganha em contato qualificado, e falha quando é bonita
sem converter ou converte sem coerência de marca.

## §E.2 — Limites normativos

| Limite | Fonte | Natureza |
|--------|-------|----------|
| WCAG 2.2 nível AA | ISO/IEC 40500:2025 | Inegociável |
| Consentimento explícito para tracking e formulário | LGPD arts. 7º, 8º | Inegociável |
| Encarregado publicado no site do cliente | LGPD art. 41 + Res. 18/2024 | Inegociável — bloqueia go-live |
| HTTPS forçado, validação e rate limiting no formulário | OWASP Top 10:2025 | Inegociável |
| Mobile-first | 79% das transações online no Brasil ocorrem via smartphone | Inegociável |

## §E.3 — Padrões-lei

- **Core Web Vitals (CrUX p75)** — árbitro final de performance
- **WCAG 2.2 AA** — árbitro de acessibilidade, verificável por axe-core
- **OWASP Top 10:2025** — árbitro de segurança
- **Atomic Design** — árbitro de reuso de componentes
- **Unbounce Conversion Benchmark** — referência de conversão esperada

## §E.4 — Gates

| Gate | Critério binário | Evidência |
|------|------------------|-----------|
| **G0** Entrada | Briefing assinado, oferta definida, KPI de conversão numérico | Documento + linha no ROPA do cliente |
| **G1** Preparação | Headline, 3–4 benefícios, prova social com autorização, assets, destino do formulário, eventos de tracking especificados | Checklist 100% |
| **G2** Construção | DoD aceito nas quatro camadas | Preview versionado + feedback datado |
| **G3** Validação | Zero defeito crítico · Lighthouse ≥ 90 (proxy) · zero erro axe-core · formulário grava em ambiente real · consentimento funcional | Relatórios anexados |
| **G4** Handover | Cliente publica uma alteração de conteúdo sozinho | Gravação do treinamento + aceite |
| **G5** Pós-entrega | CrUX p75 dentro dos limiares · conversão medida contra benchmark | Relatório 7/30/90 |

**G3 não certifica performance.** Ele bloqueia a entrega de uma página
comprovadamente lenta em laboratório. A certificação só existe em G5, com
dados de campo, respeitada a janela móvel de 28 dias do CrUX.

## §E.5 — Camadas de criação

**Estratégia e copy.** Uma promessa por página. Benefícios em resultado, não
em recurso. Correspondência entre a mensagem do anúncio e a headline — a causa
mais comum de conversão abaixo do benchmark é lacuna de relevância entre o
anúncio e a página, não a página em si.

**Design e interação.** Hierarquia acima da dobra. Contraste, alt text,
navegação por teclado, foco visível. **Toda imagem, vídeo, iframe e slot de
anúncio com width e height explícitos** — é a origem dominante de CLS.
Fontes com `font-display: swap` e espaço reservado para conteúdo dinâmico.

**Engenharia.** HTML semântico, JavaScript mínimo. Precarregamento da imagem
LCP, CSS crítico inline, precarregamento de fontes. Para INP: quebrar tarefas
longas e ceder à thread principal.

**Dados e automação.** Um evento de conversão nomeado antes do desenvolvimento.
Consentimento antes do disparo. Fluxo pós-conversão testado ponta a ponta.

## §I — Métricas com instrumento

| Métrica | Alvo | Instrumento |
|---------|------|-------------|
| LCP p75 | < 2,5s (alerta 2,0s) | CrUX / Search Console |
| INP p75 | < 200ms (alerta 160ms) | CrUX |
| CLS p75 | < 0,1 (alerta 0,08) | CrUX |
| Erros críticos de acessibilidade | 0 | axe-core em CI |
| Taxa de conversão | ≥ mediana do setor do cliente | GA4, evento nomeado |
| Retrabalho | ≤ 8% das tarefas | Contagem de tarefas reabertas no board |
| Rodadas de revisão | ≤ 2 por gate | Registro datado de feedback |

## §I.1 — Referência de conversão (com divergência declarada)

A mediana geral de páginas dedicadas é reportada como **6,6%** na análise
Unbounce de 41.000 páginas, 464 milhões de visitantes e 57 milhões de
conversões. O quartil superior fica em **11,45%** ou mais. Um relatório
posterior reporta mediana de **4,02%** — amostras e definições de conversão
diferem entre publicadores, e a divergência deve ser declarada ao cliente,
não escondida.

A variação por setor é maior que qualquer média sugere: SaaS em torno de
**3,8%**, serviços financeiros **8,4%**, eventos e entretenimento **12,3%**.
Uma página a 3,8% está abaixo da mediana geral e simultaneamente no quartil
superior do seu próprio setor.

**Fonte de tráfego domina o setor.** Busca paga converte em torno de 3,2% e
social em torno de 1,5% na mesma página. Segmentar por fonte antes de comparar
com qualquer benchmark — taxa combinada esconde o que importa.

**Formulário.** Três campos convertem cerca de 10,1%; nove campos caem para
3,6%. A queda mais íngreme acontece entre quatro e sete campos. Cada campo
adicional exige justificativa comercial explícita no briefing.

**Norma de promessa comercial:** a meta de conversão é fixada contra a mediana
do setor do cliente, com fonte de tráfego declarada. Promessa de "+15–30%
acima da página anterior" sem página anterior medida é promessa sem base.

## §D — Não decide

Escopo de tráfego pago, produção de criativos de anúncio, ou a oferta
comercial em si. A landing page converte uma oferta; ela não a corrige.
