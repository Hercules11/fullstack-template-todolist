import {
    Button, Textarea, Input, Label,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@todo-monorepo/ui"
import { useEffect, useState } from "react";

import type { TodoBase, TodoState } from "@todo-monorepo/datasource"
import type { TodoDialogProps } from "@todo-monorepo/datasource"

export const AddEditDialogComp = ({
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
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "添加新任务" : "编辑任务"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Title Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-left">
                            标题 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="任务标题"
                        />
                    </div>
                    {/* Description Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-left">
                            描述
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="任务详细描述"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">取消</Button>
                    </DialogClose>
                    <Button
                        onClick={handleSubmit}
                        disabled={!formData.title.trim()}
                    >
                        {mode === "add" ? "添加" : "保存"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};