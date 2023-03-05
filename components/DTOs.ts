export interface PLFormValues {
  poName: string,
  style: string,
  color: string,
  lineName: string,
  weightPerPieceInKg: string,
  quantityPerCarton: number,
  XXS: number,
  XS: number,
  S: number,
  M: number,
  L: number,
  XL: number,
  measurementL: string,
  measurementW: string,
  measurementH: string
}

export interface PLRequestValues {
  poName: string,
  style: string,
  color: string,
  lineName: string,
  weightPerPieceInKg: string,
  quantityPerCarton: number,
  quantityOfSizes: {
    XXS: number,
    XS: number,
    S: number,
    M: number,
    L: number,
    XL: number
  },
  cartonMeasurements: {
    L: string,
    W: string,
    H: string
  }
}
