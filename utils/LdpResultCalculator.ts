import bigDecimal from 'js-big-decimal';
import {func} from "prop-types";

export interface TruckingDetail {
  containerFee: string,
  unitBasedFee: {
    volumeLessThan10CBM: string,
    volumeBetween10And20CBM: string,
    volumeMoreThan20CBM: string
  }
}

interface InputValues {
  quantity: string,
  exchangeRate: string,
  clearancePrice: string,
  taxRate: string,
  trucking: TruckingDetail,
  warehouse: string
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

function calcContainerNumAndRemainingVolume(totalUnitsVolume: string)
  : { containerNum: string, volumeWithoutContainer: string } {
  const volumePerContainer: number = 65;
  const doubledVolumePerContainer: bigDecimal = new bigDecimal('130');
  // 体积 / 130 = 2 x 整柜数量 x 65 + 剩余体积 (e.g. 体积为 270, 算式就是 270 / 130 = (2 x 2) x 65 + 10)
  // 计算整柜数量和剩余散柜体积
  const halfOfContainerNum: bigDecimal = new bigDecimal(
    bigDecimal.floor(
      bigDecimal.divide(
        totalUnitsVolume,
        doubledVolumePerContainer.getValue(),
        8))
  );
  const volumeRemaining: bigDecimal = new bigDecimal(
    bigDecimal.subtract(
      totalUnitsVolume,
      halfOfContainerNum.multiply(doubledVolumePerContainer).getValue())
  );
  // console.log('剩余体积 ' + volumeRemaining.getValue())
  // 剩余体积 ≥ 100 则再加 2 个整柜
  // 65 < 剩余体积 ≤ 99 则再加 1 个整柜，剩余作为散货
  // 50 ≤ 剩余体积 ≤ 65 则再加 1 个整柜
  // 剩余体积 < 50 则全部作为散货
  let extraContainerNum: bigDecimal = new bigDecimal(0);
  let volumeWithoutContainer: string = "0";
  if (volumeRemaining.compareTo(new bigDecimal(100)) >= 0) {
    // 剩余体积 ≥ 100 则再加 2 个整柜
    extraContainerNum = extraContainerNum.add(new bigDecimal(2));
  } else if (volumeRemaining.compareTo(new bigDecimal(65)) === 1) {
    // 65 < 剩余体积 ≤ 99 则再加 1 个整柜，剩余作为散货
    extraContainerNum = extraContainerNum.add(new bigDecimal(1));
    volumeWithoutContainer = volumeRemaining.subtract(new bigDecimal(65)).getValue();
  } else if (volumeRemaining.compareTo(new bigDecimal(50)) >= 0) {
    // 50 ≤ 剩余体积 ≤ 65 则再加 1 个整柜
    extraContainerNum = extraContainerNum.add(new bigDecimal(1));
  } else {
    // 剩余体积 < 50 则全部作为散货
    volumeWithoutContainer = volumeRemaining.getValue();
  }
  const containerNum: string = halfOfContainerNum.multiply(new bigDecimal(2)).add(extraContainerNum).getValue();
  // console.log('柜数' + containerNum);
  // console.log('散货体积' + volumeWithoutContainer);

  return {containerNum, volumeWithoutContainer};
}

function getUnitBasedTruckingFee(trucking: TruckingDetail, volume: string): string {
  const decimalVolume = new bigDecimal(volume);
  if (decimalVolume.compareTo(new bigDecimal(10)) === -1) {
    // 10 cbm 以内
    return trucking.unitBasedFee.volumeLessThan10CBM;
  } else if (decimalVolume.compareTo(new bigDecimal(20)) <= 0) {
    // 10 - 20 cbm
    return trucking.unitBasedFee.volumeBetween10And20CBM;
  } else {
    // 20 cbm 以上
    return trucking.unitBasedFee.volumeMoreThan20CBM;
  }
}

export default function calcLdp(inputValues: InputValues): ResultAndFees {
  const quantity = inputValues.quantity;
  const exchangeRate = inputValues.exchangeRate;
  const clearancePrice = inputValues.clearancePrice;
  const taxRatePercent = inputValues.taxRate;
  const trucking = inputValues.trucking;
  const warehouse = inputValues.warehouse;
  const totalUnitsVolume = inputValues.volume;
  const estimatedFeePerUnit = inputValues.estimatedFeePerUnit;
  const estimatedFeePerContainer = inputValues.estimatedFeePerContainer;

  const {containerNum, volumeWithoutContainer} = calcContainerNumAndRemainingVolume(totalUnitsVolume);

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

  const unitBasedFees: VolumeBasedFees = calcUnitBasedFees(
    warehouse,
    exchangeRate,
    getUnitBasedTruckingFee(trucking, volumeWithoutContainer),
    estimatedFeePerUnit,
    volumeWithoutContainer)
  const containerBasedFees: VolumeBasedFees = calcContainerBasedFees(
    exchangeRate,
    trucking.containerFee,
    estimatedFeePerContainer,
    containerNum)

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

function calcUnitBasedFees(warehouse: string,
                           exchangeRate: string,
                           trucking: string,
                           estimatedFeePerUnit: string,
                           volume: string): VolumeBasedFees {
  if (volume === '0') {
    return {
      landShippingFee: "0",
      oceanShippingFee: "0",
      destinationPortFee: "0"
    };
  }
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
  // DOC fee
  const docFee: number = 55;
  // ISF filing fee
  const isfFilingFee: number = 35;
  // ISF bond fee
  const isfBondFee: number = 250;
  // chassis charge
  const chassisChargeFeePerVolume: number =
    warehouse === 'LA' ? 3 : 3;
  // pallet
  const palletFeePerVolume: string =
    warehouse === 'LA' ?
      bigDecimal.divide(25, '1.5', 8) :
      bigDecimal.divide(25, '1.5', 8);
  // folk lift charge
  const folkLiftChargeFeePerVolume: number =
    warehouse === 'LA' ? 35 : 70;
  // 目的港费用
  const destinationPortFee = bigDecimal.add(
    bigDecimal.add(
      bigDecimal.add(
        bigDecimal.add(bigDecimal.add(entryFeePerVolume, hdChargeFeePerVolume), docFee),
        trucking
      ),
      isfFilingFee + isfBondFee
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
  // VGM
  const VGMFeeRMB: number = 50;
  // 铅封费
  const sealFeeRMB: number = 50;
  // 报关费
  const clearanceFeeRMB: number = 100;
  // 舱单费
  const chamberOrderFeeRMB: number = 100;
  // 内装
  const innerFeeRMB: number = 950;
  // 洋山港
  const yangShanFeeRMB: number = 1000;
  const landShippingFee = bigDecimal.divide(
    chamberReservationFeeRMB + singleCertFeeRMB + VGMFeeRMB + THCFeeRMB + sealFeeRMB + clearanceFeeRMB +
    chamberOrderFeeRMB + innerFeeRMB + yangShanFeeRMB,
    exchangeRate,
    2
  );

  // transit part
  const amsFee: number = 35;
  const oceanShippingFee = bigDecimal.add(
    estimatedFeePerContainer, amsFee
  );

  // foreign part
  // entry fee
  const entryFee: number = 85;
  // H/D charge fee
  const hdChargeFee: number = 65;
  // DOC fee
  const docFee: number = 55;
  // ISF filing fee
  const isfFilingFee: number = 35;
  // ISF bond fee
  const isfBondFee: number = 250;
  // pier pass fee
  const pierPassFee: number = 100;
  // chassis charge fee
  const chassisChargeFee: number = 350;
  // clean truck fee
  const cleanTruckFee: number = 50;
  // pre-pull fee
  const prePullFee: number = 150;
  // congestion fee
  const congestionFee: number = 150;
  // overdue fee (per diem?)
  const overdueFee: number = 300;
  // chassis split fee
  const chassisSplitFee: number = 100;
  const destinationPortFee = bigDecimal.add(
    bigDecimal.add(
      bigDecimal.add(bigDecimal.add(entryFee, hdChargeFee), docFee),
      trucking
    ),
    isfFilingFee + isfBondFee + pierPassFee + chassisChargeFee + cleanTruckFee + prePullFee + congestionFee +
    overdueFee + chassisSplitFee
  );
  return {
    landShippingFee: bigDecimal.multiply(landShippingFee, containerNum),
    oceanShippingFee: bigDecimal.multiply(oceanShippingFee, containerNum),
    destinationPortFee: bigDecimal.multiply(destinationPortFee, containerNum),
  };
}
