import type { ReactNode } from "react";

export interface AlertDialogComProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void; // 更通用的确认回调
	title?: string; // 可定制标题
	description?: string | ReactNode; // 支持富文本描述
	confirmText?: string; // 确认按钮文本
	cancelText?: string; // 取消按钮文本
	confirmButtonClass?: string; // 确认按钮自定义样式
	children?: ReactNode;
}
