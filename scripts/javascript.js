function calc() {
    // --- Início: Coleta das Informações do Cliente ---
    const revenda = $('input[name="revendaRadio"]:checked').val() || 'Não selecionada';
    const nbCliente = $('#nbCliente').val();
    const motivo = $('#motivoGV').val();
    const cofre = $('#cofreBoni').val();

    let cabecalhoResumo = `
        <h5><b>Informações do Pedido:</b></h5>
        <ul style="list-style-type: none; padding-left: 0;">
            <li><b>Revenda:</b> ${revenda}</li>
            <li><b>NB do Cliente:</b> ${nbCliente}</li>
            <li><b>Motivo:</b> ${motivo}</li>
            <li><b>Cofre:</b> ${cofre}</li>
        </ul>
        <hr>
        <h5><b>Produtos:</b></h5>
    `;
    // --- Fim: Coleta das Informações do Cliente ---

    let resumoProdutos = '<ul>';
    let totalItens = 0;

    // Itera sobre cada input de quantidade que seja maior que 0
    $('.input-text.qty').each(function() {
        var quantidade = parseInt($(this).val());
        if (quantidade > 0) {
            totalItens++;
            var card = $(this).closest('.card');
            var nomeProduto = card.data('product-name'); 
            var codigoProduto = card.data('product-code');
            resumoProdutos += `<li>${quantidade}x ${nomeProduto} (Cód: ${codigoProduto})</li>`;
        }
    });

    if (totalItens === 0) {
        resumoProdutos += "<li>Nenhum produto selecionado.</li>";
    }

    resumoProdutos += '</ul>';

    // Junta o cabeçalho com a lista de produtos e insere no Modal
    $('#output').html(cabecalhoResumo + resumoProdutos); 
}

$('#submit-to-google-sheet').on('submit', function(e) {
    e.preventDefault();
  
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxUPKXqwt1Fxq6T4OxbSpm-zQfYMLfmnGOVIThixjWbvw1AWBJHl0FUrQH2LCyko2_y/exec'; // Sua URL do App da Web
    const submitButton = $(this).find('button[type="submit"]');
  
    // 1. Montar o objeto de dados
    let submissionData = {
      clienteInfo: {},
      produtos: []
    };
  
    // Preenche as informações do cliente
    submissionData.clienteInfo.Revenda = $('input[name="revendaRadio"]:checked').val() || '';
    submissionData.clienteInfo.NBCliente = $('#nbCliente').val();
    submissionData.clienteInfo.Motivo = $('#motivoGV').val();
    submissionData.clienteInfo.Cofre = $('#cofreBoni').val();
    submissionData.clienteInfo.OutroMotivo = $('#outroMotivo').val();
    
    // Preenche a lista de produtos
    $('.input-text.qty').each(function() {
      let quantidade = parseInt($(this).val());
      if (quantidade > 0) {
        let card = $(this).closest('.card');
        submissionData.produtos.push({
          NomeSku: card.data('product-name'),
          CodSKU: card.data('product-code'),
          Quantidade: quantidade
        });
      }
    });
  
    // Validação: não envia se nenhum produto foi selecionado
    if (submissionData.produtos.length === 0) {
      alert('Por favor, selecione a quantidade de pelo menos um produto.');
      return; // Interrompe a submissão
    }
    
    // Fornece feedback visual para o usuário
    const originalButtonText = submitButton.text();
    submitButton.text('Enviando...').prop('disabled', true);
  
    // 2. Enviar o objeto como uma string JSON
    $.ajax({
      url: scriptURL,
      method: 'POST',
      contentType: 'application/json; charset=utf-8', // Informa ao servidor que estamos enviando JSON
      data: JSON.stringify(submissionData), // Converte o objeto JS para uma string JSON
      success: function(response) {
        alert('Bonificação enviada com sucesso!');
        window.location.reload();
      },
      error: function(err) {
        alert('Não foi possível enviar a bonificação. Tente novamente.');
        submitButton.text(originalButtonText).prop('disabled', false);
      }
    });
  });