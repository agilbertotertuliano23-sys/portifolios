---
kind: case
servico: ecommerce
instancia: protocolo-regencia-v2
status: instanciado
maturidade: 100
maturidade_anterior: 55
data: 2026-07-30
---

# Case 03 — E-commerce e Plataformas de Venda

Serviço de maior custo de falha do portfólio de web. Um defeito de webhook em
produção não gera retrabalho — gera pedido pago sem processamento e dano
reputacional imediato.

---

## §E.1 — Filosofia do ativo

O e-commerce é uma **máquina de transação confiável**. Toda decisão de projeto
se subordina a uma pergunta: o dinheiro chega, o pedido é registrado, e o
cliente sabe disso? Estética que aumente atrito no checkout é defeito, não
escolha.

## §E.2 — Limites normativos

| Limite | Fonte | Natureza |
|--------|-------|----------|
| Integridade de script na página de pagamento | PCI DSS 4.0.1 req. 6.4.3 | Inegociável |
| Detecção de alteração não autorizada em scripts e cabeçalhos HTTP | PCI DSS 4.0.1 req. 11.6.1 | Inegociável |
| Base legal e ROPA cobrindo dados de pedido e pagamento | LGPD arts. 7º, 37 | Bloqueia go-live |
| Comunicação de incidente em 3 dias úteis | Res. CD/ANPD 15/2024 | Runbook obrigatório |
| Políticas de privacidade, termos e reembolso publicados | CDC + LGPD | Bloqueia go-live |
| WCAG 2.2 AA no fluxo de compra | ISO/IEC 40500:2025 | Inegociável |

## §E.3 — Padrões-lei

- **PCI DSS 4.0.1** — árbitro de segurança de pagamento
- **OWASP Top 10:2025** — árbitro de segurança de aplicação
- **Core Web Vitals (CrUX p75)** — árbitro de performance
- **Baymard Institute** — referência de usabilidade de checkout

## §E.4 — Gates

| Gate | Critério binário | Evidência |
|------|------------------|-----------|
| **G0** Entrada | Matriz de SKUs, preços e estoque validada · gateway definido · regras tributárias e de frete homologadas | Documento assinado |
| **G1** Preparação | Textos legais prontos · arquitetura de e-mails transacionais aprovada · credenciais de sandbox e produção segregadas | Checklist 100% |
| **G2** Construção | Vitrine, carrinho persistente, checkout, área do cliente, cupons — DoD por camada | Ambiente de staging |
| **G3** Validação | **Jornada sandbox completa da home ao pagamento concluído, com todos os webhooks disparando e registrados** · dados de cartão inválidos e CEP inválido tratados · zero erro axe-core no fluxo de compra | Log de webhook + relatório |
| **G3-P** Conformidade PCI | Inventário de todo script da página de pagamento, com autorização formal e verificação de integridade · alerta ativo para alteração não autorizada | Inventário + evidência de alerta |
| **G4** Handover | Cliente cadastra um produto e processa um pedido de teste sozinho | Gravação da execução |
| **G5** Pós-entrega | Taxa de abandono medida · CrUX p75 · zero pedido travado sem triagem | GA4 + painel do gateway |

**G3 é o gate que o modelo anterior tinha como bullet.** A jornada sandbox
completa com validação de webhook era item de checklist; passa a ser condição
de bloqueio. É o único ponto do sistema onde a falha custa dinheiro do cliente
diretamente.

## §E.4.1 — Por que G3-P existe

Os requisitos 6.4.3 e 11.6.1 do PCI DSS 4.0.1 são obrigatórios desde
**31 de março de 2025** e estão entre os pontos de falha de auditoria mais
comuns. Eles existem por causa de e-skimming: o atacante não invade o servidor
— ele altera um script que o navegador carrega e captura os dados do cartão
direto do formulário enquanto o usuário digita.

**O erro conceitual mais caro deste serviço:** supor que hospedar os campos de
pagamento em iframe de processador transfere a responsabilidade. Não transfere.
O iframe é isolado, mas **a página que o enquadra não é**. Analytics, teste A/B,
gravação de sessão e widget de chat rodam no mesmo contexto de navegação de
topo, e um script ali pode ler o DOM, sobrepor um campo falso sobre o iframe ou
redirecionar o formulário no envio.

O requisito 6.4.3 alcança **todos** os scripts carregados pela página de
pagamento, inclusive analytics e chat — não apenas os scripts de pagamento.

A atualização do SAQ A de janeiro de 2025 removeu 6.4.3 e 11.6.1 para
comerciantes desse questionário, mas adicionou critério de elegibilidade
exigindo confirmar que o site não é suscetível a ataques por script — algo
difícil de provar sem monitoramento. Na prática, a isenção é rara.

## §E.5 — Camadas de criação

**Estratégia e copy.** Custo total visível desde o início. **48% dos
abandonos** têm como causa custos extras revelados no checkout — frete,
impostos ou taxas que elevam o total esperado.

**Design e interação.** Menos campos. O fluxo médio de checkout nos EUA exibe
23,48 elementos de formulário por padrão, dos quais 14,88 são campos — e é
possível reduzir de 20% a 60% na maioria dos casos. **Checkout como convidado
obrigatório:** criação de conta compulsória responde por 19% dos abandonos, e
checkout longo ou complicado por 18%.

**Engenharia.** Cache de borda para páginas estáticas de produto. Compressão
agressiva de catálogo sem perda comercial. Scripts de terceiros assíncronos —
e inventariados, por G3-P.

**Dados e automação.** Eventos de compra em GA4 e pixel. Fluxo de carrinho
abandonado — é o tipo de fluxo automatizado de maior rendimento, com taxa de
abertura em torno de 50,5%.

## §I — Métricas com instrumento

| Métrica | Alvo | Instrumento |
|---------|------|-------------|
| Abandono de carrinho | < 70% (referência global 70,22%) | GA4 funil |
| LCP p75 da página de produto | < 2,5s | CrUX |
| Webhooks falhos não tratados | 0 | Log do gateway + alerta |
| Pedidos travados sem triagem | 0 | Painel do gateway |
| Scripts não autorizados na página de pagamento | 0 | Monitor de integridade |
| Erros críticos de acessibilidade no checkout | 0 | axe-core |

## §I.1 — Referência de abandono (com divergência declarada)

A referência mais citada é **70,22%**, meta-análise de 50 estudos do Baymard
Institute. Uma medição de comportamento ao vivo, sobre mais de 200 milhões de
usuários mensais, registra **77,81%**. Não é contradição: uma é agregado de
longo prazo entre estudos, a outra é sessão em tempo real.

Móvel abandona muito mais que desktop — cerca de **80%** contra **66%**.
Verticais divergem fortemente: mercado alimentício por volta de 61%, DTC
convencional entre 67% e 76%, B2B entre 80% e 84%, finanças e viagem entre 81%
e 91%.

**Norma:** comparar sempre contra a vertical do cliente e o dispositivo
dominante, nunca contra o agregado global. Abaixo de 70% é acima da média;
abaixo de 60% é forte; o piso realista de um checkout otimizado fica entre
55% e 60%.

**Contexto de mercado.** O e-commerce brasileiro fechou 2025 entre R$ 200 bi
e R$ 235,5 bi conforme a fonte, e as projeções para 2026 convergem em torno de
**R$ 259 bi**, com ticket médio próximo de R$ 562. A divergência na base de
2025 deve ser declarada em qualquer proposta que use esses números.

## §D — Não decide

Estratégia de sortimento, precificação, logística contratada, ou a escolha do
gateway — decide apenas os requisitos que a integração escolhida deve cumprir.
