package com.react_app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
class NotificationReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Log.d("sdfljsdfljsdfl","sdfljsdfljsdfl")
        val data = AuthData(
            requester = intent.getStringExtra("requester") ?: return,
            location = intent.getStringExtra("location") ?: "",
            time = intent.getStringExtra("time") ?: ""
        )
        // 데이터 저장
        AuthDataStorage.saveAuthData(context, data)
        // 위젯 갱신
        NotificationWidget.refreshAllWidgets(context)
    }
}
