(() => {
  const cabecalho = document.querySelector('.cabecalho-home');
  // A altura pode mudar quando os links do menu ocupam mais de uma linha.
  const atualizarAltura = () => {
    const altura = Math.ceil(cabecalho.getBoundingClientRect().height);
    document.body.style.setProperty('--altura-cabecalho', `${altura}px`);
  };

  atualizarAltura();
  new ResizeObserver(atualizarAltura).observe(cabecalho);
})();
