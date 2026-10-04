---
kind: canonical
titulo: Protocolo de Regência — Modelo Normativo de Instituição de Direcionamento
escopo: portfolio-completo
versao: 2.0
status: consolidado
data: 2026-07-30
substitui: [pipeline-8-fases, modelo-universal-6-blocos, raci-9-papeis]
---

# Protocolo de Regência

Camada normativa superior do portfólio. Define **como** um serviço se torna
regido, não o conteúdo de nenhum serviço específico. Cada case instancia
este protocolo; nenhum case o reescreve.

---

## §E — Regra-mãe

> Nenhuma etapa avança sem evidência mínima.
> Nenhum entregável é pronto sem DoD.
> Nenhum cliente aprova sem contexto suficiente para decidir.

Corolário operacional: **um sistema de governança que ninguém consegue operar
não governa nada.** Toda norma abaixo foi dimensionada para execução por uma
pessoa, com pontos de expansão marcados para quando houver mais.

---

## §E.1 — Protocolo de sete campos

Um serviço é considerado **instituído** quando os sete campos estão preenchidos.
Preenchimento parcial = serviço esboçado, não regido.

| # | Campo | Critério de preenchimento |
|---|-------|---------------------------|
| 1 | **Filosofia do ativo** | Uma frase que define o que o entregável *é*, não o que ele contém |
| 2 | **Limites normativos** | Compliance e restrições técnicas inegociáveis, com fonte citada |
| 3 | **Padrões-lei** | Frameworks externos que arbitram qualidade — devem ser verificáveis por terceiro |
| 4 | **Gates nomeados** | 4–6 pontos Go/No-Go, critério binário, evidência exigida |
| 5 | **Camadas de criação** | As quatro camadas universais, cada uma com checklist de inspeção |
| 6 | **Regência condensada** | Chapéus, não papéis — ver §E.3 |
| 7 | **Métricas com instrumento** | Cada KPI só entra com o campo "onde é coletado" preenchido |

**Campo 7 é o mais violado.** Métrica sem instrumento de coleta é ficção com
aparência de KPI. `Taxa de retrabalho ≤ 8%` pressupõe registro de retrabalho;
`velocity` pressupõe histórico. Se o instrumento não existe, ou se cria o
instrumento ou se remove a métrica.

---

## §E.2 — Pipeline unificado (seis estações)

Substitui os dois pipelines concorrentes anteriores. As durações da antiga
tabela de 8 fases passam a ser **parâmetros de instanciação** por serviço,
não estrutura.

| Estação | Gate de saída | Evidência exigida |
|---------|---------------|-------------------|
| **E0 · Entrada** | Briefing assinado + KPI alvo nomeado | Documento assinado, KPI com valor numérico e fonte de coleta |
| **E1 · Preparação** | Insumos 100% + riscos mapeados | Checklist de preparação completo, matriz de risco |
| **E2 · Construção** | DoD por camada aceito | Versionamento, registro de revisão, feedback do cliente datado |
| **E3 · Validação** | Zero defeito crítico aberto | Relatório de teste por camada, evidência do padrão-lei |
| **E4 · Handover** | Cliente opera o ativo | Documentação, gravação de treinamento, aceite formal |
| **E5 · Pós-entrega** | Relatório + lição registrada | Dados 7/30/90, uma linha no repositório de lições |

Gates são **binários**. "Quase pronto" é No-Go. Desvio exige registro escrito
com justificativa e responsável nomeado — não aprovação verbal.

---

## §E.3 — Regência condensada: três chapéus

Correção da aresta crítica do modelo anterior (RACI de nove papéis para
operação de uma pessoa). Os nove papéis colapsam em três chapéus operáveis:

| Chapéu | Absorve | Autoridade |
|--------|---------|------------|
| **Regente** | PM, STR, Account | Decide escopo, aprova gates, responde ao cliente. Accountable universal — sempre exatamente um |
| **Executor** | DES, DEV, CON, AUT | Produz dentro do DoD. Múltiplos permitidos |
| **Validador** | QA, Diretor de Criação | Inspeciona contra o checklist da camada |

