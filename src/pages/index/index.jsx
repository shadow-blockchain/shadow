import { Image, Input, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import moment from 'moment'
import React from 'react'
import { connect } from 'react-redux'
import { Subject, zip } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { addressLoad, blockLoad, fetch } from '../../actions/trans'
import { addrDetail, block, blockList, overview, transDetail } from '../../api/index'
import BaseComponent from '../../common/baseComponet'
import Nav from '../../components/nav'
import Trans from '../../components/trans'
import SearchIcon from '../../static/images/search.png'
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
class Index extends BaseComponent {

  state = {
    blockData: {
      limit: 3,
      offset: 0,
      total: 0,
      items: []
    },
    overview: {},
    keyword: ""
  }

  searchText$ = new Subject();

  componentDidMount() {
    const { limit, offset } = this.state.blockData
    blockList({ limit, offset }).subscribe(x => {
      this.setState({
        blockData: x
      })
    })
    overview().subscribe(x => this.setState({ overview: x }))

    this.searchText$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(x => {
      const len = x.length
      if (![40,41,64,66].includes(len)) {
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
          if (!val ) {
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

  doSearch() {
    this.searchText$.next(this.state.keyword)
  }

  navBlock(block) {
    Taro.navigateTo({
      url: `/pages/detail/index?_b=${block}`
    })
  }

  render() {
    const { overview: { address_total,total_power, amount_circulation, block_total, destroyed_local_currency, difficulty, mining_time, transaction_total }, blockData: { items } } = this.state
    return (
      <View className='index'>
        <View className="index_header">
          <View className="index-op">
            <Nav></Nav>
            <View className="index-expose-text" onClick={() => { Taro.navigateTo({url:"/pages/expose/index"}) }}>{this.formatMessage('expose.link.name')}</View>
            <View className='logo-container'>
              {/* <Image src={Logo} className="index-logo"></Image>
              <View className='logo-text'>{this.formatMessage('home.name')}</View> */}
            </View>
            <View className="mt40 search-index search-container">
              <Input placeholder={this.formatMessage('home.search.notice')} className="search-input" onInput={(v) => { this.setState({ keyword: v.detail.value }) }} />
              <Image src={SearchIcon} className="search-icon" onClick={this.doSearch.bind(this)}></Image>
            </View>
          </View>
        </View>
        <View className="index-stat">
          <View className="index-title">
            <View className="index-title-left">
              <View className="title-flag"></View>
              <View className="title-text">{this.formatMessage("home.statistics.title")}</View>
            </View>
            <View className="index-title-right"></View>
          </View>
          <View className="index-stat-content">
            <View className="stat-content">
              <View className="stat-data-box">
                <View className='stat-data-box-number'>{block_total}</View>
                <View className='stat-data-box-text'>{this.formatMessage('home.statistics.block')}</View>
              </View>
              <View className="stat-data-box">
                <View className='stat-data-box-number'>{transaction_total}</View>
                <View className='stat-data-box-text'>{this.formatMessage('home.statistics.trans')}</View>
              </View>
              <View className="stat-data-box">
                <View className='stat-data-box-number'>{address_total}</View>
                <View className='stat-data-box-text'>{this.formatMessage('home.statistics.address')}</View>
              </View>
              <View className="stat-data-box">
                <View className='stat-data-box-number'>{amount_circulation}</View>
                <View className='stat-data-box-text'>{this.formatMessage('home.statistics.push')}</View>
              </View>
            </View>
            <View className="stat-content">
              <View className="stat-data-box">
                <View className='stat-data-box-number'>{mining_time} s</View>
                <View className='stat-data-box-text'>{this.formatMessage('home.statistics.block.time')}</View>
              </View>
              <View className="stat-data-box">
                <View className='stat-data-box-number'>{total_power}</View>
                <View className='stat-data-box-text'>{this.formatMessage('home.statistics.computer.power')}</View>
              </View>
              <View className="stat-data-box">
                <View className='stat-data-box-number'>{difficulty}</View>
                <View className='stat-data-box-text'>{this.formatMessage('home.statistics.dig.hard')}</View>
              </View>
              <View className="stat-data-box">
                <View className='stat-data-box-number'>{destroyed_local_currency}</View>
                <View className='stat-data-box-text'>{this.formatMessage('home.statistics.destroy')}</View>
              </View>
            </View>
          </View>
        </View>
        <View className="trans-area">
          <View className="index-title">
            <View className="index-title-left">
              <View className="title-flag"></View>
              <View className="title-text">{this.formatMessage("home.trans.title")}</View>
            </View>
            {/* <View className="index-title-right">{this.formatMessage("home.statistics.all")}</View> */}
          </View>
          <View className="trans-area-content">
            <Trans limit={3} isAll={true}></Trans>
          </View>
        </View>

        <View className="block-area">
          <View className="index-title">
            <View className="index-title-left">
              <View className="title-flag"></View>
              <View className="title-text">{this.formatMessage("home.block.title")}</View>
            </View>
            {/* <View className="index-title-right">{this.formatMessage("home.statistics.all")}</View> */}
          </View>
          {
            items
            && items.map((item, index) => {
              return (
                <View className="block-area-content" key={index}>
                  <View className="block-area-left">
                    <View className="block-area-content-source">
                      <View className="block-area-source-title">{this.formatMessage('home.block.item.name')}#</View>
                      <View className="block-area-source blue" onClick={this.navBlock.bind(this, item.number)}>{item.number}</View>
                    </View>
                    <View className="block-area-content-source">
                      <View className="block-area-source-title">{this.formatMessage('home.block.item.number')}</View>
                      <View className="block-area-source blue" onClick={this.navBlock.bind(this, item.number)}>{item.tx_total} {this.formatMessage('home.block.item.unit')}</View>
                    </View>
                  </View>
                  <View className="block-area-right">
                    <View>{moment(item.timestamp).fromNow(true)}</View>
                  </View>
                </View>
              )
            })
          }

        </View>
      </View>
    )
  }
}

export default Index


