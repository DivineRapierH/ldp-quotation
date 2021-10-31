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
  costPerUnitInCNY: string,
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
      render: (fee: number) => <p>{`$ ${fee}`}</p>
    },
    {
      title: '单件成本($)',
      dataIndex: 'costPerUnit',
      key: 'costPerUnit',
      render: (costPerUnit: number) => <p>{`$ ${costPerUnit}`}</p>
    },
    {
      title: '单件成本(¥)',
      dataIndex: 'costPerUnitInCNY',
      key: 'costPerUnitInCNY',
      render: (costPerUnitInCNY: number) => <p>{`¥ ${costPerUnitInCNY}`}</p>
    }
  ];

  const calcCostPerUnit = (totalCost: string): string =>
    bigDecimal.divide(totalCost, resultValues.quantity, 5);

  const convertUSD2CNY = (amount: string): string =>
    bigDecimal.multiply(amount, resultValues.exchangeRate);

  const tableData: TableDisplayValue[] = [
    {
      key: '1',
      feeName: '内陆费',
      fee: resultValues.landShippingFee,
      costPerUnit: calcCostPerUnit(resultValues.landShippingFee),
      costPerUnitInCNY: convertUSD2CNY(calcCostPerUnit(resultValues.landShippingFee)),
    },
    {
      key: '2',
      feeName: '海运费',
      fee: resultValues.oceanShippingFee,
      costPerUnit: calcCostPerUnit(resultValues.oceanShippingFee),
      costPerUnitInCNY: convertUSD2CNY(calcCostPerUnit(resultValues.oceanShippingFee)),
    },
    {
      key: '3',
      feeName: '关税',
      fee: resultValues.duty,
      costPerUnit: calcCostPerUnit(resultValues.duty),
      costPerUnitInCNY: convertUSD2CNY(calcCostPerUnit(resultValues.duty)),
    },
    {
      key: '4',
      feeName: '目的港',
      fee: resultValues.destinationPortFee,
      costPerUnit: calcCostPerUnit(resultValues.destinationPortFee),
      costPerUnitInCNY: convertUSD2CNY(calcCostPerUnit(resultValues.destinationPortFee)),
    }
  ];

  function formatter(tableData: TableDisplayValue) : TableDisplayValue {
    return {
      ...tableData,
      fee: bigDecimal.round(tableData.fee, 2),
      costPerUnit: bigDecimal.round(tableData.costPerUnit, 2),
      costPerUnitInCNY: bigDecimal.round(tableData.costPerUnitInCNY, 2)
    };
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={tableData.map(formatter)}
        pagination={false}
        bordered
        size="small"
        summary={pageData => {
          let totalFee = '0';
          let totalCostPerUnit = '0';
          let totalCostPerUnitCNY = '0';

          pageData.forEach(({ fee, costPerUnit, costPerUnitInCNY }) => {
            totalFee = bigDecimal.add(fee, totalFee);
            totalCostPerUnit = bigDecimal.add(costPerUnit, totalCostPerUnit);
            totalCostPerUnitCNY = bigDecimal.add(costPerUnitInCNY, totalCostPerUnitCNY);
          });

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text >{`$ ${totalFee}`}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Text>{`$ ${totalCostPerUnit}`}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <Text>{`¥ ${totalCostPerUnitCNY}`}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </>
  );
}

export default LdpResultTable;
