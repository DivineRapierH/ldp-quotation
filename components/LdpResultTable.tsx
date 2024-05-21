import bigDecimal from "js-big-decimal";
import React from "react";
import {Table, Typography} from "antd";
const { Text } = Typography;

export interface Props {
  resultValues: TableValue
}

interface TableValue {
  landShippingFee: string,
  oceanShippingFee: string,
  duty: string,
  destinationPortFee: string,
  quantity: string,
  exchangeRate: string, // $1 to ¥?
}

interface TableDisplayValue {
  key: string,
  feeName: string,
  fee: string,
  costPerUnit: string,
  // costPerUnitInCNY: string,
}

const LdpResultTable = ({resultValues} : Props) => {
  const columns = [
    {
      title: '名称',
      dataIndex: 'feeName',
      key: 'feeName',
    },
    {
      title: '费用',
      dataIndex: 'fee',
      key: 'fee',
      render: (fee: number) => <p>{`${fee}`}</p>
    },
    {
      title: '单件成本',
      dataIndex: 'costPerUnit',
      key: 'costPerUnit',
      render: (costPerUnit: number) => <p>{`${costPerUnit}`}</p>
    },
    // {
    //   title: '单件成本(¥)',
    //   dataIndex: 'costPerUnitInCNY',
    //   key: 'costPerUnitInCNY',
    //   render: (costPerUnitInCNY: number) => <p>{`¥${costPerUnitInCNY}`}</p>
    // }
  ];

  const calcCostPerUnit = (totalCost: string): string =>
    bigDecimal.divide(totalCost, resultValues.quantity, 5);

  const convertUSD2CNY = (amount: string): string => {
    return bigDecimal.multiply(amount, resultValues.exchangeRate);
  }


  const tableData: TableDisplayValue[] = [
    {
      key: '1',
      feeName: '内陆费',
      fee: `¥${bigDecimal.round(convertUSD2CNY(resultValues.landShippingFee), 2)}`,
      costPerUnit: `¥${bigDecimal.round(convertUSD2CNY(calcCostPerUnit(resultValues.landShippingFee)), 2)}`,
      // costPerUnitInCNY: convertUSD2CNY(calcCostPerUnit(resultValues.landShippingFee)),
    },
    {
      key: '2',
      feeName: '海运费',
      fee: `$${bigDecimal.round(resultValues.oceanShippingFee, 2)}`,
      costPerUnit: `$${bigDecimal.round(calcCostPerUnit(resultValues.oceanShippingFee), 2)}`
      // costPerUnitInCNY: convertUSD2CNY(calcCostPerUnit(resultValues.oceanShippingFee)),
    },
    {
      key: '3',
      feeName: '关税',
      fee: `$${bigDecimal.round(resultValues.duty, 2)}`,
      costPerUnit: `$${bigDecimal.round(calcCostPerUnit(resultValues.duty), 2)}`
      // costPerUnitInCNY: convertUSD2CNY(calcCostPerUnit(resultValues.duty)),
    },
    {
      key: '4',
      feeName: '目的港',
      fee: `$${bigDecimal.round(resultValues.destinationPortFee, 2)}`,
      costPerUnit: `$${bigDecimal.round(calcCostPerUnit(resultValues.destinationPortFee), 2)}`,
      // costPerUnitInCNY: convertUSD2CNY(calcCostPerUnit(resultValues.destinationPortFee)),
    }
  ];

  function formatter(tableData: TableDisplayValue) : TableDisplayValue {
    return {
      ...tableData,
      fee: bigDecimal.round(tableData.fee, 2),
      costPerUnit: bigDecimal.round(tableData.costPerUnit, 2),
      // costPerUnitInCNY: bigDecimal.round(tableData.costPerUnitInCNY, 2)
    };
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        bordered
        size="small"
      />
    </>
  );
}

export default LdpResultTable;
