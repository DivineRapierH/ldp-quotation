import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {Button, Row, Col, Form, Input, Divider} from 'antd';
import styles from '../styles/Home.module.css'
import LdpForm from "../components/LdpForm";
import LdpResultTable from "../components/LdpResultTable";
import {useState} from "react";
import calcLdp from "../utils/LdpResultCalculator";
import useStateCallback from "../utils/useStateCallback";

interface LdpFormResult {
  quantity: string;
  exchangeRate: string;
  clearancePrice: string;
  taxRate: string;
  trucking: string;
  volume: string;
  type: string;
  estimatedFee: string;
}


const Home: NextPage = () => {

  const [formValue, setFormValue] = useStateCallback({
    landShippingFee: '0',
    oceanShippingFee: '0',
    duty: '0',
    destinationPortFee: '0',
    quantity: '0',
    exchangeRate: '0'
  });
  const [isResultCalculated, setIsResultCalculated] = useState(false);

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
  ];

  const onFinish = (values: LdpFormResult) => {
    const {
      landShippingFee,
      oceanShippingFee,
      duty,
      destinationPortFee
    } = calcLdp({
      quantity: values.quantity,
      exchangeRate: values.exchangeRate,
      clearancePrice: values.clearancePrice,
      taxRate: values.taxRate,
      trucking: `${truckingOptions.filter(opt => opt.name === values.trucking)[0].fee}`,
      volume: values.volume,
      type: values.type,
      estimatedFee: values.estimatedFee
    });
    setFormValue({
      landShippingFee: landShippingFee,
      oceanShippingFee: oceanShippingFee,
      duty: duty,
      destinationPortFee: destinationPortFee,
      quantity: values.quantity,
      exchangeRate: values.exchangeRate,
    }, () => setIsResultCalculated(true));
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
        {/*<h1 className={styles.title}>*/}
        {/*  海运费计算器*/}
        {/*</h1>*/}
        <LdpForm
          truckingOptions={truckingOptions}
          onFormUnsavedChange={() => setIsResultCalculated(false)}
          onFinish={onFinish}
        />
        {isResultCalculated && (
          <>
            <Divider />
            <LdpResultTable
              {...formValue}
            />
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
