
import { ADDRESSCLEAR, ADDRESSLOAD, BLOCKCLEAR, BLOCKLOAD, TRANSCLEAR, TRANSFETCH } from '../constants/trans'

export const fetch = (data = {}) => {

    return {
        type: TRANSFETCH,
        payload: data
    }
}

export const clear = () => {
    return {
        type: TRANSCLEAR
    }
}

export const blockLoad = (data = {}) => {
    return {
        type: BLOCKLOAD,
        payload: data
    }    
}

export const blockClear = () => {
    return {
        type: BLOCKCLEAR
    }
}

export const addressLoad = (data = {}) => {
    return {
        type: ADDRESSLOAD,
        payload: data
    }
}

export const addressClear = () => {
    return {
        type: ADDRESSCLEAR
    }
}