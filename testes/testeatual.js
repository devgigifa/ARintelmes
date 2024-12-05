async function initAR() {
    const scene = document.querySelector("#a-scene");
    scene.style.display = "block"; 
    const components = ["cycletime", "operationcode", "quantity", "quantityprod", "scrapquantity", "goodquantity", "perf", "nextop", "rescode", "itemtool", "item", "status"];
    const qrCodeResponse = 'D0:EF:76:44:9F:87'; //endereço de MAC


    // D0:EF:76:45:6F:03

    if (qrCodeResponse) {
        try {
            const intelmountAPIResponse = await fetch(`https://intelmount.apps.intelbras.com.br/v1/resources/mount?mac=${qrCodeResponse}`);
            if (intelmountAPIResponse.ok) {
                const data = await intelmountAPIResponse.json();

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
                    // status: (data?.data[0]?.status),
                    // orders: data?.data?.[0]?.stopDetails?.[0]?.orders?.currents[0]?.production,
                    // stopDetails: data?.data?.[0]?.stopDetails?.[0]
                    // ? {
                    //     color: data.data[0].stopDetails[0].color,
                    //     name: data.data[0].stopDetails[0].name,
                    // } : null,
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
        // Estado: Produção
        console.log("Entrou em produção");

        document.getElementById("grandbox").setAttribute("color", "#00a335");
        document.getElementById("status").setAttribute("value", "PRODUCAO");
        document.getElementById("production-bar").setAttribute("color", "##246F3C");

        // if (orders === 'null') { //!orders não funciona aqui, testar se da forma atual funciona (não mudou produção por ora)
        //     document.getElementById("item").setAttribute("value", "sem item");
        //     const elementsToHide = [
        //         "cycletime", "operationcode", "quantity", "quantityprod",
        //         "scrapquantity", "perf", "goodquantity", "calcProdNum", 
        //         "tc", "op", "qtd", "qtdboa", "qtdprod", "ref", "itemtool", "nextop", 
        //     ];
        //     for (const id of elementsToHide) {
        //         const element = document.getElementById(id);
        //         if (element) element.setAttribute("visible", "false");
        //     }
        // }
        updateProductionStatus(machineDetails);
    }


    if (status === "STOP" ) {
        // Estado: Parado
        console.log("Entrou em parada");

        document.getElementById("grandbox").setAttribute("color", `#${stopDetails.color || '00a335'}`);        
        document.getElementById("status").setAttribute("value", "PARADO"); //pode ser "INICIO DE OP" OU "TROCA DE OP"
        document.getElementById("production-bar").setAttribute("color", "#50788a");
        document.getElementById("item").setAttribute("value", stopDetails.name);

        // if (orders === 'null') { // !orders ou stopDetails && orders.currents ou orders === 'null' ; entra, mas não sai
        //     // Parado sem ordem
        //     console.log('entrou em stop sem ordem')
        //     console.log(orders) // null
        //     console.log('orders:', orders, 'tipo:', typeof orders);


        //     const elementsToHide = [
        //         "cycletime", "operationcode", "quantity", "quantityprod",
        //         "scrapquantity", "perf", "goodquantity", "calcProdNum", 
        //         "tc", "op", "qtd", "qtdboa", "qtdprod", "ref", "itemtool", "nextop", "statusPercentage"
        //     ];
    
        //     document.getElementById("grandbox").setAttribute("color", `#${stopDetails.color || '00a335'}`);
        //     document.getElementById("status").setAttribute("value", "PARADO");
        //     document.getElementById("item").setAttribute("value", stopDetails.name);
        //     document.getElementById("production-bar").setAttribute("color", "#8f9ca4");
    
        //     for (const id of elementsToHide) {
        //         const element = document.getElementById(id);
        //         if (element) element.setAttribute("visible", "false");
        //     }
        // }
        if (stopDetails.color === "CBDEE8") {
            document.getElementById("grandbox").setAttribute("color", "#adb3b7")
        }
        updateProductionStatus(machineDetails);
    } 


    if (status === "INACTIVE") {
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
        updateProductionStatus(machineDetails);
    }


    // ver onde se encaixam durante testes
    if(statusPercentage >= 0 && statusPercentage <= 5){
        document.getElementById("grandbox").setAttribute("color", `#${stopDetails.color || '00a335'}`);        
        document.getElementById("status").setAttribute("value", "INICIO DE OP"); //pode ser "INICIO DE OP" OU "TROCA DE OP"
        document.getElementById("production-bar").setAttribute("color", "#50788a");
        // document.getElementById("item").setAttribute("value", stopDetails.name);
        updateProductionStatus(machineDetails);
    }

    if(statusPercentage > 95){
        document.getElementById("grandbox").setAttribute("color", `#${stopDetails.color || '00a335'}`);        
        document.getElementById("status").setAttribute("value", "TROCA DE OP"); //pode ser "INICIO DE OP" OU "TROCA DE OP"
        document.getElementById("production-bar").setAttribute("color", "#50788a");
        updateProductionStatus(machineDetails);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // const gaugesGroup = document.getElementById("gauges-group");
    // gaugesGroup.setAttribute("visible", "true"); 
    // initGauges();
    // updateProductionBar(value);
    initAR();
    updateMachineStatus()
});


// BARRA DE PRODUÇÃO ............................................................................................................

// Função que calcula a produção com base na quantidade e o valor total.
function calcStatusPercentage(machineDetails) {
    const { quantity, quantityprod, scrapquantity: refuge } = machineDetails;
    const total = quantityprod || 1; // Evitar divisão por zero

    // Cálculo
    if (!refuge) {
        return Math.max(0, Math.min(100, ((quantity / total) * 100).toFixed(2))); // Limita entre 0 e 100
    }
    return Math.max(0, Math.min(100, (((quantity - refuge) / total) * 100).toFixed(2))); // Limita entre 0 e 100
}


// Função para atualizar o elemento HTML
function updateStatusPercentage(machineDetails) {
    const statusPercentage = calcStatusPercentage(machineDetails);
    const element = document.getElementById("statusPercentage");

    if (element) {
        element.setAttribute("value", `${statusPercentage}%`);
    }
    return statusPercentage; // Retorna o valor para ser usado em outras funções, como a barra de produção
}

// Função que ajusta o tamanho da barra de produção com base no percentual
function updateProductionBar(value) {
    const barFill = document.getElementById("production-bar");

    if (barFill) {
        const fillScale = value / 100; // Proporção da barra em relação a 100%
        barFill.setAttribute("scale", `${fillScale * 1.3} 0.1 0.1`); // Ajusta o tamanho na escala X
        barFill.setAttribute("position", `${(fillScale * 1.3 / 2) - 0.65} 0 0`); // Reposiciona para manter a centralização
    }
}

// Função principal para sincronizar statusPercentage e a barra de produção
function updateProductionStatus(machineDetails) {
    const statusPercentage = updateStatusPercentage(machineDetails); // Atualiza o número
    updateProductionBar(statusPercentage); // Atualiza a barra com o mesmo valor
}

// .............................................................................................................................
