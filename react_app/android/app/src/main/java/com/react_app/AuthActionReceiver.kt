package com.react_app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class AuthActionReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val data = AuthDataStorage.getAuthData(context) ?: return
        when (intent.action) {
            "ACTION_APPROVE" -> {
                Log.i("AuthAction", "APPROVED: $data")
            }
            "ACTION_DENY" -> {
                Log.i("AuthAction", "DENIED: $data")
            }
        }
        AuthDataStorage.clear(context)
        NotificationWidget.refreshAllWidgets(context)
    }
}
