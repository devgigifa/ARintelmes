
// status STOP:                funcionando só se tiver stopDetails
// status PRODUCTION:          funcionando só se não tiver stopDetails
// status INACTIVE:            






async function initAR() {
    const scene = document.querySelector("#a-scene");
    scene.style.display = "block"; 
    const components = ["cycletime", "operationcode", "quantity", "quantityprod", "scrapquantity", "goodquantity", "perf", "nextop", "rescode", "itemtool", "item", "status"];
    const qrCodeResponse = 'D0:EF:76:45:ED:DF'; //endereço de MAC

    if (qrCodeResponse) {
        try {
            const intelmountAPIResponse = await fetch(`https://intelmount.apps.intelbras.com.br/v1/resources/mount?mac=${qrCodeResponse}`);
            if (intelmountAPIResponse.ok) {
                const data = await intelmountAPIResponse.json();


                console.log("Resposta completa da API:", data);
                console.log("Valor do status vindo da API:", (data?.data[0]?.status));
                console.log("Status:", (data?.data[0]?.status));
                

                const status = (data?.data[0]?.status)

                const machineDetails = {
                    cycletime: (data?.data[0]?.orders?.currents[0]?.item?.factor),
                    operationcode: (data?.data[0]?.orders?.currents[0]?.operationId),
                    quantity: (data?.data[0]?.orders?.currents[0]?.production?.meta),
                    quantityprod: (data?.data[0]?.orders?.currents[0]?.production?.current),
                    scrapquantity: (data?.data[0]?.orders?.currents[0]?.production?.refuge),
                    goodquantity: ((data?.data[0]?.orders?.currents[0]?.production?.current) - (data?.data[0]?.orders?.currents[0]?.production?.refuge)),
                    perf: `perf: ${(data?.data[0]?.orders?.currents[0]?.perf).toFixed(2)}%`,
                    nextop: `Proxima OP: ${"5607040-2"}`,
                    rescode: (data?.data?.[0].code),
                    itemtool: (data?.data[0]?.orders?.currents[0]?.item?.tool),
                    itemname: (data?.data[0]?.orders?.currents[0]?.item?.name),
                    item: `${(data?.data[0]?.orders?.currents[0]?.item?.code)} - ${(data?.data[0]?.orders?.currents[0]?.item?.name)}`,
                    status: (data?.data[0]?.status),
                    // stopDetails: {
                    //     color: data?.data[0]?.stopDetails[0]?.color,
                    //     name: data?.data[0]?.stopDetails[0]?.name
                    // }                
                }

                for (const component of components) {
                    const element = document.getElementById(component);
                    if (element) {
                        element.setAttribute("value", machineDetails[component]);
                    }
                }
                updateMachineStatus(status, machineDetails);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    }
}

async function updateMachineStatus(status, machineDetails) {            



    console.log("Status recebido:", status);
    console.log("Detalhes da máquina recebidos:", machineDetails); 



    if (status === "PRODUCTION") {
        console.log("entrou em produção")
        // Estado de Produção
        document.getElementById("grandbox").setAttribute("color", "#00a335");
        document.getElementById("status").setAttribute("value", "PRODUCAO");
        document.getElementById("production-bar").setAttribute("color", "#b4212c")


    } else if (status === "STOP") {
        // Estado Parada com ordem
        console.log("Nome do stopDetails:", machineDetails.stopDetails.name);

        document.getElementById("grandbox").setAttribute("color",  `#${machineDetails.stopDetails.color}`)
        // por condição para cor igual === '#CBDEE8' muda a cor da fonte para #003610
        
        document.getElementById("status").setAttribute("value", "PARADO COM ORDEM");
        document.getElementById("production-bar").setAttribute("color", "#50788a")
        document.getElementById("item").setAttribute("value", machineDetails.stopDetails.name)

    } else if (status === "INACTIVE") {
        // Estado Fora de Turno
        const elementsToHide = ["cycletime", "operationcode", "quantity", "quantityprod", "scrapquantity", "perf", "goodquantity", "calcProdNum", "tc", "op", "qtd", "qtdboa", 'qtdprod', 'ref'];
        
        document.getElementById("grandbox").setAttribute("color", "#adb3b7");
        document.getElementById("status").setAttribute("value", "PARADO");
        document.getElementById("item").setAttribute("value", "FORA DE TURNO MAQUINA DESLIGADA PLANEJADA");
        
        let productionValue = 100; 
        document.getElementById("production-bar").setAttribute("color", "#8f9ca4")

        for (const id of elementsToHide) {
            document.getElementById(id).setAttribute("visible", "false");
        }
        // document.getElementById("rescode").setAttribute("visible", "true");
    }
}


// BARRA DE PRODUÇÃO

// Função que calcula a produção com base na quantidade e o valor total.
function calcProdNum() {
    if (!refuge) {
        const calc = (quantity / total) * 100;
        return calc; // Calcula a porcentagem de produção.
    }
    const calc = ((quantity - refuge) / total) * 100;
    return calc; // Calcula a produção considerando o refúgio.
}


// Funções que atualizam a barra de preenchimento para manter a escala correta
function updateProductionBar(value) {
    const barFill = document.getElementById("production-bar");

    if (barFill) {
        const fillScale = value / 100; 
        barFill.setAttribute("scale", `${fillScale * 1.3} 0.1 0.1`); 
        barFill.setAttribute("position", `${(fillScale * 1.3 / 2) - 0.65} 0 0`); 
    }
}

function productionBar() {
    // Calculando o valor da produção
    let productionValue = calcProdNum(); // Obtém o valor da produção.
    
    // Caso o valor de produção seja superior a 100, é definido como 100 para não ultrapassar.
    if (productionValue > 100) {
        productionValue = 100;
    }

    updateProductionBar(productionValue); // Atualiza a barra de produção com o valor calculado.
}





document.addEventListener('DOMContentLoaded', () => {
const gaugesGroup = document.getElementById("gauges-group");
gaugesGroup.setAttribute("visible", "true"); 
initGauges();
updateProductionBar(productionValue);
initAR(); 
});


// FUNCTION GAUGES

// Função para gerar um valor aleatório entre dois números
function getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
}

// Atualiza os gauges gradualmente
function simulateGaugeChange(textId, ringId, currentValue) {
    const newValue = getRandomValue(0, 100);
    let step = (newValue - currentValue) / 100;

    const interval = setInterval(() => {
        if (Math.abs(newValue - currentValue) < Math.abs(step)) {
            currentValue = newValue;
            clearInterval(interval);
        } else {
            currentValue += step;
        }
        updateGauge(currentValue, textId, ringId);
    }, 100); // Atualiza a cada 50ms para uma transição suave
}

// Inicializa os gauges
function initGauges() {
    let OEEValue = 100, DispValue = 100, PerfValue = 100, QualValue = 100;

    setInterval(() => {
        simulateGaugeChange('text-OEE', 'ring-OEE', OEEValue);
        simulateGaugeChange('text-Disponibilidade', 'ring-Disponibilidade', DispValue);
        simulateGaugeChange('text-Performance', 'ring-Performance', PerfValue);
        simulateGaugeChange('text-Qualidade', 'ring-Qualidade', QualValue);
    }, 10000);
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
        console.warn("Element not found:", textId, ringId);
    }
}

