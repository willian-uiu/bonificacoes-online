var prods = [
    { id: 1, name: "Bife com batata", price: 30.0 },
    { id: 2, name: "Coxa de frango Crocante", price: 25.0 },
    { id: 3, name: "Carne de panela", price: 22.0 },
    { id: 4, name: "Farofa", price: 10.0 },
    { id: 5, name: "Salada", price: 8.0 },
    { id: 6, name: "Torresmo", price: 12.0 },
];




function calc(){
    var quantities = document.getElementsByName("quantity");
    var output     = document.getElementById("output");
    var total      = 0;


    
    output.innerHTML = "";

    var formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    output.innerHTML = `<p>Caro(a), ${document.getElementById("nome").value}</p><p>Seguem os dados do seu pedido.</p <p>Seu pedido é:</p>`;

    for (var input of quantities) {
        var id = input.id;        
        
        if (input.value != 0) {
            output.innerHTML += `Produto: ${prods[id-1].name}  - Preço: ${formatter.format(prods[id-1].price)} - Quantidade: ${input.value} </br>`;
            total            += prods[id-1].price * parseFloat(input.value);
        }


    }

    output.innerHTML += `<h2>Total: ${formatter.format(total)}</h2>`;

    

}

