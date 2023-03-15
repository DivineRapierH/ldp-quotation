import {NextPage} from "next";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import PLFrom from "../../components/PLFrom";
import {PLRequestValues} from "../../components/DTOs";
import axios from "axios";
import {message} from "antd";
import {MessageInstance} from "antd/lib/message/interface";
import {useState} from "react";

const PLHome: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div className={styles.container}>
      {contextHolder}
      <Head>
        <title>PL Generator</title>
        <meta name="description" content="PL 生成器"/>
        <link rel="icon" href="../../public/Water-Wave-Emoji.png"/>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Packing List
        </h1>
        <PLFrom
          isLoading={isLoading}
          onSubmit={request => {
            callApi(request, messageApi, setIsLoading);
          }}
        />
      </main>
    </div>
  );
};

function callApi(request: PLRequestValues,
                 messageApi: MessageInstance,
                 setIsLoading: (isLoading: boolean) => void) {
  setIsLoading(true);
  const url = 'https://xdht.huanglifan.com/api/packing-list/output-excel';
  // const url = 'http://localhost:8080/api/packing-list/output-excel';
  // Assume url is the API endpoint that returns an octet-stream file
  axios.post(url, request, {responseType: 'blob'})
    .then(response => {
      // get Content-Disposition header
      const contentDisposition = response.headers['Content-Disposition'];
      // extract filename using regex
      const filename = contentDisposition ? contentDisposition.match(/filename="(.+)"/)[1] : 'PL.xlsx';
      console.log('filename: ' + filename);
      // create a file link
      const fileLink = URL.createObjectURL(response.data);
      // create an <a> element
      const link = document.createElement('a');
      // set href and download attributes
      link.href = fileLink;
      link.download = filename;
      // append to document body
      document.body.appendChild(link);
      // click it
      link.click();
      // remove it
      document.body.removeChild(link);
      // revoke file link
      URL.revokeObjectURL(fileLink);
      messageApi.success('下载成功').then(() => {
        setIsLoading(false);
      });
    })
    .catch(error => {
      // Handle error
      messageApi.error('出错了！').then(() => {
        setIsLoading(false);
      });
    });
}

export default PLHome;