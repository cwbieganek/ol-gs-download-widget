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
import '../node_modules/@material/mwc-top-app-bar/mwc-top-app-bar.js';
import '../node_modules/@material/mwc-dialog/mwc-dialog.js';


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
		document.getElementsByTagName("mwc-dialog")[0].show();
	}
}

function downloadMnCongressionalDistrictsWfs(format) {
	downloadWfs(
		"http://ec2-34-219-14-207.us-west-2.compute.amazonaws.com:8080/geoserver/mn/wfs",
		"1.0.0",
		"	mn:congdist_117_a_mn",
		format
	);
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
	// Create MN Counties Vector Source and Layer
	const mnCountiesVectorSource = new VectorSource({
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
	
	const mnCountiesVectorLayer = new VectorLayer({
		source: mnCountiesVectorSource,
		style: new Style({
			stroke: new Stroke({
				color: 'rgba(0, 0, 0, 1.0)',
				width: 2,
			}),
		}),
	});

	// Create MN Congressional Districts Vector Source and Layer
	const mnCongressionalDistrictsVectorSource = new VectorSource({
		format: new GeoJSON(),
		url: function (extent) {
			return (
				'http://ec2-34-219-14-207.us-west-2.compute.amazonaws.com:8080/geoserver/mn/wfs?service=WFS&' +
				'version=1.1.0&request=GetFeature&typename=	mn:congdist_117_a_mn&' +
				'outputFormat=application/json&srsname=EPSG:4326&' +
				'bbox=' +
				extent.join(',') +
				',EPSG:4326'
			);
		},
		strategy: bboxStrategy,
	});
	
	const mnCongressionalDistrictsVectorLayer = new VectorLayer({
		source: mnCongressionalDistrictsVectorSource,
		style: new Style({
			stroke: new Stroke({
				color: 'rgba(173, 216, 230, 1.0)',
				width: 2,
				lineDash: [4, 10]
			})
		}),
	});

	let view = new View({
		center: [-10524117.583902, 5752956.496856], // EPSG: 4326
		zoom: 2
	});

	// NOTE: The map variable is currently never actually used, which makes eslint angry
	const map = new Map({
		controls: defaultControls().extend([new DownloadControl()]),
		target: 'map',
		layers: [
			new TileLayer({
				source: new XYZ({
					url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				})
			}),
			mnCountiesVectorLayer,
			mnCongressionalDistrictsVectorLayer
		],
		view: view
	});

	// This is hack that waits two seconds before updating the zoom level because the MN Counties
	// WFS will not appear unless we start at zoom level 2. Once the layer appears, we can zoom in.
	setTimeout(() => {
		view.animate({ zoom: 6 });
	}, 2000);

	// Add event listeners to download format select element
	let formatSelect = document.getElementsByTagName("mwc-select")[1];
	formatSelect.addEventListener("selected", () => {
		console.log(`You selected the ${formatSelect.selected.value} file format.`);
	});

	// Add event listeners to download button (in popup)
	let popupDownloadButton = document.getElementsByTagName("mwc-button")[0];
	popupDownloadButton.addEventListener("click", () => {
		let wfsLayerSelect = document.getElementsByTagName("mwc-select")[0];
		let wfsLayerTypeName = wfsLayerSelect.selected.value;
		let format = formatSelect.selected.value;

		switch (wfsLayerTypeName) {
			case "mn:congdist_117_a_mn":
				downloadMnCongressionalDistrictsWfs(format);
				break;
			case "mn:county_nrcs_a_mn":
				downloadMnCountiesWfs(format);
				break;
			default:
				throw Error("Invalid WFS layer type name " + wfsLayerTypeName);
		}
	});

	// function afterCsvParsed(results) {
	// 	if (results.errors.length > 0) {
	// 		console.error("Failed to parse the \"MN People Vaccinated By County CSV\"");
	// 		return;
	// 	}

	// 	// Sucessfully parsed the CSV
	// 	console.log("Successfully parsed the \"MN People Vaccinated By County CSV\"");
	// }

	// Attempt to parse the MN vaccination by county CSV from S3
	// Papa.parse("https://chrisb-gis-data.s3.us-west-2.amazonaws.com/MN_People_Vaccinated_By_County_211105.csv", {
	// 	download: true,
	// 	complete: afterCsvParsed
	// });
}