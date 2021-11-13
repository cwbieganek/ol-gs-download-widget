
import { expect } from "chai";
import { sum } from "../math.mjs";

describe("Math module", () => {
	describe("Math.sum", () => {
		it("correctly sums two numbers", () => {
			const result = sum(2, 2);
			expect(result).to.equal(4);
		});
	});
});