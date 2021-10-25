import {Button, Form, Col, Row, Input, Select} from "antd";
import React from "react";

interface TruckingOptions {
  name: string,
  fee: number,
}

export default function LdpForm(
  {
    onFinish,
    truckingOptions,
    onFormUnsavedChange
  }: {
    onFinish: (values: any) => void,
    truckingOptions: Array<TruckingOptions>,
    onFormUnsavedChange: () => void
  }) {

  const [form] = Form.useForm();

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
        <Col span={8} key="type">
          <Form.Item
            name="type"
            label="散柜/整柜"
            rules={[
              {
                required: true,
                message: '请选择!',
              },
            ]}
          >
            <Select>
              <Select.Option value="bulk">散柜</Select.Option>
              <Select.Option value="whole">整柜</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} key="volume">
          <Form.Item
            name="volume"
            label="散货立方数"
            rules={[
              {
                required: true,
                message: '请输入立方数!',
              },
              {
                pattern: /^\d+(\.\d+)?$/,
                message: '请输入正确的立方数',
              }
            ]}
          >
            <Input type="number" step=".01"/>
          </Form.Item>
        </Col>
        <Col span={8} key="estimatedFee">
          <Form.Item
            name="estimatedFee"
            label="预计海运费"
            rules={[
              {
                required: true,
                message: '请输入预计海运费!',
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
