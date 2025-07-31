import {
  AlertDialog,
  Button,
  XStack,
  YStack,
  Text,
} from 'tamagui';

import type { AlertDialogComProps } from "@todo-monorepo/datasource"

export const AlertDiaglog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title = "操作确认",
  description = "您确定要删除这个任务吗？此操作无法撤销。",
  confirmText = "确认",
  cancelText = "取消",
  confirmButtonClass = "bg-red-600 hover:bg-red-700",
  children
}: AlertDialogComProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          background="$backgroundTransparent"
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
          p="$4"
          background="$background"
        >
          <YStack space="$3">
            <AlertDialog.Title>
              <Text fontSize="$6" fontWeight="600" color="$color12" text="center">
                {title}
              </Text>
            </AlertDialog.Title>

            <AlertDialog.Description>
              <Text fontSize="$4" color="$color11" text="center" lineHeight="$1">
                {description}
              </Text>
            </AlertDialog.Description>

            {children}
            <YStack space="$2" p="$2">
              <Button
                theme="red"
                size="$4"
                background="$red10"
                color="white"
                fontWeight="500"
                onPress={onConfirm}
                pressStyle={{ background: '$red11' }}
              >
                {confirmText}
              </Button>

              <Button
                size="$4"
                variant="outlined"
                borderColor="$borderColor"
                background="$background"
                color="$color11"
                fontWeight="500"
                // onPress={}
                pressStyle={{ background: '$backgroundPress' }}
              >
                {cancelText}
              </Button>
            </YStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};