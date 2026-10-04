---
kind: case
servico: integracoes-apis
instancia: protocolo-regencia-v2
status: instanciado
maturidade: 100
maturidade_anterior: 35
data: 2026-07-30
divida_quitada: checklist-truncado-em-testes
---

# Case 04 — Integrações com APIs e Automações

Este era o serviço mais exposto do portfólio: o checklist original terminava
no meio da seção de testes, exatamente no ponto onde o tratamento de falha
deveria ser especificado. O serviço que mais depende de lidar com falha era o
que tinha menos falha documentada.

---

## §E.1 — Filosofia do ativo

A integração é um **contrato entre sistemas que vão falhar**. Ela não é
julgada pelo caminho feliz — é julgada pelo comportamento quando a API externa
cai, quando o payload chega malformado e quando o mesmo evento dispara duas
vezes. Uma integração que só funciona quando tudo funciona não é uma
integração; é uma demonstração.

## §E.2 — Limites normativos

| Limite | Fonte | Natureza |
|--------|-------|----------|
| Autorização verificada por objeto e por propriedade | OWASP API Top 10:2023 (API1, API3) | Inegociável |
| Rate limiting e paginação com limites sãos | OWASP API Top 10:2023 (API4) | Inegociável |
| Credenciais cifradas, nunca em repositório | OWASP Top 10:2025 | Inegociável |
| Falha fechada, nunca aberta; sem vazamento de stack trace | OWASP Top 10:2025 (nova categoria) | Inegociável |
| Base legal e ROPA para todo dado trafegado | LGPD arts. 7º, 37 | Bloqueia go-live |
| Cláusulas-padrão para transferência internacional | Res. CD/ANPD 19/2024 | Bloqueia go-live se houver processamento fora do país |
| Fronteira PSAV | Res. BCB 519/520/521 | Inegociável |

## §E.3 — Padrões-lei

- **OWASP API Security Top 10:2023** — árbitro de segurança de API. Projeto
  separado do Top 10 web, com ciclo próprio; APIs usam os dois
- **OWASP Top 10:2025** — árbitro de segurança de aplicação
- **DORA (State of DevOps)** — vocabulário de métricas de entrega
- **Contrato de API versionado** — árbitro de integridade do dado

## §E.4 — Gates

| Gate | Critério binário | Evidência |
|------|------------------|-----------|
| **G0** Entrada | Endpoints, métodos e rate limits mapeados · regra de negócio escrita · dono do dado nomeado | Documento assinado |
| **G1** Preparação | Diagrama de sequência aprovado · chaves de teste e produção segregadas · gatilhos e ações definidos | Checklist 100% |
| **G2** Construção | Autenticação implementada · logs estruturados · sincronização assíncrona · DoD por camada | Staging |
| **G3** Validação — caminho feliz | Ponta a ponta com dado real em sandbox | Log completo |
| **G3-F** Validação — falha induzida | **Timeout, payload inválido, credencial expirada, rate limit estourado e evento duplicado, cada um com comportamento definido e observado** | Matriz de falha preenchida |
| **G4** Handover | Runbook entregue · cliente identifica e reprocessa uma falha sozinho | Gravação da execução |
| **G5** Pós-entrega | Taxa de erro medida · zero falha silenciosa | Painel de logs |

## §E.4.1 — Matriz de falha induzida (a dívida quitada)

Esta é a seção que faltava. Nenhuma integração passa G3-F sem as sete linhas
preenchidas com comportamento **observado**, não previsto.

| Cenário de falha | Comportamento exigido | Evidência |
|------------------|----------------------|-----------|
| Timeout da API externa | Retry com backoff exponencial, teto definido, depois fila morta | Log com timestamps do retry |
| Payload inválido | Rejeição com erro tipado. Nada gravado pela metade | Registro do erro + estado íntegro |
| Credencial expirada | Falha fechada, alerta ao operador. Nunca degradar para acesso anônimo | Alerta disparado |
| Rate limit estourado | Enfileiramento e retomada, não descarte | Fila drenada após janela |
| Evento duplicado | Idempotência por chave. Segundo evento não gera segundo efeito | Dois disparos, um efeito |
| API externa fora do ar | Mensagem clara na interface. Nenhum estado inconsistente | Captura de tela + estado |
| Resposta com dado a mais que o previsto | Filtro por lista de permissão. Propriedade não prevista não propaga | Diff de payload |

