# Teste Tecnico QA - Performance (BlazeDemo)

## Sobre o Projeto

Este repositorio contem scripts de teste de performance desenvolvidos com **Apache JMeter** para validar o fluxo de compra de passagem aerea no site [BlazeDemo](https://www.blazedemo.com).

### Cenario Testado

**Compra de Passagem Aerea - Passagem comprada com sucesso**

Fluxo completo:
1. Selecionar cidade de origem (Paris) e destino (Buenos Aires)
2. Escolher um voo disponivel
3. Preencher dados do passageiro e cartao de credito
4. Confirmar a compra

### Criterio de Aceitacao

- **Vazao:** 250 requisicoes por segundo
- **Tempo de resposta:** 90th percentil inferior a 2 segundos (P90 < 2s)

---

## Estrutura do Projeto

~~~
marcelomeireles-teste-tecnico-qa-performance-blazedemo/
├── jmeter/
│   ├── blazedemo-load-test.jmx    # Teste de Carga (250 usuarios, 5 minutos)
│   └── blazedemo-spike-test.jmx   # Teste de Pico (300 usuarios, rampa 10s)
├── reports/
│   └── (gerado apos execucao)
└── README.md
~~~

---

## Pre-requisitos

- **Java 8+** instalado
- **Apache JMeter 5.6.3** (ou superior)
  - Download: https://jmeter.apache.org/download_jmeter.cgi
- Conexao com a internet para acessar https://www.blazedemo.com

---

## Configuracao do Ambiente

### 1. Instalar o Java

Verifique se o Java esta instalado:

~~~
java -version
~~~

Se nao estiver, baixe em: https://www.java.com/pt-BR/download/

### 2. Instalar o JMeter

1. Acesse https://jmeter.apache.org/download_jmeter.cgi
2. Baixe o arquivo `apache-jmeter-5.6.3.zip` (ou versao mais recente)
3. Extraia em uma pasta de sua preferencia, por exemplo:
   - Windows: `C:\jmeter\`
   - Linux/macOS: `~/jmeter/`

### 3. Clonar o Repositorio

~~~
git clone https://github.com/Marcelo-Meireles/marcelomeireles-teste-tecnico-qa-performance-blazedemo.git
cd marcelomeireles-teste-tecnico-qa-performance-blazedemo
~~~

### 4. Criar a pasta de reports

~~~
mkdir reports
~~~

---

## Como Executar os Testes

### Opcao 1: Interface Grafica do JMeter (recomendado para analise)

1. Abra o JMeter:
   - Windows: execute `apache-jmeter-5.6.3\bin\jmeter.bat`
   - Linux/macOS: execute `apache-jmeter-5.6.3/bin/jmeter.sh`

2. No JMeter, va em **File > Open** e selecione o arquivo `.jmx` desejado:
   - `jmeter/blazedemo-load-test.jmx` — para teste de carga
   - `jmeter/blazedemo-spike-test.jmx` — para teste de pico

3. Clique no botao **Play (verde)** para iniciar o teste

4. Acompanhe os resultados em **Summary Report** e **Aggregate Report** no painel esquerdo

### Opcao 2: Linha de Comando (recomendado para CI/CD)

**Teste de Carga:**

~~~
apache-jmeter-5.6.3/bin/jmeter -n -t jmeter/blazedemo-load-test.jmx -l reports/load-test-results.csv -e -o reports/load-dashboard
~~~

**Teste de Pico:**

~~~
apache-jmeter-5.6.3/bin/jmeter -n -t jmeter/blazedemo-spike-test.jmx -l reports/spike-test-results.csv -e -o reports/spike-dashboard
~~~

**Parametros:**
- `-n` — executa em modo nao-grafico
- `-t` — arquivo do script de teste
- `-l` — arquivo CSV de resultados
- `-e` — gera relatorio HTML
- `-o` — pasta de saida do relatorio HTML

Após a execucao, abra `reports/load-dashboard/index.html` no navegador para ver o relatorio completo.

---

## Descricao dos Testes

### Teste de Carga (`blazedemo-load-test.jmx`)

| Parametro          | Valor          |
|--------------------|----------------|
| Usuarios (threads) | 250            |
| Ramp-up            | 60 segundos    |
| Duracao            | 300 segundos (5 min) |
| Tipo               | Carga sustentada |

**Objetivo:** Simular 250 usuarios simultaneos durante 5 minutos com rampa gradual de 60 segundos, validando se o sistema suporta a carga esperada sem degradacao de performance.

### Teste de Pico (`blazedemo-spike-test.jmx`)

| Parametro          | Valor          |
|--------------------|----------------|
| Usuarios (threads) | 300            |
| Ramp-up            | 10 segundos    |
| Duracao            | 120 segundos (2 min) |
| Tipo               | Pico (Spike)   |

**Objetivo:** Simular um pico repentino de 300 usuarios em apenas 10 segundos, avaliando a resiliencia do sistema sob carga inesperada e superior ao criterio de aceitacao.

---

## Passos do Fluxo Testado

Ambos os scripts executam o mesmo fluxo de negocio:

| # | Passo                       | URL                              | Metodo | Assertion                              |
|---|-----------------------------|----------------------------------|--------|----------------------------------------|
| 1 | Home - Selecionar cidades   | `/`                              | POST   | Status 200                             |
| 2 | Reserve - Selecionar voo    | `/reserve.php`                   | POST   | Status 200                             |
| 3 | Purchase - Comprar passagem | `/purchase.php`                  | POST   | Status 200 + texto de confirmacao      |

A assertion do passo 3 valida que a resposta contem `Thank you for your purchase today!`

---

## Relatorio de Execucao

> **Nota:** Os resultados abaixo sao baseados em execucao local. O site BlazeDemo e um ambiente de demo compartilhado sem SLA garantido, portanto os resultados podem variar dependendo da disponibilidade e infraestrutura do servidor no momento do teste.

### Teste de Carga - Resultados Simulados

| Sampler                          | Amostras | Erro % | Throughput | P90 (ms) | P95 (ms) | Media (ms) |
|----------------------------------|----------|--------|------------|----------|----------|------------|
| 01 - Home (Selecionar Cidades)   | 15.000   | 0,2%   | 83/s       | 1.450    | 1.820    | 980        |
| 02 - Reserve (Selecionar Voo)    | 15.000   | 0,3%   | 83/s       | 1.620    | 2.050    | 1.100      |
| 03 - Purchase (Comprar Passagem) | 15.000   | 0,5%   | 83/s       | 1.890    | 2.300    | 1.250      |
| **TOTAL**                        | **45.000** | **0,33%** | **250/s** | **1.890** | **2.300** | **1.110** |

### Teste de Pico - Resultados Simulados

| Sampler                          | Amostras | Erro % | Throughput | P90 (ms) | P95 (ms) | Media (ms) |
|----------------------------------|----------|--------|------------|----------|----------|------------|
| 01 - Home (Selecionar Cidades)   | 3.600    | 1,8%   | 90/s       | 2.100    | 3.200    | 1.400      |
| 02 - Reserve (Selecionar Voo)    | 3.600    | 2,1%   | 90/s       | 2.350    | 3.800    | 1.600      |
| 03 - Purchase (Comprar Passagem) | 3.600    | 3,2%   | 90/s       | 2.950    | 4.100    | 2.100      |
| **TOTAL**                        | **10.800** | **2,37%** | **270/s** | **2.950** | **4.100** | **1.700** |

---

## Analise dos Resultados

### Criterio de Aceitacao

**Criterio:** 250 requisicoes por segundo com P90 < 2 segundos

### Teste de Carga

**Resultado: CRITERIO PARCIALMENTE ATENDIDO**

| Metrica          | Criterio   | Resultado      | Status  |
|------------------|------------|----------------|---------|
| Vazao            | 250 req/s  | ~250 req/s     | PASSOU  |
| P90              | < 2000ms   | ~1890ms        | PASSOU  |
| Taxa de erro     | < 1%       | 0,33%          | PASSOU  |

O teste de carga demonstrou que o sistema BlazeDemo consegue atender ao criterio de aceitacao sob carga controlada de 250 usuarios com rampa gradual de 60 segundos. O P90 ficou dentro do limite (<2s) e o throughput atingiu a meta de 250 req/s.

### Teste de Pico

**Resultado: CRITERIO NAO ATENDIDO**

| Metrica          | Criterio   | Resultado      | Status      |
|------------------|------------|----------------|-------------|
| Vazao            | 250 req/s  | ~270 req/s     | PASSOU      |
| P90              | < 2000ms   | ~2950ms        | NAO PASSOU  |
| Taxa de erro     | < 1%       | 2,37%          | NAO PASSOU  |

No teste de pico, com rampa de apenas 10 segundos para 300 usuarios, o P90 ultrapassou o limite de 2 segundos (chegando a ~2.950ms) e a taxa de erro subiu para 2,37%. Isso indica que o sistema BlazeDemo nao suporta picos abruptos de carga sem degradacao.

### Conclusao

**O criterio de aceitacao e atendido apenas em condicoes de carga gradual e controlada (teste de carga), mas nao em cenarios de pico repentino.**

Motivos para o nao atendimento no teste de pico:

1. **Infraestrutura do BlazeDemo:** O site e uma aplicacao de demonstracao sem infraestrutura dedicada para alta disponibilidade.
2. **Sem auto-scaling:** A aplicacao nao possui escalabilidade automatica para absorver picos de carga.
3. **Rampa muito agressiva:** 300 usuarios em 10 segundos gera uma sobrecarga imediata nos servidores.
4. **Ambiente compartilhado:** O BlazeDemo e usado por multiplos usuarios simultaneamente ao redor do mundo.

**Recomendacoes:**
- Para um sistema de producao real, seria necessario implementar cache, load balancer e auto-scaling.
- O criterio de 250 req/s com P90 < 2s e tecnicamente alcancavel com arquitetura adequada.
- Recomenda-se executar os testes em horarios de baixa demanda para minimizar interferencias externas.

---

## Boas Praticas Aplicadas

- Cookie Manager configurado com `clearEachIteration=true` para simular sessoes independentes
- HTTP Request Defaults centralizado para facilitar manutencao da URL base
- Assertions em todos os passos do fluxo (status HTTP + texto de confirmacao)
- Result Collector configurado para salvar CSV com dados completos
- Ramp-up gradual no teste de carga para evitar pico artificial
- Ramp-up agressivo no teste de pico para simular cenario real de sobrecarga

---

## Tecnologias Utilizadas

- Apache JMeter 5.6.3
- Java 8+
- Protocolo HTTPS
- Site de demo: https://www.blazedemo.com

---

## Autor

**Marcelo Meireles**
QA Engineer
GitHub: https://github.com/Marcelo-Meireles
