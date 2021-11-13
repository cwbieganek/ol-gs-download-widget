import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';

// Imports from WFS example located here: https://openlayers.org/en/latest/examples/vector-wfs.html
// import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector.js';
import { Stroke, Style } from 'ol/style.js';
// import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import {bbox as bboxStrategy} from 'ol/loadingstrategy.js';

// CSV parser
import Papa from "papaparse";

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

	// Attempt to parse the MN vaccination by county CSV from S3
	Papa.parse("https://chrisb-gis-data.s3.us-west-2.amazonaws.com/MN_People_Vaccinated_By_County_211105.csv", {
		download: true,
		complete: function(results) {
			if (results.errors.length > 0) {
				console.error("Failed to parse the \"MN People Vaccinated By County CSV\"");
				return;
			}

			// Sucessfully parsed the CSV
			console.log("Successfully parsed the \"MN People Vaccinated By County CSV\"");
		}
	});
}