import apisauce, { ApiResponse } from 'apisauce'
import { Merchant } from '../Models/merchant'
import { MerchantUser, UserAccount, UserRole } from '../Models/merchant-user'
import { AuthToken } from '../Models/token'
import { MerchantInfo } from '../Models/merchant-info'
import { Version } from '../Models/version'
import { Item } from '../Models/item'
import { RelatedObject } from '../Models/related'
import { Reward } from '../Models/reward'
import { Tax } from '../Models/tax'
import { SaleTX } from '../Models/sale-tx'
import AppConfig from '../Config/AppConfig'

const TO_VERSION = '9223372036854775807'

class PublicApi {
  constructor () {
    this.apiUrl = AppConfig.apiUrl
    this.api = apisauce.create({
      baseURL: this.apiUrl,
      headers: {
        'Cache-Control': 'no-cache'
      },
      timeout: AppConfig.defaultTimeout
    })
  }

  getPayInfo = () => {
    return {
      //TerminalSerial: "09133834091",
      //PinPadSerial: "6A751477",
      UserId: "1365",
      Password: "123456"
    }
  }



  setApiUrl = (url) => {
    this.apiUrl = url
    this.api = apisauce.create({
      baseURL: url,
      headers: {
        'Cache-Control': 'no-cache'
      },
      timeout: AppConfig.defaultTimeout
    })
  }

  getApiUrl = () => {
    return this.apiUrl
  }

  getReportItemSales = (merchantId, startDate, endDate) => {
    var headers = this.api.headers
    //delete headers['Authorization']
    console.log('merchantId: ' + merchantId)
    console.log('startDate: ' + startDate)
    console.log('endDate: ' + endDate)

    return this.api.post('api/v1/sales/all', {
      merchantId: merchantId,
      startDate: startDate, //1526758201000,
      endDate: endDate, //1526844599000,
      sortField: 'time',
      sortAsc: false
    }, this.api.headers)

  }


setHeader = (header: string, value: string) => {
    return this.api.setHeader(header, value)
  }

  setToken = (token) => {
    this.setHeader('Authorization', `Bearer ${token}`)
  }


  getUserMerchants = (email) => {
    let url = this.apiUrl
    console.tron.display({
      name: '💼 GET user merchant',
      value: {
        url,
        email
      }
    })

    const headers = this.api.headers
    delete headers['Authorization']

    return this.api.get('api/public/user/merchants', {username: email}, headers)
  }

  getImage = (merchantId, image) => {
    return this.api.get('api/public/download/'+merchantId, {size: 'LARGE', filename: image}, this.api.headers)
  }

  login = (email, password, merchantId): Promise<ApiResponse<AuthToken>> => {
    return this.api.get('oauth/token', {
      ...AppConfig.apiAuthenticationOptions,
      username: `${merchantId}:${email}`,
      password
    }).then(resp => {
      // this.setToken
      console.tron.display({
        name: '🔫 getMerchantUser',
        preview: email,
        value: {
          userName: email,
          merchantId: merchantId
        }
      })
      return resp
    })
  }

  getReportItemSales2 = (merchantId: string): Promise<ApiResponse<Object>> => {
    return this.api.get('api/v1/sales/report-item-sales', {
      merchantId: merchantId
    })
  }


  getMerchantUser = (email: string, merchantId: string): Promise<ApiResponse<MerchantUser>> => {
    return this.api.get('api/v1/user-account/merchant-user', {
      userName: email,
      merchantId: merchantId
    })
  }

  getMerchant = (merchantId: string): Promise<ApiResponse<Merchant>> => {
    return this.api.get('api/v1/merchant', {
      merchantId: merchantId
    })
  }

  getMerchantInfo = (merchantId: string): Promise<ApiResponse<RelatedObject<MerchantInfo>>> => {
    return this.api.get(`api/pubilc/merchant/${merchantId}/info`)
  }

  getVersion = (merchantId: string): Promise<ApiResponse<Version>> => {
    return this.api.get('api/public/version')
  }

  getMerchantSettings = (merchantId: string): Promise<ApiResponse<Object>> => {
    return this.api.get('api/v1/merchant/settings', {
      merchantId: merchantId
    })
  }

  getUserAccount = (merchantId: string, userName: string): Promise<ApiResponse<UserAccount>> => {
    return this.api.get('api/v1/user-account', {
      merchantId: merchantId,
      userName: userName
    })
  }

  getMerchantUsers = (merchantId: string): Promise<ApiResponse<MerchantUser[]>> => {
    return this.api.get('api/v1/merchant/merchant-users', {
      fromVersion: 0,
      includeDeleted: 0,
      merchantId: merchantId,
      rows: 65535,
      startRow: 0,
      toVersion: TO_VERSION
    })
  }

