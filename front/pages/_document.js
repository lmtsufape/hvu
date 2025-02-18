// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <script
          defer="defer"
          src="//barra.brasil.gov.br/barra_2.0.js"
          type="text/javascript"
        ></script>
      </Head>
      <body>
        <div
          id="barra-brasil"
          style={{
            background: "#7F7F7F",
            height: "20px",
            padding: "0 0 0 10px",
            display: "block",
          }}
        >
          <ul id="menu-barra-temp" style={{ listStyle: "none" }}>
            <li
              style={{
                display: "inline",
                float: "left",
                paddingRight: "10px",
                marginRight: "10px",
                borderRight: "1px solid #EDEDED",
              }}
            >
              <a
                href="http://brasil.gov.br"
                style={{
                  fontFamily: "sans,sans-serif",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                Portal do Governo Brasileiro
              </a>
            </li>
          </ul>
        </div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
