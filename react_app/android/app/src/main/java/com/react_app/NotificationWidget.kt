package com.react_app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.util.Log
import android.view.View
import android.widget.RemoteViews

class NotificationWidget : AppWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray){
        refreshAllWidgets(context)
    }
    companion object {
        private fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int){
            val data = AuthDataStorage.getAuthData(context)
            val views = RemoteViews(context.packageName, R.layout.authentication_widget)
            if (data != null) {
                views.setViewVisibility(R.id.auth_view, View.VISIBLE)
                views.setViewVisibility(R.id.empty_view, View.GONE)

                views.setTextViewText(R.id.message_text, "${data.requester} 로그인 요청")
                views.setTextViewText(R.id.location_text, data.location)
                views.setTextViewText(R.id.time_text, data.time)

                val intent = Intent(context, AuthActionReceiver::class.java).apply {
                    action = "ACTION_APPROVE"
                }
                val pendingIntent =
                    PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_IMMUTABLE)
                views.setOnClickPendingIntent(R.id.approve_button, pendingIntent)

                val denyIntent = Intent(context, AuthActionReceiver::class.java).apply {
                    action = "ACTION_DENY"
                }
                val denyPendingIntent =
                    PendingIntent.getBroadcast(context, 1, denyIntent, PendingIntent.FLAG_IMMUTABLE)
                views.setOnClickPendingIntent(R.id.deny_button, denyPendingIntent)
            }else {
                views.setViewVisibility(R.id.empty_view, View.VISIBLE)
                views.setViewVisibility(R.id.auth_view, View.GONE)
            }
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
        fun refreshAllWidgets(context: Context) {
            val manager = AppWidgetManager.getInstance(context)
            val ids = manager.getAppWidgetIds(ComponentName(context, NotificationWidget::class.java))
            ids.forEach { id -> updateAppWidget(context, manager, id) }
        }
    }
}
