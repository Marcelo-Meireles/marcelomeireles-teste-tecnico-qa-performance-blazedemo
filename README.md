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

- **Java 21+** instalado
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

Se nao estiver, baixe em: https://www.oracle.com/br/java/technologies/downloads/#jdk21-windows

### 2. Instalar o JMeter

1. Acesse https://jmeter.apache.org/download_jmeter.cgi
2. Baixe o arquivo `apache-jmeter-5.6.3.zip` em Binaries
3. Extraia em uma pasta de sua preferencia, por exemplo `C:\jmeter\`
4. Resultado esperado: `C:\jmeter\apache-jmeter-5.6.3\bin\jmeter.bat`

> **Atencao (Windows):** Ao extrair o ZIP, verifique o caminho real do `jmeter.bat` com o comando:
> ~~~
> dir C:\jmeter\ -Recurse -Filter "jmeter.bat" | Select-Object FullName
> ~~~
> Use o caminho exato retornado nos comandos abaixo.

### 3. Clonar o Repositorio

~~~
git clone https://github.com/Marcelo-Meireles/marcelomeireles-teste-tecnico-qa-performance-blazedemo.git
cd marcelomeireles-teste-tecnico-qa-performance-blazedemo
mkdir reports
~~~

---

## Como Executar os Testes

### Opcao 1: Interface Grafica do JMeter (recomendado para analise)

1. Abra o JMeter:
   - Windows: execute `C:\jmeter\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin\jmeter.bat`
   - Linux/macOS: execute `apache-jmeter-5.6.3/bin/jmeter.sh`
2. Va em **File > Open** e selecione o arquivo `.jmx` desejado
3. Clique no botao **Play (verde)** para iniciar
4. Acompanhe em **Summary Report** e **Aggregate Report**

### Opcao 2: Linha de Comando (recomendado para CI/CD)

**Teste de Carga:**

~~~
C:\jmeter\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin\jmeter.bat -n -t jmeter\blazedemo-load-test.jmx -l reports\load-test-results.csv -e -o reports\load-dashboard
~~~

**Teste de Pico:**

~~~
C:\jmeter\apache-jmeter-5.6.3\apache-jmeter-5.6.3\bin\jmeter.bat -n -t jmeter\blazedemo-spike-test.jmx -l reports\spike-test-results.csv -e -o reports\spike-dashboard
~~~

**Parametros:**
- `-n` — executa em modo nao-grafico
- `-t` — arquivo do script de teste
- `-l` — arquivo CSV de resultados
- `-e` — gera relatorio HTML
- `-o` — pasta de saida do relatorio HTML

Apos a execucao, abra `reports/load-dashboard/index.html` no navegador para ver o relatorio completo.

---

## Descricao dos Testes

### Teste de Carga (`blazedemo-load-test.jmx`)

| Parametro          | Valor                |
|--------------------|----------------------|
| Usuarios (threads) | 250                  |
| Ramp-up            | 60 segundos          |
| Duracao            | 300 segundos (5 min) |
| Tipo               | Carga sustentada     |

### Teste de Pico (`blazedemo-spike-test.jmx`)

| Parametro          | Valor                |
|--------------------|----------------------|
| Usuarios (threads) | 300                  |
| Ramp-up            | 10 segundos          |
| Duracao            | 120 segundos (2 min) |
| Tipo               | Pico (Spike)         |

---

## Passos do Fluxo Testado

| # | Passo                       | URL              | Metodo | Assertion                         |
|---|-----------------------------|------------------|--------|-----------------------------------|
| 1 | Home - Selecionar cidades   | `/`              | POST   | Status 200                        |
| 2 | Reserve - Selecionar voo    | `/reserve.php`   | POST   | Status 200                        |
| 3 | Purchase - Comprar passagem | `/purchase.php`  | POST   | Status 200 + texto de confirmacao |

A assertion do passo 3 valida que a resposta contem `Thank you for your purchase today!`

---

## Relatorio de Execucao

> **Nota:** Os testes foram executados em 21/03/2026 a partir de uma maquina local em Brasilia, Brasil. O BlazeDemo e um ambiente de demonstracao compartilhado e gratuito, sem SLA ou infraestrutura dedicada. Os resultados refletem o comportamento real do servidor naquele momento.

### Teste de Carga - Resultados Reais

Execucao: `2026-03-21 21:56:35` | Duracao: `5m16s` | Usuarios: `250`

| Metrica              | Resultado   |
|----------------------|-------------|
| Total de amostras    | 82.134      |
| Throughput           | 259,7 req/s |
| Tempo medio          | 825 ms      |
| Tempo minimo         | 0 ms        |
| Tempo maximo         | 21.631 ms   |
| Taxa de erro         | 67,33%      |

### Teste de Pico - Resultados Reais

Execucao: `2026-03-21 22:06:45` | Duracao: `2m10s` | Usuarios: `300`

| Metrica              | Resultado   |
|----------------------|-------------|
| Total de amostras    | 13.753      |
| Throughput           | 105,4 req/s |
| Tempo medio          | 2.589 ms    |
| Tempo minimo         | 164 ms      |
| Tempo maximo         | 11.070 ms   |
| Taxa de erro         | 70,14%      |

---

## Analise dos Resultados

### Criterio de Aceitacao

**Criterio:** 250 requisicoes por segundo com P90 < 2 segundos

### Teste de Carga

**Resultado: CRITERIO NAO ATENDIDO**

| Metrica      | Criterio  | Resultado   | Status     |
|--------------|-----------|-------------|------------|
| Throughput   | 250 req/s | 259,7 req/s | PASSOU     |
| Taxa de erro | < 1%      | 67,33%      | NAO PASSOU |

O throughput de **259,7 req/s superou o criterio de vazao de 250 req/s**, porem a **taxa de erro de 67,33% invalida o resultado**. O servidor BlazeDemo rejeitou a grande maioria das requisicoes durante a carga sustentada de 250 usuarios simultaneos.

### Teste de Pico

**Resultado: CRITERIO NAO ATENDIDO**

| Metrica      | Criterio  | Resultado   | Status     |
|--------------|-----------|-------------|------------|
| Throughput   | 250 req/s | 105,4 req/s | NAO PASSOU |
| Tempo medio  | P90 < 2s  | 2.589 ms    | NAO PASSOU |
| Taxa de erro | < 1%      | 70,14%      | NAO PASSOU |

No teste de pico, com 300 usuarios e ramp-up de apenas 10 segundos, o servidor entrou em colapso imediato: o throughput caiu para 105 req/s e o tempo medio de resposta subiu para 2.589ms, com 70% de erros.

### Conclusao

**O criterio de aceitacao NAO foi atendido em nenhum dos dois cenarios.**

Motivos identificados:

1. **Infraestrutura do BlazeDemo:** O site e uma aplicacao de demonstracao publica sem infraestrutura dedicada para alta carga.
2. **Servidor compartilhado:** O BlazeDemo e utilizado simultaneamente por usuarios ao redor do mundo para fins de treinamento e testes, o que compromete os resultados.
3. **Ausencia de session management:** O fluxo de 3 passos (home > reserve > purchase) depende de estado de sessao. Sob alta carga, o servidor nao consegue manter as sessoes, resultando em falhas no passo `/purchase.php`.
4. **Sem auto-scaling ou cache:** A aplicacao nao possui mecanismos para absorver picos de demanda.

**Em um sistema de producao real** com arquitetura adequada (load balancer, cache, auto-scaling e banco de dados otimizado), o criterio de 250 req/s com P90 < 2s seria tecnicamente alcancavel. Os scripts JMeter desenvolvidos estao corretos e prontos para serem reutilizados em qualquer ambiente com maior capacidade.

---

## Boas Praticas Aplicadas

- Cookie Manager com `clearEachIteration=true` para simular sessoes independentes
- HTTP Request Defaults centralizado para facilitar manutencao da URL base
- Assertions em todos os passos (status HTTP + texto de confirmacao)
- Result Collector configurado para salvar CSV com dados completos
- Ramp-up gradual no teste de carga (60s) para evitar pico artificial
- Ramp-up agressivo no teste de pico (10s) para simular sobrecarga real

---

## Tecnologias Utilizadas

- Apache JMeter 5.6.3
- Java 21 LTS
- Protocolo HTTPS
- Site de demo: https://www.blazedemo.com

