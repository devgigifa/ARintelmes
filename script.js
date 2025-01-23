// Função para inicializar a AR e retornar o rescode
async function initAR() {
	const scene = document.querySelector("#a-scene");
	scene.style.display = "block"; 
	const components = ["cycletime", "operationcode", "quantity", "quantityprod", "scrapquantity", "goodquantity", "perf", "nextop", "rescode", "itemtool", "item", "status"];
	const qrCodeResponse = 'D0:EF:76:45:71:2F'; // Endereço de MAC

	if (qrCodeResponse) {
		try {
			const intelmountAPIResponse = await fetch(`https://intelmount.apps.intelbras.com.br/v1/resources/mount?mac=${qrCodeResponse}`);
			if (intelmountAPIResponse.ok) {
				const data = await intelmountAPIResponse.json();
				const status = data?.data[0]?.status;
				const stopDetails = data?.data?.[0]?.stopDetails?.[0] ? { color: data.data[0].stopDetails[0].color, name: data.data[0].stopDetails[0].name } : null;
				const machineDetails = {
					cycletime: data?.data[0]?.orders?.currents[0]?.item?.factor,
					operationcode: data?.data[0]?.orders?.currents[0]?.operationId,
					quantity: data?.data[0]?.orders?.currents[0]?.production?.meta,
					quantityprod: data?.data[0]?.orders?.currents[0]?.production?.current,
					scrapquantity: data?.data[0]?.orders?.currents[0]?.production?.refuge,
					goodquantity: data?.data[0]?.orders?.currents[0]?.production?.current - data?.data[0]?.orders?.currents[0]?.production?.refuge,
					perf: data?.data[0]?.orders?.currents[0]?.perf ? `perf: ${(data?.data[0]?.orders?.currents[0]?.perf).toFixed(2)}%` : "N/A",
					nextop: `Proxima OP: ${"5607040-2"}`,
					rescode: data?.data?.[0].code,
					itemtool: data?.data[0]?.orders?.currents[0]?.item?.tool,
					itemname: data?.data[0]?.orders?.currents[0]?.item?.name,
					item: `${data?.data[0]?.orders?.currents[0]?.item?.code} - ${data?.data[0]?.orders?.currents[0]?.item?.name}`,
					orders: data?.data[0]?.orders?.currents[0].production,
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

				return machineDetails.rescode;
			}
		} catch (error) {
			console.error("Failed to fetch data:", error);
		}
	}
}

// TIME ......................................................................
async function initTime(resCode) {
	if (!resCode) return;

	try {
		const productiveDateAps = await fetch(
			`https://intelcalc.apps.intelbras.com.br/v1/resources/${resCode}/aps/calendar/productive?date=${new Date().toISOString()}`
		);
		if (!productiveDateAps.ok) {
			console.error("Erro ao buscar dados da API:", productiveDateAps.status);
			return;
		}
		const { dateStart } = (await productiveDateAps.json()).data || {};
		if (!dateStart) {
			console.error("Data de início não encontrada.");
			return;
		}
		// ajustar datas para o horário local
		const toLocalTime = (date) => new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000);
		const localStartDate = toLocalTime(dateStart); // Ajusta o horário de início
		const localEndDate = toLocalTime(new Date());  // Ajusta o horário atual

		// log de data
		console.log("Start Date (API, ajustado para o horário local):", localStartDate.toISOString());
		console.log("End Date (Hora atual ajustada para o horário local):", localEndDate.toISOString());

		const operationTime = (localEndDate - localStartDate) / 60000;
		const hours = Math.floor(operationTime / 60);
		const minutes = Math.floor(operationTime % 60);
		const duration = hours > 0 ? `${hours} h` : `${minutes} min`;

		// log tempo de operação
		console.log(`A máquina funcionou por ${duration}.`);

		// atualiza valor do elemento
		const hoursElement = document.getElementById("hours");
		hoursElement?.setAttribute("value", duration);

		return { dateStart: localStartDate.toISOString(), dateEnd: localEndDate.toISOString() };

	} catch (error) {
		console.error("Erro ao processar os dados:", error);
	}
}

// GAUGES ................................................................

