import React, { Component } from 'react'
import {Alert, NativeModules} from "react-native";
import AppConfig from '../Config/AppConfig'
import PublicApi from '../Services/PublicApi'
import {tdeb, toast} from "../Utils/toast";
import store from "react-native-simple-store";


const storeKey =  "printerIp";

const XPrinterRas = NativeModules.XPrinterRas;

const getIp = async () => {
  const ip = await store.get(storeKey)
  return ip
}

const setIp = async (ip) => {
  await store.update(storeKey, ip);
}

const xprint = async (base64string) => {
  const ip = await getIp();
  if(!ip || ip.trim() == '') {
    return Promise.resolve("OK");
  } else return await XPrinterRas.printImage(ip, base64string)
}

module.exports = {
  xprint, getIp, setIp
};

