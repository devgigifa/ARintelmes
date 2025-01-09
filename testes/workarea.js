// Lista de endereços MAC
const macAddresses = [
    { mac: 'D0:EF:76:46:76:BB', name: 'INSCN-02' },
    { mac: 'D0:EF:76:46:79:9B', name: 'INSSF-07' },
    { mac: 'D0:EF:76:46:80:8F', name: 'INSSF-10' },
    { mac: 'D0:EF:76:45:E8:FB', name: 'INSTE-02' }
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