**Regra de troca de chapéu (não negociável):** o Validador nunca inspeciona
no mesmo bloco de tempo em que executou. Intervalo mínimo entre execução e
validação da mesma peça: um ciclo de sono ou 12 horas, o que vier antes.
Autovalidação imediata é o mecanismo pelo qual defeito escapa — é uma falha
de atenção, não de competência.

**Cliente:** Consulted nos gates de escopo (E0, E1), Approver no aceite (E4).
Máximo duas rodadas de revisão por gate. SLA de resposta do cliente: 48h,
em cláusula contratual — o atraso do cliente desloca o cronograma
formalmente, não silenciosamente.

**Ponto de expansão:** quando houver freelancers validados, o chapéu Executor
se distribui e o RACI de nove papéis volta a fazer sentido. Como evolução,
nunca como ponto de partida.

---

## §E.4 — Fundação da tarefa (o átomo)

Nenhuma tarefa entra em E2 sem cinco campos. Este é o átomo que torna a
regência auditável em operação solo — cada tarefa carrega seu próprio critério
de julgamento, e o Validador não reinventa o padrão a cada inspeção.

```yaml
tarefa:
  servico: landing-page          # de qual case herda a norma
  camada: design                 # estrategia | design | engenharia | dados
  dod: "renderiza em 375/768/1440 sem quebra de layout"
  evidencia: "screenshot nos três breakpoints"
  metrica: "zero overflow horizontal em QA"
```

**Exemplo de transformação.** O item `Seção de benefícios com ícones`, solto
no checklist antigo, torna-se:

| Campo | Valor |
|-------|-------|
| Serviço | landing-page |
| Camada | design |
| DoD | renderiza em 375px, 768px e 1440px sem quebra |
| Evidência | screenshot nos três breakpoints |
| Métrica | zero overflow horizontal em QA |

O item deixa de ser uma lembrança e passa a ser uma proposição verificável.

---

## §E.5 — As quatro camadas de criação

Universais a todos os serviços. Permitem **sobreleitura diagnóstica**: quando
algo falha, sabe-se se falhou no conceito, na forma, no código ou na medição.

1. **Estratégia, copy e narrativa** — a mensagem e sua promessa
2. **Design visual e interação** — a forma e sua acessibilidade
3. **Engenharia e infraestrutura** — o código e sua performance
4. **Dados e automação** — a medição e seus fluxos

Cada case detalha o checklist de inspeção das quatro camadas no seu contexto.

---

## §I — Estado de maturidade do portfólio

Medição na data desta versão, aplicando o critério dos sete campos:

| Serviço | Antes | Depois desta rodada | Documento |
|---------|-------|---------------------|-----------|
| Landing Pages | ~95% | 100% (revisado — arbitro corrigido) | `01-CASE` |
| Sites Institucionais | ~60% | 100% (instanciado) | `02-CASE` |
| E-commerce | ~55% | 100% (instanciado) | `03-CASE` |
| Integrações/APIs | ~35% | 100% (dívida documental quitada) | `04-CASE` |
| Branding | ~20% | 100% (instanciado do zero) | `05-CASE` |
| Incubadora | ~15% | 100% (instanciado do zero) | `06-CASE` |

A **inversão ticket/governança** — produto premium menos regido que produto
de entrada — está resolvida na documentação. Permanece por resolver na
prática: os gates da Incubadora nunca foram executados em campo.

---

## §I.1 — Decisão pendente resolvida: posição do Web 3.0

A decisão foi forçada por evidência regulatória, não por preferência de
posicionamento.

**Fato normativo.** As Resoluções BCB nº 519, 520 e 521 (publicadas em
10/11/2025) regulamentam a Lei nº 14.478/2022 e entraram em vigor em
02/02/2026. Prestadoras de serviços de ativos virtuais precisam de autorização
do Banco Central, devem ser constituídas e sediadas no Brasil, e as que já
operavam têm até 30/10/2026 para protocolar o pedido — prazo improrrogável,
sob pena de cessar atividades. A Resolução BCB nº 552 (03/03/2026) acrescentou
obrigações. O regime aplicado é equivalente ao das demais instituições
reguladas: capital mínimo, PLD/FT, segurança cibernética, auditoria.

**Decisão normativa:** Web 3.0 é **camada técnica opcional por serviço**,
nunca posicionamento central. Fica instituída a fronteira PSAV:

