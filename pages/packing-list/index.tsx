import {NextPage} from "next";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import PLFrom from "../../components/PLFrom";
import {PLRequestValues} from "../../components/DTOs";
import axios from "axios";

const PLHome: NextPage = () => {
  return (
    <div className={styles.container}>
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
          onSubmit={request => {
            callApi(request);
          }}
        />
      </main>
    </div>
  );
};

function callApi(request: PLRequestValues) {
  const url = 'https://xdht.huanglifan.com/api/packing-list/output-excel';
  // Assume url is the API endpoint that returns an octet-stream file
  axios.post(url, request)
    .then(response => {
      // Assume filename is obtained from response headers
      const blob = new Blob([response.data], {type: response.headers['content-type']});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // @ts-ignore
      a.download = response.headers.get("Content-Disposition").split("filename=")[1] || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      // Handle error
    });
}

export default PLHome;