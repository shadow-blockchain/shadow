import { get } from '../utils/request'
// 交易列表
export const trans = (data = {}) => get("/transactions", data)
// 区块信息
export const block = (id ="", data = {}) =>  get(`/blocks/${id}`, data)
// 区块列表
export const blockList =(data ={}) => get('/blocks', data)
// 概览数据
export const overview = (data ={}) => get('/overview', data)
// 交易详情
export const transDetail = (hash = "", data ={}) => get(`/transactions/${hash}`, data)
// 地址详情
export const addrDetail = (address ="", data ={}) => get(`/addresses/${address}`, data)