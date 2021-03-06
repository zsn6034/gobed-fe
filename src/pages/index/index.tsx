/*
 * @Descripttion: 
 * @Author: zhuangshunan
 * @Date: 2021-08-22 16:12:18
 * @LastEditors: zhuangshunan
 * @LastEditTime: 2021-09-21 12:31:49
 */
import { Component, useState, useEffect } from 'react'
import { View, Text, Picker, CommonEvent } from '@tarojs/components'
import { AtInput, AtButton, AtIcon, AtToast } from 'taro-ui';
import Taro from '@tarojs/taro';

// import { observer, inject } from 'mobx-react'

import styles from './index.module.less'


// type PageStateProps = {
//   store: {
//     counterStore: {
//       counter: number,
//       increment: Function,
//       decrement: Function,
//       incrementAsync: Function
//     }
//   }
// }

// interface Index {
//   props: PageStateProps;
// }

// @inject('store')
// @observer
// class Index extends Component {
//   componentWillMount () { }

//   componentDidMount () { }

//   componentWillUnmount () { }

//   componentDidShow () { }

//   componentDidHide () { }

//   increment = () => {
//     const { counterStore } = this.props.store
//     counterStore.increment()
//   }

//   decrement = () => {
//     const { counterStore } = this.props.store
//     counterStore.decrement()
//   }

//   incrementAsync = () => {
//     const { counterStore } = this.props.store
//     counterStore.incrementAsync()
//   }

//   render () {
//     const { counterStore: { counter } } = this.props.store
//     return (
//       <View className='index'>
//         <Button onClick={this.increment}>+</Button>
//         <Button onClick={this.decrement}>-</Button>
//         <Button onClick={this.incrementAsync}>Add Async</Button>
//         <Text>{counter}</Text>
//       </View>
//     )
//   }
// }

// export default Index

