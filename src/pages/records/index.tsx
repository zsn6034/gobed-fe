/*
 * @Descripttion: 早睡记录
 * @Author: zhuangshunan
 * @Date: 2021-09-05 16:37:45
 * @LastEditors: zhuangshunan
 * @LastEditTime: 2021-09-05 23:34:11
 */
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { AtTag, AtNoticebar, AtToast } from 'taro-ui'
import { View } from '@tarojs/components'
import { Action } from '../../types';
import styles from './index.module.less';

interface Record {
  date: string;
  curMoney: number;
  status: Action;
}

const getStatus = (value: number) => {
  if (value === -1) return '准时';
  if (value === 0) return '待定';
  if (value === 1) return '超时';
};

const getTagStyles = (status: Action) => {
  if (status === -1) return styles.ontimeStatus;
  if (status === 0) return styles.uncertainStatus;
  if (status === 1) return styles.timeoutStatus;
}

const Records = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [toast, setToast] = useState({ show: false, text: '' });

  useEffect(() => {
    const _3rd_session = Taro.getStorageSync('_3rd_session');
        if (!_3rd_session) {
          // 当登录凭证的缓存不存在时，调用wx登录接口换取code码，并调用后端login服务换取对应登录凭证_3rd_session
          Taro.login({
            success: wxLoginRes => {
              if (wxLoginRes.code) {
                Taro.request({
                  url: 'https://guxiaobai.top:9998/gobed/login',
                  method: 'POST',
                  data: {
                    code: wxLoginRes.code,
                  },
                  success: (devLoginRes: any) => {
                    console.log('login：dev返回：', devLoginRes);
                    Taro.setStorageSync('_3rd_session', devLoginRes.data._3rd_session);
                    Taro.request({
                      url: 'https://guxiaobai.top:9998/gobed/users/getRecordList',
                      method: 'GET',
                      data: {
                        _3rd_session: Taro.getStorageSync('_3rd_session'),
                      },
                      success: (res: any) => {
                        console.log('getRecordList:::!!', res);
                        const list = res.data.recordList.length ? res.data.recordList.map(r => ({
                          date: r.date,
                          curMoney: r.cur_money,
                          status: r.last_confirm_action,
                        })) : [];
                        setRecords(list);
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
            url: 'https://guxiaobai.top:9998/gobed/users/getRecordList',
            method: 'GET',
            data: {
              _3rd_session: Taro.getStorageSync('_3rd_session'),
            },
            success: (res: any) => {
              console.log('getRecordList:::!!', res);
              const list = res.data.recordList.length ? res.data.recordList.map(r => ({
                date: r.date,
                curMoney: r.cur_money,
                status: r.last_confirm_action,
              })) : [];
              setRecords(list);
            }
          });
        }
  }, []);

  const goDetail = (record: Record) => {
    return () => {
      if (record.status === -1 || record.status === 1) {
        setToast({ show: true, text: '已完成选择，无需重新进入操作界面' });
      }
      if (record.status === 0) {
        Taro.navigateTo({
          url: `/pages/confirm/index?date=${record.date}`
        });
      }
    }
  };

  return (
    <View className={styles.records}>
      <AtToast
        onClose={() => setToast({ show: false, text: '' })}
        isOpened={toast.show}
        text={toast.text}
        duration={2000}
        hasMask
      />
      <View className={styles.title}>
        <AtNoticebar>最近3日早睡记录</AtNoticebar>
      </View>
      {records.map(record => (
        // <View key={record.date}>{record.date}+{record.curMoney}+{record.status}</View>
        <View key={record.date} className={styles.card} onClick={goDetail(record)}>
          <View className={styles.left}>
            <View className={styles.moneyValue}>&yen;{record.curMoney}</View>
            <View className={styles.moneyText}>金额</View>
          </View>
          <View className={styles.right}>
            <View className={styles.date}>{record.date}</View>
            <View className={getTagStyles(record.status)}>
              <AtTag>{getStatus(record.status)}</AtTag>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default Records;
