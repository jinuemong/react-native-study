# 📅 React Native 기반 Android 위젯으로 유저 스케줄 표시하기

## ✅ 목적

React Native 앱에서 관리하는 유저의 스케줄 데이터를 Android 홈 화면 위젯에 표시합니다. 앱을 실행하지 않고도 유저가 스케줄을 확인할 수 있게 하며, 앱이 꺼져 있어도 데이터를 보여줄 수 있어야 합니다.

---

## 🧱 구성 요소

| 구성 요소 | 역할 |
|-----------|------|
| React Native 앱 | 유저 스케줄 데이터를 서버에서 받아옴 |
| Native Module (Android) | React Native → Android 데이터 전달 |
| SharedPreferences | 앱-위젯 간 데이터 영구 저장 |
| AppWidgetProvider | 위젯의 UI 및 동작 정의 |
| RemoteViews | 위젯의 UI 구성 (텍스트 렌더링 등) |

---

## 🔄 전체 데이터 흐름

- 서버
- ↓ (fetch)
- React Native 앱
- ↓ (Native Module 전달)
- Android (SharedPreferences 저장)
- ↓
- Android 위젯 (RemoteViews로 렌더링)

---

## 🛠 전체 구현 요약

### 1. React Native 앱에서 스케줄 데이터 저장

```ts
// 예시 schedule 데이터
const scheduleData = {
  "12:00": { Mon: ["User A", "User B"], Tue: ["User C"] },
  "14:00": { Mon: [], Tue: ["User D", "User E"] },
};

// Native Module로 전달
NativeModules.WidgetBridge.saveScheduleData(JSON.stringify(scheduleData));
```

### 2. 안드로이드 네이티브 코드

```kotlin
class WidgetBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "WidgetBridge"

    @ReactMethod
    fun saveScheduleData(json: String) {
        val prefs = reactContext.getSharedPreferences("UserSchedulePrefs", Context.MODE_PRIVATE)
        prefs.edit().putString("scheduleData", json).apply()

        // 위젯 강제 갱신
        val intent = Intent(reactContext, ScheduleWidgetProvider::class.java).apply {
            action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
        }
        reactContext.sendBroadcast(intent)
    }
}
```

### 3. 안드로이드 위젯 정의
```kotlin
class ScheduleWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        val prefs = context.getSharedPreferences("UserSchedulePrefs", Context.MODE_PRIVATE)
        val json = prefs.getString("scheduleData", "{}") ?: "{}"

        val views = RemoteViews(context.packageName, R.layout.schedule_widget)

        // title 고정
        views.setTextViewText(R.id.title, "📅 유저 스케줄")

        // 예시 데이터 렌더링
        views.setTextViewText(R.id.row1, "12:00\nMon: User A, B\nTue: User C")
        views.setTextViewText(R.id.row2, "14:00\nTue: User D, E")

        appWidgetIds.forEach { id ->
            appWidgetManager.updateAppWidget(id, views)
        }
    }
}
```

### 4. manifest 등록
```xml
<receiver android:name=".ScheduleWidgetProvider" android:exported="false">
    <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
    </intent-filter>
    <meta-data
        android:name="android.appwidget.provider"
        android:resource="@xml/schedule_widget_info" />
</receiver>
```

### 5. schedule_widget_info.xml (위젯 메타 정보)
```xml
<appwidget-provider
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="180dp"
    android:minHeight="110dp"
    android:updatePeriodMillis="0"
    android:initialLayout="@layout/schedule_widget"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen" />
```

### 6. schedule_widget.xml (RemoteViews 레이아웃)
```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:background="#FFFFFF"
    android:padding="8dp"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <TextView
        android:id="@+id/title"
        android:textSize="16sp"
        android:textStyle="bold"
        android:textColor="#000000"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content" />

    <TextView
        android:id="@+id/row1"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textColor="#333333"
        android:layout_marginTop="4dp" />

    <TextView
        android:id="@+id/row2"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textColor="#333333"
        android:layout_marginTop="2dp" />
</LinearLayout>
```

# Android 위젯 요약 정리 (React Native 연동 기반)

## 📌 위젯의 특성

- **홈 화면에서 직접 정보 확인**  
  앱을 실행하지 않고도 사용자가 원하는 정보를 실시간 또는 주기적으로 표시할 수 있음.

- **앱 실행과 독립적인 동작**  
  앱이 꺼져 있어도 `SharedPreferences` 등의 저장소에 접근하여 위젯 UI 갱신 가능.

