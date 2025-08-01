import { PlusCircle } from '@tamagui/lucide-icons'
import { Button, YStack } from 'tamagui'

export function AddTaskButton(props) {
    const { onPress, children = '添加任务', ...otherProps } = props;

    return (
        <YStack width="100%">
            <Button
                size="$5"
                width="100%"
                backgroundColor="oklch(0.627 0.194 149.214)"
                color="white"
                fontWeight="600"
                fontSize="$6"
                borderRadius="$4"
                icon={PlusCircle}
                iconAfter={false} // 图标在文本前面
                pressStyle={{
                    backgroundColor: "oklch(0.597 0.194 149.214)", // 按下时稍微暗一点
                    transform: [{ scale: 0.98 }]
                }}
                hoverStyle={{
                    backgroundColor: "oklch(0.647 0.194 149.214)", // 悬停时稍微亮一点
                }}
                onPress={onPress}
                {...otherProps}
            >
                {children}
            </Button>
        </YStack>
    );
}