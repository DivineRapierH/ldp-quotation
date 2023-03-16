import {Button, Col, Divider, Form, Input, InputNumber, Row, Select, Space} from "antd";
import React from "react";
import {PLFormValues, PLRequestValues} from "./DTOs";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

export default function PLFrom({onSubmit, isLoading}: {
  onSubmit: (values: PLRequestValues) => void,
  isLoading: boolean
}) {
  const [form] = Form.useForm();
  const sizeConstants = [
    {value: 'XXS', label: 'XXS'},
    {value: 'XS', label: 'XS'},
    {value: 'S', label: 'S'},
    {value: 'M', label: 'M'},
    {value: 'L', label: 'L'},
    {value: 'XL', label: 'XL'},
    {value: 'XXL', label: 'XXL'},
    {value: '1X', label: '1X'},
    {value: '2X', label: '2X'},
    {value: '3X', label: '3X'},
    {value: '4X', label: '4X'},
    {value: '5X', label: '5X'},
  ];

  return (
    <Form
      form={form}
      name="pl_form"
      layout={'vertical'}
      onFinish={values => {
        const plRequestValues: PLRequestValues = {
          companyName: values.companyName,
          factoryName: values.factoryName,
          poName: values.poName,
          style: values.style,
          weightPerPieceInKg: values.weightPerPieceInKg,
          cartonBoxWeightInKg: values.cartonBoxWeightInKg,
          quantityPerCarton: parseInt(values.quantityPerCarton),
          colorSizeQuantityList: values.colorSizeQuantityList,
        };
        onSubmit(plRequestValues);
      }}
    >
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item
            name="companyName"
            label="公司"
            initialValue={"苏州市新大华泰进出口有限公司"}
            rules={[
              {
                required: true,
                message: '请选择公司!',
              },
            ]}
          >
            <Select
              options={[
                {value: '苏州市新大华泰进出口有限公司', label: '苏州市新大华泰进出口有限公司'},
                {value: '苏州市新恒大进出口有限公司', label: '苏州市新恒大进出口有限公司'},
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="factoryName"
            label="加工工厂"
            rules={[
              {
                required: true,
                message: '请输入加工工厂名称!',
              },
            ]}
          >
            <Input type="text"/>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="poName"
            label="PO NO."
            rules={[
              {
                required: true,
                message: '请输入 PO NO. !',
              },
            ]}
          >
            <Input type="text"/>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="style"
            label="STYLE#"
            rules={[
              {
                required: true,
                message: '请输入 STYLE# !',
              },
            ]}
          >
            <Input type="text"/>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item
            name="quantityPerCarton"
            label="QTY/CTN"
            normalize={value => parseInt(value)}
            rules={[
              {
                required: true,
                message: '请输入 QTY/CTN !',
              },
            ]}
          >
            <Input type="number"/>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="weightPerPieceInKg"
            label="单件净重 (KG)"
            rules={[
              {
                required: true,
                message: '请输入 单件净重 !',
              },
            ]}
          >
            <Input type="text"/>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="cartonBoxWeightInKg"
            label="单个纸箱重量 (KG)"
            rules={[
              {
                required: true,
                message: '请输入 单个纸箱重量 !',
              },
            ]}
          >
            <Input type="text"/>
          </Form.Item>
        </Col>
      </Row>
      <Divider orientation="left">颜色尺码数量:</Divider>
      <Form.List name="colorSizeQuantityList">
        {(colorFields, {add, remove}) => (
          <>
            {colorFields.map((colorField, index) => (
              <div key={colorField.key + 'container'}>
                <Row key={colorField.key + 'main'}>
                  <Col span={6}>
                    <Form.Item
                      {...colorField}
                      label="颜色"
                      name={[colorField.name, 'color']}
                      key={colorField.key + 'color'}
                      rules={[{required: true, message: '请输入颜色!'}]}
                    >
                      <Input/>
                    </Form.Item>
                  </Col>
                  <Col span={6} offset={1}>
                    <Form.Item
                      {...colorField}
                      label="包装方式"
                      name={[colorField.name, 'packageType']}
                      key={colorField.key + 'packageType'}
                      rules={[{required: true, message: '请选择包装方式!'}]}
                      initialValue={'SINGLE_COLOR_SINGLE_SIZE'}
                    >
                      <Select options={[
                        {value: 'SINGLE_COLOR_SINGLE_SIZE', label: '独色独码'},
                        {value: 'SINGLE_COLOR_MULTI_SIZE', label: '独色混码'},
                      ]}/>
                    </Form.Item>
                  </Col>
                  <Col span={2} offset={1}>
                    <MinusCircleOutlined
                      onClick={() => remove(colorField.name)}
                      className={'dynamic-delete-button'}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    Measurements:
                  </Col>
                </Row>
                <Row gutter={24} key={colorField.key + 'measurements'}>
                  <Col span={6}>
                    <Form.Item
                      {...colorField}
                      label="LENGTH (cm)"
                      name={[colorField.name, 'cartonMeasurementsInCm', 'L']}
                      key={colorField.key + index + 'measurementL'}
                      rules={[{required: true, message: '请输入 LENGTH!'}]}
                    >
                      <Input type="text"/>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      {...colorField}
                      label="WIDTH (cm)"
                      name={[colorField.name, 'cartonMeasurementsInCm', 'W']}
                      key={colorField.key + index + 'measurementW'}
                      rules={[{required: true, message: '请输入 WIDTH!'}]}
                    >
                      <Input type="text"/>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      {...colorField}
                      label="HEIGHT (cm)"
                      name={[colorField.name, 'cartonMeasurementsInCm', 'H']}
                      key={colorField.key + index + 'measurementH'}
                      rules={[{required: true, message: '请输入 HEIGHT!'}]}
                    >
                      <Input type="text"/>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  sizes:
                </Row>
                <Row gutter={24}>
                  {sizeConstants.map((sizeConstant, index) => {
                    return (
                      <Col span={4} key={colorField.key + sizeConstant.label + '-card'}>
                        <Form.Item
                          {...colorField}
                          label={sizeConstant.label}
                          name={[colorField.name, 'sizeQuantityRatioList', index, 'size']}
                          key={colorField.key + sizeConstant.label + index + 'size'}
                          initialValue={sizeConstant.value}
                          hidden={true}
                        >
                          <Input/>
                        </Form.Item>
                        <Form.Item
                          {...colorField}
                          label={sizeConstant.value + ' 的数量'}
                          name={[colorField.name, 'sizeQuantityRatioList', index, 'quantity']}
                          key={colorField.key + sizeConstant.label + index + 'quantity'}
                          initialValue={0}
                        >
                          <InputNumber min={0}/>
                        </Form.Item>
                        {(
                          <Form.Item
                            noStyle
                            shouldUpdate
                          >
                            {
                              ({getFieldValue}) => getFieldValue(['colorSizeQuantityList', colorField.name, 'packageType']) === 'SINGLE_COLOR_MULTI_SIZE' ? (
                                <Form.Item
                                  {...colorField}
                                  label={sizeConstant.label + ' 尺码配比'}
                                  name={[colorField.name, 'sizeQuantityRatioList', index, 'ratio']}
                                  key={colorField.key + sizeConstant.label + index + 'ratio'}
                                  rules={[{required: true, message: '请输入尺码配比!'}]}
                                  initialValue={0}
                                >
                                  <InputNumber min={0} size="small"/>
                                </Form.Item>) : null
                            }
                          </Form.Item>
                        )}
                      </Col>
                    )
                  })}
                </Row>

                <Divider/>
              </div>
            ))}
            <Row>
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                  增加颜色
                </Button>
              </Form.Item>
            </Row>
          </>
        )}
      </Form.List>


      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          disabled={isLoading}
        >
          生成 PL Excel
        </Button>
      </Form.Item>
    </Form>
  );

}