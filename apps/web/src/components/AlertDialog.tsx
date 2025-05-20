import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@todo-monorepo/ui";
import type { AlertDialogComProps } from "@todo-monorepo/datasource"

export const AlertDialogComp = ({
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
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description && (
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>

                {/* Optional extended content */}
                {children}

                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={confirmButtonClass}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};