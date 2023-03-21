export interface PLFormValues {
  companyName: string,
  factoryName: string,
  poName: string,
  style: string,
  ref: string|null,
  quantityPerCarton: number,
  weightPerPieceInKg: string,
  cartonBoxWeightInKg: string,
  colorSizeQuantityList: [
    {
      packageType: string,
      color: string,
      colorCode: string|null,
      cartonMeasurementsInCm: {
        L: string,
        W: string,
        H: string
      },
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
  ref: string|null,
  weightPerPieceInKg: string,
  quantityPerCarton: number,
  cartonBoxWeightInKg: string,
  colorSizeQuantityList: [
    {
      packageType: string,
      color: string,
      colorCode: string|null,
      cartonMeasurementsInCm: {
        L: string,
        W: string,
        H: string
      },
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
