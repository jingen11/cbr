import { Helper } from "./helper";

import { Bin } from "./bin";

export class Trip {
  #id;
  #date;
  #location;
  #payment;
  #bin;
  #closedDate;

  constructor(aux) {
    this.#id = aux.id;
    this.#date = aux.date;
    this.#location = aux.location;
    this.#payment = aux.payment ?? 0;
    this.#bin = aux.bin;
    this.#closedDate = aux.closedDate;
  }

  toAux() {
    return {
      id: this.#id,
      date: this.#date,
      location: this.#location,
      payment: this.#payment,
      bin: this.#bin.name,
      closedDate: this.#closedDate,
    };
  }

  updateTrip(tripDetails) {
    const validatedDetails = this.constructor.validateDetails(tripDetails);

    if (
      this.#date.getTime() !== validatedDetails.date.getTime() ||
      (this.#closedDate &&
        this.#closedDate.getTime() !== validatedDetails.closedDate.getTime()) ||
      this.#bin !== validatedDetails.bin
    ) {
      // logic to prevent collision
    }

    this.#date = validatedDetails.date;
    this.#location = validatedDetails.location;
    this.#payment = validatedDetails.payment;
    this.#bin = validatedDetails.bin;
    this.#closedDate = validatedDetails.closedDate;
  }

  deleteTrip() {}

  setPayment(payment) {
    this.updateTrip({ ...this.toAux(), payment: payment });
  }

  closeTrip(loadDate) {}

  static #vacancyValidation = true;
  static #db;

  static init(db) {
    this.#db = db;
  }

  static toggleVacancyValidation() {
    this.#vacancyValidation = !this.#vacancyValidation;
  }

  static createTrip(tripDetails) {
    const validatedDetails = this.validateDetails(tripDetails);

    const tripId = Helper.generateId();

    return new Trip({ ...validatedDetails, id: tripId });
  }

  static validateDetails(tripDetails) {
    const tripDate = new Date(tripDetails.date);

    if (!(tripDetails.location instanceof String)) {
      throw new Error("invalid location");
    }

    if (tripDetails.payment && !(tripDetails instanceof Number)) {
      throw new Error("invalid payment");
    }

    const bin = Bin.allBins[tripDetails.binName];

    if (!(bin instanceof Bin)) {
      throw new Error("invalid bin");
    }

    if (this.#vacancyValidation && !bin.checkVacancy()) {
      throw new Error("bin is not vacant");
    }

    let closedDate;

    if (tripDetails.closedDate) {
      closedDate = new Date(tripDetails.closedDate);

      if (closedDate < tripDate) {
        throw new Error("closed date is earlier than trip date");
      }
    }

    return {
      date: tripDate,
      location: tripDetails.location,
      action: tripDetails.action,
      payment: tripDetails.payment,
      bin: bin,
      closedDate: closedDate,
    };
  }

  static get db() {
    return this.#db;
  }
}
