function initAR() {
    const scene = document.querySelector("#a-scene");
    scene.style.display = "block"; 
}

AFRAME.registerComponent("maintenance-cursor", {
    init: function () {
        const el = this.el;
        const factText = document.getElementById("fact-text");
        let fact = "";

        fetch("https://cors-anywhere.herokuapp.com/http://numbersapi.com/random/trivia")
            .then((response) => response.text())
            .then((data) => {
                fact = data;
            })
            .catch((error) => alert("Erro ao conectar à API:", error));

        el.addEventListener("click", function () {
            factText.setAttribute("value", fact);
        });
    },
});

AFRAME.registerComponent("status-cursor", {
    init: function () {
        document.addEventListener('DOMContentLoaded', () => {
            const gaugesGroup = document.getElementById("gauges-group");
            gaugesGroup.setAttribute("visible", "false"); // Esconde os gauges no início
            initializeGauges(); // Inicializa os gauges
            simulateProductionBarChange();

            // Adiciona o evento de clique para o botão de Status
            const statusButton = document.getElementById("status-button");
            statusButton.addEventListener("click", function () {
                console.log("Botão clicado!");
                const isVisible = gaugesGroup.getAttribute("visible") === "true";
                gaugesGroup.setAttribute("visible", !isVisible);
                console.log("Gauges visibility:", !isVisible);
            });
        });
    },
});


// FUNCTION GAUGES

        // Função para gerar um valor aleatório entre dois números
        function getRandomValue(min, max) {
            return Math.random() * (max - min) + min;
        }

        // Atualiza os gauges gradualmente
        function simulateGaugeChange(textId, ringId, currentValue) {
            const newValue = getRandomValue(0, 100); // Gera um novo valor aleatório
            let step = (newValue - currentValue) / 100; // Define o passo de mudança gradual

            const interval = setInterval(() => {
                if (Math.abs(newValue - currentValue) < Math.abs(step)) {
                    currentValue = newValue; // Finaliza o valor
                    clearInterval(interval);
                } else {
                    currentValue += step; // Atualiza gradualmente
                }
                updateGauge(currentValue, textId, ringId);
            }, 50); // Atualiza a cada 50ms para uma transição suave
        }

        // Inicializa os gauges
        function initializeGauges() {
            let OEEValue = 100, DispValue = 100, PerfValue = 100, QualValue = 100;

            setInterval(() => {
                simulateGaugeChange('text-OEE', 'ring-OEE', OEEValue);
                simulateGaugeChange('text-Disponibilidade', 'ring-Disponibilidade', DispValue);
                simulateGaugeChange('text-Performance', 'ring-Performance', PerfValue);
                simulateGaugeChange('text-Qualidade', 'ring-Qualidade', QualValue);
            }, 5000); // A cada 5 segundos, simula uma nova atualização de todos os gauges
        }

        // Atualiza os gauges
        function updateGauge(value, textId, ringId) {
            const textEntity = document.getElementById(textId);
            const ringEntity = document.getElementById(ringId);

            if (textEntity && ringEntity) {
                textEntity.setAttribute('value', textId.split('-')[1] + ': ' + Math.round(value) + '%');

                const greenValue = Math.floor((value / 100) * 255);
                const redValue = 255 - greenValue;
                const color = `rgb(${redValue}, ${greenValue}, 0)`;
                ringEntity.setAttribute('color', color);

                const thetaLength = (value / 100) * 360;
                ringEntity.setAttribute('theta-length', thetaLength);
            } else {
                alert("Element not found:", textId, ringId);
            }
        }

// Funções que atualizam a barra de preenchimento para manter a escala correta
function updateProductionBar(value) {
    const barFill = document.getElementById("production-bar-fill");

    if (barFill) {
        // Atualiza a escala da barra de preenchimento
        const fillScale = value / 100; // Ajusta a escala conforme o valor
        barFill.setAttribute("scale", `${fillScale * 1.3} 0.1 0.1`); // Escala ajustada para o comprimento total
        // Atualiza a posição da barra de preenchimento para que fique corretamente alinhada
        barFill.setAttribute("position", `${(fillScale * 1.3 / 2) - 0.65} 0 0`); // Posiciona à frente do início
    }
}

// Função de simular porcentagem similar a dos gauges
function simulateProductionBarChange() {
    let productionValue = 0;
    let step = 1; // Incremento para o preenchimento

    const interval = setInterval(() => {
        if (productionValue >= 100) {
            productionValue = 0; // Reinicia a barra após chegar a 100%
        } else {
            productionValue += step; // Atualiza gradualmente
        }
        updateProductionBar(productionValue);
    }, 100); // Atualiza a cada 100ms
}




// testando endpoint dos números

// HORAS

AFRAME.registerComponent("random-hours", {
init: function () {
const hoursNum = document.getElementById("hours");

fetch("https://www.random.org/integers/?num=1&min=0&max=150&col=1&base=10&format=plain&rnd=new")
    .then((response) => response.text())
    .then((data) => {
        const hours = data.trim(); // Remove espaços em branco
        const hoursConcat = `${hours} h`; // Adiciona "h" ao valor
        hoursNum.setAttribute("value", hoursConcat); // Define o valor com "h"
    })
    .catch((error) => alert("Erro ao conectar à API:", error));
},
});


