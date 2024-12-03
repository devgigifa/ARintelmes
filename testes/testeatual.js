async function initAR() {
    const scene = document.querySelector("#a-scene");
    scene.style.display = "block"; 
    const components = ["cycletime", "operationcode", "quantity", "quantityprod", "scrapquantity", "goodquantity", "perf", "nextop", "rescode", "itemtool", "item", "status"];
    const qrCodeResponse = 'D0:EF:76:44:C8:87'; //endereço de MAC

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
        document.getElementById("production-bar").setAttribute("color", "#b4212c");

        // if (!orders) {
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
    }


    if (status === "STOP" ) {
        // Estado: Parado
        console.log("Entrou em parada");

        document.getElementById("grandbox").setAttribute("color", `#${stopDetails.color || '00a335'}`);        
        document.getElementById("status").setAttribute("value", "PARADO"); //pode ser "INICIO DE OP" OU "TROCA DE OP"
        document.getElementById("production-bar").setAttribute("color", "#50788a");
        document.getElementById("item").setAttribute("value", stopDetails.name);

        if (stopDetails.color === "CBDEE8") { // !orders ou stopDetails && orders === null ; entra aqui, mas talvez não esteja entrando quando tem ordem
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
        if (stopDetails.color === "CBDEE8") {
            document.getElementById("grandbox").setAttribute("color", "#adb3b7")
        } 
    } 


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
}

document.addEventListener('DOMContentLoaded', () => {
    // const gaugesGroup = document.getElementById("gauges-group");
    // gaugesGroup.setAttribute("visible", "true"); 
    // initGauges();
    // updateProductionBar(value);
    initAR();
    updateMachineStatus()
});