> A operação **não custodia** chaves privadas, **não intermedia** troca,
> **não converte** ativo virtual em moeda fiduciária e **não transfere**
> ativo de terceiro. Toda integração blockchain é **read-only** ou dispara
> transação assinada pela carteira do próprio usuário, sem passar por
> infraestrutura da agência.

Cruzar essa fronteira desloca a operação para um regime de autorização bancária.
O gate correspondente aparece em `02-CASE` (Sites) e `04-CASE` (Integrações).

**Consequência comercial:** o vocabulário "agência Web 3.0" sai do
posicionamento. Entra como capacidade técnica declarada quando o caso de uso
justificar, com o mapeamento obrigatório de propósito comercial, valor ao
usuário e risco regulatório antes de qualquer escopo.

---

## §I.2 — Correção transversal: laboratório ≠ campo

Erro estrutural presente em todos os checklists anteriores, corrigido em
todos os cases.

O modelo antigo tratava **Lighthouse ≥ 90** como árbitro final de performance.
Lighthouse é medição de laboratório. O Google avalia Core Web Vitals por
**dados de campo**: o Chrome User Experience Report, no percentil 75 de
usuários reais, em janela móvel de 28 dias. Uma página passa em um métrica
quando ao menos 75% das visitas reais atingem o limiar "bom". Um score
perfeito no ambiente de desenvolvimento não significa nada se um quarto dos
visitantes reais, em aparelhos medianos, tem experiência lenta.

**Norma corrigida — gate duplo:**

- **Pré-deploy (E3):** Lighthouse como *proxy de laboratório*. Bloqueia o
  handover, mas não certifica nada.
- **Pós-deploy (E5):** CrUX p75 como *verdade de campo*. É a única evidência
  que conta no relatório 7/30/90. A janela de 28 dias significa esperar
  semanas antes de julgar se uma correção funcionou.

Limiares vigentes: LCP < 2,5s · INP < 200ms · CLS < 0,1, cada um no p75.
Alertas em 80% do limiar: LCP > 2,0s · INP > 160ms · CLS > 0,08.

**INP substituiu FID em março de 2024.** Qualquer documento do corpus que
ainda mencione FID está desatualizado e deve ser corrigido na próxima revisão.

---

## §I.3 — Correção transversal: LGPD operacional

O corpus anterior tratava LGPD como "cláusula contratual + banner de
consentimento". Isso não é conformidade; é aparência de conformidade.

**Obrigações que geram infração autônoma**, independentemente de vazamento:

| Obrigação | Base | Instrumento |
|-----------|------|-------------|
| Encarregado nomeado, nome e e-mail publicados em local de fácil acesso no site | Art. 41 + Res. CD/ANPD 18/2024 | Página de privacidade |
| ROPA — registro das operações de tratamento | Art. 37 | Planilha ou template ANPD |
| Base legal documentada por operação | Arts. 7º e 11 | Anexo do ROPA |
| Processo de resposta a incidente | Res. CD/ANPD 15/2024 | Runbook + contato ANPD |
| Cláusulas-padrão para transferência internacional | Res. CD/ANPD 19/2024 | Anexo contratual |

**Prazo de comunicação de incidente relevante: 3 dias úteis.** A falha mais
recorrente nos casos julgados pela ANPD não foi o vazamento — foi a
comunicação ausente ou tardia, somada à falta do básico: encarregado nomeado,
documentação em dia, resposta tempestiva à Autoridade.

**Regime de pequeno porte (Res. CD/ANPD 2/2022).** ME, EPP, MEI e startups
têm ROPA simplificado, prazos em dobro (6 dias úteis para incidente) e
dispensa de nomeação formal de encarregado — *desde que* haja canal próprio
de comunicação com o titular. A flexibilização **não se aplica** a quem faz
tratamento de alto risco: larga escala, dados sensíveis, dados de crianças.

> **Nuance crítica para a operação.** Ao entregar tráfego pago + CRM +
> automação, a agência pode empurrar o cliente para "larga escala" e fazê-lo
> perder o benefício do regime simplificado. Isso precisa ser dito ao cliente
> em E0, não descoberto em E5.

