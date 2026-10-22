
const campoBusca = document.getElementById("busca-aluno");
const sugestoes = document.getElementById("sugestoes");
const botaoPalpite = document.getElementById("btn-palpite");
const mensagem = document.getElementById("mensagem");
const tentativas = document.getElementById("tentativas");

let alunoSelecionado = null;
let historicoPalpites = [];

let alunoSecreto = alunos[
    Math.floor(Math.random() * alunos.length)
];

console.log("Aluno secreto:", alunoSecreto.nome);

campoBusca.addEventListener("input", () => {
    const pesquisa = campoBusca.value.trim().toLowerCase();

    alunoSelecionado = null;
    sugestoes.innerHTML = "";

    if (!pesquisa) return;

    const encontrados = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(pesquisa)
    );

    encontrados.forEach(aluno => {
        const opcao = document.createElement("button");
    opcao.type = "button";
    opcao.className = "opcao-aluno";

    const foto = document.createElement("img");
    foto.src = aluno.foto;
    foto.alt = "";
    foto.className = "foto-sugestao";

    const nome = document.createElement("span");
    nome.textContent = aluno.nome;

    opcao.appendChild(foto);
    opcao.appendChild(nome);

    opcao.addEventListener("click", () => {
        campoBusca.value = aluno.nome;
        alunoSelecionado = aluno;
        sugestoes.innerHTML = "";
    });

    sugestoes.appendChild(opcao);
});

    if (encontrados.length === 0) {
        sugestoes.textContent = "Nenhum aluno encontrado.";
    }
});



function comparar(valorPalpite, valorSecreto) {
    if (Array.isArray(valorPalpite) && Array.isArray(valorSecreto)) {
        const iguais = valorPalpite.some(valor =>
            valorSecreto.includes(valor)
        );

        if (iguais && valorPalpite.length === valorSecreto.length &&
            valorPalpite.every(valor => valorSecreto.includes(valor))) {
            return "correto";
        }

        return iguais ? "parcial" : "errado";
    }

    return valorPalpite === valorSecreto ? "correto" : "errado";
}


function compararEscolas(escolasPalpite, escolasSecretas) {
    const iguais = escolasPalpite.filter(escola =>
        escolasSecretas.includes(escola)
    );

    if (
        escolasPalpite.length === escolasSecretas.length &&
        iguais.length === escolasSecretas.length
    ) {
        return "correto";
    }

    if (iguais.length > 0) {
        return "parcial";
    }

    return "errado";
}

function criarCelula(texto, resultado) {
    const celula = document.createElement("div");

    celula.className = `celula ${resultado}`;
    celula.textContent = texto;

    return celula;
}

function registrarPalpite() {
    if (!alunoSelecionado) {
        mensagem.textContent =
            "Selecione um aluno nas sugestões primeiro, n seja burro";
        return;
    }

    if (historicoPalpites.some(aluno => aluno.id === alunoSelecionado.id)) {
        mensagem.textContent = "já tentou esse aluno irm, q decepção";
        return;
    }

    const palpite = alunoSelecionado;

    historicoPalpites.push(palpite);

    const linha = document.createElement("div");
    linha.className = "linha-tentativa";

    linha.appendChild(criarCelula(palpite.nome, "nome"));

    const atributos = [
        ["Gênero", palpite.genero, alunoSecreto.genero],
        ["Escola", palpite.escolas, alunoSecreto.escolas],
        ["Curso", palpite.curso, alunoSecreto.curso],
        ["Idade", palpite.idade, alunoSecreto.idade],
        ["Time", palpite.time, alunoSecreto.time],
        ["Interesse amoroso", palpite.ia, alunoSecreto.ia],
        ["Música", palpite.musica, alunoSecreto.musica]
    ];

    
atributos.forEach(([nome, valorPalpite, valorSecreto]) => {
    let resultado;
    let texto;

    if (nome === "Escola" || nome === "Interesse amoroso") {
        resultado = compararEscolas(valorPalpite, valorSecreto);
        texto = valorPalpite.join(" / ");
    } else {
        resultado = comparar(valorPalpite, valorSecreto);
        texto = String(valorPalpite);

        if (nome === "Idade" && resultado === "errado") {
            texto += valorPalpite < valorSecreto
                ? " ↑"
                : " ↓";
        }
    }

    linha.appendChild(criarCelula(texto, resultado));
});

    tentativas.prepend(linha);

    if (palpite.id === alunoSecreto.id) {
        mensagem.textContent = "Boa, Acertou, dhr";

        const resultado = document.getElementById("resultado");
        const nomeAluno = document.getElementById("nome-aluno");
        const fotoAluno = document.getElementById("foto-aluno");

        if (resultado && nomeAluno && fotoAluno) {
            nomeAluno.textContent = alunoSecreto.nome;
            fotoAluno.src = alunoSecreto.foto;
            resultado.hidden = false;
        }

        botaoPalpite.disabled = true;
        campoBusca.disabled = true;
    } else {
        mensagem.textContent = "E esse nn lk";
    }

    campoBusca.value = "";
    sugestoes.innerHTML = "";
    alunoSelecionado = null;
}

botaoPalpite.addEventListener("click", registrarPalpite);