async function initGauges(resCode, dateStart, dateEnd) {
	const components = ["performance", "quality", "available", "oee"];
	try {
		const startDateISO = new Date(dateStart).toISOString();
		const endDateISO = new Date(dateEnd).toISOString();

		// Log para visualizar as horas de início e fim
		console.log("Start Date (ISO):", startDateISO);
		console.log("End Date (ISO):", endDateISO);

		const intelcalcAPIResponse = await fetch(
			`https://intelcalc.apps.intelbras.com.br/v1/oee/time?dateEnd=${endDateISO}&dateStart=${startDateISO}&resCode=${resCode}&onlyPerf=false`
		);
		if (intelcalcAPIResponse.ok) {
			const data = await intelcalcAPIResponse.json();
			const gaugeDetails = {
				performance: data?.data?.performance,
				quality: data?.data?.quality,
				available: data?.data?.available,
				oee: data?.data?.oee,
			};

			// Atualiza os gauges
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

			// Simula atualizações periódicas a cada 15 segundos
			setInterval(() => {
				components.forEach((component) => {
					const value = gaugeDetails[component];
					updateGauge(value, `text-${component}`, `ring-${component}`);
				});
			}, 15000);
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
		// verifica se o valor é maior que 100 e aplica a cor verde escuro
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

document.addEventListener('DOMContentLoaded', async () => {
	const resCode = await initAR();  // Pega o rescode de initAR
	if (resCode) {
		const timeDetails = await initTime(resCode);  // Pega dateStart e dateEnd de initTime
		if (timeDetails) {
			initGauges(resCode, timeDetails.dateStart, timeDetails.dateEnd);  // Passa os dados para initGauges
		}
	}
});

// STATUS MACHINE ...............................................................................

async function updateMachineStatus(status, stopDetails, machineDetails) {
    // Função para esconder os elementos
    const hideElements = () => {
		const elementsToHide = [ "cycletime", "operationcode", "quantity", "quantityprod", "item", "scrapquantity", "perf", "goodquantity", "calcProdNum", "op", "qtd", "qtdboa", "qtdprod", "ref", "itemtool", "nextop", "statusPercentage", "lineI", "lineII"  ];
        elementsToHide.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.setAttribute("visible", "false");
        });
    };

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
		if (stopDetails.color === "CBDEE8") { document.getElementById("grandbox").setAttribute("color", "#adb3b7") }
		if (stopDetails.color === "FFCC47") { document.getElementById("grandbox").setAttribute("color", "#eead2d") }
		updateProductionStatus(machineDetails);
	} 

	// INATIVO
	if (status === "INACTIVE") {
		console.log("Entrou em inativo");

		document.getElementById("grandbox").setAttribute("color", "#adb3b7");
		document.getElementById("status").setAttribute("value", "INATIVO");
		document.getElementById("item").setAttribute("value", "FORA DE TURNO: MAQUINA DESLIGADA PLANEJADA");
		hideElements()

		updateProductionStatus(machineDetails);
	}

	// INICIO DE OP - TESTAR
	if(statusPercentage >= 0 && statusPercentage <= 5){
		document.getElementById("entity").setAttribute("visible", "true");        
	    document.getElementById("grandbox").setAttribute("color", `#${stopDetails.color || '00a335'}`);
	    document.getElementById("status").setAttribute("value", "INICIO DE OP"); //pode ser "INICIO DE OP" OU "TROCA DE OP"
	    // document.getElementById("item").setAttribute("value", stopDetails.name);
	    updateProductionStatus(machineDetails);
	}

	// TROCA DE OP - TESTAR
	if(statusPercentage > 95){
		document.getElementById("entity").setAttribute("visible", "true");        
	    document.getElementById("grandbox").setAttribute("color", `#${stopDetails.color || '00a335'}`);        
	    document.getElementById("status").setAttribute("value", "TROCA DE OP");
	    updateProductionStatus(machineDetails);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	updateProductionBar();
	initAR();
	updateMachineStatus()
	updateStatusPercentage()
	updateProductionBar()
	updateProductionStatus()
});


// BARRA DE PRODUÇÃO .........................................................

// Função que calcula e atualiza o percentual de produção no elemento HTML e retorna o valor
function updateStatusPercentage() {
	const getValue = (id) => parseInt(document.getElementById(id)?.getAttribute("value") || 0);
	const quantity = getValue("quantity");
	const quantityprod = getValue("quantityprod") || 1; // Evitar divisão por zero
	const refuge = getValue("refuge");
	const percentage = refuge ? ((quantityprod - refuge) / quantity) * 100 : (quantityprod / quantity) * 100;    
	const finalPercentage = Math.max(0, Math.min(100, percentage.toFixed(2))); // Limita entre 0 e 100
	const element = document.getElementById("statusPercentage");
	element?.setAttribute("value", `${finalPercentage}%`);
	return finalPercentage;
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
setInterval(updateProductionStatus, 10000);  // Atualiza a cada 10 segundo
