# React Native vs Native 위젯 구현 비교

## 🎯 목적

사용자에게 특정 **시간표 정보를 앱을 열지 않고도 확인할 수 있도록**,  
**홈 화면**이나 **잠금 화면**에서 표시 가능한 **위젯**으로 제공하는 기능을 구현하고자 함.

---

## 📌 사용 시나리오

- 서버에서 가져온 **스케줄 정보**를 위젯으로 표시
- 데이터는 자주 바뀌지 않고, **하루 1~2회 갱신 정도**
- 사용자는 앱 진입 없이 **즉시 시간표를 확인**하고 싶어함
- 홈 화면 또는 잠금 화면에 **고정된 정보 형태로 노출**되길 원함

---

## ✅ 방식 A: **네이티브 위젯 구현 (RN 앱 + 플랫폼별 위젯)**

| 구성 요소     | 설명 |
|---------------|------|
| React Native 앱 | 메인 앱 UI 및 설정 등 담당 |
| Android        | `AppWidgetProvider` + `RemoteViews`로 위젯 구성 |
| iOS            | `WidgetKit` + Swift로 위젯 구현 |
| 데이터 공유    | `SharedPreferences` (Android), `App Group` (iOS) 등을 통해 앱 ↔︎ 위젯 간 데이터 연동 |

### ✔ 장점

- **실제 시스템 위젯**이므로:
  - 홈 화면 / 잠금 화면 모두에 표시 가능
  - 앱 실행 없이 바로 정보 제공
- 플랫폼 최적화된 리소스 사용 (배터리, 퍼포먼스 효율 ↑)
- 위젯 터치 시 앱 내 특정 화면으로 진입 가능 (딥링크)

### ❌ 단점

- iOS, Android 각각 별도 구현 필요 (Swift, Kotlin/Java)
- 유지보수가 다소 복잡 (버전별 차이, 브릿지 구성 필요)
- UI의 자유도는 제한적 (특히 iOS 위젯은 커스터마이징 제한 있음)

---

## ✅ 방식 B: **React Native 단독 구현 방식**

| 구성 요소 | 설명 |
|-----------|------|
| React Native | 단일 코드베이스로 위젯처럼 보이는 뷰를 구성 |
| 표시 방식 | 오버레이, 앱 내 위젯 스타일 컴포넌트, PiP(Picture-in-Picture), 푸시 알림 등 사용 |

### ✔ 장점

- RN 코드 한 번으로 Android/iOS 모두 관리
- UI 구성 자유도가 높고, 유지보수 간편
- 앱의 기존 자산을 그대로 재활용 가능 (폰트, 스타일 등)

### ❌ 단점

- **홈/잠금 화면 위젯으로는 불가**
- 시스템 위젯처럼 항상 표시되지는 않음
- 플랫폼 제약 및 권한 이슈 (ex. 오버레이 권한, 알림 권한 등)
- iOS에서는 홈 위젯 대체 수단이 거의 없음

---

## 📊 비교 표

| 항목 | 네이티브 위젯 (A) | RN 단독 구현 (B) |
|------|--------------------|------------------|
| 홈/잠금 화면 위젯 | ✅ 가능 | ❌ 불가능 |
| 코드 공유성 | ❌ 낮음 (플랫폼별) | ✅ 높음 |
| UI 자유도 | ❌ 낮음 (제한 있음) | ✅ 높음 |
| 리소스 최적화 | ✅ 우수 | ❌ 일반적 |
| 사용자 접근성 | ✅ 뛰어남 | ❌ 앱 열어야 확인 |
| 유지보수 | ❌ 복잡 | ✅ 간편 |

---

## ✅ 결론

사용자가 **앱을 열지 않고도 시간표 정보를 자주 확인**해야 하는 상황이라면,  
**네이티브 위젯 방식 (A)**이 기능, 접근성, 사용자 경험 면에서 가장 적합합니다.

React Native로 만든 앱과 연동해 위젯 데이터를 공유할 수 있도록 구성하고,  
각 플랫폼에 맞는 위젯 코드를 추가 개발하는 방식이 추천됩니다.

# Android - React Native 간 데이터 공유 흐름

## 📌 목적

React Native 앱에서 생성한 데이터를 Android 네이티브 위젯(AppWidgetProvider)에서도 사용할 수 있도록 하기 위한 데이터 공유 방식입니다.

---

## 🔄 데이터 공유 방식: `SharedPreferences`

Android 플랫폼에서는 React Native와 네이티브(Android Java/Kotlin) 간의 간단한 데이터 공유를 위해 **`SharedPreferences`**를 사용할 수 있습니다.

---

## ✅ 흐름 예시 1: React Native → Android 위젯

### 1. React Native에서 시간표 데이터를 저장

