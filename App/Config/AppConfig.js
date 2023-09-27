export default {
  isDebug: true,
  defaultTimeout: 10000,
  printerIp: '192.168.43.100',
  apiUrl: 'https://merchant.tosantechno.com/', // update this
  paymentUrl: 'https://merchant.tosantechno.com/', // ipg
    apiAuthenticationOptions: {
      grant_type: 'password',
      client_id: 'IndigoCloudAppId', // update this
      client_secret: 'f85hjfR5kw' // update this
  },
  hockeyApp: {
    appId: '',
    isEnabled: () => {
        return false;
      // return !__DEV__
    }
  },
  mandrill: {
    apiKey: '' // update this if using mandrill
  }
}
