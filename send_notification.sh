REQUESTER="jinwoo"
LOCATION="Seoul"
PACKAGE_NAME="com.react_app"
RECEIVER_CLASS=".NotificationReceiver"
RECEIVER_COMPONENT="com.react_app/.NotificationReceiver"
ACTION="com.react_app.AUTH_NOTIFICATION"

# chmod +x send_notification.sh
send_auth_request() {
  TIME="$(date '+%Y-%m-%d %H:%M:%S')"
  DEVICES=$(adb devices | grep -w "device" | cut -f1)

  if [ -z "$DEVICES" ]; then
    echo "연결된 기기가 없습니다."
    exit 1
  fi

  echo "연결된 기기 목록:"
  echo "$DEVICES"
  echo

  for DEVICE in $DEVICES; do
    echo "[$DEVICE] 인증 요청 전송 중..."
    adb -s "$DEVICE" shell am broadcast \
      -a "$ACTION" \
      --es requester "$REQUESTER" \
      --es location "$LOCATION" \
      --es time "\"$TIME\"" \
      -n "$RECEIVER_COMPONENT"
  done
}

wait_for_response() {
  echo "승인 응답을 기다리는 중... (Ctrl+C로 종료)"

  while true; do
    RESPONSE=$(adb logcat -d | grep -E "APPROVED|DENIED" | tail -1)
    if [[ "$RESPONSE" == *"APPROVED"* ]] || [[ "$RESPONSE" == *"DENIED"* ]]; then
      echo "응답 확인: $RESPONSE"
      read -p "다시 인증 요청을 보내시겠습니까? (y/n): " AGAIN
      if [[ "$AGAIN" == "y" ]]; then
        adb logcat -c  # 로그 정리
        send_auth_request
      else
        echo "종료합니다."
        exit 0
      fi
    else
      sleep 1
    fi
  done
}

# 최초 실행
adb logcat -c  # 로그 초기화
send_auth_request
wait_for_response
