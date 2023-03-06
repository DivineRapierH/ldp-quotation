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
  packageType: string,
  poName: string,
  style: string,
  color: string,
  lineName: string,
  weightPerPieceInKg: string,
  quantityPerCarton: number,
  totalQuantityOfSizes: {
    XXS: number,
    XS: number,
    S: number,
    M: number,
    L: number,
    XL: number
  },
  cartonMeasurementsInCm: {
    L: string,
    W: string,
    H: string
  }
}
