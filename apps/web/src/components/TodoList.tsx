// apps/web/src/components/TodoList.tsx
import { Button } from '@todo-monorepo/ui';
import useStore from "../state/todo";

import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";

import { AddEditDialogComp } from './AddEditDialog';
import { AlertDialogComp } from './AlertDialog';
import { TodoListItem } from './TodoListItem';
import { TodoBase } from '@todo-monorepo/datasource';

export default function TodoList() {
    const { todos, addTodo, updateTodo, deleteTodo, fetchTodos } = useStore();
    const [addEditComp, setAddEditComp] = useState<boolean>(false);
    const [alertComp, setAlertComp] = useState<boolean>(false);
    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const [currentEditTodoId, setCurrentEditTodoId] = useState<string>('');
    const [deleteTodoId, setDeleteTodoId] = useState<string | null>(null);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos])

    // Handlers for CRUD operations
    const addNewTask = () => {
        setMode('add');
        setAddEditComp(true);
    };

    const handleNewTask = async (newTodo: { title: string; description?: string, completed: boolean }) => {
        try {
            await addTodo(newTodo);
            setAddEditComp(false);
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleEditTask = async (updatedTodo: TodoBase) => {
        try {
            await updateTodo({ id: currentEditTodoId, ...updatedTodo });
            setAddEditComp(false);
        } catch (error) {
            console.error("Error editing task:", error);
        }
    };

    const handleDeleteTask = async () => {
        if (!deleteTodoId) return;
        try {
            await deleteTodo(deleteTodoId);
            setAlertComp(false);
            setDeleteTodoId(null);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // UI interaction handlers
    const openEditMode = (id: string) => {
        setMode('edit');
        setCurrentEditTodoId(id);
        setAddEditComp(true);
    };

    const openDeleteConfirm = (id: string) => {
        setDeleteTodoId(id);
        setAlertComp(true);
    };

    const toggleTodoStatus = async (id: string) => {
        const todo = todos.find(todo => todo.id === id);
        if (todo) {
            try {
                await updateTodo({ id, title: todo.title, description: todo.description, completed: !todo.completed });
            } catch (error) {
                console.error("Error toggling task status:", error);
            }
        }
    };

    return (
        <>
            <div className="w-full max-w-3xl mx-auto mt-4">
                {/* Header with Add Button */}
                <div className="mb-6">
                    <Button className="hover:bg-green-700 h-full p-4 border-0 text-white rounded-sm shadow-xl w-full text-center flex items-center justify-center gap-2 bg-green-600 " onClick={addNewTask}>
                        <PlusCircle className="mr-2 h-6 w-6 size-custom" />
                        <span className='text-xl'>添加任务</span>
                    </Button>
                </div>

                {/* Todo List */}
                <div className="bg-transparent rounded-lg divide-y divide-gray-300">
                    {todos.length === 0 ? (
                        <div className="text-center p-4 text-gray-500">
                            暂无任务，点击上方按钮添加
                        </div>
                    ) : (
                        todos.map((todo) => (
                            <TodoListItem
                                key={todo.id}
                                {...todo}
                                toggleTodoStatus={toggleTodoStatus}
                                openEditMode={openEditMode}
                                openDeleteConfirm={openDeleteConfirm}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Add/Edit Dialog */}
            {/* 类型报错问题出在，子类型是字面量类型，二选一，而父级传参的类型是可选类型，在类型系统的范围内就是不兼容的，无论是不是做了值上面的判断 */}

            {mode === 'add' ?
                <AddEditDialogComp
                    isOpen={addEditComp}
                    onOpenChange={setAddEditComp}
                    mode='add'
                    initialData={undefined}
                    onSubmit={handleNewTask}
                /> :
                <AddEditDialogComp
                    isOpen={addEditComp}
                    onOpenChange={setAddEditComp}
                    mode='edit'
                    initialData={{
                        title: todos.find(todo => todo.id === currentEditTodoId)?.title as string,
                        description: todos.find(todo => todo.id === currentEditTodoId)?.description,
                        completed: todos.find(todo => todo.id === currentEditTodoId)?.completed as boolean
                    }}
                    onSubmit={handleEditTask}
                />}

            {/* Delete Confirmation Dialog */}
            <AlertDialogComp
                isOpen={alertComp}
                onOpenChange={setAlertComp}
                onConfirm={handleDeleteTask}
            />
        </>
    );
}