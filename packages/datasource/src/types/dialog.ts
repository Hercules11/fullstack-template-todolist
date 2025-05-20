import type { TodoBase } from "./todo";

// Discriminated Unions, 根据标志字段，区分属性
export type TodoDialogProps = {} & (
	| {
			mode: "edit";
			initialData: TodoBase; // Require TodoBase for "edit" mode
			onSubmit: (data: TodoBase) => void;
			isOpen: boolean;
			onOpenChange: (open: boolean) => void;
	  }
	| {
			mode: "add";
			initialData?: undefined; // Explicitly allow undefined for "add" mode
			onSubmit: (data: TodoBase) => void;
			isOpen: boolean;
			onOpenChange: (open: boolean) => void;
	  }
);
