
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/entities/model';
import NativeNotificationSpec from '@/shared/lib/spec/NativeNotificationSpec';
import { MainView } from '@/pages';
import { NativeEventEmitter } from 'react-native';

export function AuthenticatorScreen() {
  console.log('로깅 시작');
  const setAuthData = useAuthStore((state) => state.setAuthData);
  useEffect(() => {
    const subscription = new NativeEventEmitter().addListener('AuthDataUpdated', (data) => {
      console.log('응답은 왔다');
      console.log(data.requester); // requester 문자열
      console.log(data.location);  // location 문자열
      console.log(data.time);      // time 문자열
      setAuthData({
        requester: data.requester,
        location: data.location,
        time: data.time,
      });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!NativeNotificationSpec) return 
    NativeNotificationSpec.saveState().then((data) => {
      console.log('응답은 왔다 2');
      if (data) {
        console.log(data.requester); // requester 문자열
        console.log(data.location);  // location 문자열
        console.log(data.time);      // time 문자열
        setAuthData({
          requester: data.requester,
          location: data.location,
          time: data.time,
        });
      }
    });
  }, []);
  return (
    < MainView />
  );
}
