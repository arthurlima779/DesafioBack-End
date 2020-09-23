const Koa = require("koa");
const bodyparser = require("koa-bodyparser");

const server = new Koa();

server.use(bodyparser());

const produto = [
    {
        id: 1,
        nome: "Camiseta Vomit3d",
        quantidade: 15,
        valor: 6500,
        deletado: false
    }
];

//Funcionalidade dos Produtos

const criarProduto = (novoProduto) => {
    novoProduto = {
        id: novoProduto.id,
        nome: novoProduto.nome,
        quantidade: novoProduto.quantidade,
        valor: novoProduto.valor,
        deletado: false
    }
    produto.push(novoProduto);
    return novoProduto;
}

const obterProduto = (id) => {
    let encontrado = false
    for (i = 0; i < produto.length; i++) {
        if (produto[i].id == id) {
            encontrado = true
            return produto[i];
        }
    }
}

const obterProdutos = () => {
    return produto;
}

const atualizarProduto = (id, corpo) => {
    obterProduto(id);
    if (obterProduto(id)) {
        produto[i].id = corpo.id,
            produto[i].nome = corpo.nome,
            produto[i].quantidade = corpo.quantidade,
            produto[i].valor = corpo.valor,
            produto[i].deletado = false
        return obterProduto(id);
    } else {
        return null
    }
}

const deletarProduto = (id) => {
    obterProduto(id);
    produto[i].deletado = true
    return produto[i];
}

const pedido = [
    {
        id: 1,
        produtos: [],
        estado: "incompleto",
        idCliente: "arthur lima",
        deletado: false,
        valorTotal: 000
    }
];

//Funcionalidade dos Pedidos
//Criar Pedido
const criarPedido = (novoPedido) => {
    novoPedido = {
        id: novoPedido.id,
        produtos: [],
        estado: "incompleto",
        idCliente: novoPedido.idCliente,
        deletado: false,
        valorTotal: 000
    }
    pedido.push(novoPedido);
    return novoPedido;
}
//Listar todos os Pedidos
const obterPedidos = () => {
    return pedido;
}
//Adicionar produtos no carrinho
const obterPedido = (id) => {
    for (i = 0; i < pedido.length; i++) {
        if (pedido[i].id == id) {
            return {
                indice: i,
                pedido: pedido[i]
            }
        }
    }
}


const adicionarProdutosNoPedido = (id, prod) => {
    let manolo = obterPedido(id);
    //Obter um produto(id)
    const estoque = produto[prod.id-1];
    if(estoque){
        //Verificar quantidade
        if(estoque.quantidade>0 && estoque.quantidade>prod.quantidade){
            const pedidoAtual = pedido[manolo.indice];
         
            if(pedidoAtual){
            const produtoExiste = pedidoAtual.produtos.filter((pdt) => pdt.id === prod.id).length>0;
            if(produtoExiste==true){
                for(i=0;i<pedidoAtual.produtos.length;i++){
                    if(pedidoAtual.produtos[i].id===prod.id){
                        //console.log(indiceProduto);
                        pedidoAtual.produtos.splice(i, 1, {
                            id: estoque.id,
                            nome: estoque.nome,
                            quantidade: pedidoAtual.produtos[i].quantidade+prod.quantidade,
                            valor: estoque.valor
                        });
                    }
                }
                estoque.quantidade=estoque.quantidade-prod.quantidade;
            }else{
                pedidoAtual.produtos.push({
                    id: estoque.id,
                    nome: estoque.nome,
                    quantidade: prod.quantidade,
                    valor: estoque.valor
                });
                estoque.quantidade=estoque.quantidade-prod.quantidade;
            }
            //Atualizar Valor do Carrinho
                let Valor_Total = 0;
                for(i=0;i<pedidoAtual.produtos.length;i++){
                    let valorAtualizado = (pedidoAtual.produtos[i].valor*pedidoAtual.produtos[i].quantidade);
                    Valor_Total+=valorAtualizado;
                }
                pedidoAtual.valorTotal=Valor_Total;
        }
        }else{
        return("Quantidade de produto maior que estoque.");
            }
        
    }


}

//Atualizar Status do pedido
const atualizarStatus = (id, prod) => {
    let status = obterPedido(id);
    if(status){
        if(status.pedido.produtos.length > 0){
        pedido[i].estado = prod.estado;
    }else{
        return("O seu carrinho está vazio");
    }
    
}
}

//Filtrar pelo status do pedido
const listarStatus = (prod) =>{
    for(i=0;i<pedido.length;i++){
        if(pedido[i].estado == prod.estado){
            return(pedido[i]);
        }else{
            return ("Estado de pedido inexistente");
        }
    }
}



//Miolo

server.use((ctx) => {
    let path = ctx.url;
    if (path === "/products") {
        if (ctx.method === "POST") {
            ctx.status = 200;
            ctx.body = criarProduto(ctx.request.body);
        } else if (ctx.method === "GET") {
            ctx.status = 200;
            ctx.body = obterProdutos();
        }
    } else if (path.includes("/products/")) {
        const caminho = path.split("/");
        const corpo = ctx.request.body;
        if (caminho[1] === "products") {
            const id = caminho[2];
            if (id) {
                if (ctx.method === "GET") {
                    ctx.body = obterProduto(id);
                } else if (ctx.method === "DELETE") {
                    ctx.body = deletarProduto(id);
                } else if (ctx.method === "PUT") {
                    if (deletado == true) {
                        ctx.status = 400;
                        ctx.body = "Um produto deletado não pode ser atualizado."
                    } else {
                        ctx.body = atualizarProduto(id, corpo);
                    }
                    if (ctx.body == null) {
                        ctx.status = 404;
                        ctx.body = "Produto não encontrado, informe ID corretamente";
                    }
                } else {
                    ctx.status = 404;
                    ctx.body = "Produto não encontrado, informe uma ID";
                }
            }
        }
    }
    let atalho = ctx.url;
    let prod = ctx.request.body;
    if (atalho === "/orders") {
        if (ctx.method === "POST") {
            ctx.status = 200;
            ctx.body = criarPedido(ctx.request.body);
        } else if (ctx.method === "GET") {      
            if(ctx.body = obterPedidos()){
                ctx.status = 200;
                ctx.body = obterPedidos();
            }else{
                ctx.status = 404;
                ctx.body = "Sem pedidos até o momento.";
            } 
            
        } else if (ctx.method === "GET"){
            if (ctx.body = listarStatus(prod)){
                ctx.status=200;
                return(pedido[i]);
            }else{
                ctx.status=404;
                return ("Estado de pedido inexistente");
            }
        }
    } else if (atalho.includes("/orders/")) {
        const trilha = path.split("/");
        const prod = ctx.request.body;
        if (trilha[1] === "orders") {
            const id = trilha[2];
            if (id) {
                if (ctx.method === "GET") {
                    ctx.status = 200;
                    ctx.body = adicionarProdutosNoPedido(id, prod);
                    ctx.body = atualizarStatus(id, prod);
                }
            }
        }
    }

});


server.listen(8081, () => console.log("Está funfando nobre gafanhoto"));