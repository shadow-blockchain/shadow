import { ScrollView, View } from "@tarojs/components"
import Taro from '@tarojs/taro'
import React from 'react'
import { connect } from 'react-redux'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { blockClear, blockLoad } from '../../actions/trans'
import { block } from '../../api/index'
import BaseComponent from '../../common/baseComponet'
import Empty from '../../components/empty'
import Nav from '../../components/nav'
import Trans from '../../components/trans'
import './index.scss'

@connect(({ trans }) => ({
   trans
}), (dispatch) => ({
   clear() {
      dispatch(blockClear())
   },
   fetch(data = {}) {
      dispatch(blockLoad(data))
   }
}))
class info extends BaseComponent {
   state = {
      lang: {},
      baseInfo: {},
      scrollNum: 0,
      blockNum: "",
      loading: true
   }

   searchText$ = new Subject();

   componentDidMount() {
      const { _b = "" } = Taro.getCurrentInstance().router.params
      if (_b) {
         this.setState({
            blockNum: _b
         })
         block(_b, {}).subscribe(v => {
            !!v && this.props.fetch(v)
            this.setState({
               loading: false
            })
         })
      }
      this.searchText$.pipe(
         debounceTime(200),
         distinctUntilChanged()
      ).subscribe(x => this.setState({ scrollNum: x }))
   }

   componentWillUnmount() {
      this.props.clear()
   }

   render() {
      const { blockData: { timestamp, number = this.state.blockNum, previous_hash, size, status, hash } } = this.props.trans
      const { scrollNum, loading } = this.state
      return !loading && !hash ? <Empty title={this.formatMessage('block.detail.title')} /> : <View className="bg" >
         <Nav title={this.formatMessage('block.detail.title')}></Nav>
         {!loading && <ScrollView className="scroll-container" scrollY lowerThreshold={150} onScrollToLower={() => { this.searchText$.next(scrollNum + 1) }}>
            <View className="detail-card">
               <View className="d-f">
                  <View className="d-f-t">{this.formatMessage('block.detail.outTime')}</View>
                  <View className="d-f-c white">{timestamp}</View>
               </View>
               <View className="d-f">
                  <View className="d-f-t">{this.formatMessage('block.detail.status')}</View>
                  <View className="d-f-c red">{status && this.formatMessage('block.detail.status.' + status)}</View>
               </View>
               <View className="d-f">
                  <View className="d-f-t">{this.formatMessage('block.detail.size')}</View>
                  <View className="d-f-c white">{size} bytes</View>
               </View>
               <View className="d-f">
                  <View className="d-f-t">{this.formatMessage('block.detail.dealNumber')}</View>
                  <View className="d-f-c white">{number}</View>
               </View>
               <View className="d-f">
                  <View className="d-f-t">{this.formatMessage('block.detail.parentHash')}</View>
                  <View className="d-f-c blue">{previous_hash}</View>
               </View>
            </View>
            <View className="hash-box"  >
               <Trans pullDown={scrollNum} block={number} ></Trans>
            </View>
         </ScrollView>
         }
      </View>
   }
}

export default info