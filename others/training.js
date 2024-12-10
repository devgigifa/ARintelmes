
// Desafios: Lógica de programação: praticando com desafios

// Resolução dos desafios 2: Projeto AluGames
// Os desafios não obrigatórios a seguir objetivam a prática dos conceitos trabalhados nesta aula. Os desafios 1 e 2 estão diretamente relacionados ao projeto Alugames e os demais foram pensados para reforçar o conteúdo de Lógica.

// Desafio 1: implemente uma confirmação de devolução.
// Adicione uma confirmação ao devolver um jogo, solicitando ao usuário que confirme a devolução antes que ela seja concluída. Isso pode ajudar a evitar devoluções acidentais.

function alterarStatus(id) {
    let gameClicado = document.getElementById(`game-${id}`);
    let imagem = gameClicado.querySelector('.dashboard__item__img');
    let botao = gameClicado.querySelector('.dashboard__item__button');
    let nomeJogo = gameClicado.querySelector('.dashboard__item__name');

    if (imagem.classList.contains('dashboard__item__img--rented')) {
        // Adiciona uma confirmação antes de devolver o jogo
        if (confirm(`Você tem certeza que deseja devolver o jogo ${nomeJogo.textContent}?`)) {
            imagem.classList.remove('dashboard__item__img--rented');
            botao.classList.remove('dashboard__item__button--return');
            botao.textContent = 'Alugar';
        }
    } else {
        imagem.classList.add('dashboard__item__img--rented');
        botao.classList.add('dashboard__item__button--return');
        botao.textContent = 'Devolver';
    }
}


// Desafio 2:  crie uma função para imprimir no console a informação sobre quantos jogos foram alugados.
// Para imprimir na tela a informação sobre quantos jogos foram alugados, você pode modificar a função alterarStatus() para contar os jogos alugados e exibir essa informação no console. Aqui está um exemplo de como você pode fazer isso:

let jogosAlugados = 0;

function contarEExibirJogosAlugados() {
    console.log(`Total de jogos alugados: ${jogosAlugados}`);
}

function alterarStatus(id) {
    let gameClicado = document.getElementById(`game-${id}`);
    let imagem = gameClicado.querySelector('.dashboard__item__img');
    let botao = gameClicado.querySelector('.dashboard__item__button');
    let nomeJogo = gameClicado.querySelector('.dashboard__item__name');

    if (imagem.classList.contains('dashboard__item__img--rented')) {
        imagem.classList.remove('dashboard__item__img--rented');
        botao.classList.remove('dashboard__item__button--return');
        botao.textContent = 'Alugar';
        jogosAlugados--;
    } else {
        imagem.classList.add('dashboard__item__img--rented');
        botao.classList.add('dashboard__item__button--return');
        botao.textContent = 'Devolver';
        jogosAlugados++;
    }
    contarEExibirJogosAlugados();
}


// Inicializa a contagem considerando que os jogos já começam alugados
document.addEventListener('DOMContentLoaded', function() {
    jogosAlugados = document.querySelectorAll('.dashboard__item__img--rented').length;
    contarEExibirJogosAlugados();
});

// Este exemplo adiciona um evento DOMContentLoaded que é acionado quando a página é carregada. Nesse momento, ele conta a quantidade inicial de jogos alugados. Certifique-se de ajustar o código conforme necessário para se adequar ao seu projeto.


// Desafio 3: Crie um programa que verifica se uma palavra ou frase é um palíndromo.
// Função que verifica se uma palavra é um palíndromo

function verificarPalindromo(frase) {
    // Remove todos os espaços e converte a string para minúsculas
    const fraseLimpa = frase.replace(/\s+/g, '').toLowerCase();
    
    // Verifica se a frase limpa é igual ao seu reverso
    const fraseReversa = fraseLimpa.split('').reverse().join('');
    
    return fraseLimpa === fraseReversa;
}