A última linha corresponde a **BOPLA** — autorização quebrada em nível de
propriedade de objeto. A categoria consolidou exposição excessiva de dados e
atribuição em massa, e a raiz é a mesma: validar autorização no objeto inteiro
sem validar em cada propriedade. A prevenção é lista de permissão de campos
por perfil, nunca lista de bloqueio.

**Nota sobre a categoria dominante.** Autorização quebrada em nível de objeto
(BOLA) ocupa o primeiro lugar da lista de APIs desde 2019: é a mais comum, a
mais explorada e a mais difícil de detectar automaticamente, porque a API
funciona exatamente como projetada — o atacante apenas acessa o objeto de
outro usuário. Varredura automatizada não pega. Só teste com múltiplas sessões
pega.

## §E.4.2 — Fronteira PSAV aplicada a automações

Uma automação que **converte, custodia, intermedia ou transfere** ativo virtual
cruza a fronteira e submete o cliente ao regime de autorização do Banco Central.
Automação de notificação sobre transação on-chain é read-only e está dentro da
fronteira. Automação que executa a transação não está.

## §E.5 — Camadas de criação

**Estratégia.** Uma regra de negócio escrita em prosa antes de qualquer
diagrama. Se a regra não cabe em um parágrafo, ela não está entendida.

**Design e interação.** Estado de erro na interface é tela de projeto, não
improviso. O usuário precisa saber que falhou, o que falhou e o que fazer.

**Engenharia.** Idempotência por padrão. Logs estruturados com identificador
de correlação. Segredos fora do repositório. Sincronização assíncrona para não
travar a interface.

**Dados e automação.** Consentimento antes do fluxo. Categoria correta de
mensagem — em mensageria, misturar utilidade com marketing infla custo e
viola o opt-in. Mensagem de marketing exige consentimento explícito conforme
LGPD e modelo aprovado.

## §I — Métricas com instrumento

| Métrica | Alvo | Instrumento |
|---------|------|-------------|
| Taxa de falha de mudança | < 15% dos deploys | Registro de deploy + incidente |
| Tempo de recuperação de deploy falho | < 1 dia | Timestamp incidente → resolução |
| Taxa de retrabalho | < 8% | Tarefas reabertas |
| Falhas silenciosas | 0 | Alerta obrigatório por cenário da matriz |
| Cenários da matriz de falha cobertos | 7 de 7 | Matriz G3-F |

## §I.1 — Nota sobre vocabulário DORA

O modelo elite / alto / médio / baixo foi **abandonado** em 2025, substituído
por sete arquétipos que combinam desempenho de entrega com fatores humanos
como esgotamento e fricção. Benchmarking contra "elite" é vocabulário morto.

A métrica antes chamada MTTR foi redefinida como **tempo de recuperação de
deploy falho** e movida para a categoria de throughput — a definição anterior
não distinguia falha causada por mudança de software de falha causada por
fator externo como queda de datacenter. Foi acrescentada a **taxa de
retrabalho**: percentual de deploys que são trabalho não planejado para
corrigir defeito.

Os alvos acima foram calibrados contra a distribuição observada, não contra
aspiração: a maior faixa de equipes tem taxa de falha entre 8% e 16%, e 39,5%
ficam acima de 16%. Apenas 8,5% atingem a faixa de 0 a 2%. Para operação solo,
perseguir o topo dessa distribuição é desperdício de atenção — o valor está em
não estar entre os 15,3% que levam mais de uma semana para se recuperar.

## §D — Não decide

A escolha da ferramenta de automação, a arquitetura interna dos sistemas do
cliente, ou a decisão de negócio de integrar — decide o comportamento que a
integração deve ter quando falhar.
