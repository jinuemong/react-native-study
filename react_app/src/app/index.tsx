
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/entities/model';
import NativeNotificationSpec from '@/shared/lib/spec/NativeNotificationSpec';
import { MainView } from '@/pages';

export function AuthenticatorScreen() {
  const setAuthData = useAuthStore((state) => state.setAuthData);

  useEffect(() => {
    if (!NativeNotificationSpec) return;
    NativeNotificationSpec.saveState().then((data) => {
      if (data) {
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
