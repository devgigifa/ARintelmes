// Lista de endereços MAC
const macAddresses = [
    { mac: 'D0:EF:76:46:76:BB', name: 'INSCN-02' },
    { mac: 'D0:EF:76:46:79:9B', name: 'INSSF-07' },
    { mac: 'D0:EF:76:46:80:8F', name: 'INSSF-10' },
    { mac: 'D0:EF:76:44:87:5F', name: 'INSSE-15' },
    { mac: 'D0:EF:76:44:88:EB', name: 'INSSE-13' },
    { mac: 'D0:EF:76:44:93:E7', name: 'INSCN-01' },
    { mac: 'D0:EF:76:44:94:D3', name: 'INSSE-10' },
    { mac: 'D0:EF:76:44:9F:87', name: 'INSSE-14' },
    { mac: 'D0:EF:76:44:A6:6F', name: 'INSSF-01' },
    { mac: 'D0:EF:76:44:A8:5B', name: 'INSTE-05' },
    { mac: 'D0:EF:76:44:A8:A7', name: 'INSCN-06' },
    { mac: 'D0:EF:76:44:AE:73', name: 'INSCN-07' },
    { mac: 'D0:EF:76:44:C1:13', name: 'INSSE-04' },
    { mac: 'D0:EF:76:44:C4:EF', name: 'INSSF-04' },
    { mac: 'D0:EF:76:44:C8:87', name: 'INSSF-06' },
    { mac: 'D0:EF:76:44:CC:DF', name: 'INSTE-04' },
    { mac: 'D0:EF:76:44:CD:C7', name: 'INSTE-01' },
    { mac: 'D0:EF:76:44:D4:3F', name: 'INSSE-12' },
    { mac: 'D0:EF:76:45:37:67', name: 'INSCN-10' },
    { mac: 'D0:EF:76:45:38:2B', name: 'INSTE-03' },
    { mac: 'D0:EF:76:45:39:67', name: 'INSSE-07' },
    { mac: 'D0:EF:76:45:39:8F', name: 'INSSF-05' },
    { mac: 'D0:EF:76:45:3A:97', name: 'INSSF-09' },
    { mac: 'D0:EF:76:45:3F:27', name: 'INSCN-08' },
    { mac: 'D0:EF:76:45:42:1B', name: 'INSCN-05' },
    { mac: 'D0:EF:76:45:4B:13', name: 'INSSE-06' },
    { mac: 'D0:EF:76:45:52:5F', name: 'INSSE-05' },
    { mac: 'D0:EF:76:45:53:EB', name: 'INSSE-11' },
    { mac: 'D0:EF:76:45:54:37', name: 'INSSE-03' },
    { mac: 'D0:EF:76:45:6F:03', name: 'INSSF-03' },
    { mac: 'D0:EF:76:45:71:2F', name: 'INSTE-10' },
    { mac: 'D0:EF:76:45:79:6B', name: 'INSTE-06' },
    { mac: 'D0:EF:76:45:A1:DF', name: 'INSSE-09' },
    { mac: 'D0:EF:76:45:A8:07', name: 'INSCN-09' },
    { mac: 'D0:EF:76:45:AC:C7', name: 'INSSE-02' },
    { mac: 'D0:EF:76:45:AC:D3', name: 'INSCN-04' },
    { mac: 'D0:EF:76:45:B8:6B', name: 'INSTE-09' },
    { mac: 'D0:EF:76:45:BB:2F', name: 'INSTE-08' },
    { mac: 'D0:EF:76:45:BE:97', name: 'INSCN-03' },
    { mac: 'D0:EF:76:45:E8:FB', name: 'INSTE-02' },
    { mac: 'D0:EF:76:45:EA:A3', name: 'INSTE-07' },
    { mac: 'D0:EF:76:45:EA:DF', name: 'INSSF-02' },
    { mac: 'D0:EF:76:45:ED:DF', name: 'INSSE-08' }, 
    { mac: 'D0:EF:76:46:72:0B', name: 'INSSE-01' },
    { mac: 'D0:EF:76:46:72:3F', name: 'INSSF-08' },
    { mac: 'D0:EF:76:46:76:BB', name: 'INSCN-02' },
    { mac: 'D0:EF:76:46:79:9B', name: 'INSSF-07' },
    { mac: 'D0:EF:76:46:80:8F', name: 'INSSF-10' }
];

