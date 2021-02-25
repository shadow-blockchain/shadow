import { Image, ScrollView, View } from "@tarojs/components"
import Taro from '@tarojs/taro'
import React from 'react'
import { connect } from 'react-redux'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { addressClear, addressLoad } from '../../actions/trans'
import { addrDetail } from '../../api/index'
import BaseComponent from '../../common/baseComponet'
import Nav from '../../components/nav'
import Trans from '../../components/trans'
import AddrPng from '../../static/images/address.png'
import './index.scss'

@connect(({ trans }) => ({
    trans
}), (dispatch) => ({
    clear() {
        dispatch(addressClear())
    },
    fetch(data = {}) {
        dispatch(addressLoad(data))
    }
}))
class Address extends BaseComponent {
    state = {
        scrollNum: 0,
        addr: ""
    }

    searchText$ = new Subject();

    componentDidMount() {
        const { _b = "" } = Taro.getCurrentInstance().router.params
        if (_b) {
            this.setState({
                addr: _b
            })
            addrDetail(_b, {}).subscribe(v => v && this.props.fetch(v))
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
        const { address: { balance, address = this.state.addr, tx_count } } = this.props.trans
        const { scrollNum } = this.state
        return <View className="bg" >
            <Nav title={this.formatMessage('address.title')}></Nav>
            <ScrollView className="scroll-container" scrollY lowerThreshold={150} onScrollToLower={() => { this.searchText$.next(scrollNum + 1) }}>
                <View className="addr-detail-box">
                    <View>
                        <View className="addr-detail-box-top">
                            <Image src={AddrPng} className="addr-icon" />
                            <View className="addr-hash-text white">{address}</View>
                        </View>
                    </View>
                    <View className="addr-detail-box-bottom">
                        <View className="addr-detail-box-balance">
                            <View className="label">DKC{this.formatMessage('address.balance.text')}</View>
                            <View className="balance red">{balance}</View>
                        </View>
                        <View className="addr-detail-box-balance">
                            <View className="label">{this.formatMessage('address.transfer.number')}</View>
                            <View className="balance red">{tx_count}</View>
                        </View>
                    </View>
                </View>
                <View className="hash-box"  >
                    <Trans pullDown={scrollNum} address={address} isAll={false} isAddr={true} ></Trans>
                </View>
            </ScrollView>
        </View>
    }
}

export default Address