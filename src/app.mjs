// OpenLayers imports
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector.js';
import { Stroke, Style } from 'ol/style.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import {bbox as bboxStrategy} from 'ol/loadingstrategy.js';
import {Control, defaults as defaultControls} from 'ol/control.js';

// CSV parser
// import Papa from "papaparse";

// Material Web Components
import '../node_modules/@material/mwc-select/mwc-select.js';
import '../node_modules/@material/mwc-list/mwc-list-item.js';
import '../node_modules/@material/mwc-button/mwc-button.js';

// WFS Download module
import { downloadWfs } from './wfs-download.mjs';

class DownloadControl extends Control {
	constructor(opt_options) {
		const options = opt_options || {};

		const button = document.createElement('button');
		button.innerHTML = '<img style="width: 20px;" src="img/file_download_white_24dp.svg" title="Download MN Counties" alt="Download Icon" />';

		const element = document.createElement('div');
		element.className = 'rotate-north ol-unselectable ol-control';
		element.appendChild(button);

		super({
			element: element,
			target: options.target,
		});

		button.addEventListener('click', this.handleDownloadClick, false);
	}

	handleDownloadClick() {
		console.log("Download button clicked!");
		document.getElementById("format-select-container").classList.replace("no-display", "flex");
		// downloadMnCountiesWfs("SHAPE-ZIP");
	}
}

function downloadMnCountiesWfs(format) {
	downloadWfs(
		"http://ec2-34-219-14-207.us-west-2.compute.amazonaws.com:8080/geoserver/mn/wfs",
		"1.0.0",
		"mn:county_nrcs_a_mn",
		format
	);
}

export default function app() {
	const vectorSource = new VectorSource({
		format: new GeoJSON(),
		url: function (extent) {
			return (
				'http://ec2-34-219-14-207.us-west-2.compute.amazonaws.com:8080/geoserver/mn/wfs?service=WFS&' +
				'version=1.1.0&request=GetFeature&typename=mn:county_nrcs_a_mn&' +
				'outputFormat=application/json&srsname=EPSG:4326&' +
				'bbox=' +
				extent.join(',') +
				',EPSG:4326'
			);
		},
		strategy: bboxStrategy,
	});
	
	const vector = new VectorLayer({
		source: vectorSource,
		style: new Style({
			stroke: new Stroke({
				color: 'rgba(0, 0, 255, 1.0)',
				width: 2,
			}),
		}),
	});

	new Map({
		controls: defaultControls().extend([new DownloadControl()]),
		target: 'map',
		layers: [
			new TileLayer({
				source: new XYZ({
					url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				})
			}),
			vector
		],
		view: new View({
			center: [0, 0],
			zoom: 2
		})
	});

	// Add event listeners to download format select element
	let formatSelect = document.getElementsByTagName("mwc-select")[0];
	formatSelect.addEventListener("selected", () => {
		console.log(`You selected the ${formatSelect.selected.value} file format.`);
	});

	// Add event listeners to download button (in popup)
	let popupDownloadButton = document.getElementsByTagName("mwc-button")[0];
	popupDownloadButton.addEventListener("click", () => {
		downloadMnCountiesWfs(formatSelect.selected.value);
	});

	function afterCsvParsed(results) {
		if (results.errors.length > 0) {
			console.error("Failed to parse the \"MN People Vaccinated By County CSV\"");
			return;
		}

		// Sucessfully parsed the CSV
		console.log("Successfully parsed the \"MN People Vaccinated By County CSV\"");
	}

	// Attempt to parse the MN vaccination by county CSV from S3
	// Papa.parse("https://chrisb-gis-data.s3.us-west-2.amazonaws.com/MN_People_Vaccinated_By_County_211105.csv", {
	// 	download: true,
	// 	complete: afterCsvParsed
	// });
}