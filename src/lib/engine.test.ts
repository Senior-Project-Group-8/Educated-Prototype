import { describe, it, expect } from "vitest";
import { p4pl, nextLevel, normalizedGain, estimateTheta } from "./engine";
describe("adaptive engine", () => {
  it("4PL at θ=b is midway between c and d", () => expect(p4pl(1, 1.2, 1, 0.25, 0.95)).toBeCloseTo(0.6));
  it("lowers difficulty when rolling accuracy < 60%", () => expect(nextLevel(3, [true, false, false, true, false])).toBe(2));
  it("raises difficulty after consecutive correct", () => expect(nextLevel(2, [false, true, true])).toBe(3));
  it("normalized gain g=(post-pre)/(100-pre)", () => expect(normalizedGain(40, 70)).toBeCloseTo(0.5));
  it("θ rises after correct answers within 3-5 trials", () => {
    const t = Array.from({ length: 4 }, () => ({ a: 1.2, b: 0.5, c: 0.25, d: 0.97, correct: true }));
    expect(estimateTheta(t)).toBeGreaterThan(0.5);
  });
});
