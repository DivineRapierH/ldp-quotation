import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {Button, Row, Col, Form, Input, Divider, Card} from 'antd';
import styles from '../styles/Home.module.css'
import LdpForm, {LdpFormResult} from "../components/LdpForm";
import LdpResultTable from "../components/LdpResultTable";
import {useState} from "react";
import calcLdp from "../utils/LdpResultCalculator";
import useStateCallback from "../utils/useStateCallback";
import bigDecimal from "js-big-decimal";

const Home: NextPage = () => {

  const [formValue, setFormValue] = useStateCallback({
    landShippingFee: '0',
    oceanShippingFee: '0',
    duty: '0',
    destinationPortFee: '0',
    quantity: '0',
    exchangeRate: '0'
  });
  const [cardValue, setCardValue] = useState({
    productName: '',
    quantity: '0',
    numPerBox: '0',
    length: '0',
    width: '0',
    height: '0',
    totalVolume: '0',
    volumeWithoutContainer: '0',
    containerNum: '0',
  });
  const [isInfoCardLoading, setInfoCardLoading] = useState(true);
  const [isResultCalculated, setIsResultCalculated] = useStateCallback(false);

  const truckingOptions = [
    {name: 'AVALON', fee: 1839.5},
    {name: 'KW-COI', fee: 1222},
    {name: 'KW-MAVAN', fee: 929.5},
    {name: 'INITIAL', fee: 1547},
    {name: 'RC', fee: 1189.5},
    {name: 'O-tac', fee: 1287},
    {name: 'O-jam', fee: 929.5},
    {name: 'A-ftdi', fee: 1872},
    {name: 'A-santafe', fee: 1904.5},
    {name: 'Q4-TSS', fee: 1189.5},
    {name: 'Herman Kay', fee: 3500},
  ];

  const onFinish = (values: LdpFormResult) => {
    console.log(values)
    const boxVolume = bigDecimal.divide(
      bigDecimal.multiply(bigDecimal.multiply(values.length, values.width), values.height),
      1000000,
      10
    );
    const boxNum = bigDecimal.ceil(bigDecimal.divide(values.quantity, values.numPerBox, 1));
    const totalVolume = bigDecimal.multiply(boxVolume, boxNum);

    const {
      landShippingFee,
      oceanShippingFee,
      duty,
      destinationPortFee,
      volumeWithoutContainer,
      containerNum
    } = calcLdp({
      quantity: values.quantity,
      exchangeRate: values.exchangeRate,
      clearancePrice: values.clearancePrice,
      taxRate: values.taxRate,
      trucking: `${truckingOptions.filter(opt => opt.name === values.trucking)[0].fee}`,
      volume: totalVolume,
      estimatedFeePerUnit: values.estimatedFeePerUnit,
      estimatedFeePerContainer: values.estimatedFeePerContainer,
    });
    setCardValue({
      productName: values.productName,
      quantity: values.quantity,
      numPerBox: values.numPerBox,
      length: values.length,
      width: values.width,
      height: values.height,
      totalVolume,
      volumeWithoutContainer,
      containerNum,
    })
    setFormValue({
      landShippingFee: landShippingFee,
      oceanShippingFee: oceanShippingFee,
      duty: duty,
      destinationPortFee: destinationPortFee,
      quantity: values.quantity,
      exchangeRate: values.exchangeRate,
    }, () => setIsResultCalculated(true, () => setInfoCardLoading(false)));
  };

  const ResTable = () => {
    if (isResultCalculated) {
      return
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>LDP Calculator</title>
        <meta name="description" content="海运费计算器"/>
        <link rel="icon" href="../public/Water-Wave-Emoji.png"/>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          海运费计算器
        </h1>
        <LdpForm
          truckingOptions={truckingOptions}
          onFormUnsavedChange={() => setIsResultCalculated(false, () => setInfoCardLoading(true))}
          onFinish={onFinish}
        />
        {isResultCalculated && (
          <>
            <Divider />
            <Row gutter={24}>
              <Col span={8}>
                <Card title={cardValue.productName} loading={isInfoCardLoading}>
                  <p>{cardValue.numPerBox}件装</p>
                  <p>纸箱尺寸 {cardValue.length}cm * {cardValue.width}cm * {cardValue.height}cm</p>
                  <p>预估总体积 {bigDecimal.round(cardValue.totalVolume, 2)}立方米</p>
                  <p>散货体积 {bigDecimal.round(cardValue.volumeWithoutContainer, 2)}立方米，整柜数量 {cardValue.containerNum}个</p>
                </Card>
              </Col>
              <Col span={16}>
                <LdpResultTable
                  resultValues={formValue}
                />
              </Col>
            </Row>

          </>
        )}


        {/*<p className={styles.description}>*/}
        {/*  Get started by editing{' '}*/}
        {/*  <code className={styles.code}>pages/index.js</code>*/}
        {/*</p>*/}

        {/*<Button type="primary">Button</Button>*/}
      </main>

      {/*<footer className={styles.footer}>*/}
      {/*  <p>*/}
      {/*    Powered by{' '}*/}
      {/*    <span className={styles.logo}>*/}
      {/*      <Image src="/Water-Wave-Emoji.png" alt="Wave Emoji" width={16} height={16}/>*/}
      {/*    </span>*/}
      {/*  </p>*/}
      {/*</footer>*/}
    </div>
  )
}

export default Home
