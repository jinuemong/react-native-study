

### ex > table

```kotlin
{
  "weekdays": {
    "14:00": {
      "MON": ["A", "B", "C"],
      "TUE": ["D", "E", "F"]
    },
    "16:00": {
      "MON": ["G", "H", "I"],
      "TUE": ["J", "K", "L"]
    }
  },
  "weekends": {
    "14:00": {
      "SAT": ["X", "Y", "Z"],
      "SUN": ["P", "Q", "R"]
    }
  }
}
```

### 데이터 클래스 정의

```kotlin
data class Schedule(
    val weekdays: Map<String, DaySchedule>,
    val weekends: Map<String, DaySchedule>
)

data class DaySchedule(
    val MON: List<String>? = null,
    val TUE: List<String>? = null,
    val WED: List<String>? = null,
    val THU: List<String>? = null,
    val FRI: List<String>? = null,
    val SAT: List<String>? = null,
    val SUN: List<String>? = null
)
```

### 위젯 xml 기반 

```kotlin
// 각 Row를 Horizontal LinearLayout으로 구성
// 전체는 Vertical LinearLayout

RemoteViews tableLayout = RemoteViews(packageName, R.layout.widget_root);

// for each row (시간)
RemoteViews rowLayout = RemoteViews(packageName, R.layout.widget_row);
// rowLayout: LinearLayout(horizontal)

val timeCell = RemoteViews(packageName, R.layout.widget_cell)
timeCell.setTextViewText(R.id.cellText, "14:00")

val monCell = RemoteViews(packageName, R.layout.widget_cell)
monCell.setTextViewText(R.id.cellText, "UserA\nUserB")

rowLayout.addView(R.id.rowRoot, timeCell)
rowLayout.addView(R.id.rowRoot, monCell)

tableLayout.addView(R.id.tableRoot, rowLayout)
```

```xml
<!-- res/drawable/cell_border.xml -->
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="@android:color/white" />
    <stroke android:width="1dp" android:color="#CCCCCC" />
</shape>
<!-- widget_cell.xml -->
<TextView
    android:id="@+id/cellText"
    android:background="@drawable/cell_border"
    android:padding="6dp"
    android:textSize="12sp"
    android:gravity="center" />
```

### Jetpack Compose 
- Jetpack Glance (Compose 기반 위젯)

```Kotlin
@Composable
fun ScheduleWidget() {
    LazyVerticalGrid(
        columns = GridCells.Fixed(6), // 시간 + 5 요일
        modifier = GlanceModifier.fillMaxSize()
    ) {
        // Time + day columns
        item { Text("Time", Modifier.border(...)) }
        item { Text("MON", Modifier.border(...)) }
        ...
        
        // 각 시간에 대한 유저 목록
        item { Text("14:00", ...) }
        item { Text("UserA\nUserB", ...) }
        ...
    }
}
```

# Android 위젯 테이블 구조 구현 방식 비교

## ✅ 결론 요약

| 항목                | RemoteViews 방식            | Jetpack Glance (Compose 기반) |
|---------------------|------------------------------|--------------------------------|
| **지원 Android 버전** | Android 4.0 이상 (광범위)     | Android 12 이상               |
| **UI 유연성**        | 제한적 (`LinearLayout` 중심) | 자유로움 (`Row`, `Grid`, etc.)|
| **테이블 구조 구현** | 흉내 가능 (Row × Cell 조합)  | 실제 Grid 기반 테이블 가능     |
| **테두리 구현**       | `drawable` + `TextView`      | `Modifier.border()`            |
| **데이터 표현**       | `RemoteViews.addView` 제한적 | `@Composable`로 유연함         |
| **유지보수**         | 기존 방식, 코드 많음          | 최신 Compose 스타일, 간결함    |

---

## ✅ 추천 방식

| 상황 | 추천 구현 방식 |
|------|----------------|
| **Android 12 이상 대상** | **Jetpack Glance (Compose)** 사용을 추천합니다. 실제 Grid UI, 테두리 등 쉽게 구현 가능 |
| **Android 11 이하도 지원해야 하는 경우** | **RemoteViews + LinearLayout 조합**으로 구현. 테이블은 row 단위로 구성하고 셀은 `TextView`와 `drawable` 테두리 활용 |

---

## 📌 참고 구현 구조 (RemoteViews)

- `widget_root.xml` → `LinearLayout` (Vertical)
- `widget_row.xml` → `LinearLayout` (Horizontal)
- `widget_cell.xml` → `TextView` with border background

```xml
<!-- cell_border.xml -->
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="@android:color/white" />
    <stroke android:width="1dp" android:color="#CCCCCC" />
</shape>
```