// Função para verificar o status de cada máquina
async function checkMachineStatus(macAddress, name) {
    try {
        const intelmountAPIResponse = await fetch(`https://intelmount.apps.intelbras.com.br/v1/resources/mount?mac=${macAddress}`);
        
        if (intelmountAPIResponse.ok) {
            const data = await intelmountAPIResponse.json();
            
            // Status
            const status = data?.data[0]?.status;
            let statusMessage = '';
            let stopName = '';  // Variável para armazenar o nome da parada
            let ordersMessage = '';
            const orders = data?.data[0]?.orders?.currents;

            if (status === 'PRODUCTION') {
                if (!orders || orders.length === 0) {
                    statusMessage = `Em Produção - Sem ordem ativa: ${name} (${macAddress})`;
                    ordersMessage = 'Sem ordem ativa';
                } else {
                    statusMessage = `Em Produção com ordem ativa: ${name} (${macAddress})`;
                    ordersMessage = `Ordem ativa: ${orders.length} ordens`;
                }
            
            } else if (status === 'STOP') {
                const stopDetails = data?.data?.[0]?.stopDetails?.[0];
                stopName = stopDetails ? stopDetails.name : 'Motivo desconhecido';
                if (!orders || orders.length === 0) {
                    statusMessage = `Parado - Sem ordem ativa: ${name} (${macAddress})`;
                    ordersMessage = `Motivo da parada: ${stopName}`;
                } else {
                    statusMessage = `Parado - Com ordem ativa: ${name} (${macAddress})`;
                    ordersMessage = `Motivo da parada: ${stopName}`;
                }
            } else {
                statusMessage = `Status desconhecido: ${name} (${macAddress})`;
            }

            return {
                statusMessage,
                macAddress,
                name,
                ordersMessage
            };
            
        } else {
            return {
                statusMessage: `${macAddress} - Erro ao verificar status. Código: ${intelmountAPIResponse.status}`,
                macAddress,
                name,
                ordersMessage: ''
            };
        }
    } catch (error) {
        return {
            statusMessage: `${macAddress} - Erro ao fazer a requisição: ${error.message}`,
            macAddress,
            name,
            ordersMessage: ''
        };
    }
}

// Função para classificar os logs conforme prioridade
async function checkAllMachines() {
    const logs = {
        productionWithOrder: [],
        productionWithoutOrder: [],
        stoppedWithoutOrder: [],
        stoppedWithOrder: [],
        otherStatus: []
    };

    for (let machine of macAddresses) {
        // Coletando o status de cada máquina
        const result = await checkMachineStatus(machine.mac, machine.name);

        // Classificando os logs conforme as mensagens
        if (result.statusMessage.includes('Em Produção com ordem ativa')) {
            logs.productionWithOrder.push(result);
        } else if (result.statusMessage.includes('Em Produção - Sem ordem ativa')) {
            logs.productionWithoutOrder.push(result);
        } else if (result.statusMessage.includes('Parado - Sem ordem ativa')) {
            logs.stoppedWithoutOrder.push(result);
        } else if (result.statusMessage.includes('Parado - Com ordem ativa')) {
            logs.stoppedWithOrder.push(result);
        } else {
            logs.otherStatus.push(result);
        }
    }

    // Exibindo os logs na ordem desejada
    if (logs.productionWithOrder.length > 0) {
        console.log("Produção com ordem ativa:");
        logs.productionWithOrder.forEach(log => {
            console.log(log.statusMessage);
            console.log(`  ${log.ordersMessage}`);
        });
    } else {
        console.log("Nenhuma máquina em Produção com ordem ativa.");
    }

    if (logs.productionWithoutOrder.length > 0) {
        console.log("\nProdução sem ordem ativa:");
        logs.productionWithoutOrder.forEach(log => {
            console.log(log.statusMessage);
        });
    } else {
        console.log("\nNenhuma máquina em Produção sem ordem ativa.");
    }

    if (logs.stoppedWithoutOrder.length > 0) {
        console.log("\nParado sem ordem ativa:");
        logs.stoppedWithoutOrder.forEach(log => {
            console.log(log.statusMessage);
            console.log(`  ${log.ordersMessage}`);
        });
    } else {
        console.log("\nNenhuma máquina Parada sem ordem ativa.");
    }

    if (logs.stoppedWithOrder.length > 0) {
        console.log("\nParado com ordem ativa:");
        logs.stoppedWithOrder.forEach(log => {
            console.log(log.statusMessage);
            console.log(`  ${log.ordersMessage}`);
        });
    } else {
        console.log("\nNenhuma máquina Parada com ordem ativa.");
    }

    if (logs.otherStatus.length > 0) {
        console.log("\nOutros Status:");
        logs.otherStatus.forEach(log => {
            console.log(log.statusMessage);
        });
    } else {
        console.log("\nNenhuma máquina com outros status.");
    }
}

// Chama a função para iniciar a verificação
checkAllMachines();