// DEU CERTOOOOOO
// STATUS MAQUINA
AFRAME.registerComponent("random-progress", {
    init: function () {
        const statusNum = document.getElementById("statusNum");

        fetch("https://www.random.org/integers/?num=1&min=0&max=100&col=1&base=10&format=plain&rnd=new")
            .then((response) => response.text())
            .then((data) => {
                const progress = data.trim(); // Remove espaços em branco
                const progressConcat = `${progress} %`; // Adiciona "%" ao valor
                statusNum.setAttribute("value", progressConcat); // Define o valor com "%"
            })
            .catch((error) => alert("Erro ao conectar à API:", error));
    },
});



// TC
AFRAME.registerComponent("random-tc", {
init: function () {
const tcElement = document.getElementById("tcNum");

fetch("https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new")
    .then((response) => response.text())
    .then((data) => {
        const tcValue = data.trim(); // Remove espaços em branco
        tcElement.setAttribute("value", tcValue); // Define o valor diretamente
    })
    .catch((error) => alert("Erro ao conectar à API:", error));
},
});

// OP
AFRAME.registerComponent("random-op", {
init: function () {
const opElement = document.getElementById("opNum");

fetch("https://www.random.org/integers/?num=1&min=0&max=9999999&col=1&base=10&format=plain&rnd=new")
    .then((response) => response.text())
    .then((data) => {
        const opValue = data.trim(); // Remove espaços em branco
        opElement.setAttribute("value", opValue); // Define o valor diretamente
    })
    .catch((error) => alert("Erro ao conectar à API:", error));
},
});

// Quantidade de Números
AFRAME.registerComponent("random-quantidade", {
init: function () {
const quantidadeElement = document.getElementById("qtdNum");

fetch("https://www.random.org/integers/?num=1&min=0&max=10000&col=1&base=10&format=plain&rnd=new")
    .then((response) => response.text())
    .then((data) => {
        const quantidadeValue = data.trim(); // Remove espaços em branco
        quantidadeElement.setAttribute("value", quantidadeValue); // Define o valor diretamente
    })
    .catch((error) => alert("Erro ao conectar à API:", error));
},
});

// Quantidade de Produtos
AFRAME.registerComponent("random-qtdprod", {
init: function () {
const quantidadeProdElement = document.getElementById("qtdProdNum");

fetch("https://www.random.org/integers/?num=1&min=0&max=1000&col=1&base=10&format=plain&rnd=new")
    .then((response) => response.text())
    .then((data) => {
        const quantidadeProdValue = data.trim(); // Remove espaços em branco
        quantidadeProdElement.setAttribute("value", quantidadeProdValue); // Define o valor diretamente
    })
    .catch((error) => alert("Erro ao conectar à API:", error));
},
});

// Refugo
AFRAME.registerComponent("random-refugo", {
init: function () {
const refugoElement = document.getElementById("refugoNum");

fetch("https://www.random.org/integers/?num=1&min=0&max=1000&col=1&base=10&format=plain&rnd=new")
    .then((response) => response.text())
    .then((data) => {
        const refugoValue = data.trim(); // Remove espaços em branco
        refugoElement.setAttribute("value", refugoValue); // Define o valor diretamente
    })
    .catch((error) => alert("Erro ao conectar à API:", error));
},
});

// Quantidade Boa
AFRAME.registerComponent("random-qtdboa", {
init: function () {
const quantidadeBoaElement = document.getElementById("qtdBoaNum");

fetch("https://www.random.org/integers/?num=1&min=0&max=1000&col=1&base=10&format=plain&rnd=new")
    .then((response) => response.text())
    .then((data) => {
        const quantidadeBoaValue = data.trim(); // Remove espaços em branco
        quantidadeBoaElement.setAttribute("value", quantidadeBoaValue); // Define o valor diretamente
    })
    .catch((error) => alert("Erro ao conectar à API:", error));
},
});

// Perf
AFRAME.registerComponent("random-perf", {
init: function () {
const perfElement = document.getElementById("perf");

fetch("https://www.random.org/integers/?num=1&min=0&max=100&col=1&base=10&format=plain&rnd=new")
    .then((response) => response.text())
    .then((data) => {
        const perfValue = parseFloat(data.trim()); // Converte para número
        const formPerfValue = perfValue.toFixed(2); // Formata para duas casas decimais
        const perfConcat = `Perf ${formPerfValue}%`; // Adiciona "Perf" e "%"
        perfElement.setAttribute("value", perfConcat); // Define o valor formatado
    })
    .catch((error) => alert("Erro ao conectar à API:", error));
},
});


// statusMaq - retorna se está em produção, parada, manutenção
/*
AFRAME.registerComponent("random-maq", {
init: function () {
const wordText = document.getElementById("statusMaq");

fetch("https://random-word-api.herokuapp.com/word?number=1")
    .then((response) => response.json()) // Altere para .json()
    .then((data) => {
        const word = data[0]; // A palavra está no primeiro índice
        wordText.setAttribute("value", word); // Define o valor
    })
    .catch((error) => alert("Erro ao conectar à API:", error));
},
});
*/

AFRAME.registerComponent("random-proxop", {
    init: function () {
        const proxOp = document.getElementById("proxOp");

        fetch("https://www.random.org/integers/?num=1&min=0&max=999999&col=1&base=10&format=plain&rnd=new")
            .then((response) => response.text())
            .then((data) => {
                const proxOpValue = data.trim(); 
                const proxOpConcat = `Proxima OP: ${proxOpValue}`; 
                proxOp.setAttribute("value", proxOpConcat);
            })
            .catch((error) => alert("Erro ao conectar à API:", error));
    },
});
