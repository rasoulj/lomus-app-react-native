import { SaleTXService } from '../../Realm/RealmService'
import UUID from '../../Utils/UUID'
import sanitizeDecimal from './sanitizeDecimal'
import api from '../../Services/PublicApi'
import TX from '../../Services/TransactionApi'
import createDummyCreditCardDetails from './createDummyCreditCardDetails'
import I18n from 'react-native-i18n'
import {tdeb, toast} from "../../Utils/toast";
import {Alert, NativeModules} from "react-native";
import AppConfig from "../../Config/AppConfig";
import store from "react-native-simple-store";

const Q20RasTransactionModule = NativeModules.Q20RasTransactionModule;

/*
const doPayment = amount => {
  return new Promise(function (resolve, reject) {
    var doVerify = (info, ReferenceNum) => {
      Q20RasTransactionModule.doVerify(AppConfig.apiUrl, {
        UserId: info.UserId,
        Password: info.Password,
        ReferenceNum: ReferenceNum
      }).then(mes => {
        var resp = JSON.parse(mes);
        if(resp.Result == "erSucceed") resolve("OK");
        else reject("Error in verification");
      }).catch(err => reject(JSON.stringify(err)));
    }

    var innerDoPayment = (init, amount) => {

      var info = PublicApi.getPayInfo();
      Q20RasTransactionModule.doPayment(AppConfig.apiUrl, {
        Amount: amount,
        //TerminalSerial: info.TerminalSerial,
        //PinPadSerial: info.PinPadSerial,
        TerminalID: init.terminalId,
        MerchantID: init.merchantId,
        UserId: info.UserId,
        Password: info.Password,
        KSN: init.ksnKey
      }).then(mes => {
        var resp = JSON.parse(mes);
        if(resp.ResponseCode != "00") {
          reject("'00' not recieved: (" + resp.ResponseCode + ")");
          return;
        }
        doVerify(info, resp.referenceNum);
      }).catch(err => reject(JSON.stringify(err)));
    };

    var doInit = () => {
      return Q20RasTransactionModule.doInit(AppConfig.apiUrl, PublicApi.getPayInfo());
    }

    var setKeys = init => {
      return new Promise(function (resolveSetKey, rejectSetKey) {
        tdeb(init);
        Q20RasTransactionModule.injectPinKey(init.pinKey).then(p => {
          tdeb(p);
          Q20RasTransactionModule.injectThreeKey(init.tikKey, init.ksnKey, init.kcvKey).then(q => {
            tdeb(q);
            resolveSetKey("INIT Keys Done!");
          }).catch(erq => {
            tdeb(erq);
            rejectSetKey(JSON.stringify(erq))
          });
        }).catch(er => {
          tdeb(er);
          rejectSetKey(JSON.stringify(er))
        });
      });
    }

    store.get(storeKey).then(res => {
      if (!res) {
        doInit().then(inits => {
          var init = JSON.parse(inits);
          setKeys(init).then(mes => {
            store.update(storeKey, init);
            innerDoPayment(init, amount);
            toast(mes);
          }).catch(ee => Alert.alert("*** Error: Keys transfer failed!"));
        }).catch(err => reject("err - doInit"));
      } else {
        innerDoPayment(res, amount);
      }
    }).catch(err => reject("Failed to read " + storeKey));
  });
}
//*/


const paymentAmount = (payment) => payment.receiveAmount
export const getChangeAmount = (ticket, payment) => {
  const paying = paymentAmount(payment)
  const remaining = remainingAmount(ticket)
  if (remaining > paying) {
    return 0
  }
  return paying - remaining
}
export const remainingAmount = (ticket) => sanitizeDecimal(totalPrice(ticket) - paidAmount(ticket))
export const remainingAmountAlaki =  (ticket) => sanitizeDecimal(0)

const totalPrice = (ticket) => sanitizeDecimal(ticket.totalPrice)

const paidAmount = (ticket) => 0
const paidAmount2 = (ticket) => {
  let paid = 0
  if (ticket.paymentTXs) {
    ticket.paymentTXs.map(payment => {
      paid += payment.receiveAmount
    })
  }
  return paid
}

const preparePaymentForSubmission = async ({ticket, payment}) => {
  const paymentType = payment.method

  /*
  if (paymentType === 'CREDIT') {

    await TX.connect()

    try {
      await TX.transact(amount)
    }
    finally {
      await TX.disconnect()
    }


    return {
      ...payment,
      ...createDummyCreditCardDetails()
    }

  }
  //*/

  if (paymentType === 'CASH' || true) {
    const changeAmount = getChangeAmount(ticket, payment)
    return {
      ...payment,
      changeAmount: sanitizeDecimal(changeAmount)
    }
  }
}

const addPaymentToCurrentTicket = function (ticket, paymentData) {
  // TODO: This is the phone's date... we should set it on the server
  const payment = {
    ...paymentData,
    id: UUID(),
    time: new Date()
  }
  SaleTXService.write(() => {
    ticket.paymentTXs.push(payment)
  })
}

const updateTicketWithMerchantAndUserInfo = ({merchantId, userId, ticket}) => {
  return SaleTXService.update({
    id: ticket.id,
    merchantId,
    userId,
    time: new Date()
  })
}

const submitTicketToTheApi = (ticket) => {
  //console.log("11")
  return api.createSaleTX(ticket)
    .then(resp => {
      //console.log(resp)
      const data = resp.data.relatedObject
      //console.log(data)
      if(data) {
        SaleTXService.update({
          id: ticket.id,
          receiptId: data.receiptId
        })
      }
    }).catch(err => console.log(err))
}

const submitToTheApiIfPaidFully = (ticket) => {
  /*
  let remaining = remainingAmountAlaki(ticket)
  if (remaining > 0) { // This triggers onSuccess only if amount split and have remaining
    return Promise.resolve()
  } else {
    return submitTicketToTheApi(ticket)
  }
  //*/
  return submitTicketToTheApi(ticket)
}

const processPayment = async ({ticket, payment, merchantId, userId, type}) => {
  console.log(type)
  if (type === 'retry') {
    return submitToTheApiIfPaidFully(ticket) // If its retry dont do regular adding payment things to ticket logic
  } else {
    const updatedPayment = await preparePaymentForSubmission({ticket, payment})
    const updatedTicket = updateTicketWithMerchantAndUserInfo({merchantId, userId, ticket})
    addPaymentToCurrentTicket(updatedTicket, updatedPayment)

    return submitToTheApiIfPaidFully(updatedTicket)
  }
}

export default processPayment