const palavra = "A man a plan a canal Panama";
if (verificarPalindromo(palavra)) {
    console.log(`'${palavra}' é um palíndromo!`);
} else {
    console.log(`'${palavra}' não é um palíndromo.`);
}


// Desafio 4: Crie um programa com uma função que receba três números como argumentos e os retorne em ordem crescente. Exiba os números ordenados.

function ordenarNumeros(a, b, c) {
    const numerosOrdenados = [a, b, c].sort((x, y) => x - y);
    console.log(`Números ordenados: ${numerosOrdenados.join(', ')}`);
}
ordenarNumeros(3, 1, 5); // Deve exibir "Números ordenados: 1, 3, 5"



// Desafio 5: Validação de Entrada
// Adicione validações no código para garantir que o usuário só consiga adicionar produtos ao carrinho se tiver selecionado um produto válido e inserido uma quantidade válida. Se a entrada não for válida, exiba uma mensagem de erro apropriada.

let totalGeral;
limpar();

function adicionar() {
    let produto = document.getElementById('produto').value;
    let quantidade = document.getElementById('quantidade').value;
    // Verificar se o produto selecionado é válido
    if (!produto || produto.trim() === "") {
        alert("Selecione um produto válido.");
        return;
    }
    // Verificar se a quantidade inserida é válida
    if (isNaN(quantidade) || quantidade <= 0) {
        alert("Insira uma quantidade válida.");
        return;
    }

    let nomeProduto = produto.split('-')[0];
    let valorUnitario = parseFloat(produto.split('R$')[1]);
    let preco = quantidade * valorUnitario;
    let carrinho = document.getElementById('lista-produtos');
    carrinho.innerHTML = carrinho.innerHTML + `<section class="carrinho__produtos__produto">
    <span class="texto-azul">${quantidade}x</span> ${nomeProduto} <span class="texto-azul">R${preco}</span>
  </section>`;
    totalGeral = totalGeral + preco;
    let campoTotal = document.getElementById('valor-total');
    campoTotal.textContent = `R$ ${totalGeral}`;
    document.getElementById('quantidade').value = 0;
}

function limpar() {
    totalGeral = 0;
    document.getElementById('lista-produtos').innerHTML = '';
    document.getElementById('valor-total').textContent = 'R$0';
}


// Desafio 2: Captura de Valores do Formulário
// Crie um formulário simples com campos de entrada e utilize JavaScript para recuperar os valores digitados nos campos usando a propriedade value. Exiba os valores no console e na tela.

// Código em html:
// <html>
// <body>
// <form id="meuForm">
//     <label for="campoNome">Nome:</label>
//     <input type="text" id="campoNome" name="nome">
   
//     <label for="campoIdade">Idade:</label>
//     <input type="text" id="campoIdade" name="idade">


//     <button type="button" onclick="capturarValores()">Capturar Valores</button>
 
//   <div id='mostraNome'><span>Seu nome e idade irão aparecer aqui.</span></div>
// </form>


// <script src="script.js"></script>
// </body>
// </html>


// Código em Javascript:
// function capturarValores() {
//     const nome = document.getElementById('campoNome').value;
//     const idade = document.getElementById('campoIdade').value;


//  document.getElementById('mostraNome').textContent = `Nome: ${nome}, Idade: ${idade}`;
//     console.log(`Nome: ${nome}, Idade: ${idade}`);
// }


// Desafio 3: Modificação de Código HTML
// Tenha um elemento HTML na página (por exemplo, um parágrafo) e utilize JavaScript para modificar seu conteúdo usando a propriedade textContent.

// Código em html:
// <html>
//     <body>
// <p id="meuParagrafo">Texto original</p>
// <button onclick="modificarConteudo()">Modificar Conteúdo</button>


// <script src="script.js"></script>
//   </body>
// </html>

// Código em Javascript:
// function modificarConteudo() {
//     const paragrafo = document.getElementById('meuParagrafo');
//     paragrafo.textContent = 'Novo texto modificado dinamicamente!';
// }


