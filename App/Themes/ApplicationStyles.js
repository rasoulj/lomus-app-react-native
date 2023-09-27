import Fonts from './Fonts'
import Metrics from './Metrics'
import Colors from './Colors'

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const ApplicationStyles = {
  screen: {
    lineWrapperMain: {
      flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20, marginLeft: 30, marginRight: 30
    },
    categoryWrapper: {
      flex: 8,
      alignSelf: 'flex-start',
      backgroundColor: 'white',
      borderRadius:20,
      width: '90%',
      zIndex: 0
    },
    lineArrow: {
      right: -5,
      top: 58,
      width: 50,
      height: 50,
      borderRadius: 30,
    },

    lineImage: {
      left: -20,
      top: 35,
      width: 90,
      height: 90,
      borderRadius: 30,
    },

    absView: {
      zIndex: 1000,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      //alignSelf: 'flex-start',
      position: 'absolute',
    },

    borView: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 2,
    },

    halfView: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 2,
      width: "50%",
      alignSelf: 'center',
      marginTop: 15
    },

    hStyle: {
      fontFamily: 'normal',
      fontSize: 26,
      textAlign: 'center'
    },
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.white,

    },
    container: {
      flex: 1,
      backgroundColor: Colors.transparent
    },


    header: {
      ...Fonts.style.h4,
      paddingVertical: Metrics.doubleBaseMargin,
      color: Colors.text,
      marginVertical: Metrics.smallMargin,
      textAlign: 'center'
    },
    section: {
      margin: Metrics.section
      // padding: Metrics.baseMargin
    },
    text: {
      ...Fonts.style.normal,
      color: Colors.text,
      marginVertical: Metrics.smallMargin,
      textAlign: 'center'
    },

    field: {
      color: Colors.text,
      fontFamily: 'normal',
      fontSize: 20,
      paddingVertical: 5,
      textAlign: 'center'
    },
    picker: {
      ...Fonts.style.normal,
      //fontWeight: '400',
      color: Colors.text
    },
    primaryBtnContainer: {
      marginTop: Metrics.baseMargin,
      padding: 5
    },
    primaryBtn: {
      padding: 10,
      fontFamily: Fonts.type.base,
      fontSize: Metrics.btnSize,
      letterSpacing: 0.19,
      textAlign: 'center',
      color: Colors.textInverse,
      fontWeight: '400',
      borderRadius: 33.3,
      backgroundColor: Colors.primary,
      borderStyle: 'solid',
      borderWidth: 0.7,
      borderColor: Colors.primary,
      elevation: 3
    },
    primaryBtnDisabled: {
      opacity: 0.4,
      padding: 10,
      fontFamily: Fonts.type.base,
      fontWeight: '400',
      fontSize: Metrics.btnSize,
      letterSpacing: 0.19,
      textAlign: 'center',
      color: Colors.textInverse,
      borderRadius: 33.3,
      backgroundColor: "#888",
      borderStyle: 'solid',
      borderWidth: 0.7,
      borderColor: Colors.primary,
      elevation: 3
    },
    primaryBtnOutlineContainer: {
      padding: 5
    },
    primaryBtnOutline: {
      padding: 11,
      paddingTop: 16,
      fontFamily: Fonts.type.base,
      fontWeight: '400',
      fontSize: Metrics.btnSize,
      letterSpacing: 0.19,
      textAlign: 'center',
      color: Colors.primary,
      borderRadius: 33.3,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: Colors.primary,
      elevation: 2
    },
    primaryBtnActive: {
      padding: 14,
      paddingTop: 16,
      paddingBottom: 17,
      fontFamily: Fonts.type.base,
      fontSize: Metrics.btnSize,
      fontWeight: '400',
      letterSpacing: 0.19,
      textAlign: 'center',
      color: Colors.textInverse,
      borderRadius: 33.3,
      backgroundColor: '#4B0082',
      borderStyle: 'solid',
      borderWidth: 0,
      borderColor: Colors.primary,
      elevation: 3
    },

    numberButton: {
      padding: 7,
      fontFamily: Fonts.type.base,
      fontSize: 12,
      letterSpacing: 0.19,
      fontWeight: '400',
      textAlign: 'center',
      color: Colors.primary,
      borderRadius: 33.3,
      backgroundColor: Colors.aqua_marine,
      borderStyle: 'solid',
      borderWidth: 0.7,
      borderColor: Colors.tiffany_blue,
      width: 30,
      height: 30,
      elevation: 2
    },

    lightSubhead1: {
      fontFamily: Fonts.type.base, //'Roboto',
      fontSize: 5.3,
      lineHeight: 8,
      textAlign: 'left',
      color: 'rgba(0, 0, 0, 0.87)'
    },
    lightBody2Secondary: {
      fontFamily: Fonts.type.base, //'Roboto',
      fontSize: 4.7,
      fontWeight: '500',
      lineHeight: 8,
      textAlign: 'left',
      color: 'rgba(0, 0, 0, 0.54)'
    },

    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    lineItemText: {
      ...Fonts.style.normal,
      paddingVertical: Metrics.marginVertical,
      color: Colors.snow,
      textAlign: 'left',
      flex: 1,
      marginTop: 4,
      fontWeight: '500'
    },
    subtitle: {
      color: Colors.snow,
      padding: Metrics.smallMargin,
      marginBottom: Metrics.smallMargin,
      marginHorizontal: Metrics.smallMargin
    },
    titleText: {
      ...Fonts.style.h2,
      fontSize: 14,
      color: Colors.text
    }
  },
  darkLabelContainer: {
    padding: Metrics.smallMargin,
    paddingBottom: Metrics.doubleBaseMargin,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    marginBottom: Metrics.baseMargin
  },
  darkLabel: {
    fontFamily: Fonts.type.bold,
    color: Colors.snow
  },
  groupContainer: {
    margin: Metrics.smallMargin,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  sectionTitle: {
    ...Fonts.style.h4,
    color: Colors.coal,
    backgroundColor: Colors.ricePaper,
    padding: Metrics.smallMargin,
    marginTop: Metrics.smallMargin,
    marginHorizontal: Metrics.baseMargin,
    borderWidth: 1,
    borderColor: Colors.ember,
    alignItems: 'center',
    textAlign: 'center'
  }
}

export default ApplicationStyles
