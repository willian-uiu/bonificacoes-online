var prods = [
    { id: 1, name: "Skol 600", sku: 982 },
    { id: 2, name: "Brahma 600", sku: 988 },
    { id: 3, name: "Budweiser 600", sku: 2548 },
    { id: 4, name: "Original 600", sku: 2546 },
    { id: 5, name: "Spaten 600", sku: 23186 },
    { id: 6, name: "Stella", sku: 20530 },
];




function calc() {
    var quantities = document.getElementsByName("quantity");
    var output = document.getElementById("output");
    var total = 0;



    output.innerHTML = "";

    var formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    output.innerHTML = `<p>Cliente: ${document.getElementById('nbCliente').value}</p>
    <p>Revenda: ${document.querySelector('input[name=revendaRadio]:checked').value}</p>
    <p>Motivo: ${document.getElementById('motivoGV').value} </p>
    <p>Outro motivo: ${document.getElementById('outroMotivo').value} </p>
    <p>Cofre: ${document.getElementById('cofreBoni').value} </p>
    
    <h4>Bonificar produtos</h4>`;

    for (var input of quantities) {
        var id = input.id;

        if (input.value != 0) {
            output.innerHTML += `Produto: ${prods[id - 1].name} 
            | Sku: ${prods[id - 1].sku} 
            | Quantidade: ${input.value} </br>`;
            // total            += prods[id-1].sku * parseFloat(input.value);
        }


    }

    // output.innerHTML += `<h2>Total: ${formatter.format(total)}</h2>`;



}