// Desafio 4: Soma de dois números
// Faça a soma de duas variáveis numéricas e apresente no console com uma mensagem amigável em Template String.

const numero1 = 10;
const numero2 = 20;
const soma = numero1 + numero2;
const mensagem = `A soma de ${numero1} e ${numero2} é ${soma}.`;

console.log(mensagem);


// Desafio 5: Separar duas sentenças com ponto e vírgula
// Receba, no mínimo, duas sentenças como uma string e utilize split() para quebrá-la em frases menores com base em um ponto e vírgula como delimitador.

const duasSentencas = "Criar o que não existe ainda deve ser a pretensão de todo sujeito que está vivo; A tarefa mais importante de uma pessoa que vem ao mundo é criar algo"
const frasesSeparadas = duasSentencas.split(';');

console.log(frasesSeparadas);


// Desafio 6: Separar número com split()
// Receba uma string contendo números separados por vírgulas. Utilize split() para separar os números e exibi-los no console.

const numerosSeparados = "10,20,30,40,50";
const arrayNumeros = numerosSeparados.split(',');
console.log(arrayNumeros);


// Desafio 1: Validar entrada de quantidade
// Adicione uma verificação para garantir que a quantidade inserida pelo usuário seja um número positivo. Se o valor não for válido, exiba uma mensagem de erro adequada.

function comprar() {
    let tipo = document.getElementById('tipo-ingresso');
    let qtdInput = document.getElementById('qtd');
    let qtd = parseInt(qtdInput.value);
    // Verificar se a quantidade é um número positivo
    if (isNaN(qtd) || qtd <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }
    if (tipo.value == 'pista') {
        comprarPista(qtd);
    } else if (tipo.value == 'superior') {
        comprarSuperior(qtd);
    } else {
        comprarInferior(qtd);
    }
}

function comprarPista(qtd) {
    let qtdPista = parseInt(document.getElementById('qtd-pista').textContent);
    if (qtd > qtdPista) {
        alert('Quantidade indisponível para tipo pista');
    } else {
        qtdPista = qtdPista - qtd;
        document.getElementById('qtd-pista').textContent = qtdPista;
        alert('Compra realizada com sucesso!');
    }
}

function comprarSuperior(qtd) {
    let qtdSuperior = parseInt(document.getElementById('qtd-superior').textContent);
    if (qtd > qtdSuperior) {
        alert('Quantidade indisponível para tipo superior');
    } else {
        qtdSuperior = qtdSuperior - qtd;
        document.getElementById('qtd-superior').textContent = qtdSuperior;
        alert('Compra realizada com sucesso!');
    }
}

function comprarInferior(qtd) {
    let qtdInferior = parseInt(document.getElementById('qtd-inferior').textContent);
    if (qtd > qtdInferior) {
        alert('Quantidade indisponível para tipo inferior');
    } else {
        qtdInferior = qtdInferior - qtd;
        document.getElementById('qtd-inferior').textContent = qtdInferior;
        alert('Compra realizada com sucesso!');
    }
}


// Desafio 2: Conversão de String para Inteiro com uma função
// Crie uma função que aceite uma string como parâmetro, utilize a função parseInt para converter essa string em um número inteiro e retorne o resultado.

function converterParaInteiro(valorString) {
    return parseInt(valorString);
}
// Exemplo de uso
let valorString = "42";
let valorInteiro = converterParaInteiro(valorString);
console.log(valorInteiro);  // Saída esperada: 42


// Desafio 3: Calculadora
// Escreva um programa de calculadora simples com funções separadas para adição, subtração, multiplicação e divisão. Utilize um bloco condicional para determinar qual função executar com base em uma variável que representa a operação desejada.

function adicao(a, b) {
    return a + b;
}

function subtracao(a, b) {
    return a - b;
}

function multiplicacao(a, b) {
    return a * b;
}

