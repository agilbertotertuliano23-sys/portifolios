---
kind: case
servico: sites-institucionais
instancia: protocolo-regencia-v2
status: instanciado
maturidade: 100
maturidade_anterior: 60
data: 2026-07-30
---

# Case 02 — Sites Institucionais e Portfólios

O checklist técnico deste serviço já era denso. Faltavam filosofia, gates
formais e métricas com instrumento — os itens existiam como lembranças, não
como bloqueios. Esta instanciação promove os itens certos a Go/No-Go.

---

## §E.1 — Filosofia do ativo

O site institucional é a **prova de existência verificável** da marca. Ele não
converte diretamente; ele remove a dúvida que impede a conversão em outro
lugar. Falha quando parece abandonado, quando não responde à pergunta "isto é
real e confiável", ou quando o cliente não consegue atualizá-lo sozinho.

Corolário: **um site que o cliente não consegue editar apodrece em seis meses.**
A autonomia do cliente não é cortesia de handover — é requisito de projeto.

## §E.2 — Limites normativos

| Limite | Fonte | Natureza |
|--------|-------|----------|
| WCAG 2.2 AA em todas as páginas internas | ISO/IEC 40500:2025 | Inegociável |
| Encarregado e canal do titular publicados | LGPD art. 41 | Bloqueia go-live |
| ROPA do cliente contemplando formulários do site | LGPD art. 37 | Bloqueia go-live |
| SSL ativo, redirecionamento HTTP→HTTPS forçado | OWASP Top 10:2025 | Inegociável |
| Fronteira PSAV | Res. BCB 519/520/521 | Inegociável — ver §E.4, G3-W |
| Zero link quebrado | — | Inegociável |

## §E.3 — Padrões-lei

- **Core Web Vitals (CrUX p75)** — árbitro de performance
- **WCAG 2.2 AA** — árbitro de acessibilidade
- **OWASP Top 10:2025** — árbitro de segurança. Acesso quebrado permanece em
  primeiro lugar; configuração incorreta subiu para segundo; SSRF foi
  absorvido pela categoria de acesso
- **EIP-6963** — árbitro de descoberta de carteira, quando aplicável
- **DTCG v2025.10** — árbitro de tokens, quando houver design system

## §E.4 — Gates

| Gate | Critério binário | Evidência |
|------|------------------|-----------|
| **G0** Entrada | Sitemap e arquitetura de informação aprovados · responsável do cliente nomeado | Documento assinado |
| **G1** Preparação | Copy de todas as páginas revisado · assets consolidados · DNS validado · estratégia de palavra-chave por página | Checklist 100% |
| **G2** Construção | Componentes globais aplicados · navegação com estados ativos · DoD por camada | Preview versionado |
| **G3** Validação | Zero 404 em links internos, externos e âncoras · zero erro axe-core · cross-browser · 360px a ultra-wide | Relatórios |
| **G3-W** Fronteira PSAV | Integração blockchain comprovadamente **read-only** ou assinada pela carteira do usuário. Sem custódia de chave, sem intermediação, sem conversão fiduciária | Declaração técnica assinada + revisão do fluxo |
| **G4** Handover | Cliente publica uma página nova sozinho, sem suporte | Gravação da execução do cliente |
| **G5** Pós-entrega | CrUX p75 nos limiares · páginas indexadas | Search Console + CrUX |

**G3-W é o gate mais consequente deste serviço.** Cruzar a fronteira PSAV
transforma o cliente em prestadora de serviços de ativos virtuais, sujeita a
autorização do Banco Central, constituição no Brasil, capital mínimo, PLD/FT
e auditoria. O regime vigora desde 02/02/2026; quem já operava tem até
30/10/2026 para protocolar o pedido, sob pena de cessar atividades em até 30
dias após o prazo. Um site institucional **não** pode empurrar um cliente para
esse regime por descuido de escopo.

## §E.5 — Camadas de criação

**Estratégia e copy.** Uma página, uma pergunta respondida. Palavra-chave por
página definida antes do texto, não depois.

**Design e interação.** Sistema de componentes antes das páginas. Estados
ativos de navegação explícitos. Dimensões explícitas em toda mídia.

**Engenharia.** Rotas semânticas. Imagens em WebP/AVIF com lazy loading abaixo
da dobra. Code-splitting para scripts pesados. Open Graph dinâmico por página.
Quando houver carteira: descoberta via **EIP-6963**, que substitui o padrão
legado `window.ethereum` — com múltiplas extensões instaladas, a última
sobrescreve as anteriores e a conexão se torna imprevisível. Bibliotecas
modernas de conexão já suportam o padrão por padrão.

**Dados e automação.** Visualização de página disparando corretamente por
rota. Formulários de contato dentro do ROPA do cliente.

## §I — Métricas com instrumento

| Métrica | Alvo | Instrumento |
|---------|------|-------------|
| LCP p75 da home | < 2,5s | CrUX |
| INP p75 | < 200ms | CrUX |
| CLS p75 | < 0,1 | CrUX |
| Links quebrados | 0 | Crawler em CI |
| Erros críticos de acessibilidade | 0 | axe-core |
| Páginas indexadas | 100% do sitemap | Search Console |
| Autonomia do cliente | 1 publicação sem suporte em 30 dias | Log do CMS |

**Autonomia é métrica, não sensação.** Se o cliente não publicou nada em 30
dias, o handover falhou mesmo tendo sido assinado.

## §I.1 — Nota sobre acessibilidade e o horizonte WCAG 3.0

WCAG 2.2 AA é o padrão vigente e virou norma internacional ISO em outubro de
2025. WCAG 3.0 está em Working Draft — a versão de março de 2026 renomeou
"outcomes" para "requirements" e descreve 174 deles, mas o modelo de
conformidade não está fechado. A Recomendação final é projetada para 2028–2030,
com adoção regulatória posterior.

**Norma:** não refatorar o programa de acessibilidade em torno de WCAG 3.0.
O trabalho em 2.2 AA rola para frente — o nível Bronze do 3.0 é descrito como
aproximadamente equivalente a 2.2 AA. Fornecedor que oferece "varredura
certificada WCAG 3.0" em 2026 está vendendo roteiro, não produto.

## §D — Não decide

Produção de conteúdo editorial contínuo, gestão de mídia paga, e a decisão de
negócio sobre integrar blockchain — decide apenas a fronteira técnica que essa
integração não pode cruzar.
