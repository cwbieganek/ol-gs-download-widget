export function buildUrl(path, version, typeName, format) {
	let url = `${path}` + 
	"?service=WFS" + 
	`&version=${encodeURIComponent(version)}` +
	"&request=GetFeature" + 
	`&typeName=${encodeURIComponent(typeName)}` + 
	"&maxFeatures=50" + 
	`&outputFormat=${encodeURIComponent(format)}`;

	return url;
}

// Downloads a WFS in one of the supported formats
// Formats supported: Shapefile, KML, CSV, GeoJSON
export function downloadWfs(path, version, typeName, format) {
	const VALID_FORMATS = [
		"SHAPE-ZIP",                             // Zipped shapefile
		"application/vnd.google-earth.kml+xml",  // KML
		"text/csv",                              // CSV (option 1)
		"csv",                                   // CSV (option 2)
		"application/json"                       // GeoJSON
	];

	if (!VALID_FORMATS.includes(format)) {
		throw new TypeError("Invalid download format: " + format);
	}

	// Format is valid. Build URL.
	let url = buildUrl(path, version, typeName, format);

	// window.open(url);
}