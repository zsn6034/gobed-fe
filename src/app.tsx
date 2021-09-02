/*
 * @Descripttion: 
 * @Author: zhuangshunan
 * @Date: 2021-08-22 16:12:18
 * @LastEditors: zhuangshunan
 * @LastEditTime: 2021-08-22 17:52:19
 */
import { Component } from 'react'
import { Provider } from 'mobx-react'
import 'taro-ui/dist/style/index.scss';

import counterStore from './store/counter'
import './app.less'

const store = {
  counterStore
}

class App extends Component {
  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // this.props.children 就是要渲染的页面
  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