function divisao(a, b) {
    if (b !== 0) {
        return a / b;
    } else {
        return "Erro: divisão por zero.";
    }
}

function calculadora(operacao, a, b) {
    switch (operacao) {
        case 'soma':
            return adicao(a, b);
        case 'subtracao':
            return subtracao(a, b);
        case 'multiplicacao':
            return multiplicacao(a, b);
        case 'divisao':
            return divisao(a, b);
        default:
            return "Operação inválida.";
    }
}
// Exemplo de uso
let resultado = calculadora('soma', 5, 3);
console.log(resultado);  // Saída esperada: 8


// Desafio 4: Verificação de Números Pares e Ímpares
// Implemente uma função que aceite um número como parâmetro e utilize um bloco condicional para determinar se o número é par ou ímpar.

function verificarParOuImpar(numero) {
    if (numero % 2 === 0) {
        return "Par";
    } else {
        return "Ímpar";
    }
}
// Exemplo de uso
let numero = 7;
let resultadoParOuImpar = verificarParOuImpar(numero);
console.log(resultadoParOuImpar);  // Saída esperada: Ímpar


// Desafio 5: Conversão de Temperatura
// Crie uma função que converta a temperatura de Celsius para Fahrenheit e vice-versa. Utilize uma variável para indicar a escala desejada e um bloco condicional para determinar qual conversão realizar.

function converterTemperatura(valor, escala) {
    if (escala.toLowerCase() === 'celsius') {
        return (valor * 9/5) + 32;  // Celsius para Fahrenheit
    } else if (escala.toLowerCase() === 'fahrenheit') {
        return (valor - 32) * 5/9;  // Fahrenheit para Celsius
    } else {
        return "Escala inválida";
    }
}
// Exemplo de uso
let temperaturaCelsius = 25;
let temperaturaFahrenheit = converterTemperatura(temperaturaCelsius, 'celsius');
console.log(temperaturaFahrenheit);  // Saída esperada: 77


// Desafio 1: Adicionar Opção de Excluir Amigos da Lista
// Criar uma funcionalidade no Projeto Amigo Secreto que permita ao usuário clicar em um amigo na lista e removê-lo. Atualizar a visualização da lista após a remoção.

let amigos = [];

function adicionar() {
    let amigo = document.getElementById('nome-amigo');
    let lista = document.getElementById('lista-amigos');

    amigos.push(amigo.value);

    if (lista.textContent == '') {
        lista.textContent = amigo.value;
    } else {
        lista.textContent = lista.textContent + ', ' + amigo.value;
    }
    amigo.value = '';

    atualizarLista();
    atualizarSorteio();
}

function sortear() {
    embaralhar(amigos);

    let sorteio = document.getElementById('lista-sorteio');
    for (let i = 0; i < amigos.length; i++) {
        if (i == amigos.length - 1) {
            sorteio.innerHTML = sorteio.innerHTML + amigos[i] +' --> ' +amigos[0] + '<br/>';
        } else {
            sorteio.innerHTML = sorteio.innerHTML + amigos[i] +' --> ' +amigos[i + 1] + '<br/>';
        }
    }
}

function excluirAmigo(index) {
    amigos.splice(index, 1);
    atualizarLista();
    atualizarSorteio();
}

function embaralhar(lista) {
    for (let indice = lista.length; indice; indice--) {
        const indiceAleatorio = Math.floor(Math.random() * indice);
        [lista[indice - 1], lista[indiceAleatorio]] = [lista[indiceAleatorio], lista[indice - 1]];
    }
}

function atualizarSorteio() {
    let sorteio = document.getElementById('lista-sorteio');
    sorteio.innerHTML = '';
}

function atualizarLista() {
    let lista = document.getElementById('lista-amigos');
    lista.innerHTML = '';

    for (let i = 0; i < amigos.length; i++) {
        // Cria um elemento de parágrafo para cada amigo
        let paragrafo = document.createElement('p');
        paragrafo.textContent = amigos[i];
        // Adiciona um evento de clique para excluir o amigo
        paragrafo.addEventListener('click', function() {
            excluirAmigo(i);
        });
        // Adiciona o parágrafo à lista
        lista.appendChild(paragrafo);
    }
}

