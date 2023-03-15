export interface PLFormValues {
  companyName: string,
  factoryName: string,
  poName: string,
  style: string,
  quantityPerCarton: number,
  weightPerPieceInKg: string,
  cartonBoxWeightInKg: string,
  measurementL: string,
  measurementW: string,
  measurementH: string,
  colorSizeQuantityList: [
    {
      packageType: string,
      color: string,
      sizeQuantityRatioList: [
        {
          size: string,
          quantity: number
          ratio: number|null
        }
      ]
    }
  ],
}

export interface PLRequestValues {
  companyName: string,
  factoryName: string,
  poName: string,
  style: string,
  weightPerPieceInKg: string,
  quantityPerCarton: number,
  cartonBoxWeightInKg: string,
  cartonMeasurementsInCm: {
    L: string,
    W: string,
    H: string
  },
  colorSizeQuantityList: [
    {
      packageType: string,
      color: string,
      sizeQuantityRatioList: [
        {
          size: string,
          quantity: number
          ratio: number|null
        }
      ]
    }
  ],
}
