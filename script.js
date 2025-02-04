
document.addEventListener('DOMContentLoaded', () => {
	initAR();
	updateMachineStatus()
	updateStatusPercentage()
	updateProductionBar()
	updateProductionStatus()
});

async function initAR(macAddress) {
    const scene = document.querySelector("#a-scene");
    scene.style.display = "block";
    const components = ["cycletime", "operationcode", "quantity", "quantityprod", "scrapquantity", "goodquantity", "perf", "nextop", "rescode", "itemtool", "item", "status"];

    if (macAddress) {
        try {
            const intelmountAPIResponse = await fetch(`https://intelmount.apps.intelbras.com.br/v1/resources/mount?mac=${macAddress}`);
            if (intelmountAPIResponse.ok) {
				const data = await intelmountAPIResponse.json();
				const status = data?.data[0]?.status;
				const stopDetails = data?.data?.[0]?.stopDetails?.[0] ? { color: data.data[0].stopDetails[0].color, name: data.data[0].stopDetails[0].name } : null;
				const rescode = data?.data?.[0].code;
				const machineDetails = {
					cycletime: data?.data[0]?.orders?.currents[0]?.item?.factor,
					operationcode: data?.data[0]?.orders?.currents[0]?.operationId,
					quantity: data?.data[0]?.orders?.currents[0]?.production?.meta,
					quantityprod: data?.data[0]?.orders?.currents[0]?.production?.current,
					scrapquantity: data?.data[0]?.orders?.currents[0]?.production?.refuge,
					goodquantity: data?.data[0]?.orders?.currents[0]?.production?.current - data?.data[0]?.orders?.currents[0]?.production?.refuge,
					perf: data?.data[0]?.orders?.currents[0]?.perf ? `perf: ${(data?.data[0]?.orders?.currents[0]?.perf).toFixed(2)}%` : "perf: N/A",
					nextop: `Proxima OP: ${"5607040-2"}`,
					rescode: rescode,
					itemtool: data?.data[0]?.orders?.currents[0]?.item?.tool,
					itemname: data?.data[0]?.orders?.currents[0]?.item?.name,
					item: `${data?.data[0]?.orders?.currents[0]?.item?.code} - ${data?.data[0]?.orders?.currents[0]?.item?.name}`,
					orders: data?.data[0]?.orders?.currents[0].production,
                    statusDate: data?.data?.[0].statusDate,
					// error: data?data[0]?.error
					// errorMessage: data?data[0]?.errorMessage
				};

				// Atualiza todos os componentes
				for (const component of components) {
					const element = document.getElementById(component);
					if (element) {
						element.setAttribute("value", machineDetails[component]);
					}
				}
				// Atualiza o status da máquina
				updateMachineStatus(status, stopDetails, machineDetails);
                return { rescode: machineDetails.rescode, statusDate: machineDetails.statusDate };  // Retorna um objeto com rescode e statusDate            
            } else {
                console.error("Erro na resposta da API:", intelmountAPIResponse.status);
                return null;
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
            return null;
        }
    } else {
        console.error("MAC address não fornecido.");
        return null;
    }
}

// TIME ......................................................................
async function initTime(macAddress) {
    console.log("Initializing time with MAC Address:", macAddress);

    const { rescode, statusDate } = await initAR(macAddress);
    
    if (!rescode || typeof rescode !== "string") {
        console.error("Invalid rescode returned from initAR:", rescode);
        return null; // Retorne null caso o rescode seja inválido
    }

    console.log("Initializing time with rescode:", rescode);

    try {
        // Converter o statusDate para o horário local
        const toLocalTime = (date) => new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000);
        const startDate = toLocalTime(statusDate); // Usa statusDate diretamente
        const endDate = toLocalTime(new Date());  // Horário atual ajustado para o horário local

        // log de data
        console.log("Start Date (do statusDate, ajustado para o horário local):", startDate.toISOString());
        console.log("End Date (Hora atual ajustada para o horário local):", endDate.toISOString());

        const operationTime = (endDate - startDate) / 60000;
        const hours = Math.floor(operationTime / 60);
        const minutes = Math.floor(operationTime % 60);
        const duration = hours > 0 ? `${hours} h` : `${minutes} min`;

        // log tempo de operação
        console.log(`A máquina funcionou por ${duration}.`);

        // Atualiza o valor do elemento
        const hoursElement = document.getElementById("hours");
        hoursElement?.setAttribute("value", duration);

        return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
    } catch (error) {
        console.error("Error while processing productive data:", error);
    }
    return null;
}

