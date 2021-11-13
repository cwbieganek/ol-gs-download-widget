import { expect } from "chai";
import { buildUrl, downloadWfs } from "../src/wfs-download.mjs";

describe("WFS Download module", () => {
	describe("buildUrl", () => {
		it("correctly builds a URL for a shapefile download", () => {
			const result = buildUrl(
				"http://ec2-34-219-14-207.us-west-2.compute.amazonaws.com:8080/geoserver/mn/ows",
				"1.0.0",
				"mn:county_nrcs_a_mn",
				"SHAPE-ZIP"
			);
			expect(result).to.equal("http://ec2-34-219-14-207.us-west-2.compute.amazonaws.com:8080/geoserver/mn/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=mn%3Acounty_nrcs_a_mn&maxFeatures=50&outputFormat=SHAPE-ZIP");
		});
	});

	describe("downloadWfs", () => {
		it("throws an error when passed an unsupported format", () => {
			expect(() => { downloadWfs(null, null, null, "DWG") }).to.throw(TypeError, "Invalid download format: ");
		});
	});
});