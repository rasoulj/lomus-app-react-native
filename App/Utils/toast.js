import {
  ToastAndroid
} from "react-native";

const toast = (message) => {
  ToastAndroid.show(message, ToastAndroid.LONG)
}


const tdeb = (message) => {
  toast(JSON.stringify(message))
}


module.exports = {
  toast,
  tdeb
}