A ANPD deixou a fase pedagógica: tornou-se agência reguladora e abriu 19 novos
processos sancionadores em um único mês de 2026.

*Nota de escopo: esta seção sistematiza obrigações públicas; não substitui
parecer jurídico. Contratos e políticas devem ser revisados por advogado.*

---

## §D — Registro de triangulação de fontes

Fontes consultadas por domínio, com conflitos declarados. Divergência entre
fontes não é ruído a esconder — é dado sobre a confiabilidade do número.

| Domínio | Fonte primária | Conflito identificado |
|---------|----------------|-----------------------|
| Performance web | Google CrUX / Core Web Vitals | Nenhum. Limiares estáveis e convergentes |
| Acessibilidade | WCAG 2.2 AA, aprovada como ISO/IEC 40500:2025 (out/2025) | WCAG 3.0 em Working Draft (mar/2026, 174 requisitos); Recomendação final projetada 2028–2030. **Não usar para conformidade** |
| Segurança web | OWASP Top 10:2025 (final jan/2026) | Fontes secundárias ainda citam a edição 2021 como corrente. A 2025 é a vigente |
| Segurança de API | OWASP API Security Top 10:2023 | Projeto separado, ciclo próprio. Não confundir com a lista web |
| Pagamento | PCI DSS 4.0.1 — 6.4.3 e 11.6.1 obrigatórios desde 31/03/2025 | Atualização do SAQ A (jan/2025) removeu 6.4.3/11.6.1 para SAQ A, mas criou critério de elegibilidade de difícil comprovação. Iframe do processador **não** transfere a responsabilidade da página que o enquadra |
| Conversão de LP | Unbounce — 41.000 páginas, 464M visitantes, 57M conversões | **Conflito real:** mediana reportada como 6,6% (análise Q4/2024) e como 4,02% (relatório 2026). Amostras e definições de conversão diferem entre publicadores. Usar 6,6% com a divergência declarada |
| Abandono de carrinho | Baymard — meta-análise de 50 estudos, 70,22% | Dynamic Yield mede 77,81% em sessões ao vivo (200M+ usuários/mês). Não é contradição: agregado de longo prazo vs. comportamento em tempo real |
| Entrega de software | DORA / State of DevOps 2025 | Modelo elite/high/medium/low **abandonado** em 2025 em favor de sete arquétipos. Benchmarking contra "elite" é vocabulário morto |
| Aceleração | GALI — ANDE + Emory, 30+ publicações | Impacto agregado positivo, mas variação forte programa a programa. Sem receita única |
| Marca | ISO 20671-1:2021 (avaliação) e ISO 10668:2010 (valoração monetária) | Escopos distintos: avaliação não-financeira vs. valoração financeira |
| Design tokens | DTCG v2025.10 — primeira versão estável, 28/10/2025 | Ferramentas ainda em migração. Style Dictionary v4 suporta DTCG, mas o formato 2025.10 completo é trabalho em curso na v5 |
| Mercado BR e-commerce | ABComm e ABIACOM | **Conflito material:** ABComm reporta 2025 acima de R$ 200 bi e projeta R$ 258 bi para 2026; ABIACOM reporta R$ 235,5 bi em 2025 (+15,3%) e projeta R$ 259,8 bi. Terceira fonte estima R$ 218–225 bi para 2025. Convergem na projeção 2026 (~R$ 259 bi), divergem na base 2025 |
| Ativos virtuais BR | Resoluções BCB 519, 520, 521 e 552 | Nenhum. Marco regulatório definido e datado |
| Mensageria | Meta — modelo por mensagem desde 01/07/2025 | Faturamento no Brasil ainda em USD até meados de 2026; migração para BRL anunciada. Valores em BRL nas fontes são conversões, não tabela oficial |

---

## §D.1 — O que este protocolo decide

**Decide:** o formato de instituição de qualquer serviço; o pipeline canônico;
a estrutura de autoridade em operação enxuta; o átomo de tarefa; a posição do
Web 3.0; o árbitro real de performance; o piso de conformidade LGPD.

**Não decide:** o conteúdo normativo de nenhum serviço específico — isso é
dos cases; a precificação; a estratégia comercial; a sequência de execução
em campo.
