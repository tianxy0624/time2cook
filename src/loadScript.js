const files = [
  "./assets/js/sdk/lib/axios/dist/axios.standalone.js",
  "./assets/js/sdk/lib/CryptoJS/rollups/hmac-sha256.js",
  "./assets/js/sdk/lib/CryptoJS/rollups/sha256.js",
  "./assets/js/sdk/lib/CryptoJS/components/hmac.js",
  "./assets/js/sdk/lib/CryptoJS/components/enc-base64.js",
  "./assets/js/sdk/lib/url-template/url-template.js",
  "./assets/js/sdk/lib/apiGatewayCore/sigV4Client.js",
  "./assets/js/sdk/lib/apiGatewayCore/apiGatewayClient.js",
  "./assets/js/sdk/lib/apiGatewayCore/simpleHttpClient.js",
  "./assets/js/sdk/lib/apiGatewayCore/utils.js",
  "./assets/js/sdk/apigClient.js",
  "./assets/js/aws-sdk.min.js",
];
export default function loadScripts() {
  files.forEach((d, i) => {
    var tag = document.createElement("script");
    tag.async = false;
    tag.src = d;
    document.body.appendChild(tag);
  });
}
