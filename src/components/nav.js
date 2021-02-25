import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React from "react"
import LeftPng from '../static/images/left.png'
import './nav.scss'

function nav({title}) {
    const back = () => {
        !!Taro.getCurrentPages().length && Taro.navigateBack({delta:1})
    }
    return (
        <View className="nav-box">
            { !!Taro.getCurrentPages().length && <Image src={LeftPng} className="left-arrow" onClick={back}></Image>}
            <View className="nav-title">{title}</View>
        </View>
    )
}


export default nav