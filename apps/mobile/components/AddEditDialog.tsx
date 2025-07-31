import { useState, useEffect } from 'react';
import {
    Dialog,
    Button,
    Input,
    TextArea,
    XStack,
    YStack,
    Text,
    Adapt,
} from 'tamagui';
import { Sheet } from '@tamagui/sheet';
import { X } from '@tamagui/lucide-icons';

import type { TodoBase, TodoState, TodoDialogProps } from "@todo-monorepo/datasource"

export const AddEditDialog = ({
    isOpen,
    onOpenChange,
    mode,
    initialData,
    onSubmit,
}: TodoDialogProps) => {
    // repeat that view is function of state, understand the data change flow
    const [formData, setFormData] = useState<TodoBase | TodoState>(
        initialData ? initialData : { title: "", description: "", completed: false }
    );

    // Reset form data when initialData changes
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData(initialData);
        } else {
            setFormData({ title: "", description: "", completed: false });
        }
    }, [initialData, mode]);

    const handleSubmit = () => {
        onSubmit(formData);
        setFormData({ title: "", description: "", completed: false }); // Reset form data after submission
    };


    return (
        <Dialog modal open={isOpen} onOpenChange={onOpenChange}>
            <Adapt when="sm" platform="touch">
                <Sheet
                    animation="medium"
                    zIndex={200000}
                    modal
                    dismissOnSnapToBottom
                    snapPointsMode="fit"
                >
                    <Sheet.Frame gap="$4">
                        <Adapt.Contents />
                    </Sheet.Frame>
                    <Sheet.Overlay
                        animation="lazy"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                </Sheet>
            </Adapt>

            <Dialog.Portal>
                <Dialog.Overlay
                    key="overlay"
                    animation="slow"
                    opacity={0.5}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                    background="#000"
                />

                <Dialog.Content
                    bordered
                    elevate
                    key="content"
                    animateOnly={['transform', 'opacity']}
                    animation={[
                        'quicker',
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                    enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                    exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                    gap="$4"
                    width={350}
                >
                    <Dialog.Title fontSize="$6" fontWeight="600" color="#1a1a1a">
                        {mode === "add" ? "添加新任务" : "编辑任务"}
                    </Dialog.Title>

                    <Dialog.Close asChild>
                        <Button
                            position="absolute"
                            right="$3"
                            size="$2"
                            circular
                            icon={X}
                            borderColor="transparent"
                            pressStyle={{
                                background: '$gray4',
                            }}
                        />
                    </Dialog.Close>

                    <YStack gap="$3">
                        <YStack gap="$2">
                            <Text fontSize="$4" fontWeight="500" color="#666666">
                                标题 <span style={{ color: 'oklch(0.637 0.237 25.331)' }}>*</span>
                            </Text>
                            <Input
                                id="title"
                                placeholder="任务标题"
                                value={formData.title}
                                onChangeText={(e) => setFormData({ ...formData, title: e.target.value })}
                                size="$4"
                                borderColor="#e2e2e2"
                                focusStyle={{
                                    borderColor: '$blue8',
                                }}
                            />
                        </YStack>

                        <YStack gap="$2">
                            <Text fontSize="$4" fontWeight="500" color="#666666">
                                描述
                            </Text>
                            <TextArea
                                id="description"
                                placeholder="任务详细描述"
                                value={formData.description || ""}
                                onChangeText={(e) =>
                                    setFormData({ ...formData, description: e.target.value })}
                                size="$4"
                                borderColor="#e2e2e2"
                                focusStyle={{
                                    borderColor: '$blue8',
                                }}
                            />
                        </YStack>
                    </YStack>

                    <XStack gap="$3">
                        <Dialog.Close displayWhenAdapted asChild>
                            <Button
                                aria-label="Cancel"
                                // onPress={handleCancel}
                                flex={1}
                                background="$gray3"
                                borderColor="#e2e2e2"
                                pressStyle={{
                                    background: '$gray4',
                                }}
                            >
                                取消
                            </Button>
                        </Dialog.Close>

                        <Button
                            aria-label="Add task"
                            onPress={handleSubmit}
                            flex={1}
                            background="$blue8"
                            color={'white'}
                            pressStyle={{
                                background: '$blue9',
                            }}
                            disabled={!formData.title.trim()}
                            opacity={!formData.title.trim() ? 0.6 : 1}
                        >
                            {mode === "add" ? "添加" : "保存"}
                        </Button>
                    </XStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    );
};
