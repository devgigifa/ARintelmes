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
            if (status === 'PRODUCTION') {
                statusMessage = 'Em Produção';
            } else if (status === 'STOP') {
                statusMessage = 'Parado';
            } else {
                statusMessage = 'Status desconhecido';
            }

            // Verificação do campo orders
            const orders = data?.data[0]?.orders?.currents;
            let ordersMessage = '';
            if (!orders || orders.length === 0) {
                ordersMessage = 'Sem ordens ativas';
            } else {
                const production = orders[0]?.production;
                ordersMessage = production ? `Produção ativa: ${production}` : 'Sem produção ativa';
            }

            // Exibindo as informações no console
            console.log(`${name} (${macAddress}) - Status: ${statusMessage} | ${ordersMessage}`);
        } else {
            console.log(`${macAddress} - Erro ao verificar status. Código: ${intelmountAPIResponse.status}`);
        }
    } catch (error) {
        console.log(`${macAddress} - Erro ao fazer a requisição: ${error.message}`);
    }
}

// Loop para verificar o status de todas as máquinas
async function checkAllMachines() {
    for (let machine of macAddresses) {
        console.log(`Verificando status de ${machine.name} (${machine.mac})...`);
        await checkMachineStatus(machine.mac, machine.name);
    }
}

// Chama a função para iniciar a verificação
checkAllMachines();