function updateMachineDataUI(machineDetails) {
	const components = ["cycletime", "operationcode", "quantity", "quantityprod", "scrapquantity", "goodquantity", "perf", "rescode", "itemtool", "item"];
    components.forEach(component => {
		const element = document.getElementById(component);
        if (element) {
			element.setAttribute("value", machineDetails[component] || "N/A");
        }
    });
}

// GAUGES ................................................................

async function initGauges(macAddress) {
    if (!startDate || !endDate) {
        console.error("Invalid startDate or endDate provided to initGauges.");
        return;
    }
    const components = ["performance", "quality", "available", "oee"];

    try {
        const {startDate, endDate} = initTime(startDate, endDate)
        const { rescode } = await initAR(macAddress);
    // tem que pegar startDate de initTime e usar
    // tem que pegar rescode de initAR ou de initTime

        // const startDate = new Date(startDate).toISOString();
        // const endDate = new Date(endDate).toISOString();

        console.log("Start Date (ISO):", startDate);
        console.log("End Date (ISO):", endDate);

        const intelcalcAPIResponse = await fetch(
            `https://intelcalc.apps.intelbras.com.br/v1/oee/time?endDate=${endDate}&startDate=${startDate}&rescode=${rescode}&onlyPerf=false`
        );

        if (intelcalcAPIResponse.ok) {
            const data = await intelcalcAPIResponse.json();
            const gaugeDetails = {
                performance: data?.data?.performance,
                quality: data?.data?.quality,
                available: data?.data?.available,
                oee: data?.data?.oee,
            };

            components.forEach((component) => {
                const elementText = document.getElementById(`text-${component}`);
                const elementRing = document.getElementById(`ring-${component}`);
                const value = gaugeDetails[component];

                if (elementText && elementRing) {
                    updateGauge(value, `text-${component}`, `ring-${component}`);
                } else {
                    console.error(`Elemento não encontrado para ${component}`);
                }
            });

            // setInterval(() => {
            //     components.forEach((component) => {
            //         const value = gaugeDetails[component];
            //         updateGauge(value, `text-${component}`, `ring-${component}`);
            //     });
            // }, 15000);
        } else {
            console.error("Erro ao buscar dados da API:", intelcalcAPIResponse.status);
        }
    } catch (error) {
        console.error("Falha ao buscar dados:", error);
    }
}

// Atualiza os gauges
function updateGauge(value, textId, ringId) {
	const textRing = document.getElementById(textId);
	const ring = document.getElementById(ringId);

	if (textRing && ring) {
		textRing.setAttribute('value', `${textId.split('-')[1]}: ${Math.round(value)}%`);
		let color;
		if (value > 100) {
			color = 'rgb(0, 128, 0)';
		} else {
			const greenValue = Math.floor((value / 100) * 255);
			const redValue = 255 - greenValue;
			color = `rgb(${redValue}, ${greenValue}, 0)`;
		}
		ring.setAttribute('color', color);
		// atualiza o anel
		const length = (value / 100) * 360;
		ring.setAttribute('theta-length', length);
	} else {
		console.error(`Element with id '${textId}' or '${ringId}' not found.`);
	}
}

// Inicialização ao detectar marcador
document.addEventListener("markerFound", async (event) => {
    const markerId = event.detail.id; // ID do marcador detectado
    const markerElement = document.getElementById(markerId);
    const macAddress = markerElement?.getAttribute("data-mac"); // Obtém o MAC do marcador
    console.log("macAddress encontrado:", macAddress);
    
    if (macAddress) {
        console.log(`Endereço MAC detectado: ${macAddress}`);
        try {
            const { rescode, statusDate } = await initAR(macAddress);  // Pega rescode e statusDate diretamente de initAR
            const { startDate, endDate } = await initGauges(rescode, startDate, endDate); 

            if (rescode && statusDate) {
                const timeDetails = await initTime(macAddress);  // Passa o macAddress para obter tempo
                if (timeDetails) {
                    initGauges(rescode, startDate, endDate);  // Passa os dados para initGauges
                } else {
                    console.error("Falha ao obter dados de tempo. initGauges não será chamado.");
                }
            } 
        } catch (error) {
            console.error("Erro durante a inicialização:", error);
        }
    } else {
        console.error("Nenhum endereço MAC encontrado para o marcador.");
    }
});

