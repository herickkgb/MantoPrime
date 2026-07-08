import {
  PARCELAMENTO_CAMISA,
  PRECO_CAMISA,
  PROMO_SEGUNDA_COMPLETA,
} from "../config/commercial.js";

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
    `Vi que a camisa está por ${PRECO_CAMISA} ${PARCELAMENTO_CAMISA}.`,
    PROMO_SEGUNDA_COMPLETA,
    "",
    "Pode me passar informações sobre camisas disponíveis, tamanhos e prazo de entrega?",
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
    `Preço informado no site: ${produto.preco || PRECO_CAMISA} ${PARCELAMENTO_CAMISA}`,
    "",
    PROMO_SEGUNDA_COMPLETA,
    "",
    "Também quero saber sobre disponibilidade, prazo de entrega e formas de pagamento.",
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
          `Preço informado no site: ${item.preco || PRECO_CAMISA} ${PARCELAMENTO_CAMISA}`,
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
    "Condições informadas no site:",
    `Camisa por ${PRECO_CAMISA} ${PARCELAMENTO_CAMISA}.`,
    PROMO_SEGUNDA_COMPLETA,
    "",
    "Pode me passar disponibilidade, prazo de entrega e formas de pagamento?",
  ].join("\n");
};
