export class Bin {
  #name;
  #vacant;

  constructor(aux) {
    this.#name;
    this.#vacant;
  }

  toggleVacant() {
    this.#vacant = !this.#vacant;
  }

  checkVacancy() {
    return this.#vacant;
  }

  static createBin(binDetails) {
    const validatedDetails = this.validateDetails(binDetails);

    return new Bin(validatedDetails);
  }

  static validateDetails(binDetails) {
    if (!(binDetails.name instanceof String)) {
      throw new Error("invalid name");
    }

    if (!(binDetails.vacant instanceof Boolean)) {
      throw new Error("invalid vacant");
    }

    return {
      name: binDetails.name,
      vacant: binDetails.vacant,
    };
  }

  static checkVacancy(binName) {
    return true;
  }

  static allBins = {};
}
