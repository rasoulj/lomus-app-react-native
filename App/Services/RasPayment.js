import React, { Component } from 'react'
import {Alert, NativeModules, AsyncStorage} from "react-native";
import AppConfig from '../Config/AppConfig'
import PublicApi from '../Services/PublicApi'
import {tdeb, toast} from "../Utils/toast";
import store from "react-native-simple-store";


const storeKey =  "initVal31";
const Q20RasTransactionModule = NativeModules.Q20RasTransactionModule;

const getInit = async () => {
  //console.log("getInit1")
  const init = await store.get(storeKey)
  //console.log(init)
  return init
}

const setInit = async (init) => {
  await store.update(storeKey, init);
}

const doVerify = async (info, ReferenceNum) => {
  return await Q20RasTransactionModule.doVerify(AppConfig.paymentUrl, {
    UserId: info.UserId,
    Password: info.Password,
    ReferenceNum: ReferenceNum
  })
}

const getSwVersion = async () => {
  return await Q20RasTransactionModule.getSwVersion()
}

const innerDoPayment = async (init, amount) => {
  console.log("Start of doPayment")
  var info = PublicApi.getPayInfo();
  const mes = await Q20RasTransactionModule.doPayment(AppConfig.paymentUrl, {
    Amount: amount,
    //TerminalSerial: info.TerminalSerial,
    //PinPadSerial: info.PinPadSerial,
    TerminalID: init.terminalId,
    MerchantID: init.merchantId,
    UserId: info.UserId,
    Password: info.Password,
    KSN: init.ksnKey
  });

  console.log("End of doPayment & start of giveResponse")

  //console.log("INIT: " + JSON.stringify(init))
  let resp = JSON.parse(mes);

  if(resp.result != 'erSucceed') throw resp

  //console.log((resp));

  let gResp = await Q20RasTransactionModule.giveResponse(resp.SecureResponse);

  console.log("End of giveResponse & start of doVerify")

  if(gResp != "00") throw resp //"'00' not recieved: (" + resp.ResponseCode + ")";

  //* TODO: Verify
  let verMessage = await doVerify(info, resp.referenceNum);
  verMessage.doPaymentRes = resp;
  //*/
  return resp;
};


const doInit = async () => {
  console.log(AppConfig.paymentUrl)
  return Q20RasTransactionModule.doInit(AppConfig.paymentUrl, PublicApi.getPayInfo());
}

const setKeys = async (init) => {
  console.log("setKeys1: " + init.tikKey)
  tdeb(init);


  let q = await Q20RasTransactionModule.injectThreeKey(init.tikKey, init.ksnKey, init.kcvKey);
  console.log("setKeys2: injectThreeKey")
  tdeb("setKeys2: " + JSON.stringify(q));

  let p = await Q20RasTransactionModule.injectDpPinMacKey(init.dpKey, init.pinKey, init.macKey);
  console.log("setKeys3: injectDpPinMacKey")
  tdeb("setKeys3: injectDpPinMacKey");


  //*/
}


const doInitPayment = async () => {
  console.log("doInitPayment1")
  const inits = await doInit();
  //Alert.alert(inits)
  init = JSON.parse(inits);
  let mes = await setKeys(init)
  tdeb(mes)
  await setInit(init)
  return "Done!"
}

const doPayment = async (amount) => {
  let init = await getInit();
  if(!init) {
    const inits = await doInit();
    init = JSON.parse(inits);
    let mes = await setKeys(init)
    tdeb(mes)
    await setInit(init)
  }


  //tdeb(init)
  const innerRes = await innerDoPayment(init, amount)
  //Alert.alert(JSON.stringify(innerRes));
  return innerRes
}

module.exports = {
  doPayment, doInitPayment, getInit, getSwVersion
};
