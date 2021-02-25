import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React from 'react'
import { connect } from 'react-redux'
import { clear, fetch } from '../../actions/trans'
import { transDetail } from '../../api/index'
import BaseComponent from '../../common/baseComponet'
import Empty from '../../components/empty'
import Nav from '../../components/nav'
import './index.scss'

@connect(({ trans }) => ({
    trans
}), (dispatch) => ({
    clear() {
        dispatch(clear())
    },
    fetch(data = {}) {
        dispatch(fetch(data))
    }
}))
export default class TransCom extends BaseComponent {
    state = {
        loading: true
    }
    componentDidMount() {
        const { _h } = Taro.getCurrentInstance().router.params
        if (_h) {
            transDetail(_h).subscribe(val => {
                !!val && this.props.fetch(val)
                this.setState({
                    loading: false
                })
            })
        }
    }

    componentWillUnmount() {
        this.props.clear()
    }

    navAddress(addr = "") {
        addr && Taro.navigateTo({
            url: "/pages/address/index?_b=" + addr
        })
    }
    render() {
        const { result: { amount, block_number, fee, from, hash, timestamp, to } } = this.props.trans
        const { loading } = this.state
        return (
            !loading && !hash ? <Empty title={this.formatMessage('trans.title')} /> : <View className="bg ">
                <Nav title={this.formatMessage("trans.title")}></Nav>
                {!loading && <View className="trans-detail-card">
                    <View className="trans-d-f">
                        <View className="trans-d-f-t">{this.formatMessage('block.detail.hash')}</View>
                        <View className="trans-d-f-c white">{hash}</View>
                    </View>
                    <View className="trans-d-f">
                        <View className="trans-d-f-t">{this.formatMessage('trans.order.status')}</View>
                        <View className="trans-d-f-c red">{this.formatMessage('trans.order.status.success')}</View>
                    </View>
                    <View className="trans-d-f">
                        <View className="trans-d-f-t">{this.formatMessage('trans.order.block.height')}</View>
                        <View className="trans-d-f-c blue">{block_number}</View>
                    </View>
                    <View className="trans-d-f">
                        <View className="trans-d-f-t">{this.formatMessage('trans.order.time')}</View>
                        <View className="trans-d-f-c white">{timestamp}</View>
                    </View>
                    <View className="trans-d-f">
                        <View className="trans-d-f-t">{this.formatMessage('trans.order.sender')}</View>
                        <View className="trans-d-f-c blue" onClick={this.navAddress.bind(this, from)}>{from}</View>
                    </View>
                    <View className="trans-d-f">
                        <View className="trans-d-f-t">{this.formatMessage('trans.order.receiver')}</View>
                        <View className="trans-d-f-c blue" onClick={this.navAddress.bind(this, to)}>{to}</View>
                    </View>
                    <View className="trans-d-f">
                        <View className="trans-d-f-t">{this.formatMessage('trans.order.amount')}</View>
                        <View className="trans-d-f-c white">{amount}</View>
                    </View>
                    <View className="trans-d-f">
                        <View className="trans-d-f-t">{this.formatMessage('trans.order.fee')}</View>
                        <View className="trans-d-f-c white">{fee}</View>
                    </View>
                </View>
                }
            </View>
        )
    }
}