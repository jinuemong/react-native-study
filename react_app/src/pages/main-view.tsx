import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './main-view-style';
import { useAuthStore, useAuthActions } from '@/entities/model';

export function MainView() {
    const { data } = useAuthStore();
    const { approveAuthRequest, denyAuthRequest } = useAuthActions();
    if (!data) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.message}>요청된 인증이 없습니다.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>인증기</Text>
            <View style={styles.content}>
                <Text style={styles.message}>
                    {data.requester}에서 로그인 시도 중입니다
                </Text>
                <Text style={styles.location}>{data.location}</Text>
                <Text style={styles.location}>{data.time}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={denyAuthRequest}>
                    <Text style={styles.buttonText}>거부</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={approveAuthRequest}>
                    <Text style={styles.buttonText}>승인</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}