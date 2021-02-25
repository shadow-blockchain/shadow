import { Image, View } from '@tarojs/components'
import React, { useEffect, useState } from 'react'
import EmptyIcon from '../static/images/empty.png'
import { getMessage } from '../utils/lang'
import './empty.scss'
import Nav from './nav'

export default function Empty({title=""}) {
    const [lang, setLang] = useState({})
    useEffect(() => {
        const m = getMessage((v) => setLang(v))
        return () => {
            m.unsubscribe()
        }
    }, [])

    const formatLang = (l) => lang[l] ?? l

    return (
        <View className='empty-bg'>
            <Nav title={title}></Nav>
            <View className='empty-box'>
                <Image src={EmptyIcon} className='empty-icon' />
                <View className='empty-text'>{formatLang('empty.data.text')}</View>
            </View>

        </View>
    )
}