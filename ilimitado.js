
const campoBusca = document.getElementById("busca-aluno");
const sugestoes = document.getElementById("sugestoes");
const botaoPalpite = document.getElementById("btn-palpite");
const mensagem = document.getElementById("mensagem");
const tentativas = document.getElementById("tentativas");

const alunoSecreto = alunos[
    Math.floor(Math.random() * alunos.length)
];

console.log("Aluno secreto selecionado com sucesso!");

let alunoSelecionado = null;
let historicoPalpites = [];

function finalizarJogoComVitoria() {
    mensagem.textContent = "Boa, acertou! Dhr!";

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
}

campoBusca.addEventListener("input", () => {
    const pesquisa = campoBusca.value.trim().toLowerCase();

    alunoSelecionado = null;
    sugestoes.innerHTML = "";

    if (!pesquisa) return;

    const encontrados = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(pesquisa)
    );

    if (encontrados.length === 0) {
        sugestoes.textContent = "Nenhum aluno encontrado.";
        return;
    }

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

        opcao.append(foto, nome);

        opcao.addEventListener("click", () => {
            campoBusca.value = aluno.nome;
            alunoSelecionado = aluno;
            sugestoes.innerHTML = "";
        });

        sugestoes.appendChild(opcao);
    });
});

function comparar(valorPalpite, valorSecreto) {
    if (Array.isArray(valorPalpite) && Array.isArray(valorSecreto)) {
        const iguais = valorPalpite.filter(valor =>
            valorSecreto.includes(valor)
        );

        if (
            valorPalpite.length === valorSecreto.length &&
            iguais.length === valorSecreto.length
        ) {
            return "correto";
        }

        return iguais.length > 0 ? "parcial" : "errado";
    }

    return valorPalpite === valorSecreto ? "correto" : "errado";
}

function compararEscolas(valoresPalpite, valoresSecretos) {
    return comparar(valoresPalpite, valoresSecretos);
}

function criarCelula(texto, resultado) {
    const celula = document.createElement("div");
    celula.className = `celula ${resultado}`;
    celula.textContent = texto;
    return celula;
}

function executarLogicaVisualPalpite(palpite) {
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
        ["Música", palpite.musica, alunoSecreto.musica],
        ["Inteligência", palpite.inteligencia, alunoSecreto.inteligencia],
        ["Talento", palpite.talento, alunoSecreto.talento],
        ["Nível PCD", palpite.nivelPCD, alunoSecreto.nivelPCD],
        ["Habilidade esportiva", palpite.habEsporte, alunoSecreto.habEsporte]
    ];

    atributos.forEach(([nome, valorPalpite, valorSecreto]) => {
        const resultado = comparar(valorPalpite, valorSecreto);

        let texto = Array.isArray(valorPalpite)
            ? valorPalpite.join(" / ")
            : String(valorPalpite ?? "Não informado");

       const atributosNumericos = [
    "Idade",
    "Inteligência",
    "Nível PCD",
    "Habilidade esportiva"
];

if (atributosNumericos.includes(nome) && resultado === "errado") {
    const palpiteNumerico = Number(valorPalpite);
    const secretoNumerico = Number(valorSecreto);

    if (
        Number.isFinite(palpiteNumerico) &&
        Number.isFinite(secretoNumerico)
    ) {
        texto += palpiteNumerico < secretoNumerico ? " ↑" : " ↓";
    }
}
linha.appendChild(criarCelula(texto, resultado));
        

    tentativas.prepend(linha);
}

function registrarPalpite() {
    if (!alunoSelecionado) {
        mensagem.textContent = "Selecione um aluno nas sugestões primeiro!";
        return;
    }

    if (historicoPalpites.some(aluno => aluno.id === alunoSelecionado.id)) {
        mensagem.textContent = "Você já tentou esse aluno!";
        return;
    }

    const palpite = alunoSelecionado;
    historicoPalpites.push(palpite);

    executarLogicaVisualPalpite(palpite);

    if (palpite.id === alunoSecreto.id) {
        finalizarJogoComVitoria();
    } else {
        mensagem.textContent = "Esse não é o aluno secreto!";
    }

    campoBusca.value = "";
    sugestoes.innerHTML = "";
    alunoSelecionado = null;
}

botaoPalpite.addEventListener("click", registrarPalpite);
        
