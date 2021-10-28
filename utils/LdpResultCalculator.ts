import bigDecimal from 'js-big-decimal';
import {type} from "os";

interface InputValues {
  quantity: string,
  exchangeRate: string,
  clearancePrice: string,
  taxRate: string,
  trucking: string,
  volume: string,
  estimatedFeePerUnit: string,
  estimatedFeePerContainer: string,
}

interface VolumeBasedFees {
  landShippingFee: string,
  oceanShippingFee: string,
  destinationPortFee: string,
}

interface ResultAndFees extends VolumeBasedFees {
  duty: string,
  volumeWithoutContainer: string,
  containerNum: string,
}

export default function calcLdp(inputValues: InputValues): ResultAndFees {
  const quantity = inputValues.quantity;
  const exchangeRate = inputValues.exchangeRate;
  const clearancePrice = inputValues.clearancePrice;
  const taxRate = inputValues.taxRate;
  const trucking = inputValues.trucking;
  const totalUnitsVolume = inputValues.volume;
  const estimatedFeePerUnit = inputValues.estimatedFeePerUnit;
  const estimatedFeePerContainer = inputValues.estimatedFeePerContainer;

  const volumePerContainer: number = 65;

  // 计算整柜数量和剩余散柜体积
  const containerNum = bigDecimal.floor(bigDecimal.divide(bigDecimal.ceil(totalUnitsVolume), volumePerContainer, 1));
  const volumeWithoutContainer = bigDecimal.add(
    bigDecimal.modulus(bigDecimal.floor(totalUnitsVolume), volumePerContainer), // 整数部分
    bigDecimal.round(parseFloat(totalUnitsVolume) % 1, 10), // 小数部分
  );
  console.log('柜数' + containerNum);
  console.log('散货体积' + volumeWithoutContainer);

  // 计算关税（体积无关）
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

  // // 散柜部分
  // if (inputValues.type === 'bulk') {
  //   landShippingFee = bigDecimal.add(
  //     bigDecimal.divide(100, exchangeRate, 2),
  //     bigDecimal.divide(100, exchangeRate, 2)
  //   );
  //   oceanShippingFee = bigDecimal.add(
  //     bigDecimal.multiply(volume, estimatedFeePerUnit),
  //     30
  //   );
  //   destinationPortFee = bigDecimal.add(
  //     bigDecimal.add(
  //       bigDecimal.add(85, 65),
  //       trucking
  //     ),
  //     bigDecimal.add(
  //       bigDecimal.multiply(volume, 3),
  //       bigDecimal.add(
  //         bigDecimal.multiply(volume, 10),
  //         bigDecimal.multiply(volume, 35))
  //     )
  //   );
  // } else {
  //   // whole 整柜
  //   landShippingFee = bigDecimal.divide(
  //     480 + 450 + 1230 + 50 + 100 + 100 + 800 + 1000,
  //     exchangeRate,
  //     2
  //   );
  //   oceanShippingFee = bigDecimal.add(
  //     estimatedFeePerContainer, 30
  //   );
  //   destinationPortFee = bigDecimal.add(
  //     bigDecimal.add(
  //       bigDecimal.add(85, 65),
  //       trucking
  //     ),
  //     35 + 134 + 200 + 75 + 300 + 150
  //   )
  // }

  const unitBasedFees: VolumeBasedFees = calcUnitBasedFees(exchangeRate, trucking, estimatedFeePerUnit, volumeWithoutContainer)
  const containerBasedFees: VolumeBasedFees = calcContainerBasedFees(exchangeRate, trucking, estimatedFeePerContainer, containerNum)

  return {
    landShippingFee: (bigDecimal.add(
      unitBasedFees.landShippingFee,
      containerBasedFees.landShippingFee
    )),
    oceanShippingFee: (bigDecimal.add(
      unitBasedFees.oceanShippingFee,
      containerBasedFees.oceanShippingFee
    )),
    duty,
    destinationPortFee: (bigDecimal.add(
      unitBasedFees.destinationPortFee,
      containerBasedFees.destinationPortFee
    )),
    volumeWithoutContainer,
    containerNum,
  };
}

function calcUnitBasedFees(exchangeRate: string, trucking: string, estimatedFeePerUnit: string, volume: string): VolumeBasedFees {
  const landShippingFee = bigDecimal.add(
    bigDecimal.divide(100, exchangeRate, 2),
    bigDecimal.divide(100, exchangeRate, 2)
  );
  const oceanShippingFee = bigDecimal.add(
    bigDecimal.multiply(volume, estimatedFeePerUnit),
    30
  );
  const destinationPortFee = bigDecimal.add(
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
  return {
    landShippingFee,
    oceanShippingFee,
    destinationPortFee
  };
}

function calcContainerBasedFees(exchangeRate: string, trucking: string, estimatedFeePerContainer: string, containerNum: string): VolumeBasedFees {
  const landShippingFee = bigDecimal.divide(
    480 + 450 + 1230 + 50 + 100 + 100 + 800 + 1000,
    exchangeRate,
    2
  );
  const oceanShippingFee = bigDecimal.add(
    estimatedFeePerContainer, 30
  );
  const destinationPortFee = bigDecimal.add(
    bigDecimal.add(
      bigDecimal.add(85, 65),
      trucking
    ),
    35 + 134 + 200 + 75 + 300 + 150
  );
  return {
    landShippingFee: bigDecimal.multiply(landShippingFee, containerNum),
    oceanShippingFee: bigDecimal.multiply(oceanShippingFee, containerNum),
    destinationPortFee: bigDecimal.multiply(destinationPortFee, containerNum),
  };
}
