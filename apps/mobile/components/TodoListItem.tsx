import { Card, XStack, YStack, Text, Button, Checkbox, Label } from 'tamagui';
import { Edit3, Trash2, Check as CheckIcon } from '@tamagui/lucide-icons';

import type { TodoState, TodoOperate } from "@todo-monorepo/datasource"


export const TodoListItem = ({
    id,
    title,
    description,
    completed,
    // isPending,
    // createdAt,
    // updatedAt,
    toggleTodoStatus,
    openEditMode,
    openDeleteConfirm,
}: TodoState & TodoOperate) => {
    return (
        <Card
            elevate
            size="$4"
            bordered
            backgroundColor="$background"
            pressStyle={{ scale: 0.98 }}
            animation="bouncy"
            // marginBottom="$4"
            style={{ marginBottom: '1rem' }}
        >
            <Card.Header padded>
                <XStack>
                    {/* Left side with checkbox and content */}
                    <XStack flex={1} onClick={() => toggleTodoStatus(id)} alignItems="flex-start">
                        <Checkbox
                            id={`checkbox-${id}`}
                            checked={completed}
                            // onCheckedChange={() => toggleTodoStatus(id)}
                            size="$4"
                        >
                            <Checkbox.Indicator>
                                <CheckIcon />
                            </Checkbox.Indicator>
                        </Checkbox>
                        <YStack flex={1} gap="$1" paddingLeft="$2">
                            <Text
                                fontSize="$5"
                                fontWeight="600"
                                color={completed ? "$color10" : "$color12"}
                                textDecorationLine={completed ? "line-through" : "none"}
                                opacity={completed ? 0.6 : 1}
                            >
                                {title}
                            </Text>

                            {description && (
                                <Text
                                    fontSize="$3"
                                    color={completed ? "$color9" : "$color11"}
                                    opacity={completed ? 0.5 : 0.8}
                                    textDecorationLine={completed ? "line-through" : "none"}
                                >
                                    {description}
                                </Text>
                            )}
                        </YStack>
                    </XStack>
                    {/* Right side action buttons */}
                    <XStack space="$2">
                        <Button
                            size="$3"
                            icon={Edit3}
                            onPress={() => openEditMode(id)}
                            circular
                            opacity={0.7}
                            pressStyle={{ opacity: 1 }}
                        />

                        <Button
                            size="$3"
                            icon={Trash2}
                            onPress={() => openDeleteConfirm(id)}
                            circular
                            opacity={0.7}
                            pressStyle={{ opacity: 1 }}
                            color="$red10"
                        />
                    </XStack>
                </XStack>
            </Card.Header>
        </Card>
    );
};