import uuid from "uuid";

export class Helper {
  static generateId() {
    return uuid.v4();
  }
}