  getUserAccountRole = (merchantId: string, userName: string): Promise<ApiResponse<UserRole>> => {
    return this.api.get('api/v1/user-account/role', {
      merchantId: merchantId,
      userName: userName
    })
  }

  getMerchantNotificationTokens = (merchantId: string): Promise<ApiResponse<RelatedObject<string>>> => {
    return this.api.get('api/v1/merchant/notification/token', {
      merchantId: merchantId
    })
  }

  getCategories = (merchantId: string): Promise<ApiResponse<RelatedObject<number>>> => {
    return this.api.get('api/v1/category/all', {
      fromVersion: 0,
      includeDeleted: 0,
      merchantId: merchantId,
      toVersion: TO_VERSION
    })
  }

  getCategoryCount = (merchantId: string): Promise<ApiResponse<RelatedObject<number>>> => {
    return this.api.get('api/v1/category/all/count', {
      fromVersion: 0,
      includeDeleted: 0,
      merchantId: merchantId,
      toVersion: TO_VERSION
    })
  }

  getInventoryCount = (merchantId: string): Promise<ApiResponse<RelatedObject<number>>> => {
    return this.api.get('api/v1/inventory/inventories/count', {
      fromVersion: 0,
      includeDeleted: 0,
      merchantId: merchantId,
      toVersion: TO_VERSION
    })
  }

  getItems = (merchantId: string): Promise<ApiResponse<Item[]>> => {
    return this.api.get('api/v1/item/all', {
      sortField: 'dateCreated',
      sortAsc: 'true',
      fromVersion: 0,
      includeDeleted: 0,
      merchantId: merchantId,
      rows: 65535,
      startRow: 0,
      toVersion: TO_VERSION
    })
  }


  getItemsPaged = (merchantId: string, startRow: number, rows: number): Promise<ApiResponse<Item[]>> => {
    return this.api.get('api/v1/item/all', {
      sortField: 'dateCreated',
      sortAsc: 'true',
      fromVersion: 0,
      includeDeleted: 0,
      merchantId: merchantId,
      rows: rows,
      startRow: startRow,
      toVersion: TO_VERSION
    })
  }



  getItemsCount = (merchantId: string): Promise<ApiResponse<RelatedObject<number>>> => {
    return this.api.get('api/v1/item/all/count', {
      fromVersion: 0,
      includeDeleted: 0,
      merchantId: merchantId,
      toVersion: TO_VERSION
    })
  }


  getDiscounts = (merchantId: string): Promise<ApiResponse<Item[]>> => {
    return this.api.get('api/v1/discount/all', {
      fromVersion: 0,
      includeDeleted: 0,
      merchantId: merchantId,
      rows: 65535,
      startRow: 0,
      toVersion: TO_VERSION
    })
  }

  getTaxes = (merchantId: string): Promise<ApiResponse<Tax[]>> => {
    return this.api.get('api/v1/tax/all', {
      fromVersion: 0,
      includeDeleted: 0,
      merchantId: merchantId,
      rows: 65535,
      startRow: 0,
      toVersion: TO_VERSION
    })
  }

  getTaxItems = (merchantId: string, taxId: string): Promise<ApiResponse<string[]>> => {
    return this.api.get('api/v1/tax/items', {
      fromVersion: 0,
      includeDeleted: 0,
      merchantId: merchantId,
      rows: 65535,
      startRow: 0,
      taxId: taxId,
      toVersion: TO_VERSION
    })
  }

  getRewards = (merchantId: string): Promise<ApiResponse<Reward[]>> => {
    return this.api.get('api/v1/reward', {
      fromVersion: 0,
      includeDeleted: 0,
      merchantId: merchantId,
      rows: 65535,
      startRow: 0,
      toVersion: TO_VERSION
    })
  }

  getRewardableItems = (merchantId: string, rewardId: string): Promise<ApiResponse<string[]>> => {
    return this.api.get('api/v1/reward/rewardable-items', {
      fromVersion: 0,
      includeDeleted: 0,
      merchantId: merchantId,
      rewardId: rewardId,
      rows: 65535,
      startRow: 0,
      toVersion: TO_VERSION
    })
  }

  getMerchantUserAccounts = (merchantId: string): Promise<ApiResponse<UserAccount[]>> => {
    return this.api.get('api/v1/merchant/user-accounts', {
      fromVersion: 0,
      includeDeleted: 0,
      merchantId: merchantId,
      rows: 65535,
      startRow: 0,
      toVersion: TO_VERSION
    })
  }

  createSaleTX = (saleTX: SaleTX): Promise<ApiResponse<RelatedObject<SaleTX>>> => {
    return this.api.post('api/v1/sales/create', saleTX.json)
  }
}

export default new PublicApi()
