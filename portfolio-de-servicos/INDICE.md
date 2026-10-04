---
kind: indice
corpus: modelo-regente-portfolio
versao: 2.0
data: 2026-07-30
---

# Corpus de Regência — Índice

Sete documentos. Um protocolo canônico e seis cases que o instanciam.

| Documento | Serviço | Maturidade antes → depois |
|-----------|---------|---------------------------|
| `00-PROTOCOLO-REGENCIA` | Camada normativa superior | — |
| `01-CASE-LANDING-PAGES` | Landing pages | 95% → 100% (revisado) |
| `02-CASE-SITES-INSTITUCIONAIS` | Sites e portfólios | 60% → 100% |
| `03-CASE-ECOMMERCE` | E-commerce | 55% → 100% |
| `04-CASE-INTEGRACOES-APIS` | Integrações e automações | 35% → 100% |
| `05-CASE-BRANDING` | Identidade e branding | 20% → 100% |
| `06-CASE-INCUBADORA` | Incubadora de marcas | 15% → 100% |

---

## Ordem de leitura

Ler `00` primeiro. Os cases são intercambiáveis entre si, mas nenhum faz
sentido sem o protocolo — eles instanciam campos que só o protocolo define.

`06` depende conceitualmente de `01` a `05`: a incubadora sequencia os
serviços já regidos em vez de criar norma técnica própria.

---

## O que mudou em relação ao corpus anterior

**Estrutural.** Dois pipelines concorrentes (8 fases e 6 blocos) fundidos em
seis estações. RACI de nove papéis condensado em três chapéus operáveis por
uma pessoa, com regra de intervalo entre execução e validação. Átomo de tarefa
com cinco campos instituído.

**Corretivo.** Lighthouse rebaixado de árbitro final a proxy de laboratório;
CrUX p75 promovido a verdade de campo. LGPD ampliada de cláusula contratual
para cinco obrigações com instrumento. Web 3.0 reposicionado de identidade
central para camada técnica opcional, com fronteira PSAV definida.

**Aditivo.** Quatro gates que não existiam: jornada sandbox com validação de
webhook (`03`), matriz de sete cenários de falha induzida (`04`), teste de
aplicabilidade do brandbook por terceiro (`05`), evidência mensal de execução
do cliente (`06`).

---

## Arestas que permanecem abertas

Documentar não é resolver. Três coisas seguem em aberto:

**1. Nenhum gate novo foi executado em campo.** Todo o corpus está
documentalmente completo e empiricamente não testado. Os limiares foram
calibrados contra fontes externas, não contra a operação real.

**2. O intervalo Executor→Validador é hipótese.** A regra de 12 horas foi
fixada por raciocínio, não por medição. É a variável que mais provavelmente
afeta a taxa de defeito escapado, e deve ser registrada como métrica desde o
primeiro projeto para permitir calibração posterior.

**3. G2.n da incubadora pode ser rigoroso demais para o mercado regional.**
Se o cliente típico não sustentar três evidências mensais, a correção provável
é reduzir para uma obrigatória e duas desejáveis — não abandonar o gate.
Registrar qual foi o caso no piloto.

---

## Conflitos de fonte declarados

Registrados integralmente em `00 §D`. Os três de maior impacto comercial:

- **Conversão de landing page:** mediana reportada como 6,6% e como 4,02%
  conforme a publicação. Definições de conversão e amostras diferem.
- **Abandono de carrinho:** 70,22% em meta-análise de estudos contra 77,81%
  em medição de sessão ao vivo. Não é contradição; são recortes distintos.
- **E-commerce brasileiro 2025:** base reportada entre R$ 200 bi e R$ 235,5 bi
  conforme a entidade. As projeções para 2026 convergem em torno de R$ 259 bi.

Norma: usar sempre a faixa com a divergência declarada. Número único sem fonte
em proposta comercial é passivo, não argumento.
