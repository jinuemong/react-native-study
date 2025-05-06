package com.react_app

import android.content.Context
import androidx.core.content.edit

object AuthDataStorage {
    private const val PREF = "auth_data"

    fun saveAuthData(context: Context, data: AuthData) {
        context.getSharedPreferences(PREF, Context.MODE_PRIVATE).edit {
            apply {
                putString("requester", data.requester)
                putString("location", data.location)
                putString("time", data.time)
            }
        }
    }

    fun getAuthData(context: Context): AuthData? {
        val prefs = context.getSharedPreferences(PREF, Context.MODE_PRIVATE)
        val requester = prefs.getString("requester", "") ?: ""
        if (requester.isEmpty()) return null
        return AuthData(
            requester,
            prefs.getString("location", "") ?: "",
            prefs.getString("time", "") ?: ""
        )
    }

    fun clear(context: Context) {
        context.getSharedPreferences(PREF, Context.MODE_PRIVATE).edit{
            apply{
                clear()
            }
        }
    }
}

data class AuthData(val requester: String, val location: String, val time: String)
