// Função auxiliar para formatar a data e hora no padrão brasileiro
function formatarDataHora(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês começa do 0
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  const segundos = String(data.getSeconds()).padStart(2, '0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}

// Função central para obter todos os dados do formulário
function getPedidoData() {
  let pedidoData = {
      clienteInfo: {},
      produtos: []
  };

  pedidoData.clienteInfo.Timestamp = formatarDataHora(new Date());
  pedidoData.clienteInfo.Revenda = $('input[name="revendaRadio"]:checked').val() || '';
  pedidoData.clienteInfo.NBCliente = $('#nbCliente').val();
  pedidoData.clienteInfo.Motivo = $('#motivoGV').val();
  pedidoData.clienteInfo.Cofre = $('#cofreBoni').val();

  if (pedidoData.clienteInfo.Motivo === 'Outros') {
      pedidoData.clienteInfo.OutroMotivo = $('#outroMotivo').val();
  } else {
      pedidoData.clienteInfo.OutroMotivo = '';
  }

  $('.input-text.qty').each(function () {
      const quantidade = parseInt($(this).val());
      if (quantidade > 0) {
          const card = $(this).closest('.card');
          pedidoData.produtos.push({
              NomeSku: card.data('product-name'),
              CodSKU: card.data('product-code'),
              Quantidade: quantidade
          });
      }
  });

  return pedidoData;
}

// Função para popular o modal de confirmação
function calc() {
  const pedido = getPedidoData();
  let outroMotivoDisplay = '';
  if (pedido.clienteInfo.Motivo === 'Outros' && pedido.clienteInfo.OutroMotivo) {
      outroMotivoDisplay = ` (${pedido.clienteInfo.OutroMotivo})`;
  }
  let cabecalhoResumo = `<h5><b>Informações do Pedido:</b></h5><ul style="list-style-type: none; padding-left: 0;"><li><b>Revenda:</b> ${pedido.clienteInfo.Revenda}</li><li><b>NB do Cliente:</b> ${pedido.clienteInfo.NBCliente}</li><li><b>Motivo:</b> ${pedido.clienteInfo.Motivo}${outroMotivoDisplay}</li><li><b>Cofre:</b> ${pedido.clienteInfo.Cofre}</li></ul><hr><h5><b>Produtos:</b></h5>`;
  let resumoProdutos = '<ul>';
  if (pedido.produtos.length === 0) {
      resumoProdutos += "<li>Nenhum produto selecionado.</li>";
  } else {
      pedido.produtos.forEach(produto => {
          resumoProdutos += `<li>${produto.Quantidade}x ${produto.NomeSku} (Cód: ${produto.CodSKU})</li>`;
      });
  }
  resumoProdutos += '</ul>';
  $('#output').html(cabecalhoResumo + resumoProdutos);
}

// --- NOVA FUNÇÃO WHATSAPP ---
// Função para montar e enviar a notificação para o WhatsApp
function enviarMensagemWhatsApp(pedido) {
  // IMPORTANTE: Substitua o número abaixo pelo seu número de WhatsApp.
  // Formato: Código do País (55 para Brasil) + DDD + Número. Sem o '+' ou espaços.
  const meuNumeroWhatsapp = '5583998614676'; // <-- MUDE AQUI

  const info = pedido.clienteInfo;
  const produtos = pedido.produtos;

  let mensagemFormatada = `
*Nova Bonificação Recebida!* 📝

*Cliente:*
- *Revenda:* ${info.Revenda}
- *NB:* ${info.NBCliente}
- *Motivo:* ${info.Motivo} ${info.Motivo === 'Outros' ? `(${info.OutroMotivo})` : ''}
- *Cofre:* ${info.Cofre}

*Produtos Bonificados:*
`;
  produtos.forEach(produto => {
      mensagemFormatada += `- ${produto.Quantidade}x ${produto.NomeSku} (Cód: ${produto.CodSKU})\n`;
  });
  mensagemFormatada += `\n*Registrado em:* ${info.Timestamp}`;

  const mensagemCodificada = encodeURIComponent(mensagemFormatada.trim());
  const urlWhatsapp = `https://wa.me/${meuNumeroWhatsapp}?text=${mensagemCodificada}`;
  window.open(urlWhatsapp, '_blank');
}

// Handler para o envio do formulário
$('#submit-to-google-sheet').on('submit', function (e) {
  e.preventDefault();
  const submissionData = getPedidoData();
  const info = submissionData.clienteInfo;
  if (!info.Revenda || !info.NBCliente || !info.Motivo || !info.Cofre || (info.Motivo === 'Outros' && !info.OutroMotivo)) {
      alert('Por favor, preencha todas as informações do cliente.');
      return;
  }
  if (submissionData.produtos.length === 0) {
      alert('Por favor, selecione a quantidade de pelo menos um produto.');
      return;
  }

  // Chama a função do WhatsApp
  enviarMensagemWhatsApp(submissionData);

  // Continua com o envio para o Google Sheets
  const scriptURL = 'SUA_URL_DO_APPS_SCRIPT_AQUI';
  const submitButton = $(this).find('button[type="submit"]');
  const originalButtonText = submitButton.text();
  submitButton.text('Enviando...').prop('disabled', true);

  /*
  $.ajax({
      url: scriptURL,
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(submissionData),
      success: function (response) {
          alert('Bonificação enviada com sucesso para a planilha!');
          window.location.reload();
      },
      error: function (err) {
          alert('Não foi possível enviar a bonificação para a planilha. Tente novamente.');
          submitButton.text(originalButtonText).prop('disabled', false);
      }
  });
  */
});



// Lógica para mostrar/esconder o campo "Outro Motivo"
$(document).ready(function() {
  const outroMotivoContainer = $('#outroMotivo').closest('.col-md');
  outroMotivoContainer.hide();
  $('#motivoGV').on('change', function () {
      if (this.value === 'Outros') {
          outroMotivoContainer.show();
          $('#outroMotivo').prop('required', true);
      } else {
          outroMotivoContainer.hide();
          $('#outroMotivo').prop('required', false).val('');
      }
  });
});