function reiniciar() {
    amigos = [];
    document.getElementById('lista-amigos').innerHTML = '';
    document.getElementById('lista-sorteio').innerHTML = '';
}


// Desafio 2: Manipulando Arrays
// Adicione os números 1,2,3 em uma variável chamada minhaLista e armazene os números 4, 5 e 6 separadamente em outra variável. Use o método concat() para combinar as sequências de valores em uma nova lista chamadanovaLista. Imprima novaLista no console.

// Declarando uma variável do tipo array
let minhaLista = [];
// Adicionando elementos com push
minhaLista.push(1, 2, 3);
console.log("Adicionando elementos:", minhaLista);
// Criando uma nova variável
let outrosNumeros = [4, 5, 6];
// Concatenando arrays
let novaLista = minhaLista.concat(outrosNumeros);
console.log("Juntando Arrays:", novaLista);


// Desafio 3: Removendo elementos com pop
// Remova o último elemento de novaLista. Imprima novaLista após a remoção.

// Removendo o último elemento
novaLista.pop();
console.log("Desafio 4:", novaLista);


// Desafio 4: Embaralhando elementos em um array Incremente com as informações a partir do Desafio 2
// Utilize o algoritmo de Fisher-Yates (também conhecido como Knuth Shuffle) para embaralhar os elementos em novaLista. Pesquise e adapte o código para realizar o embaralhamento.

function embaralharArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Embaralhando novaLista
  novaLista = embaralharArray(novaLista);
  console.log("Embaralhando a Lista:", novaLista);

// O algoritmo de Fisher-Yates, também conhecido como o algoritmo de embaralhamento de Knuth ou o algoritmo de shuffle de Durstenfeld, é um algoritmo para gerar uma permutação aleatória de um conjunto finito. Ele foi projetado para embaralhar um array ou lista de forma eficiente e uniformemente aleatória.
// O algoritmo opera trocando elementos dentro do array. A ideia básica é percorrer o array da direita para a esquerda e, para cada elemento, trocá-lo aleatoriamente com um elemento anterior a ele (incluindo ele mesmo). Esse processo é repetido até que todo o array esteja embaralhado.

// Leia mais sobre o Algoritmo em Como embaralhar arrays com o algoritmo Fisher–Yates

// Desafio 5: Removendo duplicatas
// Crie uma função chamada removerDuplicatas que aceita um array como parâmetro e retorna um novo array sem elementos duplicados. Teste a função com novaLista e imprima o array resultante.

// Função para remover duplicatas de um array
function removerDuplicatas(array) {
    return [...new Set(array)];
  }
 
  // Testando a função com novaLista
  let novaListaSemDuplicatas = removerDuplicatas(novaLista);
  console.log("Remover duplicatas:", novaListaSemDuplicatas);


// Desafio 1: Crie uma função que valide se um número é positivo, negativo ou zero.

function validarNumero(numero) {
    if (numero > 0) {
        return "Positivo";
    } else if (numero < 0) {
        return "Negativo";
    } else {
        return "Zero";
    }
}
console.log(validarNumero(-1))


// Desafio 2: Implemente uma função que verifique se uma pessoa é maior de idade.

function verificarIdade(idade) {
    return idade >= 18 ? "Maior de idade" : "Menor de idade";
}

console.log(verificarIdade(18))


// Desafio 3: Desenvolva uma função que valide se uma string é vazia ou não.

function validarString(texto) {
    return texto === "" ? "String vazia" : "String não vazia";
}
console.log(validarString("Aqui há um texto?"))
console.log(validarString(""))

// Espaços são entendidos como caracteres, você pode inserir uma melhoria no código para validar a utilização de espaços.


