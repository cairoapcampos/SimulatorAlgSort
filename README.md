# Simuladores de Algoritmos de Ordenação

Aplicação web educacional para acompanhar, passo a passo, os algoritmos **Shell Sort**, **Heap Sort** e **Radix Sort (LSD)**.

Cada simulador apresenta o estado do vetor, as variáveis do algoritmo e a linha correspondente do código Python. É possível avançar e voltar na execução, reproduzir os passos automaticamente e experimentar diferentes entradas.

## Estrutura

```text
.
├── .gitignore                  ← Dependências, logs e arquivos locais ignorados pelo Git
├── .nvmrc                      ← Versão do Node.js para execução local
├── package.json                ← Dependências, versão do Node.js e comando de execução
├── package-lock.json           ← Versões exatas das dependências
├── README.md                   ← Documentação do projeto
├── server.js                   ← Servidor Express, rotas e validação das entradas
├── vercel.json                 ← Configuração de implantação na Vercel
├── SortAlgs/
│   ├── ShellSort.py            ← Código Python do Shell Sort
│   ├── HeapSort.py             ← Código Python do Heap Sort
│   └── RadixSort.py            ← Código Python do Radix Sort
├── src/
│   ├── algoritmos.js           ← Configuração dos algoritmos, limites e complexidades
│   ├── codigo.js               ← Leitura dos arquivos Python e localização de linhas
│   ├── tabelas-home.js         ← Dados dos exemplos apresentados na Home
│   ├── shell.js                ← Geração dos passos do Shell Sort
│   ├── heap.js                 ← Geração dos passos do Heap Sort
│   └── radix.js                ← Geração dos passos do Radix Sort
├── views/
│   ├── home.ejs                ← Conteúdo teórico, exemplos e referências
│   ├── shell.ejs               ← Página do simulador de Shell Sort
│   ├── heap.ejs                ← Página do simulador de Heap Sort
│   ├── radix.ejs               ← Página do simulador de Radix Sort
│   └── partials/               ← Componentes EJS compartilhados
└── public/
    ├── style.css               ← Estilos das páginas e visualizações
    ├── comum.js                ← Reprodução, atalhos, formulário e recursos compartilhados
    ├── home.js                 ← Ajuste do cabeçalho fixo da Home
    ├── shell.js                ← Renderização do Shell Sort
    ├── heap.js                 ← Renderização do Heap Sort
    └── radix.js                ← Renderização do Radix Sort
```

## Páginas

| URL | Descrição |
|---|---|
| `/` | Apresentação dos algoritmos, exemplos em tabelas, complexidades e referências |
| `/shell` | Simulação do Shell Sort com sublistas e intervalos decrescentes |
| `/heap` | Simulação do Heap Sort com árvore binária e pilha de chamadas |
| `/radix` | Simulação do Radix Sort com vetores de contagem e saída |

## Modos disponíveis

| Modo de entrada | Funcionamento |
|---|---|
| Padrão | Utiliza o vetor declarado no arquivo Python do algoritmo |
| Digitar | Permite informar os valores separados por vírgula, espaço ou ponto e vírgula |
| Aleatório | Gera um vetor com o tamanho escolhido pelo usuário |

Os vetores devem ter de **2 a 16 elementos**, com os seguintes limites:

| Algoritmo | Valores aceitos |
|---|---|
| Shell Sort e Heap Sort | Inteiros positivos de 1 a 999 |
| Radix Sort | Inteiros positivos de 1 a 99999 |

**Observação:** esses limites de quantidade de elementos e de valor são definidos pela aplicação web, não pelos algoritmos. Os códigos Python de `SortAlgs/` podem ordenar vetores maiores e números com mais dígitos.

## Tecnologias utilizadas

### Back-end

| Tecnologia | Uso |
|---|---|
| Node.js 24 | Execução da aplicação JavaScript |
| Express 4 | Rotas HTTP, validação das entradas e entrega das páginas |
| EJS 3 | Renderização das páginas e componentes HTML |

### Front-end

| Tecnologia | Uso |
|---|---|
| HTML | Estrutura das páginas, tabelas e controles |
| CSS | Estilos, cores e organização visual |
| JavaScript | Controle da reprodução e atualização dos elementos da interface |
| SVG | Desenho da árvore do heap e das setas no Shell Sort |

Os arquivos Python servem como referência de código para os simuladores. A aplicação web gera os passos em JavaScript e não precisa executar Python.

## Como a visualização funciona

- O servidor valida a entrada e seleciona o algoritmo solicitado.
- Os módulos de `src/` geram uma sequência de estados, registrando vetores, variáveis, operações e linhas de código.
- O arquivo `src/codigo.js` lê o código de `SortAlgs/` e identifica suas linhas para manter o painel sincronizado com os passos.
- Os templates EJS enviam os dados da simulação junto com a página.
- O arquivo `public/comum.js` controla a navegação, a reprodução automática, a velocidade e os atalhos.
- Os arquivos `public/shell.js`, `public/heap.js` e `public/radix.js` desenham o estado atual de cada algoritmo.
- O resumo permite acompanhar o resultado das passadas da ordenação.

## Conceitos demonstrados

- **Shell Sort:** ordenação por inserção em sublistas, redução do intervalo `gap` e deslocamento de elementos.
- **Heap Sort:** construção de um heap máximo, manutenção da propriedade do heap com `heapify`, troca da raiz e redução da parte ainda não ordenada.
- **Radix Sort (LSD):** processamento dos dígitos do menos significativo ao mais significativo, contagem de ocorrências e distribuição estável no vetor de saída.
- **Análise de algoritmos:** comparação de complexidades de tempo, uso de memória e estabilidade na Home, além de contadores de operações nos simuladores.

## Controles e atalhos

| Controle | Atalho | Ação |
|---|---|---|
| Início | `Home` | Volta ao primeiro passo |
| Anterior | `←` | Volta um passo |
| Play / Pausar | `Espaço` | Inicia ou pausa a reprodução automática |
| Próximo | `→` | Avança um passo |
| Fim | `End` | Avança até o último passo |
| Fim da passada | `P` | Avança até o fim da passada atual |
| Reiniciar | `R` | Reinicia a reprodução do vetor carregado |
| Velocidade | — | Ajusta o intervalo entre os passos automáticos |

## Pré-requisitos

- Node.js 24.
- npm.

Se utilizar nvm, execute `nvm use` na raiz do projeto para selecionar a versão indicada em `.nvmrc`.

## Como rodar

### 1. Instalar dependências

```sh
npm install
```

### 2. Iniciar o servidor

```sh
npm start
```

### 3. Acessar a aplicação

Abra [http://localhost:3000](http://localhost:3000). Use o menu superior para escolher um dos simuladores.

Se o `npm` não for encontrado, carregue o nvm com `. ~/.nvm/nvm.sh` em um terminal compatível.