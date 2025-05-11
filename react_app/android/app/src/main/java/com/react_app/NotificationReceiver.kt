package com.react_app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule

class NotificationReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val data = AuthData(
            requester = intent.getStringExtra("requester") ?: return,
            location = intent.getStringExtra("location") ?: "",
            time = intent.getStringExtra("time") ?: ""
        )

        val reactContext = (context.applicationContext as MainApplication).reactHost.currentReactContext

        if (reactContext != null) {
            Log.d("📣 ReactContext 확인", "ReactContext 연결됨 - 이벤트 전송 중")

            val sendData = Arguments.createMap().apply {
                putString("requester", data.requester)
                putString("location", data.location)
                putString("time", data.time)
            }

            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("AuthDataUpdated", sendData)

            Log.d("📤 이벤트 발송", "requester=${data.requester}, location=${data.location}, time=${data.time}")
        } else {
            Log.d("❌ ReactContext 없음", "ReactContext가 아직 초기화되지 않았습니다.")
        }

        // 데이터 저장
        AuthDataStorage.saveAuthData(context, data)
        // 위젯 갱신
        NotificationWidget.refreshAllWidgets(context)
    }
}