React Native JS 코드에서 `SharedPreferences`에 데이터를 저장해야 합니다.  
이를 위해 Native Module을 만들거나 라이브러리를 사용할 수 있습니다.

```ts
// JS 코드 예시
import SharedPreferences from 'react-native-shared-preferences';

SharedPreferences.setItem("boss_schedule", "12:00 - 14:00\n18:00 - 20:00");
```

### Android 위젯에서 해당 데이터 읽기

```kotlin
// Kotlin (AppWidgetProvider 클래스 내부)
val prefs = context.getSharedPreferences("MyPrefs", Context.MODE_PRIVATE)
val schedule = prefs.getString("boss_schedule", "No data")
remoteViews.setTextViewText(R.id.scheduleTextView, schedule)
```

### 안드 위젯 -> 리액트 네이티브 앱 딥링크 이동 

```kotlin
// Kotlin - 위젯에 클릭 이벤트 설정
val intent = Intent(context, MainActivity::class.java)
intent.putExtra("from_widget", true)
val pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE)
remoteViews.setOnClickPendingIntent(R.id.widget_container, pendingIntent)
```


# 📦 React Native ↔ Android 네이티브 위젯 연동

## 🔧 사용 가능한 라이브러리

| 라이브러리 | 설명 |
|------------|------|
| [`react-native-shared-preferences`](https://github.com/sriraman/react-native-shared-preferences) | Android의 SharedPreferences를 React Native에서 쉽게 접근할 수 있게 해주는 라이브러리입니다. |
| [`react-native-mmkv`](https://github.com/mrousavy/react-native-mmkv) | 고성능 키-값 저장소로 SharedPreferences보다 빠르고 효율적입니다. 위젯과의 직접 연동보다는 앱 내 상태 저장에 적합합니다. |
| Custom Native Module | 필요한 기능만 정확히 구현하고 싶을 때 사용. JS ↔ Native 간 데이터 공유를 위한 브릿지 생성. |

---

## 🧩 요약

| 구성 요소 | 설명 |
|------------|------|
| **공유 방식** | `SharedPreferences` (Android 표준 Key-Value 저장소) |
| **데이터 저장 위치** | React Native JS에서 저장 후 네이티브 위젯에서 읽음 |
| **사용 도구** | 라이브러리 (`shared-preferences`, `mmkv`) 또는 커스텀 모듈 |
| **위젯에서 읽기** | `AppWidgetProvider` → `context.getSharedPreferences()` |
| **앱 딥링크** | `PendingIntent`를 통해 앱 실행 및 파라미터 전달 가능 |


# 🍎 React Native ↔ iOS Widget 연동 (간단 요약)

## 🔄 데이터 공유 방식: App Group + UserDefaults

iOS에서는 React Native 앱과 위젯 간의 데이터 공유를 위해 **App Group**을 설정하고, **UserDefaults(suiteName:)**를 사용합니다.

---

## 🧩 요약

| 구성 요소 | 설명 |
|------------|------|
| **공유 방식** | App Group + UserDefaults (공통 저장소) |
| **사용 도구** | Swift로 구현된 WidgetKit, React Native 앱은 NativeModule 사용 |
| **데이터 저장 위치** | React Native → NativeModule → UserDefaults(suiteName) |
| **위젯 구현 위치** | Xcode의 Widget Extension에서 작성 (SwiftUI 기반) |
| **한계** | 위젯 자체는 React Native로 직접 구현 불가 → 반드시 Swift로 구현 필요 |

---

## 참고 예시

```swift
// Swift - UserDefaults에 저장된 데이터 읽기
let defaults = UserDefaults(suiteName: "group.com.example.myapp")
let schedule = defaults?.string(forKey: "boss_schedule") ?? "No schedule"
```

## 안드로이드 위젯 

- https://github.com/sAleksovski/react-native-android-widget

### 바탕화면 위젯 
홈 화면이나 잠금 화면에 고정되는 작은 인터페이스
	•	앱을 실행하지 않고도 정보를 보여주거나 간단한 상호작용 가능
	•	플랫폼 별 네이티브 구현 필수
	•	Android: AppWidgetProvider
	•	iOS: WidgetKit (SwiftUI)

React Native는 앱 실행 중의 화면(UI)만 다루는 프레임워크고,
바탕화면(Home screen)에 고정되는 위젯은 각 플랫폼의 네이티브 영역에서만 지원 

[ React Native 앱 ]
     ↕ 공유 데이터 (SharedPreferences / AppGroup)
[ Android 위젯 ]         [ iOS 위젯 ]
  (Kotlin/Java)           (Swift)

  - 	Foreground service 형태로 작은 UI를 유지하는 등의 유사 위젯 기능