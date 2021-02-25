import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { trans } from '../api/index'
import { getMessage } from '../utils/lang'
import './trans.scss'

function TransHash({ address = "", block = '', isAll = false, pullDown = 0, limit = 50, isAddr=false }) {

    const [lang, setLang] = useState({})
    const [hashData, setHashData] = useState({ items: [] })

    useEffect(() => {
        const m = getMessage((v) => setLang(v))
        return () => {
            m.unsubscribe()
        }
    }, [])
    useEffect(() => {
        if (!address && !block && !isAll) {
            return
        }
        const { offset, total } = hashData
        const start = total > 0 ? offset + limit : 0
        trans({
            limit,
            offset: start,
            address,
            block
        }).subscribe(x => {
            if (pullDown > 0) {
                x.items = [...hashData.items, ...x.items]
            }
            setHashData(x)
        })
    }, [address, block, pullDown, isAll])

    const formatLang = (l) => lang[l] ?? l

    const navTrans = (hash = "") => {
        hash && Taro.navigateTo({
            url: `/pages/trans/index?_h=${hash}`
        })
    }

    const navAddress = (addr = "") => {
        addr != address  && addr && Taro.navigateTo({
            url: "/pages/address/index?_b=" + addr
        })
    }
    return (
        <View>
            {
                hashData.items.map((item, index) => {
                    return (<View className="hash-box-cop" key={index}>
                        <View className='hash-box-title'>
                            <View className="hash-box-title-left">
                                <View className="hash-ic">{formatLang('block.detail.hash')}</View>
                                <View className="hash-box-v blue" onClick={() => { navTrans(item.hash) }}>{item.hash}</View>
                            </View>
                            <View className="hash-box-title-co white">{item.amount} DKC</View>
                        </View>
                        <View className="hash-box-content">
                            <View className="hash-box-left">
                                <View className="hash-box-icon">
                                    <View className="green-c"></View>
                                    <View className="blue-c"></View>
                                    <View className="blue-c"></View>
                                    <View className="blue-c"></View>
                                    <View className="red-c"></View>
                                </View>
                                <View className="hash-box-content-source">
                                    <View className="hash-source blue" onClick={() => {navAddress(item.from)}}>{item.from}</View>
                                    <View className="hash-source blue" onClick={() => {navAddress(item.to)}}>{item.to}</View>
                                </View>
                            </View>
                            <View className="hash-box-right">
                                <View>{!!item.timestamp && moment(item.timestamp).fromNow(true)}</View>
                            </View>
                        </View>
                    </View>)
                })
            }

        </View>
    )
}

export default TransHash