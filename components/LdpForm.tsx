import {Button, Form, Col, Row, Input, Select} from "antd";
import React from "react";

interface TruckingOptions {
  name: string,
  fee: number,
}

export interface LdpFormResult {
  productName: string,
  quantity: string,
  exchangeRate: string,
  clearancePrice: string,
  taxRate: string,
  trucking: string,
  length: string,
  width: string,
  height: string,
  numPerBox: string,
  estimatedFeePerUnit: string,
  estimatedFeePerContainer: string,
}

export default function LdpForm(
  {
    onFinish,
    truckingOptions,
    onFormUnsavedChange
  }: {
    onFinish: (values: LdpFormResult) => void,
    truckingOptions: Array<TruckingOptions>,
    onFormUnsavedChange: () => void
  }) {

  const [form] = Form.useForm();

  // not used
  const currencySelector = (
    <Form.Item name="currencySelector" noStyle>
      <Select style={{width: 70}}>
        <Select.Option value="USD">$</Select.Option>
        <Select.Option value="CNY">¥</Select.Option>
      </Select>
    </Form.Item>
  );

  return (
    <Form
      form={form}
      name="advanced_search"
      className="ant-advanced-search-form"
      onValuesChange={(changedValues, allValues) => {
        onFormUnsavedChange()
      }}
      onFinish={values => {
        onFinish(values);
      }}
    >
      <Row gutter={24}>
        <Col span={8} key="productName">
          <Form.Item
            name="productName"
            label="款号"
            rules={[
              {
                required: true,
                message: '请输入款号!',
              },
            ]}
          >
            <Input type="text"/>
          </Form.Item>
        </Col>
        <Col span={8} key="quantity">
          <Form.Item
            name="quantity"
            label="件数"
            rules={[
              {
                required: true,
                message: '请输入件数!',
              },
              {
                pattern: /^[1-9]\d*$/,
                message: '请输入正整数！',
              }
            ]}
          >
            <Input placeholder="单票或单柜件数" type="number"/>
          </Form.Item>
        </Col>
        <Col span={8} key="exchangeRate">
          <Form.Item
            name="exchangeRate"
            label="汇率"
            tooltip="1美元兑人民币"
            rules={[
              {
                required: true,
                message: '请输入汇率!',
              },
              {
                pattern: /^[0-9]+(.[0-9]+)?$/,
                message: '请输入正确的汇率！',
              }
            ]}
          >
            <Input type="number" step=".01"/>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8} key="clearancePrice">
          <Form.Item
            name="clearancePrice"
            label="清关价"
            rules={[
              {
                required: true,
                message: '请输入清关价!',
              },
              {
                pattern: /^[0-9]+(.[0-9]+)?$/,
                message: '请输入正确的价格！',
              }
            ]}
          >
            <Input type="number" step=".01" prefix="$"/>
          </Form.Item>
        </Col>
        <Col span={8} key="taxRate">
          <Form.Item
            name="taxRate"
            label="税率"
            rules={[
              {
                required: true,
                message: '请输入税率!',
              },
              {
                pattern: /^[0-9]+(.[0-9]+)?$/,
                message: '请输入正确的税率！',
              }
            ]}
          >
            <Input type="number" step=".01" suffix="%"/>
          </Form.Item>
        </Col>
        <Col span={8} key="trucking">
          <Form.Item
            name="trucking"
            label="Trucking"
            rules={[
              {
                required: true,
                message: '请选择 Trucking!',
              },
            ]}
          >
            <Select>
              {truckingOptions.map(opt => (
                <Select.Option value={opt.name} key={opt.name}>
                  {`${opt.name} ($${opt.fee})`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8} key="length">
          <Form.Item
            name="length"
            label="预估箱子长度"
            rules={[
              {
                required: true,
                message: '请输入预估长度!',
              },
              {
                pattern: /^[0-9]+(.[0-9]+)?$/,
                message: '请输入正确的长度！',
              }
            ]}
          >
            <Input type="number" step=".01" suffix="cm"/>
          </Form.Item>
        </Col>
        <Col span={8} key="width">
          <Form.Item
            name="width"
            label="预估箱子宽度"
            rules={[
              {
                required: true,
                message: '请输入预估宽度!',
              },
              {
                pattern: /^[0-9]+(.[0-9]+)?$/,
                message: '请输入正确的宽度！',
              }
            ]}
          >
            <Input type="number" step=".01" suffix="cm"/>
          </Form.Item>
        </Col>
        <Col span={8} key="height">
          <Form.Item
            name="height"
            label="预估箱子高度"
            rules={[
              {
                required: true,
                message: '请输入预估高度!',
              },
              {
                pattern: /^[0-9]+(.[0-9]+)?$/,
                message: '请输入正确的长度！',
              }
            ]}
          >
            <Input type="number" step=".01" suffix="cm"/>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8} key="numPerBox">
          <Form.Item
            name="numPerBox"
            label="每箱件数"
            rules={[
              {
                required: true,
                message: '请输入每箱件数!',
              },
              {
                pattern: /^[1-9]\d*$/,
                message: '请输入正确的每箱件数!',
              },
            ]}
          >
            <Input type="number" step="1" suffix="件/箱"/>
          </Form.Item>
        </Col>
        <Col span={8} key="estimatedFeePerUnit">
          <Form.Item
            name="estimatedFeePerUnit"
            label="预计散货海运费"
            rules={[
              {
                required: true,
                message: '请输入预计散货海运费!',
              },
              {
                pattern: /^[0-9]+(.[0-9]+)?$/,
                message: '请输入正确的价格！',
              }
            ]}
          >
            <Input type="number" step=".01" prefix="$"/>
          </Form.Item>
        </Col>
        <Col span={8} key="estimatedFeePerContainer">
          <Form.Item
            name="estimatedFeePerContainer"
            label="预计整柜海运费"
            rules={[
              {
                required: true,
                message: '请输入预计整柜海运费!',
              },
              {
                pattern: /^[0-9]+(.[0-9]+)?$/,
                message: '请输入正确的价格！',
              }
            ]}
          >
            <Input type="number" step=".01" prefix="$"/>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{textAlign: 'right'}}>
          <Button type="primary" htmlType="submit">
            计算
          </Button>
          <Button
            style={{margin: '0 8px'}}
            onClick={() => {
              form.resetFields();
            }}
          >
            重置
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
