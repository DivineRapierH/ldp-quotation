export interface PLFormValues {
  companyName: string,
  factoryName: string,
  poName: string,
  style: string,
  quantityPerCarton: number,
  weightPerPieceInKg: string,
  cartonBoxWeightInKg: string,
  colorSizeQuantityList: [
    {
      packageType: string,
      color: string,
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
  weightPerPieceInKg: string,
  quantityPerCarton: number,
  cartonBoxWeightInKg: string,
  colorSizeQuantityList: [
    {
      packageType: string,
      color: string,
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