// STATUS MACHINE ...............................................................................

async function updateMachineStatus(status, stopDetails, machineDetails) {
    // Função para esconder os elementos
    const hideElements = () => {
		const elementsToHide = [ "cycletime", "operationcode", "quantity", "quantityprod", "item", "scrapquantity", "perf", "goodquantity", "calcProdNum", "op", "qtd", "qtdboa", "qtdprod", "ref", "itemtool", "nextop", "statusPercentage", "lineI", "lineII"  ];
		document.getElementById("bar").setAttribute("opacity", "0.35");
		elementsToHide.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.setAttribute("visible", "false");
        });
    };

// if (machineDetails.error !== null){
	// 	document.getElementById("box").setAttribute("material", "color: #fc1723, opacity: 0.9;"); // funciona?
	// document.getElementById("box").setAttribute("color", "#fc1723");
	// document.getElementById("box").setAttribute("opacity", "0.9");
	// 	document.getElementById("nextop").setAttribute("value", machineDetails.errorMessage);
// }

	// PRODUÇÃO
	if (status === "PRODUCTION") {
		console.log("Entrou em produção");
		
		document.getElementById("entity").setAttribute("visible", "true");        
		document.getElementById("grandbox").setAttribute("color", "#00a335");
		document.getElementById("status").setAttribute("value", "PRODUCAO");
			
		if (!machineDetails.orders) {
			document.getElementById("tc").setAttribute("value", "sem item");
			hideElements()
		}
		updateProductionStatus(machineDetails);
	}

	// PARADO
	if (status === "STOP" ) {
		console.log("Entrou em parada");

		document.getElementById("entity").setAttribute("visible", "true");        

		document.getElementById("grandbox").setAttribute("color", `#${stopDetails.color || '00a335'}`);        
		document.getElementById("status").setAttribute("value", "PARADO");
		document.getElementById("item").setAttribute("value", stopDetails.name);

		if (!machineDetails.orders) {
			console.log("Entrou em parado sem ordem");

			document.getElementById("entity").setAttribute("visible", "true");        
			document.getElementById("grandbox").setAttribute("color", `#${stopDetails.color || '00a335'}`);
			document.getElementById("status").setAttribute("value", "PARADO");
			document.getElementById("tc").setAttribute("value", stopDetails.name);
			hideElements()
		}
		if (stopDetails.color === "CBDEE8") { document.getElementById("grandbox").setAttribute("color", "#bdbdbd") }
		if (stopDetails.color === "FFCC47") { document.getElementById("grandbox").setAttribute("color", "#eead2d") }
		if (stopDetails.color === "f8e71c") { document.getElementById("grandbox").setAttribute("color", "#ffc222") }
		updateProductionStatus(machineDetails);
	}

	// INATIVO - TESTAR
	if (status === "INACTIVE") {
		console.log("Entrou em inativo");

		document.getElementById("grandbox").setAttribute("color", "#adb3b7");
		document.getElementById("status").setAttribute("value", "INATIVO");
		document.getElementById("item").setAttribute("value", "FORA DE TURNO: MAQUINA DESLIGADA PLANEJADA");
		document.getElementById("bar").setAttribute("opacity", "0.35");

		hideElements()
		updateProductionStatus(machineDetails);
	}

	// INICIO DE OP - TESTAR
	if(statusPercentage >= 0 && statusPercentage <= 5){
		document.getElementById("entity").setAttribute("visible", "true");        
	    document.getElementById("grandbox").setAttribute("color", `#${stopDetails.color || '00a335'}`);
	    document.getElementById("status").setAttribute("value", "INICIO DE OP");
		document.getElementById("status").setAttribute("color", "#DA4710");
	    // document.getElementById("item").setAttribute("value", stopDetails.name);

	    updateProductionStatus(machineDetails);
	}

	// TROCA DE OP - TESTAR
	if(statusPercentage > 95){
		document.getElementById("entity").setAttribute("visible", "true");        
	    document.getElementById("grandbox").setAttribute("color", `#${stopDetails.color || '00a335'}`);        
	    document.getElementById("status").setAttribute("value", "TROCA DE OP");
		document.getElementById("status").setAttribute("color", "#DA4710");
		// document.getElementById("item").setAttribute("value", stopDetails.name);

	    updateProductionStatus(machineDetails);
	}
}

