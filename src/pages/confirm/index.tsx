/*
 * @Descripttion: 确认睡觉
 * @Author: zhuangshunan
 * @Date: 2021-09-01 20:00:01
 * @LastEditors: zhuangshunan
 * @LastEditTime: 2021-09-21 12:30:29
 */
import { useState, useEffect } from 'react'
import { View } from '@tarojs/components'
import { AtButton, AtToast, AtNoticebar } from 'taro-ui';
import Taro from '@tarojs/taro';
import styles from './index.module.less';

const date2String = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() + 1 < 10 ? `0${date.getDate()}` : date.getDate();
  const result = year + '-' + month + '-' + day;
  return result;
};

const Confirm = () => {
  const date = Taro.getCurrentInstance().router?.params?.date || date2String(new Date());
  const [hasConfirm, setHasConfirm] = useState(false);
  const [money, setMoney] = useState(0);
  const [toast, setToast] = useState({ show: false, text: '' });

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
                    setMoney(res.data.cur_money);
                    console.log('res.data.hasConfirm===', res.data.has_confirm)
                    setHasConfirm(res.data.has_confirm);
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
          setMoney(res.data.cur_money);
          console.log('res.data.hasConfirm===', res.data.has_confirm)
          setHasConfirm(res.data.has_confirm);
        }
      });
    }
  }, []);

  // 攒钱早睡
  const confirm = () => {
    console.log('睡了睡了~');
    Taro.request({
      // url: 'https://guxiaobai.top:9998/gobed/users/confirmOrCancel',
      url: `${process.env.HTTPS_HOST}:${process.env.HTTPS_PORT}/gobed/users/confirmOrCancel`,
      method: 'POST',
      data: {
        _3rd_session: Taro.getStorageSync('_3rd_session'),
        action: -1, // -1代表不需要惩罚
        // date: '2021-09-04'
        date,
      },
      success: (res: any) => {
        console.log('confirm:::', res);
        setToast({ show: true, text: '攒钱早睡，这波不亏~'});
        setHasConfirm(true);
      }
    });
  };

  // 有钱任性
  const cancel = () => {
    console.log('哥有钱，拿去花~');
    Taro.request({
      // url: 'https://guxiaobai.top:9998/gobed/users/confirmOrCancel',
      url: `${process.env.HTTPS_HOST}:${process.env.HTTPS_PORT}/gobed/users/confirmOrCancel`,
      method: 'POST',
      data: {
        _3rd_session: Taro.getStorageSync('_3rd_session'),
        action: 1, // 1代表需要惩罚
        // date: '2021-09-04'
        date,
      },
      success: (res: any) => {
        console.log('cancel:::', res);
        setToast({ show: true, text: '有钱任性，交钱走起~'});
        setHasConfirm(true);
      }
    });
  }

  return (
    <View className={styles.confirm}>
      <AtToast
        onClose={() => setToast({ show: false, text: '' })}
        isOpened={toast.show}
        text={toast.text}
        duration={2000}
        hasMask
      />
      <View className={styles.date}>
        <AtNoticebar>{date}</AtNoticebar>
      </View>
      {hasConfirm ? <View className={styles.title}>今天点过了，明日再来吧！</View> : <View className={styles.title}>该睡觉啦大兄弟，超时你就得交{money}元哦！</View>}
      <View className={styles.btns}>
        <View className={styles.btnWrap}>
          <AtButton circle onClick={confirm} disabled={hasConfirm}>
            <View className={styles.btnText}>睡了睡了</View>
          </AtButton>
        </View>
        <View className={styles.btnWrap}>
          <AtButton circle onClick={cancel} disabled={hasConfirm}>
            <View className={styles.btnText}>我再熬会</View>
          </AtButton>
        </View>
      </View>
    </View>
  );
};

export default Confirm;