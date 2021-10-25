import bigDecimal from 'js-big-decimal';
import {type} from "os";

interface InputValues {
  quantity: string,
  exchangeRate: string,
  clearancePrice: string,
  taxRate: string,
  trucking: string,
  volume: string,
  type: string,
  estimatedFee: string,
}

interface ResultValues {
  landShippingFee: string,
  oceanShippingFee: string,
  duty: string,
  destinationPortFee: string,
}

export default function calcLdp(inputValues: InputValues): ResultValues {
  const quantity = inputValues.quantity;
  const exchangeRate = inputValues.exchangeRate;
  const clearancePrice = inputValues.clearancePrice;
  const taxRate = inputValues.taxRate;
  const trucking = inputValues.trucking;
  const volume = inputValues.volume;
  const estimatedFee = inputValues.estimatedFee;

  let landShippingFee;
  let oceanShippingFee;
  let destinationPortFee;

  const totalClearance: string = bigDecimal.multiply(quantity, clearancePrice);
  const duty = bigDecimal.add(
    bigDecimal.multiply(
      totalClearance,
      bigDecimal.divide(taxRate, 100, 3)
    ),
    bigDecimal.add(
      bigDecimal.multiply('0.001250', totalClearance),
      bigDecimal.multiply('0.003464', totalClearance))
  );


  if (inputValues.type === 'bulk') {
    landShippingFee = bigDecimal.add(
      bigDecimal.divide(100, exchangeRate, 2),
      bigDecimal.divide(100, exchangeRate, 2)
    );
    oceanShippingFee = bigDecimal.add(
      bigDecimal.multiply(volume, estimatedFee),
      30
    );
    destinationPortFee = bigDecimal.add(
      bigDecimal.add(
        bigDecimal.add(85, 65),
        trucking
      ),
      bigDecimal.add(
        bigDecimal.multiply(volume, 3),
        bigDecimal.add(
          bigDecimal.multiply(volume, 10),
          bigDecimal.multiply(volume, 35))
      )
    );
  } else {
    // whole 整柜
    landShippingFee = bigDecimal.divide(
      480 + 450 + 1230 + 50 + 100 + 100 + 800 + 1000,
      exchangeRate,
      2
    );
    oceanShippingFee = bigDecimal.add(
      estimatedFee, 30
    );
    destinationPortFee = bigDecimal.add(
      bigDecimal.add(
        bigDecimal.add(85, 65),
        trucking
      ),
      35 + 134 + 200 + 75 + 300 + 150
    )
  }
  return {
    landShippingFee,
    oceanShippingFee,
    duty,
    destinationPortFee
  };
}