- **제약된 UI 구성**  
  위젯은 `RemoteViews` 기반으로 동작하므로 복잡한 UI 동작(애니메이션, 커스텀 뷰 등)은 제한적.

- **잠금화면에서는 직접 표시 불가**  
  잠금화면에 표시하려면 위젯이 아닌 `Notification`을 활용해야 함.

- **사용자 조작 또는 주기적인 업데이트**  
  수동으로 업데이트하거나 `AlarmManager`, `WorkManager` 등을 통해 주기적 갱신 가능.

---

## 🛠 사용된 기술 및 라이브러리

### React Native 측

- `NativeModules`  
  Native(Android)와 JS 간 데이터 브리지를 위한 공식 모듈.

- `JSON.stringify()`  
  JS 데이터를 문자열로 직렬화하여 전달.

---

### Android 측

- `SharedPreferences`  
  앱과 위젯 간 데이터 공유에 사용되는 키-값 저장소.

- `AppWidgetProvider`  
  위젯 생명주기 관리 및 업데이트 이벤트 처리.

- `RemoteViews`  
  XML 기반으로 제한된 위젯 UI를 정의하는 뷰 시스템.

- `AppWidgetManager`  
  위젯 갱신 제어 및 위젯 인스턴스 관리.

---

## ✨ 요약

- 위젯은 앱과 분리된 UI 단위로 홈 화면에 사용자 맞춤 정보를 제공할 수 있음.
- React Native 앱으로부터 Native(Android)에 데이터를 전달하고 저장하면, 위젯에서 해당 데이터를 읽어 화면에 출력 가능.
- 위젯의 렌더링은 `RemoteViews`로 제한되며, 복잡한 컴포넌트 표현에는 한계가 있음.
- 홈 화면 전용이며, 잠금화면에는 알림(Notification)을 활용하는 방식으로 간접 대응 가능.


# Android 위젯 구현: RemoteViews vs Jetpack Glance (Compose)

## ✅ 개요

Android에서는 위젯을 주로 `RemoteViews`를 통해 만들었지만,  
최근에는 Jetpack의 새로운 라이브러리인 `Glance`를 통해 **Jetpack Compose**로도 위젯 구현이 가능해짐.

---

## 🆚 RemoteViews 기반 위젯

### ✔ 장점
- 안정적이고 호환성이 높음 (모든 Android 버전 지원)
- 다양한 자료와 예제가 존재
- 리소스 소비가 적음

### ❌ 단점
- UI가 매우 제한적 (`TextView`, `ImageView`, `ProgressBar`, `LinearLayout` 등만 지원)
- 커스텀 뷰 불가, 복잡한 인터랙션 구현 어려움
- XML 기반의 정적인 UI 구성

---

## 🆚 Jetpack Glance (Compose 기반 위젯)

> [공식 문서 참고](https://developer.android.com/jetpack/androidx/releases/glance)

### ✔ 장점
- **Jetpack Compose 문법**을 그대로 활용 가능  
- 선언형 UI로 더 간결하고 재사용성 높은 코드
- 미래 지향적 (Google의 위젯 개발 권장 방향)

### ❌ 단점
- **아직 베타 단계** → 일부 기능 미지원
- Android 12(API 31)+ 이상 권장 (하위 버전 호환성 제한)
- RemoteViews로 변환되기 때문에 Compose의 일부 기능은 제한적
- 자료와 커뮤니티 리소스가 아직 적음

---

## 🧪 선택 기준

| 항목 | RemoteViews | Jetpack Glance (Compose) |
|------|--------------|----------------------------|
| **안정성** | ✅ 매우 높음 | 🔸 아직 베타 |
| **호환성** | ✅ Android 4.0+ | ⚠ Android 12+ 권장 |
| **UI 자유도** | ❌ 낮음 | 🔸 제한적이지만 Compose 스타일 가능 |
| **러닝 커브** | 🔸 XML 숙련 필요 | ✅ Compose 경험자에게 쉬움 |
| **기능 확장성** | ❌ 낮음 | 🔸 향후 확장성 기대 |

---

## ✅ 결론

| 목표 | 추천 |
|------|------|
| 호환성 우선, 빠른 적용 | ✅ RemoteViews 기반 |
| 최신 기술, 유지보수성과 선언형 UI 우선 | 🔸 Jetpack Glance (Compose) |

---

## 💡 실전 팁

- **React Native와 연동된 앱이라면**,  
  기본적으로 RemoteViews 기반으로 먼저 구현한 뒤,  
  향후 Compose 경험이 쌓이면 Glance로 마이그레이션 고려하는 전략도 유효함.