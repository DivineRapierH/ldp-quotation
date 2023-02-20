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
  const taxRatePercent = inputValues.taxRate;
  const trucking = inputValues.trucking;
  const totalUnitsVolume = inputValues.volume;
  const estimatedFeePerUnit = inputValues.estimatedFeePerUnit;
  const estimatedFeePerContainer = inputValues.estimatedFeePerContainer;

  const volumePerContainer: number = 65;

  // 计算整柜数量和剩余散柜体积
  const containerNum = bigDecimal.floor(bigDecimal.divide(totalUnitsVolume, volumePerContainer, 8));
  const volumeWithoutContainer = bigDecimal.add(
    bigDecimal.modulus(bigDecimal.floor(totalUnitsVolume), volumePerContainer), // 整数部分
    bigDecimal.round(parseFloat(totalUnitsVolume) % 1, 10), // 小数部分
  );
  console.log('柜数' + containerNum);
  console.log('散货体积' + volumeWithoutContainer);

  // 计算关税（体积无关）
  const totalClearance: string = bigDecimal.multiply(quantity, clearancePrice);
  // H/M 港口维护费
  const HMPortMaintainingRate: string = '0.001250';
  // M/P 货物处理费
  const MPCargoRate: string = '0.003464';
  const duty = bigDecimal.add(
    bigDecimal.multiply(
      totalClearance,
      bigDecimal.divide(taxRatePercent, 100, 3)
    ),
    bigDecimal.add(
      bigDecimal.multiply(HMPortMaintainingRate, totalClearance),
      bigDecimal.multiply(MPCargoRate, totalClearance))
  );

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

function calcUnitBasedFees(exchangeRate: string,
                           trucking: string,
                           estimatedFeePerUnit: string,
                           volume: string): VolumeBasedFees {
  // 内陆费
  // 报关费 RMB
  const clearanceFeeRMB: number = 100;
  // 舱单费 RMB
  const chamberOrderFeeRMB: number = 100;
  const landShippingFee = bigDecimal.add(
    bigDecimal.divide(clearanceFeeRMB, exchangeRate, 2),
    bigDecimal.divide(chamberOrderFeeRMB, exchangeRate, 2)
  );

  // 海运费
  // AMS
  const amsFee: number = 30;
  const oceanShippingFee = bigDecimal.add(
    bigDecimal.multiply(volume, estimatedFeePerUnit),
    amsFee
  );

  // fee per volume
  // entry
  const entryFeePerVolume: number = 85;
  // H/D charge
  const hdChargeFeePerVolume: number = 65;
  // chassis charge
  const chassisChargeFeePerVolume: number = 3;
  // pallet
  const palletFeePerVolume: number = 10;
  // folk lift charge
  const folkLiftChargeFeePerVolume: number = 49;
  // 目的港费用
  const destinationPortFee = bigDecimal.add(
    bigDecimal.add(
      bigDecimal.add(entryFeePerVolume, hdChargeFeePerVolume),
      trucking
    ),
    bigDecimal.add(
      bigDecimal.multiply(volume, chassisChargeFeePerVolume),
      bigDecimal.add(
        bigDecimal.multiply(volume, palletFeePerVolume),
        bigDecimal.multiply(volume, folkLiftChargeFeePerVolume))
    )
  );
  return {
    landShippingFee,
    oceanShippingFee,
    destinationPortFee
  };
}

function calcContainerBasedFees(exchangeRate: string,
                                trucking: string,
                                estimatedFeePerContainer: string,
                                containerNum: string): VolumeBasedFees {
  // domestic part
  // 订舱费
  const chamberReservationFeeRMB: number = 480;
  // 单证费
  const singleCertFeeRMB: number = 450;
  // THC
  const THCFeeRMB: number = 1230;
  // 铅封费
  const sealFeeRMB: number = 50;
  // 报关费
  const clearanceFeeRMB: number = 100;
  // 舱单费
  const chamberOrderFeeRMB: number = 100;
  // 内装
  const innerFeeRMB: number = 800;
  // 洋山港
  const yangShanFeeRMB: number = 1000;
  const landShippingFee = bigDecimal.divide(
    chamberReservationFeeRMB + singleCertFeeRMB + THCFeeRMB + sealFeeRMB + clearanceFeeRMB +
    chamberOrderFeeRMB + innerFeeRMB + yangShanFeeRMB,
    exchangeRate,
    2
  );

  // transit part
  const amsFee: number = 30;
  const oceanShippingFee = bigDecimal.add(
    estimatedFeePerContainer, amsFee
  );

  // foreign part
  // entry fee
  const entryFee: number = 85;
  // H/D charge fee
  const hdChargeFee: number = 65;
  // ISF filing fee
  const isfFilingFee: number = 35;
  // ISF bond fee
  const isfBondFee: number = 0;
  // pier pass fee
  const pierPassFee: number = 134;
  // chassis charge fee
  const chassisChargeFee: number = 200;
  // clean truck fee
  const cleanTruckFee: number = 75;
  // pre-pull fee
  const prePullFee: number = 300;
  // congestion fee
  const congestionFee: number = 150;
  const destinationPortFee = bigDecimal.add(
    bigDecimal.add(
      bigDecimal.add(entryFee, hdChargeFee),
      trucking
    ),
    isfFilingFee + isfBondFee + pierPassFee + chassisChargeFee + cleanTruckFee + prePullFee + congestionFee
  );
  return {
    landShippingFee: bigDecimal.multiply(landShippingFee, containerNum),
    oceanShippingFee: bigDecimal.multiply(oceanShippingFee, containerNum),
    destinationPortFee: bigDecimal.multiply(destinationPortFee, containerNum),
  };
}
