export type Todo = {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
	isPending: boolean;
	createdAt: Date;
	updatedAt: Date;
};

// 基础类型（共享字段）
export type TodoBase = {
	title: string;
  description?: string;
  completed: boolean ;
};

// 用户提交的base, 然后状态阶段添加的 id, 再然后服务器端添加的日期字段
export type TodoState = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  isPending: boolean;
}

export type TodoOperate = {
	toggleTodoStatus: (id: string) => void;
	openEditMode: (id: string) => void;
	openDeleteConfirm: (id: string) => void;
};

// 从用户生成数据这个动作开始，数据的属性经过后端处理，前端显示，再编辑显示，字段需求不断增加，
// 如何应对变化？
// 字段最小化原则，先处理满足要求的最少字段数，额外需要的字段，统一交给后端处理