// Desafio 4: Crie uma função que determine se um ano é bissexto.

function verificarAnoBissexto(ano) {
    if ((ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0) {
        return "Ano bissexto";
    } else {
        return "Não é bissexto";
    }
}
console.log(verificarAnoBissexto(2025))


// Desafio 5. Implemente uma função que calcule a média de dois números, interrompendo a: execução se algum dos números não for válido.

function calcularMedia(num1, num2) {
    if (isNaN(num1) || isNaN(num2)) {
        return "Um dos números não é válido.";
    }
    return (num1 + num2) / 2;
}
console.log(calcularMedia(8,5))


// Desafio 6. Desenvolva uma função que receba um array como parâmetro e retorne o seu tamanho.

function obterTamanhoArray(arr) {
    return arr.length;
}
//exemplo de uso
const myList = [1,2,3,4,5,6,7,8,9,10]

console.log(obterTamanhoArray(myList))


// Desafio 7: Crie um array e utilize a função includes para verificar se um elemento específico está presente

const meuArray = [10, 20, 30, 40, 50];
console.log("O array contém o número 30?", meuArray.includes(30));
//saída esperada: "O array contém o número 30?" true


// Desafio 8: Implemente uma função que receba um array e um elemento, e retorne se o elemento está presente no array.

// Função que verifica se um elemento está presente no array
function verificarElementoNoArray(arr, elemento) {
    return arr.includes(elemento);
}
// Exemplo de uso
const Array = [10, 20, 30, 40, 50];
const elementoProcurado = 30;
// Utilizando a função para verificar a presença do elemento no array
const elementoEstaPresente = verificarElementoNoArray(Array, elementoProcurado);
// Exibindo o resultado
if (elementoEstaPresente) {
    console.log(`O elemento ${elementoProcurado} está presente no array.`);
} else {
    console.log(`O elemento ${elementoProcurado} não está presente no array.`);
}


// Desafio 9: Crie um array de strings e utilize includes para verificar se uma determinada string está presente.

const palavras = ["apple", "banana", "orange", "grape"];
console.log("A palavra 'banana' está no array?", palavras.includes("banana"));
//saída esperada: "A palavra 'banana' está no array?" true


// Desafio 10: Desenvolva uma função que receba um array de objetos representando estudantes de um curso e um objeto que representa um estudante procurado. Depois retorne se o objeto está presente no array.

// Função que verifica se um objeto está presente no array
function verificarObjetoNoArray(arr, objeto) {
    return arr.some(item => JSON.stringify(item) === JSON.stringify(objeto));
}
// Array de objetos representando alunos
const alunos = [
    { id: 1, nome: 'João', idade: 20 },
    { id: 2, nome: 'Maria', idade: 22 },
    { id: 3, nome: 'Pedro', idade: 21 },
    { id: 4, nome: 'Ana', idade: 19 }
];
// Objeto que queremos verificar se está presente no array
const alunoProcurado = { id: 2, nome: 'Maria', idade: 22 };
// Utilizando a função para verificar a presença do objeto no array
const objetoEstaPresente = verificarObjetoNoArray(alunos, alunoProcurado);
// Exibindo o resultado
if (objetoEstaPresente) {
    console.log('O aluno está presente no array.');
} else {
    console.log('O aluno não está presente no array.');
}


// Desafio 11: Crie uma função que receba um array de números e retorne a soma dos elementos pares e o produto dos elementos ímpares.

function calcularSomaProduto(array) {
    let somaPares = 0;
    let produtoImpares = 1;

    for (let numero of array) {
        if (numero % 2 === 0) {
            somaPares += numero;
        } else {
            produtoImpares *= numero;
        }
    }
    return {
        somaPares,
        produtoImpares
    };
}

const numeros = [1, 2, 3, 4, 5];
const result = calcularSomaProduto(numeros);
console.log("Soma dos pares:", result.somaPares);
console.log("Produto dos ímpares:", result.produtoImpares);
