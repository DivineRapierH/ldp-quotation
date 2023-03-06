import {Button, Col, Form, Input, Row} from "antd";
import React from "react";
import {PLFormValues, PLRequestValues} from "./DTOs";

export default function PLFrom({onSubmit, isLoading}: {
  onSubmit: (values: PLRequestValues) => void,
  isLoading: boolean
}) {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      name="pl_form"
      onFinish={values => {
        const plRequestValues: PLRequestValues = {
          packageType: "SINGLE_COLOR_SINGLE_SIZE",
          poName: values.poName,
          style: values.style,
          color: values.color,
          lineName: values.lineName,
          weightPerPieceInKg: values.weightPerPieceInKg,
          quantityPerCarton: parseInt(values.quantityPerCarton),
          totalQuantityOfSizes: {
            XXS: parseInt(values.XXS),
            XS: parseInt(values.XS),
            S: parseInt(values.S),
            M: parseInt(values.M),
            L: parseInt(values.L),
            XL: parseInt(values.XL),
          },
          cartonMeasurementsInCm: {
            L: values.measurementL,
            W: values.measurementW,
            H: values.measurementH,
          }
        };
        onSubmit(plRequestValues);
      }}
    >
      <Row gutter={24}>
        <Col span={8}>
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
        <Col span={8}>
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
        <Col span={8}>
          <Form.Item
            name="color"
            label="COLOR"
            rules={[
              {
                required: true,
                message: '请输入 COLOR !',
              },
            ]}
          >
            <Input type="text"/>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name="lineName"
            label="LINE"
            rules={[
              {
                required: true,
                message: '请输入 LINE !',
              },
            ]}
          >
            <Input type="text"/>
          </Form.Item>
        </Col>
        <Col span={8}>
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
        <Col span={8}>
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
      </Row>
      <Row>
        <Col span={8}>
          Size:
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={4}>
          <Form.Item
            name="XXS"
            label="XXS 数量"
            initialValue={0}
            normalize={value => parseInt(value)}
          >
            <Input type="number"/>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            name="XS"
            label="XS 数量"
            initialValue={0}
            normalize={value => parseInt(value)}
          >
            <Input type="number"/>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            name="S"
            label="S 数量"
            initialValue={0}
            normalize={value => parseInt(value)}
          >
            <Input type="number"/>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            name="M"
            label="M 数量"
            initialValue={0}
            normalize={value => parseInt(value)}
          >
            <Input type="number"/>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            name="L"
            label="L 数量"
            initialValue={0}
            normalize={value => parseInt(value)}
          >
            <Input type="number"/>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            name="XL"
            label="XL 数量"
            initialValue={0}
            normalize={value => parseInt(value)}
          >
            <Input type="number"/>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          Measurements:
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            name="measurementL"
            label="LENGTH (cm)"
            rules={[
              {
                required: true,
                message: '请输入 LENGTH !',
              },
            ]}
          >
            <Input type="text"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="measurementW"
            label="WIDTH (cm)"
            rules={[
              {
                required: true,
                message: '请输入 WIDTH !',
              },
            ]}
          >
            <Input type="text"/>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="measurementH"
            label="HEIGHT (cm)"
            rules={[
              {
                required: true,
                message: '请输入 HEIGHT !',
              },
            ]}
          >
            <Input type="text"/>
          </Form.Item>
        </Col>
      </Row>
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