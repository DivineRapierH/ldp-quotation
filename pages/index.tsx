import type {NextPage} from 'next'
import Head from 'next/head'
import {Button, Row, Col, Form, Input, Divider, Card} from 'antd';
import styles from '../styles/Home.module.css'
import LdpForm, {LdpFormResult} from "../components/LdpForm";
import LdpResultTable from "../components/LdpResultTable";
import {useState} from "react";
import calcLdp from "../utils/LdpResultCalculator";
import {TruckingDetail} from "../utils/LdpResultCalculator";
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

  const truckingOptions: Array<{ name: string, trucking: TruckingDetail }> = [
    {
      name: 'AVALON',
      trucking: {
        containerFee: '1400',
        unitBasedFee: {
          volumeLessThan10CBM: '500',
          volumeBetween10And20CBM: '800',
          volumeMoreThan20CBM: '1300'
        }
      }
    },
    {
      name: 'KW-COI',
      trucking: {
        containerFee: '800',
        unitBasedFee: {
          volumeLessThan10CBM: '350',
          volumeBetween10And20CBM: '450',
          volumeMoreThan20CBM: '800'
        }
      }
    },
    {
      name: 'KW-MAVAN',
      trucking: {
        containerFee: '700',
        unitBasedFee: {
          volumeLessThan10CBM: '300',
          volumeBetween10And20CBM: '400',
          volumeMoreThan20CBM: '700'
        }
      }
    },
    {
      name: 'KW-MIDWAY',
      trucking: {
        containerFee: '700',
        unitBasedFee: {
          volumeLessThan10CBM: '300',
          volumeBetween10And20CBM: '400',
          volumeMoreThan20CBM: '700'
        }
      }
    },
    {
      name: 'INITIAL',
      trucking: {
        containerFee: '650',
        unitBasedFee: {
          volumeLessThan10CBM: '450',
          volumeBetween10And20CBM: '550',
          volumeMoreThan20CBM: '650'
        }
      }
    },
    {
      name: 'RC-LA',
      trucking: {
        containerFee: '800',
        unitBasedFee: {
          volumeLessThan10CBM: '350',
          volumeBetween10And20CBM: '450',
          volumeMoreThan20CBM: '800'
        }
      }
    },
    {
      name: 'A-ftdi',
      trucking: {
        containerFee: '1300',
        unitBasedFee: {
          volumeLessThan10CBM: '500',
          volumeBetween10And20CBM: '650',
          volumeMoreThan20CBM: '1200'
        }
      }
    },
    {
      name: 'A-Alpha',
      trucking: {
        containerFee: '1550',
        unitBasedFee: {
          volumeLessThan10CBM: '650',
          volumeBetween10And20CBM: '800',
          volumeMoreThan20CBM: '1450'
        }
      }
    },
    {
      name: 'RC-Qcircle',
      trucking: {
        containerFee: '880',
        unitBasedFee: {
          volumeLessThan10CBM: '500',
          volumeBetween10And20CBM: '650',
          volumeMoreThan20CBM: '780'
        }
      }
    },
    {
      name: 'RC-Millburn',
      trucking: {
        containerFee: '880',
        unitBasedFee: {
          volumeLessThan10CBM: '600',
          volumeBetween10And20CBM: '700',
          volumeMoreThan20CBM: '780'
        }
      }
    },
    {
      name: 'RC-INTERNAT',
      trucking: {
        containerFee: '880',
        unitBasedFee: {
          volumeLessThan10CBM: '600',
          volumeBetween10And20CBM: '700',
          volumeMoreThan20CBM: '780'
        }
      }
    },
  ];

  const onFinish = (values: LdpFormResult) => {
    // console.log(values)
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
      // Hard code exchange rate to 7, since it's not needed now.
      exchangeRate: '7',
      clearancePrice: values.clearancePrice,
      taxRate: values.taxRate,
      trucking: truckingOptions.filter(opt => opt.name === values.trucking)[0].trucking,
      warehouse: values.warehouse,
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
      // Hard code exchange rate to 7, since it's not needed now.
      exchangeRate: '7',
    }, () => setIsResultCalculated(true, () => setInfoCardLoading(false)));
  };

  const ResTable = () => {
    if (isResultCalculated) {
      return
    }
  };

  const boxVolume = new bigDecimal(cardValue.length).multiply(new bigDecimal(cardValue.width)).multiply(new bigDecimal(cardValue.height)).divide(new bigDecimal('1000000'), 4);
  const itemVolume = boxVolume.divide(new bigDecimal(cardValue.numPerBox), 4);

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
            <Divider/>
            <Row gutter={24}>
              <Col span={12}>
                <Card title={cardValue.productName} loading={isInfoCardLoading}>
                  <p>{cardValue.numPerBox}件装</p>
                  <p>纸箱尺寸 {cardValue.length}cm * {cardValue.width}cm * {cardValue.height}cm</p>
                  <p>纸箱体积 {boxVolume.getValue()}立方米，单件体积 {itemVolume.getValue()}立方米</p>
                  <p>预估总体积 {bigDecimal.round(cardValue.totalVolume, 2)}立方米</p>
                  <p>散货体积 {bigDecimal.round(cardValue.volumeWithoutContainer, 2)}立方米，整柜数量 {cardValue.containerNum}个</p>
                  {bigDecimal.compareTo(cardValue.volumeWithoutContainer, '0') > 0 &&
                      <p>⚠️有散货，请注意按照整柜还是散货报价 (同船期是否有货拼)</p>
                  }
                </Card>
              </Col>
              <Col span={12}>
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
