const express = require('express');
const path = require('path');
const { ALGORITMOS } = require('./src/algoritmos');
const { TABELAS_HOME, prepararVetor } = require('./src/tabelas-home');

const app = express();
const PORT = process.env.PORT || 3000;
const MODOS = ['padrao', 'aleatorio', 'digitar'];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.simuladores = Object.entries(ALGORITMOS).map(([id, cfg]) => ({ id, ...cfg }));

app.get('/', (req, res) => {
  res.render('home', {
    algoritmo: 'home',
    titulo: 'Algoritmos de Ordenação',
    tabelas: TABELAS_HOME,
    prepararVetor,
  });
});

function lerArray(texto, numero, max) {
  if (typeof texto !== 'string' || !texto) return null;
  const itens = texto.split(/[\s,;]+/).filter(Boolean);
  if (itens.length < 2 || itens.length > max || !itens.every((x) => numero.test(x))) return null;
  const valores = itens.map(Number);
  return valores.every((v) => v > 0) ? valores : null;
}

// Lê o vetor pedido na URL conforme o modo e devolve também o que o formulário deve exibir.
function lerEntrada(req, cfg) {
  const max = cfg.max;
  const modo = MODOS.includes(req.query.modo) ? req.query.modo : 'padrao';
  const textoArray = typeof req.query.array === 'string' ? req.query.array : '';
  const array = modo === 'padrao' ? cfg.padrao : lerArray(req.query.array, cfg.numero, max);
  const usado = array || cfg.padrao;
  return {
    usado,
    formulario: {
      acao: cfg.rota,
      titulo: cfg.titulo,
      vmin: cfg.vmin,
      vmax: cfg.vmax,
      padrao: cfg.padrao,
      valorCampo: array ? usado.join(', ') : textoArray.slice(0, 200),
      erro: array ? null : `Informe de 2 a ${max} ${cfg.descricaoValores} separados por vírgula.`,
      max,
      modo,
      tamanho: modo === 'aleatorio' ? usado.length : 8,
    },
  };
}

Object.entries(ALGORITMOS).forEach(([algoritmo, cfg]) => {
  app.get(cfg.rota, (req, res) => {
    const { usado, formulario } = lerEntrada(req, cfg);
    const dados = JSON.stringify(cfg.gerar(usado)).replace(/</g, '\\u003c');
    res.render(algoritmo, { algoritmo, nome: cfg.nome, complexidade: cfg.complexidade, ...formulario, dados });
  });
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Simulador em http://localhost:${PORT}`));
}
