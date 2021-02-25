import { Image, Input, View } from "@tarojs/components"
import Taro from '@tarojs/taro'
import React from 'react'
import { connect } from 'react-redux'
import { Subject, zip } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { addressLoad, blockLoad, fetch } from '../../actions/trans'
import { addrDetail, block, overview, transDetail } from '../../api/index'
import BaseComponent from '../../common/baseComponet'
import Nav from '../../components/nav'
import SearchIcon from '../../static/images/search-gray.png'
import './index.scss'

@connect(({ trans }) => ({
   trans
}), (dispatch) => ({
   fetch(data = {}) {
      dispatch(fetch(data))
   },
   loadBlock(data = {}) {
      dispatch(blockLoad(data))
   },
   addressLoad(data = {}) {
      dispatch(addressLoad(data))
   }
}))
class Expose extends BaseComponent {
   state = {
      keyword: "",
      overview: {}
   }

   searchText$ = new Subject();

   componentDidMount() {
      overview().subscribe(x => this.setState({ overview: x }))

      this.searchText$.pipe(
         debounceTime(200),
         distinctUntilChanged()
      ).subscribe(x => {
         const len = x.length
         if (![40, 41, 64, 66].includes(len)) {
            Taro.navigateTo({
               url: '/pages/empty/index'
            })
            return
         }
         Taro.showLoading({
            title: this.formatMessage('search.text')
         })
         if (x.length <= 41) {
            addrDetail(x).subscribe(val => {
               Taro.hideLoading()
               if (!val) {
                  Taro.navigateTo({
                     url: '/pages/empty/index'
                  })
                  return
               }
               this.props.addressLoad(val)
               Taro.navigateTo({
                  url: '/pages/address/index'
               })
            })

            return
         }
         if (x.length == 64) {
            x = `0x${x}`
         }
         zip(transDetail(x), block(x)).subscribe(val => {
            Taro.hideLoading()
            if (!!val[0] && val.hash) {
               this.props.fetch(val[0])
               Taro.navigateTo({
                  url: "/pages/trans/index"
               })
               return
            }
            if (!!val[1] && val.hash) {
               this.props.loadBlock(val[1])
               Taro.navigateTo({
                  url: "/pages/detail/index"
               })
               return
            }
            Taro.navigateTo({
               url: '/pages/empty/index'
            })
         })
      })
   }

   componentWillUnmount() {
   }

   doSearch() {
      this.searchText$.next(this.state.keyword)
   }

   navAddress(addr = "") {
      addr && Taro.navigateTo({
         url: "/pages/address/index?_b=" + addr
      })
   }
   render() {
      const { overview: { fund_address, black_hole_address } } = this.state
      return <View className="bg" >
         <Nav title={this.formatMessage('block.detail.title')}></Nav>
         <View className="mt40 search-container">
            <Input placeholder={this.formatMessage('home.search.notice')} className="search-input" onInput={(v) => { this.setState({ keyword: v.detail.value }) }} />
            <Image src={SearchIcon} className="search-small-icon" onClick={this.doSearch.bind(this)}></Image>
         </View>
         <View className="expose-content">
            <View className="expose-container">
               <View className="expose-title">{this.formatMessage('expose.cast.address')}</View>
               <View className="expose-value blue" onClick={this.navAddress.bind(this, fund_address)}>{fund_address}</View>
            </View>
            <View className="expose-container">
               <View className="expose-title">{this.formatMessage('expose.black.hole')}</View>
               <View className="expose-value blue" onClick={this.navAddress.bind(this, black_hole_address)}>{black_hole_address}</View>
            </View>
         </View>

      </View>
   }
}

export default Expose