// BARRA DE PRODUÇÃO .........................................................

// Função que calcula e atualiza o percentual de produção no elemento HTML e retorna o valor
function updateStatusPercentage() {
	const getValue = (id) => parseInt(document.getElementById(id)?.getAttribute("value") || 0);
	const quantity = getValue("quantity");
	const quantityprod = getValue("quantityprod") || 1; // Evitar divisão por zero
	const refuge = getValue("refuge");

	// Calcula o percentual diretamente, limitando entre 0 e 100
	const percentage = Math.max(0, Math.min(100, refuge ? ((quantityprod - refuge) / quantity) * 100 : (quantityprod / quantity) * 100));

	const element = document.getElementById("statusPercentage");
	element?.setAttribute("value", `${percentage.toFixed(2)}%`);
	return percentage;
}

// Função que ajusta o tamanho da barra de produção com base no percentual
function updateProductionBar(value) {
	const barFill = document.getElementById("production-bar");
	if (barFill) {
		const fillScale = value / 100;
		const startPos = fillScale * 1.3;
		const newPos = -0.65 + (startPos / 2);
		barFill.setAttribute("scale", `${startPos} 0.1 0.1`);
		barFill.setAttribute("position", `${newPos} -0.1 0`);
	}
}

// Função principal para sincronizar statusPercentage e a barra de produção
function updateProductionStatus() {
	updateProductionBar(updateStatusPercentage()); 
}
// setInterval(updateProductionStatus, 10000);  // Atualiza a cada 10 segundo

// MARCADOR ......................................................................

// Track the currently active marker to prevent multiple detections
let activeMarker = null;
// Stores the last detected machine details
let lastDetectedMachineDetails = null; 

async function markerDetection(markerId) {
    if (activeMarker) {
        console.log(`Outro marcador (${activeMarker}) já está sendo processado.`);
        return;
    }

    activeMarker = markerId;

    const markerElement = document.getElementById(markerId);
    const macAddress = markerElement?.getAttribute("data-mac"); // Obtém o MAC do marcador

    if (macAddress) {
        console.log(`Endereço MAC detectado do marcador ${markerId}: ${macAddress}`);

        try {
            // Obtém os detalhes de tempo a partir do MAC Address
            const { rescode, statusDate } = await initAR(macAddress);

            if (rescode && statusDate) {
                console.log(`Dados recebidos - rescode: ${rescode}, statusDate: ${statusDate}`);
                
                // Agora passamos o rescode e statusDate para a próxima função
                const { startDate, endDate } = await initTime(macAddress); // Passa o macAddress para initTime

                if (startDate && endDate) {
                    console.log("Dados de tempo recebidos, chamando initGauges:", rescode, startDate, endDate);
                    // Inicializa os gauges com os dados obtidos
                    await initGauges(rescode, startDate, endDate);
                } else {
                    console.error("Falha ao obter dados de tempo. initGauges não será chamado.");
                }
            } else {
                console.error("Falha ao obter rescode ou statusDate.");
            }
        } catch (error) {
            console.error("Erro durante a inicialização com o marcador:", error);
        }
    } else {
        console.error("Nenhum endereço MAC válido encontrado para este marcador.");
    }

    activeMarker = null; // Reseta o marcador ativo
}


function markerLoss(markerId) {
    console.log(`Marker ${markerId} lost. Retaining last detected data.`);
    if (activeMarker === markerId) {
        activeMarker = null;

        if (lastDetectedMachineDetails) {
            // Retain the displayed data
            const components = ["cycletime", "operationcode", "quantity", "quantityprod", "scrapquantity", "goodquantity", "perf", "nextop", "rescode", "itemtool", "item", "status"];

            for (const component of components) {
                const element = document.getElementById(component);
                if (element) {
                    element.setAttribute("value", lastDetectedMachineDetails[component]);
                }
            }

            // Retain the production bar state
            updateProductionBar(lastDetectedMachineDetails);
        }
    }
}

// Add event listeners for each registered marker
const registeredMarkers = ['machine1-marker', 'machine2-marker','machine3-marker', 'machine4-marker'];
registeredMarkers.forEach(markerId => {
    const markerElement = document.getElementById(markerId);
    if (markerElement) {
        markerElement.addEventListener('markerFound', () => markerDetection(markerId));
        markerElement.addEventListener('markerLost', () => markerLoss(markerId));
    }
});
