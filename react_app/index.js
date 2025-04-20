/**
 * @format
 */

// 앱의 엔트리 파일 
// index.jd로 앱을 시작 
// import 구문으로 코드를 불러와 앱을 번들링 
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ScheduleScreen from './sample/screens/ScheduleScreen';

//AppRegistry.registerComponent
// 네이티브 시스템에 컴포넌트 등록 
AppRegistry.registerComponent(appName, () => ScheduleScreen);
