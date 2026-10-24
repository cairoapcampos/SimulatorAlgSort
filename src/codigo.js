const fs = require('fs');
const path = require('path');

// Lê um arquivo Python da pasta SortAlgs e oferece ferramentas para localizar suas linhas.
function carregar(nomeArquivo) {
  const linhas = fs.readFileSync(path.join(__dirname, '..', 'SortAlgs', nomeArquivo), 'utf8').replace(/\s+$/, '').split('\n');

  // Número (1-based) da linha cujo texto, sem espaços nas pontas, é igual a `trecho`.
  const achar = (trecho, ocorrencia = 0) => {
    let vistas = 0;
    for (let k = 0; k < linhas.length; k++) {
      if (linhas[k].trim() === trecho && vistas++ === ocorrencia) return k + 1;
    }
    throw new Error(`${nomeArquivo}: linha "${trecho}" não encontrada`);
  };

  const indiceVetor = linhas.findIndex((l) => l.startsWith('A = ['));
  if (indiceVetor === -1) throw new Error(`${nomeArquivo}: linha "A = [...]" não encontrada`);

  return {
    linhas,
    achar,
    vetor: indiceVetor + 1,
    vetorPadrao: JSON.parse(linhas[indiceVetor].match(/^A = (\[.*\])\s*$/)[1]),
    // Código do arquivo mostrando o vetor realmente usado na simulação.
    comVetor: (vetor) => linhas.map((l, k) => (k === indiceVetor ? `A = [${vetor.join(', ')}]` : l)),
  };
}

module.exports = { carregar };
