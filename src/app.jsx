import React, { Component } from 'react'
import { Provider } from 'react-redux'
import './app.scss'
import configStore from './store'
import { init } from './utils/lang'



const store = configStore()

class App extends Component {
  componentDidMount () {
    init()
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
