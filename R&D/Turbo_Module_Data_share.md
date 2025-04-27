# React Native TurboModule 현재 Activity에서 onResume 감지하고 트랙하기

## 해당 문제
- TurboModule에서 Activity 생명주기를 감지하여
- onResume 상황에서 RN으로 "ud0a4리고 싶은 스크린" 데이터를 보내고 건너가기
- cold start, hot start 모두 작동 후 결과 획수

---

## 작성 방법

### 1. TurboModule에서 `LifecycleEventListener` 등록

```kotlin
class MyTurboModule(
    private val reactContext: ReactApplicationContext
) : TurboModuleSpec(reactContext), LifecycleEventListener {

    private var pendingScreen: String? = null

    init {
        reactContext.addLifecycleEventListener(this)
    }

    override fun onHostResume() {
        pendingScreen?.let { screenName ->
            sendEventToReactNative(screenName)
            pendingScreen = null // 복잡 발전 수 바깥
        }
    }

    override fun onHostPause() {}

    override fun onHostDestroy() {}

    fun setPendingScreen(screenName: String) {
        pendingScreen = screenName
    }

    private fun sendEventToReactNative(screenName: String) {
        val params = Arguments.createMap().apply {
            putString("screen", screenName)
        }
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("NavigateToScreen", params)
    }
}
```

### 2. React Native 에어가 이벤트 받아서 참조

```tsx
useEffect(() => {
  const subscription = DeviceEventEmitter.addListener('NavigateToScreen', (event) => {
    const screenName = event.screen;
    if (screenName) {
      navigation.navigate(screenName);
    }
  });

  return () => {
    subscription.remove();
  };
}, []);
```

---

## 호랴

| 단계 | 설명 |
|:---|:---|
| 1 | 위제와 같이 TurboModule에서 `setPendingScreen()` 호출 |
| 2 | onHostResume 시간에 테스트하고 pendingScreen 값이 있으면 이벤트 보내기 |
| 3 | RN 컨트럴로 해당 스크린으로 이동 |

---

## 보너스: Intent 기본 처리도 가능
- Widget 클릭시 Intent extra에 데이터을 저장
- TurboModule가 Intent에서 데이터를 읽어서 처리

(필요하면 Intent에서 데이터 처리하는 방식도 드립해줄게)

---

## 참고
- `LifecycleEventListener` 은 `ReactApplicationContext`에 등록을 해야 작용
- 여러 시나리오에서 pendingScreen 관리는 주의 (e.g. 다음 단계 전달을 위해)

---

**이 방법으로 hot start에서도 이동 진행가 가능해지는 것**