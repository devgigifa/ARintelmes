
// status STOP with orders:          funciona 
// status STOP without orders:       funciona         
// status PRODUCTION:                funciona
// status INACTIVE:                  sem exemplo, mas configurado
// medidas tomadas para resolver, aguardando teste   

async function initAR() {
    const scene = document.querySelector("#a-scene");
    scene.style.display = "block"; 
    const components = ["cycletime", "operationcode", "quantity", "quantityprod", "scrapquantity", "goodquantity", "perf", "nextop", "rescode", "itemtool", "item", "status"];
    const qrCodeResponse = 'D0:EF:76:44:A8:A7'; //endereço de MAC

    if (qrCodeResponse) {
        try {
            const intelmountAPIResponse = await fetch(`https://intelmount.apps.intelbras.com.br/v1/resources/mount?mac=${qrCodeResponse}`);
            if (intelmountAPIResponse.ok) {
                const data = await intelmountAPIResponse.json();

                console.log("Resposta completa da API:", data);
                console.log("Valor do status vindo da API:", (data?.data[0]?.status));
                console.log("Status:", (data?.data[0]?.status));

                const status = (data?.data[0]?.status)

// RESOLVIDO; não entra em produção porque dá erro em stopDetails, por não existir no status produção. Rever lógica e ajustar. 
// erro no console: checkpoint.html:88 Failed to fetch data: TypeError: Cannot read properties of undefined (reading '0') at initAR (checkpoint.html:74:58)
                // Verificar se stopDetails existe
                const stopDetails = data?.data?.[0]?.stopDetails?.[0]
                ? {
                    color: data.data[0].stopDetails[0].color,
                    name: data.data[0].stopDetails[0].name,
                } : null;

                // Verificar se orders existe
                const orders = data?.data?.[0]?.stopDetails?.[0]?.orders?.currents[0]?.production;
                // const orders = data?.data?.[0]?.stopDetails?.[0]?.orders?.currents[0]?.production || null;
                // modificado para ver se funciona stop with orders

                const machineDetails = {
                    cycletime: (data?.data[0]?.orders?.currents[0]?.item?.factor),
                    operationcode: (data?.data[0]?.orders?.currents[0]?.operationId),
                    quantity: (data?.data[0]?.orders?.currents[0]?.production?.meta),
                    quantityprod: (data?.data[0]?.orders?.currents[0]?.production?.current),
                    scrapquantity: (data?.data[0]?.orders?.currents[0]?.production?.refuge),
                    goodquantity: ((data?.data[0]?.orders?.currents[0]?.production?.current) - (data?.data[0]?.orders?.currents[0]?.production?.refuge)),
                    perf: data?.data[0]?.orders?.currents[0]?.perf ? `perf: ${(data?.data[0]?.orders?.currents[0]?.perf).toFixed(2)}%` : "N/A",
                    // RESOLVIDO; perf não dá erro quando em status produção, dando erro quando entra em status stop: testeatual.js:70 Failed to fetch data: TypeError: Cannot read properties of undefined (reading 'toFixed') at initAR (testeatual.js:47:79)
                    nextop: `Proxima OP: ${"5607040-2"}`,
                    rescode: (data?.data?.[0].code),
                    itemtool: (data?.data[0]?.orders?.currents[0]?.item?.tool),
                    itemname: (data?.data[0]?.orders?.currents[0]?.item?.name),
                    item: `${(data?.data[0]?.orders?.currents[0]?.item?.code)} - ${(data?.data[0]?.orders?.currents[0]?.item?.name)}`,
                    status: (data?.data[0]?.status),
                }

                for (const component of components) {
                    const element = document.getElementById(component);
                    if (element) {
                        element.setAttribute("value", machineDetails[component]);
                    }
                }
                updateMachineStatus(status, orders, stopDetails, machineDetails);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    }
}

async function updateMachineStatus(status, orders, stopDetails, machineDetails) {
    console.log("Status recebido:", status);
    console.log("Detalhes da máquina recebidos:", machineDetails);

    if (status === "PRODUCTION") {
        // ok
        // Estado: Produção
        console.log("Entrou em produção");

        document.getElementById("grandbox").setAttribute("color", "#00a335");
        document.getElementById("status").setAttribute("value", "PRODUCAO");
        document.getElementById("production-bar").setAttribute("color", "#b4212c");
    } 



    else if (status === "STOP") {
        // Estado: Parado
        console.log("Entrou em parada");
        // console.log("Nome do stopDetails:", stopDetails.name);

        document.getElementById("grandbox").setAttribute("color", `#${stopDetails.color || '00a335'}`);        
        document.getElementById("status").setAttribute("value", "PARADO");
        document.getElementById("production-bar").setAttribute("color", "#50788a");
        document.getElementById("item").setAttribute("value", stopDetails.name);

        if (stopDetails.color === "CBDEE8") {
            // Parado sem ordem
            console.log('entrou em stop sem ordem')
            console.log(orders) // null

            const elementsToHide = [
                "cycletime", "operationcode", "quantity", "quantityprod",
                "scrapquantity", "perf", "goodquantity", "calcProdNum", 
                "tc", "op", "qtd", "qtdboa", "qtdprod", "ref", "itemtool", "nextop", 
            ];
    
            document.getElementById("grandbox").setAttribute("color", "#adb3b7");
            document.getElementById("status").setAttribute("value", "PARADO");
            document.getElementById("item").setAttribute("value", "FORA DE TURNO: MAQUINA DESLIGADA PLANEJADA");
            document.getElementById("production-bar").setAttribute("color", "#8f9ca4");
            // document.getElementById("status").setAttribute("color", "#003610");
    
            for (const id of elementsToHide) {
                const element = document.getElementById(id);
                if (element) element.setAttribute("visible", "false");
            }
        }
    }

        // não tava funcionando assim, não consegui resolver a lógica para que fosse reconhecido quando orders fosse null e quando não fosse e passar por esses casos, optando por referenciar orders null à cor única do mesmo
        // else if (!stopDetails || orders === null) {
        //     console.log('entrou em stop sem ordem')
        //     console.log(orders) // null

        //     // Parado sem ordem
        //     const elementsToHide = [
        //         "cycletime", "operationcode", "quantity", "quantityprod",
        //         "scrapquantity", "perf", "goodquantity", "calcProdNum", 
        //         "tc", "op", "qtd", "qtdboa", "qtdprod", "ref", "itemtool", "nextop", 
        //     ];
    
        //     document.getElementById("grandbox").setAttribute("color", "#adb3b7");
        //     document.getElementById("status").setAttribute("value", "FORA DE TURNO");
        //     document.getElementById("item").setAttribute("value", "MAQUINA DESLIGADA PLANEJADA");
        //     document.getElementById("production-bar").setAttribute("color", "#8f9ca4");
    
        //     for (const id of elementsToHide) {
        //         const element = document.getElementById(id);
        //         if (element) element.setAttribute("visible", "false");
        //     }
        // } 
    
    else if (status === "INACTIVE") {
        // Estado: Fora de Turno
        console.log("Entrou em inativo");

        const elementsToHide = [
            "cycletime", "operationcode", "quantity", "quantityprod",
            "scrapquantity", "perf", "goodquantity", "calcProdNum", 
            "tc", "op", "qtd", "qtdboa", "qtdprod", "ref"
        ];

        document.getElementById("grandbox").setAttribute("color", "#adb3b7");
        document.getElementById("status").setAttribute("value", "INATIVO");
        document.getElementById("item").setAttribute("value", "FORA DE TURNO: MAQUINA DESLIGADA PLANEJADA");
        document.getElementById("production-bar").setAttribute("color", "#8f9ca4");

        for (const id of elementsToHide) {
            const element = document.getElementById(id);
            if (element) element.setAttribute("visible", "false");
        }
    }
    if (stopDetails.color === "CBDEE8") {
        document.getElementById("grandbox").setAttribute("color", "#adb3b7");
    }
}


// BARRA DE PRODUÇÃO ............................................................................................................

// Função que calcula a produção com base na quantidade e o valor total.
// function calcProdNum() {
//     if (!refuge) {
//         const calc = (quantity / total) * 100;
//         return calc; // Calcula a porcentagem de produção.
//     }
//     const calc = ((quantity - refuge) / total) * 100;
//     return calc; // Calcula a produção considerando o refúgio.
// }


// // Funções que atualizam a barra de preenchimento para manter a escala correta
// function updateProductionBar(value) {
//     const barFill = document.getElementById("production-bar");

//     if (barFill) {
//         const fillScale = value / 100; 
//         barFill.setAttribute("scale", `${fillScale * 1.3} 0.1 0.1`); 
//         barFill.setAttribute("position", `${(fillScale * 1.3 / 2) - 0.65} 0 0`); 
//     }
// }

// function productionBar() {
//     // Calculando o valor da produção
//     let value = calcProdNum(); // Obtém o valor da produção.
    
//     // Caso o valor de produção seja superior a 100, é definido como 100 para não ultrapassar.
//     if (value > 100) {
//         value = 100;
//     }

//     updateProductionBar(value); // Atualiza a barra de produção com o valor calculado.
// }

// .............................................................................................................................




document.addEventListener('DOMContentLoaded', () => {
    const gaugesGroup = document.getElementById("gauges-group");
    gaugesGroup.setAttribute("visible", "true"); 
    initGauges();
    updateProductionBar(value);
    initAR(); 
});


// GAUGES ........................................................................................................

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
// .............................................................................................................................
