
// Track the currently active marker to prevent multiple detections
let activeMarker = null;

async function handleMarkerDetection(markerId) {
    if (activeMarker) {
        console.log(`Another marker (${activeMarker}) is already being processed.`);
        return
    }

    activeMarker = markerId;

    const markerElement = document.getElementById(markerId);
    const macAddress = markerElement?.getAttribute('data-mac');

    if (macAddress) {
        console.log(`MAC Address detected from marker ${markerId}: ${macAddress}`);
        const machineDetails = await fetchMachineData(macAddress);

        if (machineDetails) {
            // Update machine data components
            const components = ["cycletime", "operationcode", "quantity", "quantityprod", "scrapquantity", "goodquantity", "perf", "rescode", "itemtool", "item"];
            for (const component of components) {
                const element = document.getElementById(component);
                if (element) {
                    element.setAttribute("value", machineDetails[component]);
                }
            }

            // Update production bar dynamically
            updateProductionBarUI(machineDetails);
        }
    } else {
        console.log('No valid MAC address found for this marker');
    }

    activeMarker = null; // Reset active marker
}

// Handle marker loss and reset UI
function handleMarkerLoss(markerId) {
    console.log(`Marker ${markerId} lost. Stopping data fetch.`);
    if (activeMarker === markerId) {
        activeMarker = null;
        resetProductionBarUI();
    }
}

// Add event listeners for each registered marker
const registeredMarkers = ['machine1-marker', 'machine2-marker'];
registeredMarkers.forEach(markerId => {
    const markerElement = document.getElementById(markerId);
    if (markerElement) {
        markerElement.addEventListener('markerFound', () => handleMarkerDetection(markerId));
        markerElement.addEventListener('markerLost', () => handleMarkerLoss(markerId));
    }
});