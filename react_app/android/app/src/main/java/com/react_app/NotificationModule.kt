package com.react_app

import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class NotificationModule(
    private val reactContext: ReactApplicationContext
) : NativeNotificationSpecSpec(reactContext) {
    override fun setState(isActive: Boolean, isRequest: Boolean) {
        val intent = Intent(reactContext, AuthActionReceiver::class.java).apply {
            action = if (isRequest) "ACTION_APPROVE" else "ACTION_DENY"
        }
        reactContext.sendBroadcast(intent)
    }

    override fun saveState(promise: Promise?) {
        val data = AuthDataStorage.getAuthData(reactContext) ?: return
        val map = makeMap(data)
        promise?.resolve(map)
    }

    private fun makeMap(data: AuthData): WritableMap {
        val map = Arguments.createMap()
        map.putString("requester", data.requester)
        map.putString("location", data.location)
        map.putString("time", data.time)
        return map
    }
}
