const shell = require('./shell');
const radix = require('./radix');
const heap = require('./heap');

const MAX_ELEMENTOS = 16;

const ALGORITMOS = {
  shell: {
    nome: 'Shell Sort',
    rota: '/shell',
    descricao: 'Acompanhe as inserções em sublistas e a redução dos intervalos até ordenar o vetor.',
    modulo: shell,
    maxDigitos: 3,
    vmax: 99,
    complexidade: {
      melhor: 'O(n log n)',
      medio: 'Dependente da entrada',
      notaMedia: 1,
      notaNaTabela: true,
      pior: 'O(n²)',
      espaco: 'O(1)',
      estavel: 'Não',
      notaHtml: 'Para o Shell Sort, a complexidade temporal depende da sequência de intervalos utilizada. O melhor e o pior caso apresentados consideram a sequência original de Shell. Não é apresentada uma expressão assintótica específica para o caso médio, pois sua análise depende também das características e da distribuição dos dados de entrada.',
    },
  },
  heap: {
    nome: 'Heap Sort',
    rota: '/heap',
    descricao: 'Veja a construção do heap máximo e a extração dos elementos na árvore binária.',
    modulo: heap,
    maxDigitos: 3,
    vmax: 99,
    complexidade: {
      melhor: 'O(n log n)',
      medio: 'O(n log n)',
      pior: 'O(n log n)',
      espaco: 'O(log n)',
      estavel: 'Não',
      notaHtml: 'O espaço O(log n) vem da pilha de recursão do <code>heapify</code>.',
    },
  },
  radix: {
    nome: 'Radix Sort (LSD)',
    rota: '/radix',
    descricao: 'Explore a ordenação dígito a dígito com os vetores de contagem e de saída.',
    modulo: radix,
    maxDigitos: 5,
    vmax: 999,
    complexidade: {
      melhor: 'O(d(n+b))',
      medio: 'O(d(n+b))',
      pior: 'O(d(n+b))',
      espaco: 'O(n+b)',
      estavel: 'Sim',
    },
  },
};

Object.entries(ALGORITMOS).forEach(([id, cfg]) => {
  cfg.titulo = `Simulador da Implementação Padrão do ${id === 'radix' ? 'Radix Sort' : cfg.nome}`;
  cfg.padrao = cfg.modulo.vetorPadrao;
  cfg.gerar = cfg.modulo.gerarPassos;
  cfg.max = MAX_ELEMENTOS;
  cfg.limiteValor = 10 ** cfg.maxDigitos - 1;
  cfg.numero = new RegExp(`^\\d{1,${cfg.maxDigitos}}$`);
  cfg.descricaoValores = `números inteiros positivos (de 1 a ${cfg.limiteValor})`;
  cfg.vmin = 1;
  delete cfg.modulo;
});

module.exports = { ALGORITMOS };
