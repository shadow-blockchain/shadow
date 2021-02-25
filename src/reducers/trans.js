import {
  ADDRESSCLEAR, ADDRESSLOAD, BLOCKCLEAR, BLOCKLOAD, TRANSCLEAR,
  TRANSFETCH
} from '../constants/trans'


const INIT_Trans = {
  result: {},
  blockData: {},
  address: {}
}

export default function trans(state = INIT_Trans, action) {
  switch (action.type) {
    case TRANSFETCH:
      return {
        ...state,
        result: action.payload
      }
    case TRANSCLEAR:
      return {
        ...state,
        result: {}
      }
    case BLOCKLOAD:
      return {
        ...state,
        blockData: action.payload
      }
    case BLOCKCLEAR:
      return {
        ...state,
        blockData: {}
      }
    case ADDRESSLOAD:
      return {
        ...state,
        address: action.payload
      }
    case ADDRESSCLEAR:
      return {
        ...state,
        address: {}
      }
    default:
      return state
  }
}