const Index = () => {
  const [input, setInput] = useState('');
  const [money, setMoney] = useState({ today: 0, total: 0 });
  const [toast, setToast] = useState({ show: false, text: '' });

  // 初始化：获取用户登录凭证
  useEffect(() => {
    const _3rd_session = Taro.getStorageSync('_3rd_session');
    // 当登录凭证的缓存存在时，直接返回
    if (_3rd_session) {
      console.log('_3rd_session存在：', _3rd_session);
      return;
    }
    // 当登录凭证的缓存不存在时，调用wx登录接口换取code码，并调用后端login服务换取对应登录凭证_3rd_session
    Taro.login({
      success: wxLoginRes => {
        if (wxLoginRes.code) {
          Taro.request({
            // url: 'https://guxiaobai.top:9998/gobed/login',
            url: `${process.env.HTTPS_HOST}:${process.env.HTTPS_PORT}/gobed/login`,
            method: 'POST',
            data: {
              code: wxLoginRes.code,
            },
            success: (devLoginRes: any) => {
              console.log('login：dev返回：', devLoginRes);
              Taro.setStorageSync('_3rd_session', devLoginRes.data._3rd_session);
            }
          })
        } else {
          console.log('wx登录失败！' + wxLoginRes.errMsg);
        }
      }
    });
  }, []);

  // 获取当天惩罚金额、总惩罚金额
  useEffect(() => {
    const _3rd_session = Taro.getStorageSync('_3rd_session');
    if (!_3rd_session) {
      // 当登录凭证的缓存不存在时，调用wx登录接口换取code码，并调用后端login服务换取对应登录凭证_3rd_session
      Taro.login({
        success: wxLoginRes => {
          if (wxLoginRes.code) {
            Taro.request({
              // url: 'https://guxiaobai.top:9998/gobed/login',
              url: `${process.env.HTTPS_HOST}:${process.env.HTTPS_PORT}/gobed/login`,
              method: 'POST',
              data: {
                code: wxLoginRes.code,
              },
              success: (devLoginRes: any) => {
                console.log('login：dev返回：', devLoginRes);
                Taro.setStorageSync('_3rd_session', devLoginRes.data._3rd_session);
                Taro.request({
                  // url: 'https://guxiaobai.top:9998/gobed/users/getPenalty',
                  url: `${process.env.HTTPS_HOST}:${process.env.HTTPS_PORT}/gobed/users/getPenalty`,
                  method: 'GET',
                  data: {
                    _3rd_session: Taro.getStorageSync('_3rd_session'),
                  },
                  success: (res: any) => {
                    console.log('getPenalty:::!!', res);
                    setMoney({
                      today: res.data.cur_money,
                      total: res.data.total_money,
                    });
                  }
                })
              }
            })
          } else {
            console.log('wx登录失败！' + wxLoginRes.errMsg);
          }
        }
      });
    }
    // 当登录凭证的缓存存在时
    else {
      Taro.request({
        // url: 'https://guxiaobai.top:9998/gobed/users/getPenalty',
        url: `${process.env.HTTPS_HOST}:${process.env.HTTPS_PORT}/gobed/users/getPenalty`,
        method: 'GET',
        data: {
          _3rd_session: Taro.getStorageSync('_3rd_session'),
        },
        success: (res: any) => {
          console.log('getPenalty:::', res);
          setMoney({
            today: res.data.cur_money,
            total: res.data.total_money,
          });
        }
      });
    }
  }, []);

  const handleChange = (e: CommonEvent) => {
    console.log(e.detail);
    if (e.detail) {
      setInput(e.detail.value)
    }
  };

  const save = () => {
    console.log('save...');
    const _3rd_session = Taro.getStorageSync('_3rd_session');
    console.log('_3rd_session存在：', _3rd_session);
    if (_3rd_session) {
      Taro.requestSubscribeMessage({
        tmplIds: ['O6c2pnATJplJuyvxEuwbOH-W4n8_XxBGA-oql6jgs0Q'],
        success: function (res) {
          console.log('res===', res);
          Taro.request({
            // url: 'https://guxiaobai.top:9998/gobed/users/saveTime',
            url: `${process.env.HTTPS_HOST}:${process.env.HTTPS_PORT}/gobed/users/saveTime`,
            method: 'POST',
            data: {
              remind_time: input,
              _3rd_session,
            },
            success: (saveTimeRes: any) => {
              console.log('saveTime:', saveTimeRes);
              setToast({ show: true, text: '保存成功' });
            }
          })
        },
        fail: function (err) {
          console.log(err)
          setToast({ show: true, text: '保存失败' });
        }
      })
    }
  };

  // 转发给好友
  const onShareAppMessage = (res: any) => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'BedOrPay？养成早睡习惯指日可待！',
      path: '/page/index',
    }
  };

  // 分享到朋友圈（暂时只支持安卓机）
  const onShareTimeline = () => {
    console.log('onShareTimeline');
    return {
      title: 'BedOrPay？养成早睡习惯指日可待',
    };
  }; 

  return (
    <View className={styles.indexContainer}>
      <AtToast
        onClose={() => setToast({ show: false, text: '' })}
        isOpened={toast.show}
        text={toast.text}
        duration={2000}
        hasMask
      />
      {/* 标题 */}
      <View className={styles.titleWrap}>
        <Text className={styles.title}>Go bed early, or pay ^_^</Text>
      </View>
      {/* 时间选择 */}
      <Picker
        mode='time'
        onChange={handleChange}
        // onCancel={handleChange}
      >
        <View className={styles.inputWrap}>
          <AtInput
            name='value'
            value={input}
            disabled
            onChange={() => console.log('input no change!')}
            placeholder='选择睡觉提醒时间'
          />
        </View>
      </Picker>
      {/* 确认按钮 */}
      <View className={styles.btnWrap}>
        <AtButton
          circle
          disabled={input === ''}
          onClick={save}
        >
          <View className={styles.btnText}>保存</View>
        </AtButton>
      </View>
      {/* 统计 */}
      <View className={styles.statistics}>
        <View className={styles.staticticsItem}>
          <AtIcon value='bell' size='30' color='#ffb420'></AtIcon>
          <View className={styles.textWrap}>
            <Text className={styles.name}>Today</Text>
            <Text className={styles.value}>&yen;{money.today}</Text>
          </View>
        </View>
        <View className={styles.staticticsItem}>
          <AtIcon value='analytics' size='30' color='#ffb420'></AtIcon>
          <View className={styles.textWrap}>
            <Text className={styles.name}>Total</Text>
            <Text className={styles.value}>&yen;{money.total}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Index;
