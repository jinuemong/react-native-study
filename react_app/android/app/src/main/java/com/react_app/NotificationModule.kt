package com.react_app

import android.content.Intent
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

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
        val map = Arguments.createMap()
        map.putString("requester", data.requester)
        map.putString("location", data.location)
        map.putString("time", data.time)
        promise?.resolve(map)
    }
}
