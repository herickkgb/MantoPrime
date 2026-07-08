export const WHATSAPP_NUMERO = "5531995309630";

const criarLinkWhatsApp = (mensagem) =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;

export const abrirWhatsApp = (mensagem) => {
  window.open(criarLinkWhatsApp(mensagem), "_blank", "noopener,noreferrer");
};

export const criarMensagemContato = () =>
  [
    "Olá! Quero falar com a BH-Mantos.",
    "",
    "Pode me passar informações sobre camisas disponíveis, tamanhos, valores e prazo de entrega?",
  ].join("\n");

export const criarMensagemProduto = (produto, tamanho, quantidade = 1) =>
  [
    "Olá! Tenho interesse nesta camisa da BH-Mantos:",
    "",
    `Camisa: ${produto.nome}`,
    `Time: ${produto.time}`,
    `Categoria: ${produto.categoria}`,
    `Modelo: ${produto.tipo}`,
    `Tamanho: ${tamanho}`,
    `Quantidade: ${quantidade}`,
    "",
    "Também quero saber sobre o brinde surpresa, valores, disponibilidade e prazo de entrega.",
  ].join("\n");

export const criarMensagemPedido = (itens, observacao = "") => {
  const listaItens = itens
    .map(
      (item, index) =>
        [
          `${index + 1}. Camisa: ${item.nome}`,
          `Time: ${item.time}`,
          `Categoria: ${item.categoria}`,
          `Modelo: ${item.tipo}`,
          `Tamanho: ${item.tamanho}`,
          `Quantidade: ${item.quantidade}`,
        ].join("\n"),
    )
    .join("\n\n");

  return [
    "Olá! Quero fazer um pedido na BH-Mantos.",
    "",
    "Itens do pedido:",
    "",
    listaItens,
    "",
    "Observação do cliente:",
    observacao.trim() || "Sem observação.",
    "",
    "Brinde:",
    "Tenho direito ao brinde surpresa na compra de uma camisa.",
    "",
    "Pode me passar valores, disponibilidade, prazo de entrega e formas de pagamento?",
  ].join("\n");
};
