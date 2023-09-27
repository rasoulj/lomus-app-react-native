import React, { Component } from 'react';
import {
  Text, View, Modal, StyleSheet, Image, ScrollView, DatePickerAndroid, TouchableOpacity,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import I18n from 'react-native-i18n'
import {ApplicationStyles} from "../Themes";
import moment from 'moment-jalaali'
import Loader from '../Components/Loader'
import QMButton from './QMButton'

import Picker from 'react-native-picker';



import PersianDatePicker1 from './PersianDatePicker1';
import PersianDatePicker2 from './PersianDatePicker2';

//import { Calendar, DatePicker } from 'react-persian-datepicker';
//import 'react-persian-datepicker/lib/styles/basic.css'

import publicApi from '../Services/PublicApi'
import Currency from "../Transforms/Currency";

import Triangle from '../Components/Triangle'
import ViewShot from 'react-native-view-shot'
import {xprint} from "../Services/RasXPrint";
import PrinterAndroid from '../Services/PrinterAndroid'


const NoRial = amount => Currency(amount, 0, '')

export default class SellInfo extends Component {

  constructor(props) {
    super(props)

    this.viewShot = null
    this.viewShotDetail = null

    this.triangleNumber = 50


    var now = moment()
    var yest = moment()
    //yest.add(-1, 'day')

    this.state = {
      startDate: yest,
      endDate: now,
      data: [],
      loading: false,
      selected: undefined
    }


  }

  static defaultProps ={
    year:1396,
    month:1,
    day:1,
    style:{},
    //minDate: '1396/1/1',
    //maxDate: '1400/1/1',
    textStyle:{},
    pickerConfirmBtnText: 'انتخاب',
    pickerTitleText: 'تاریخ را انتخاب کنید',
    pickerCancelBtnColor: [255,0,0,1],
    pickerToolBarFontSize:22,
    pickerFontSize:28,
    pickerToolBarBg:[232, 232, 232, 1],
    pickerConfirmBtnColor: [0,0,255,1],
    pickerTitleColor: [0,0,0,1],
    pickerBg: [255, 255, 255,255],
    pickerCancelBtnText: 'انصراف',
    yearCount:30,
    onCancel: (data)=>{},
    onSelect: (data)=>{},

  }


  renderPicker=()=>{
    const {
      pickerConfirmBtnText,
      pickerTitleText,
      pickerCancelBtnColor,
      pickerToolBarFontSize,
      pickerFontSize,
      pickerToolBarBg,
      pickerConfirmBtnColor,
      pickerTitleColor,
      pickerBg,
      pickerCancelBtnText
    } = this.props;
    const {year,month,day}=this.state;
    Picker.init({
      pickerData: this._createDates(),
      pickerConfirmBtnText,
      pickerTitleText,
      pickerCancelBtnColor,
      pickerToolBarFontSize,
      pickerFontSize,
      pickerToolBarBg,
      pickerConfirmBtnColor,
      pickerTitleColor,
      pickerBg,
      pickerCancelBtnText,
      selectedValue:[year,this.getMonthString(month),day],
      onPickerConfirm: data => {
        data[1]=  this.getMonthNumber(data[1]);
        this.setState({year: data[0] ,day: data[2] ,month: data[1]});
        //this.props.onConfirm(data);
        this.setDate(data, this.dateField)
      },
      onPickerCancel: data => {
        data[1]=  this.getMonthNumber(data[1]);
        this.props.onCancel(data);
      },
      onPickerSelect: data => {
        data[1]=  this.getMonthNumber(data[1]);
        this.props.onSelect(data);
      }

    });
    Picker.hide();
  }
  _createDates(){
    var MaxMonth;
    var MaxYear;
    var MaxDay;
    if(this.props.maxDate==undefined){
      maxDate=moment();
      //maxDate.add(3,'jYear');
      var MaxMonth=maxDate.jMonth();
      var MaxYear=maxDate.jYear();
      var MaxDay=maxDate.jDate();
    }else{
      m =moment(this.props.maxDate,'jYYYY/jM/jD');
      var MaxMonth=m.jMonth();
      var MaxYear=m.jYear();
      var MaxDay=m.jDate();
    }


    m =this.props.minDate==undefined ? moment() : moment(this.props.minDate,'jYYYY/jM/jD');
    if(this.props.minDate==undefined) m.add(-3,'jYear')
    var month=m.jMonth();
    var year=m.jYear();
    var day=m.jDate();

    let data = [];
    let len = this.props.yearCount ;
    for(let i=0;m.jYear()<=MaxYear;i++){
      var _year=m.jYear();
      let months = [];
      for(let j=0;j<12;j++){
        var daysLength= (moment.jIsLeapYear(_year)) ? 30 : 29 ;
        if(j!=11) { daysLength=30; }
        if(j<=5){daysLength=31}
        if(_year==MaxYear&&j>MaxMonth) break;
        if(year==_year&&j<month) continue;
        let days=[];
        for(let k=0;k<daysLength;k++){
          if(_year==MaxYear&&j==MaxMonth&&k==MaxDay) break;
          if(_year==year&&month==j&&k<day-1) continue;
          days.push(k+1);
        }
        let _days = {};
        _days[this.getMonthString(j+1)] = days;
        months.push(_days);
      }
      let _data = {};
      _data[_year] = months;
      data.push(_data);
      m.add(1,'jYear');
    }
    return data;

  }
  getMonthString(number){
    switch(number){
      case 1:
        return 'فروردین';
      case 2:
        return 'اردیبهشت';
      case 3:
        return 'خرداد';
      case 4:
        return 'تیر';
      case 5:
        return 'مرداد';
      case 6:
        return 'شهریور';
      case 7:
        return 'مهر';
      case 8:
        return 'آبان';
      case 9:
        return 'آذر';
      case 10:
        return 'دی';
      case 11:
        return 'بهمن';
      case 12:
        return 'اسفند';
    }
    return number;
  }
  getMonthNumber(string) {
    switch (string) {
      case 'فروردین':
        return 1;
      case 'اردیبهشت':
        return 2;
      case 'خرداد':
        return 3;
      case 'تیر':
        return 4;
      case 'مرداد':
        return 5;
      case 'شهریور':
        return 6;
      case 'مهر':
        return 7;
      case 'آبان':
        return 8;
      case 'آذر':
        return 9;
      case 'دی':
        return 10;
      case 'بهمن':
        return 11;
      case 'اسفند':
        return 12;
    }
    return number;
  }

  /*
  getSelectedDate(){
    var year, day, month;
    if( this.state.day==undefined){
      if(this.props.selectedDate == undefined){
        var _now=moment();
        year=_now.jYear();
        month=_now.jMonth()+1;
        day=_now.jDate();
      }else{
        const date= this.props.selectedDate.split('/');
        year=date[0];
        month=date[1];
        day=date[2];
      }
    }else{
      year=this.state.year;
      month=this.state.month;
      day=this.state.day;
    }
    return {year,day,month};
  }
  //*/

  dateField = 'startDate'

  showPicker = async (dateField, d) => {
    //console.log(d.jYear())
    //this.setState({year: d.jYear()})//, month: d.jMonth(), day: d.jDate()})
    Picker.select([d.jYear(), this.getMonthString(d.jMonth()+1), d.jDate()])
    this.dateField = dateField
    Picker.show()
  }

  showPicker2 = async (dateField, options) => {
    try {
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) return;
      else {
        newState[dateField] = new Date(year, month, day);
        this.setState(newState);
      }
    } catch ({code, message}) {
      console.warn(`Error in example': `, message);
    }
  };

  toDateStr(date) {
    return date ? moment(date).format('jYYYY/jM/jD') : '----/--/--'
  }


  toEndDate2(d2) {
    var d = new Date(d2)
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)
  }

  toEndDate(m2) {
    var m = m2.utc()
    //return m.toISOString()
    return new Date(m.year(), m.month(), m.date(), 23, 59, 59).toISOString()
    //return new Date(Date.UTC(m.year(), m.month()+1, m.date(), 23, 59, 59))
  }


  toStartDate(m2) {
    var m = m2.clone().utc()
    return new Date(m.year(), m.month(), m.date(), 0, 0, 0).toISOString()
  }


  runReport() {
    this.setState({data: [], loading: true, selected: null})


    publicApi.getReportItemSales(this.props.merchant.id, this.toStartDate(this.state.startDate), this.toEndDate(this.state.endDate)).then(resp => {
      console.log(resp)
      this.setState({data: resp.data, loading: false})
    }).catch(() => {
      this.setState({data: [], loading: false})
    });
  }

  takeScreenshotAndPrint = (viewShot) => {
    viewShot.capture().then(
      base64string => {

        /*
        xprint(base64string)
          .then(mes => console.log(mes))
          .catch(err => Alert.alert('Cannot access remote printer.'));
        //*/

        PrinterAndroid.print( // Call native java fucntion to print
          base64string,
          (error) => {
            Alert.alert(I18n.t('Printer_Error'), I18n.t('Printer_Error_MSG'))
            console.tron.display({
              name: '🖨 امکان چاپ رسید وجود ندارد',
              value: error
            })
          }
        )
      }
    )
  }

  findSummery(paymentMethod) {
    var f = this.state.data.filter(d => d.paymentMethods[0] == paymentMethod);
    return [I18n.t('x'+paymentMethod), f.length ? f.length : I18n.t('0'), NoRial(f.reduce((s, d) => s + d.amount, 0))]
  }

  renderData() {
    if(!this.state.data.length) return this.renderNoData();
    const w = [0.08, 0.15, 0.21, 0.25, 0.15, 0.15]
    const w2 = [0.25, 0.25, 0.49]

    //console.log(this.state.data[0])
    return (<View>
        <View style={{marginBottom: 30, alignItems: 'center'}}>
          <QMButton
            btnType={'green2'}
            onPress={() => this.takeScreenshotAndPrint(this.viewShot)}
            disabled={false}>
            {I18n.t('PRINT')}
          </QMButton>
        </View>

        <Triangle amount={this.triangleNumber}/>
      <ViewShot ref={(viewShot) => { this.viewShot = viewShot }} options={{format: 'png', result: 'base64', quality: 1}}>
        {this.renderDataRow(null, [
        I18n.t('No'),
        I18n.t('receiptId'),
        I18n.t('time'),
        I18n.t('amount'),
        I18n.t('TranType'),
        I18n.t('Discount')
      ], w, true)}
      {this.state.data.map((d, i) => this.renderDataRow(d, [
          i+1,
          parseInt(d.receiptId, 16),
          moment(d.time).format('jYYYY/jM/jD'),
          NoRial(d.amount),
          I18n.t('x'+d.paymentMethods[0]),
          NoRial(d.discount)
        ], w))}
        {this.vSpace(10)}

        <View style={{backgroundColor: 'white'}}><Text style={styles.header}>{I18n.t('report_summery')}</Text></View>
        {this.renderDataRow(null, [
          I18n.t('payment_method'), I18n.t('fhNum'), I18n.t('total_rial')
        ], w2, true)}
        {['CREDIT', 'CASH'].map(p => this.renderDataRow(null, this.findSummery(p), w2))}

        {this.vSpace(10)}
      </ViewShot>
      <Triangle amount={this.triangleNumber} style={styles.triangleDown}/>

      </View>
    )
  }

  renderDataRow(tag, d, w, isHeader) {
    var bc = isHeader ? 'black' :  tag && this.state.selected === tag ? 'lightgray' : 'white'
    var fc = !isHeader ? 'black' : 'white';

    var row = (<View key={d}  style={{flexDirection: 'row', backgroundColor: bc}}>
      {d.map((p, i) => (<View key={p} style={{flex: w[i], borderWidth: 1, borderColor: 'gray'}}><Text style={[styles.field, {color: fc}]}>{p}</Text></View>))}
    </View>)

    if(!tag) return row

    return (<TouchableOpacity onPress={() => this.setState({selected: tag})}>
      {row}
    </TouchableOpacity>)
  }

  renderNoData() {
    return (<View style={{width: "80%", borderWidth: 2, borderColor: 'black', borderRadius: 10}}>
      <Text style={styles.header}>{I18n.t('no_data')}</Text>
    </View>)
  }

  renderLineItem(i, item) {
    return (<View style={{flexDirection: 'row'}}>
      <View style={{flex: 0.1, borderWidth: 1}}><Text style={styles.field}>{i}</Text></View>
      <View style={{flex: 0.9, borderWidth: 1}}><Text style={styles.field}>{item.itemVariation.name}</Text></View>
    </View>)
  }

  vSpace(space) {
    return (<View><Text style={{fontSize: space}}>{' '}</Text></View>)
  }

  renderDetail() {
    if( !this.state.selected) return (<View style={{alignItems: 'center', marginTop: 80, width: "80%"}}>{this.renderNoData()}</View>)

    const w = [0.2, 0.4, 0.4]

    return (<View style={{marginTop: 30, width: '90%'}}>
        <Loader loading={false}>
          <View style={{marginBottom: 30, alignItems: 'center'}}>
            <QMButton
              btnType={'green2'}
              onPress={() => this.takeScreenshotAndPrint(this.viewShotDetail)}
              disabled={false}>
              {I18n.t('PRINT')}
            </QMButton>
          </View>

          <Triangle amount={50}/>
          <ViewShot ref={(viewShotDetail) => { this.viewShotDetail = viewShotDetail }} options={{format: 'png', result: 'base64', quality: 1}}>
            <View style={{marginTop: 10, marginBottom: 10}}>
            {this.renderDataRow(null, [I18n.t('No'), I18n.t('ProductName'), I18n.t('amount')], w, true)}
            {this.state.selected.lineItems.map((item, i) => this.renderDataRow(null, [
              i+1, item.itemVariation.name, NoRial(item.itemVariation.webStorePrice)
            ], w))}
            </View>
          </ViewShot>
          <Triangle amount={50} style={styles.triangleDown}/>
        </Loader>
    </View>)
  }

  setDates(offset) {
    var startDate = moment()
    var endDate = moment()

    if(offset >= 0) startDate.add(-offset, 'day')
    else if(offset == -30) startDate = startDate.startOf('jMonth').clone()
    else startDate = startDate.startOf('jYear').clone()
      //var year = endDate.jYear()
      //var month = offset < -31 ? 1 : (endDate.jMonth()+1)
      //startDate = moment(year+"/"+month+"/1 00:00:00", "jYYYY/jM/jD HH:mm:ss")
    //}

    this.setState({startDate, endDate})
  }

  renderSpectDateSelector() {
    var st = [styles.header, {marginRight: 30}]
    var stDate = [st, {color: 'blue'}]

    return (<View style={{flex: 1, flexDirection: 'row', marginBottom: 20, alignSelf: 'center'}}>


        <QMButton
          btnType='blue2'
          onPress={() => this.setDates(0)}
          disabled={false}
        >
          {I18n.t('days0')}
        </QMButton>


        <QMButton
          btnType='blue2'
          onPress={() => this.setDates(7)}
          disabled={false}

        >
          {I18n.t('days7')}
        </QMButton>


        <QMButton
          btnType='blue2'
          onPress={() => this.setDates(30)}
          disabled={false}>
          {I18n.t('days30')}
        </QMButton>

        <QMButton
          btnType='blue2'
          onPress={() => this.setDates(-30)}
          disabled={false}>
          {I18n.t('cmonth')}
        </QMButton>


        <QMButton
          btnType='blue2'
          onPress={() => this.setDates(365)}
          disabled={false}

        >
          {I18n.t('days365')}
        </QMButton>

        <QMButton
        btnType='blue2'
        onPress={() => this.setDates(-365)}
        disabled={false}

      >
        {I18n.t('cyear')}
      </QMButton>

      </View>
    )
  }

  renderBody() {

    return (<ScrollView style={[styles.container, {backgroundColor: 'transparent', width: "100%"}]}>
      <View style={[styles.section]}>
        {this.renderDateSelector()}
        {this.renderSpectDateSelector()}

        <View>
          <Loader loading={this.state.loading}>
            {this.renderData()}
          </Loader>
        </View>
      </View>
    </ScrollView>)

  }

  setDate(date, field) {
    var newState = {};
    newState[field] = moment(date.join('-'), 'jYYYY-jM-jD');
    this.setState(newState)
  }

  setDate2(date, field) {
    var newState = {};
    newState[field] = moment(date.join('-'), 'jYYYY-jM-jD');
    this.setState(newState)
  }

  renderDateSelector() {
    var st = [styles.header, {marginRight: 30}]
    var stDate = [st, {color: 'blue'}]

    return (<View style={{flex: 1, flexDirection: 'row'}}>
        <Text style={st}>{I18n.t('reportFromDate')}</Text>
        <TouchableOpacity onPress={this.showPicker.bind(this, 'startDate', this.state.startDate ? this.state.startDate : moment())}>
          <Text style={stDate}>{this.toDateStr(this.state.startDate)}</Text>
        </TouchableOpacity>
        <Text style={st}>{I18n.t('toDate')}</Text>
        <TouchableOpacity onPress={this.showPicker.bind(this, 'endDate', this.state.endDate ? this.state.endDate: moment())}>
          <Text style={stDate}>{this.toDateStr(this.state.endDate)}</Text>
        </TouchableOpacity>
        {/*<TouchableOpacity onPress={() => this.runReport()}>
            <Text style={st}>{I18n.t('run')}</Text>

          </TouchableOpacity>*/}



        <QMButton
          btnType='green2'
          onPress={() => this.runReport()}
          disabled={false}

        >
          {I18n.t('run')}
        </QMButton>

      </View>
    )
  }

  renderDateSelector2() {
    var fromP = (<PersianDatePicker1 id={'a'} textStyle={styles.field} minDate='1396/1/1' maxDate='1400/12/29' onConfirm={d => this.setDate(d, 'startDate')} />)
    var toP = (<PersianDatePicker2 id={'b'} textStyle={styles.field} minDate='1396/1/1' maxDate='1400/12/29' onConfirm={d => this.setDate(d, 'endDate')} />)

    //var fromP = (<DatePicker/>)
    //var toP = (<DatePicker/>)


    return (<View style={{width: "100%"}}>
      <View style={{flexDirection: 'row', flex: 1, marginBottom: 10}}>
        <View style={{flex: 0.2}}>
          <Text style={styles.field}>{I18n.t('reportFromDate')}</Text>
        </View>
        <View style={{flex: 0.5}}>
          {fromP}
        </View>
        <View style={{flex: 0.3}}/>
      </View>
      <View style={{flexDirection: 'row', flex: 1}}>
        <View style={{flex: 0.2}}>
          <Text style={styles.field}>{I18n.t('toDate')}</Text>
        </View>
        <View style={{flex: 0.5}}>
          {toP}
        </View>
        <View style={{flex: 0.3}}>
          <QMButton btnType='green2' onPress={() => this.runReport()} disabled={false}>
            {I18n.t('run')}
          </QMButton>
        </View>
      </View>
    </View>)
  }

  render() {
    this.renderPicker();
    return (
      <View style={{flex: 1}}>
        {/*<Modal visible={this.props.visible} animationType={'slide'} onRequestClose={this.props.closeReq}>*/}
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
            {/*<View style={{flex: 0.07, alignItems: 'flex-start'}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 0.07}}>
                  <Icon name='close' size={40} style={{ alignSelf: 'flex-start', paddingTop: 5, paddingRight: 5 }} onPress={this.props.closeReq} />
                </View>
                <View style={{flex: 0.93, alignItems: 'center'}}>
                  <Text style={[{fontSize: 25, alignSelf: 'center', fontFamily: 'normal'}]}>{I18n.t('SellInfo')}</Text>
                </View>
              </View>

            </View>*/}
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', width: "100%"}} >
              <View style={{flexDirection: 'row', flex: 1, width: "100%"}}>
                <View style={{flex: 0.55, backgroundColor: 'white', borderColor: 'gray', borderRadius: 20, borderWidth: 3, margin: 10}}>
                  {this.renderBody()}
                </View>
                <View style={{flex: 0.45, backgroundColor: 'white', borderColor: 'gray', borderRadius: 20, borderWidth: 3, margin: 10, alignItems: 'center'}}>
                  {this.renderDetail()}
                </View>
              </View>

            </View>
          </View>

        {/*</Modal>*/}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  containerStyle:{
    padding:3,
    justifyContent:'space-around',
    flexDirection:'row',
    alignItems:'center',
    borderColor:'#424242',
    borderWidth:1,
    borderRadius:10,
    marginLeft:25,
    marginRight:25,
    backgroundColor:'white',
    minWidth:150,
  }
})
