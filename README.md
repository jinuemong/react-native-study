### 애뮾레이터 실행 
- 사용 가능한 에뮬레이터 리스트 확인
emulator -list-avds

- 예시: Pixel_4_API_34 에뮬레이터 실행
emulator -avd Pixel_4_API_34

- 실행 후 adb 연결 대기 (안정성)
adb wait-for-device

- APK 설치 또는 앱 실행
adb install -r path/to/your/app.apk
- 또는
adb shell am start -n your.package.name/your.package.name.YourMainActivity

### 실제 연결된 기기로 실행 

- 연결된 기기 목록 확인
adb devices

- 기기명 : 123456F

- 해당 기기로 APK 설치
adb -s 123456F install -r path/to/your/app.apk

- 또는 gradle을 이용한 설치
./gradlew installDebug -Pandroid.injected.device.serial=123456F

### 기기 재연결 시도 
adb kill-server
adb start-server

### 강제 재부팅
adb kill-server
adb start-server


### 안드로이드 실행
npx react-native run-android

	•	연결된 디바이스나 에뮬레이터로 실행
	•	연결된 디바이스가 오프라인이면 에러 발생
→ adb devices로 상태 확인 후 adb kill-server && adb start-server로 재시작

