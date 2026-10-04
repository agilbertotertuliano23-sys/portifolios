---
kind: case
servico: branding
instancia: protocolo-regencia-v2
status: instanciado
maturidade: 100
maturidade_anterior: 20
data: 2026-07-30
---

# Case 05 — Identidade Visual e Branding Estratégico

Serviço com a maior distância entre valor percebido e governança existente.
No corpus anterior ocupava três linhas. O problema central deste serviço não é
técnico: é que **coerência visual não é mensurável no arquivo isolado**, só em
aplicação — e o modelo antigo não tinha nenhum mecanismo de aplicação.

---

## §E.1 — Filosofia do ativo

A marca é um **sistema de decisão sobre aparência e voz**, não um conjunto de
arquivos. Um brandbook é bem-sucedido quando alguém que não participou do
projeto consegue produzir uma peça nova e coerente sozinho. Falha quando é
bonito e inaplicável — quando toda peça futura exige o designer original.

Corolário: **o entregável não é o logo; é a capacidade de gerar peças
consistentes sem o autor.**

## §E.2 — Limites normativos

| Limite | Fonte | Natureza |
|--------|-------|----------|
| Contraste mínimo de texto em toda paleta aplicada | WCAG 2.2 AA | Inegociável |
| Busca de anterioridade de marca antes da entrega final | Lei 9.279/96 (LPI) | Bloqueia entrega |
| Cessão de direitos e escopo de uso explícitos em contrato | LPI + Lei 9.610/98 | Bloqueia entrega |
| Licença de fontes verificada para uso comercial | Contratos de fundição | Bloqueia entrega |
| Direitos de imagem de fotografia e ilustração | Lei 9.610/98 | Bloqueia entrega |

**A busca de anterioridade é o gate mais negligenciado do serviço.** Entregar
identidade sobre um nome já registrado em classe conflitante transfere ao
cliente um passivo que ele não sabia que estava comprando.

## §E.3 — Padrões-lei

- **ISO 20671-1:2021** — árbitro de avaliação de marca. Estrutura a marca por
  elementos de entrada (tangíveis, qualidade, inovação, serviço, ativos
  intangíveis) e dimensões de saída (legal, cliente e demais interessados,
  mercado, ambiente econômico e político, financeira). É meta-padrão: define
  o que medir, não o valor
- **ISO 10668:2010** — árbitro de valoração monetária, se o cliente precisar
  de número financeiro. Escopo distinto: valoração financeira, não avaliação
- **WCAG 2.2 AA** — árbitro de contraste da paleta
- **DTCG v2025.10** — árbitro de formato de tokens

## §E.4 — Gates

| Gate | Critério binário | Evidência |
|------|------------------|-----------|
| **G0** Entrada | Diagnóstico de posicionamento assinado · concorrentes mapeados · decisor nomeado | Documento assinado |
| **G1** Preparação | Referências coletadas · tom de voz definido em prosa · restrições de aplicação levantadas (onde a marca vai viver) | Checklist 100% |
| **G2** Construção | Rota escolhida entre no máximo três · variações e reduções · paleta com contraste verificado | Versões numeradas |
| **G3** Validação — aplicabilidade | **Teste em três superfícies reais: um post, uma landing page e um documento — produzidos por alguém que não desenhou a marca, usando apenas o brandbook** | As três peças + registro de dúvidas |
| **G3-L** Validação legal | Busca de anterioridade concluída · licenças de fonte e imagem verificadas · cessão redigida | Relatório de busca + licenças |
| **G4** Handover | Cliente ou terceiro produz uma peça nova sem consultar o autor | Peça + gravação |
| **G5** Pós-entrega | Aderência medida nas peças publicadas em 90 dias | Auditoria visual |

**G3 é a invenção normativa deste case.** Coerência visual é verificável
apenas em aplicação. O teste exige um executor que não participou do projeto,
porque o autor sempre consegue aplicar a própria marca — ele carrega o
contexto que o brandbook deveria carregar. Toda dúvida levantada pelo executor
é uma lacuna do brandbook, e vira item de correção antes de G4.

## §E.5 — Camadas de criação

**Estratégia e narrativa.** Posicionamento em uma frase antes de qualquer
forma. Tom de voz com exemplos do que a marca diz e do que ela nunca diz.

**Design visual.** Sistema antes de peça. Variações de logo com regra de uso
por contexto e tamanho mínimo. **Paleta verificada para contraste na
aplicação de texto**, não apenas escolhida por harmonia.

**Engenharia e infraestrutura do sistema.** Tokens em formato DTCG. A
especificação atingiu sua primeira versão estável (2025.10) em 28 de outubro
de 2025, com suporte a temas, múltiplas marcas sem duplicação de arquivo,
espaços de cor modernos e referências entre tokens. Um arquivo de tokens gera
código para web, iOS, Android e Flutter.

Estrutura em três camadas, que evita o caos de nomenclatura: primitivo
(`azul-500`) alimenta semântico (`cor-acao`) alimenta componente
(`botao-fundo-primario`). Com a camada correta, uma mudança de valor propaga
limpa por toda superfície.

*Ressalva de maturidade:* ferramentas ainda estão migrando. Style Dictionary
tem suporte de primeira classe ao formato DTCG desde a v4, mas o suporte
completo ao 2025.10 é trabalho em curso na v5. Verificar a cadeia de
ferramentas antes de prometer pipeline automatizado ao cliente.

**Dados.** Ver §I.1.

## §I — Métricas com instrumento

| Métrica | Alvo | Instrumento |
|---------|------|-------------|
| Peças produzidas por terceiro sem dúvida | 3 de 3 em G3 | Registro de dúvidas |
| Pares de cor reprovados em contraste | 0 | Verificador de contraste |
| Aderência das peças publicadas em 90 dias | ≥ 80% | Auditoria visual sobre amostra |
| Tempo até a primeira peça autônoma do cliente | < 30 dias | Data da peça |
| Rodadas de revisão | ≤ 2 por gate | Registro datado |

## §I.1 — Medir marca sem fingir precisão

Este é o ponto onde o serviço mais se expõe: retorno de branding não é
imediato nem linear, e clientes com baixa maturidade analítica cobram número.
A resposta honesta não é inventar número — é separar o que se mede do que não
se mede.

**Mensurável no prazo do projeto:** aderência visual, autonomia do cliente,
conformidade de contraste, cobertura de aplicação.

**Mensurável em 90 dias ou mais, com linha de base:** reconhecimento assistido
e espontâneo em pesquisa, disposição a recomendar, custo de aquisição antes e
depois.

**Não mensurável pelo projeto isolado:** valor financeiro da marca. Isso exige
valoração conforme ISO 10668, com abordagem de mercado, renda ou alívio de
royalties — trabalho de outra natureza e outro fornecedor.

**Norma comercial:** se não houver linha de base medida antes do rebranding,
nenhuma promessa de melhoria percentual pode ser feita. A alternativa honesta
é fixar como resultado a **capacidade de operação consistente**, que é
verificável em G3 e G4, e propor a medição de percepção como escopo separado
com linha de base.

## §D — Não decide

O nome da marca — decide apenas que ele precisa passar por busca de
anterioridade. Não decide estratégia de produto, precificação, nem a produção
de conteúdo contínuo que aplica a marca.
