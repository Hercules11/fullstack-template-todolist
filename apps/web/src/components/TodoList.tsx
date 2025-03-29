// apps/web/src/components/TodoList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Todo, CreateTodoInput, UpdateTodoInput } from '@todo-monorepo/datasource';
import { addTodo, removeTodo, updateTodo, fetchTodos } from '../api/mock';

const API_URL = 'http://localhost:3000/todos';

// 组件中使用
function getTodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTodos = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchTodos();
                setTodos(data);
            } catch (err) {
                setError("Failed to load todos");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadTodos();
    }, []);

    // 其他逻辑...
}

export const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get<Todo[]>(API_URL);
            setTodos(response.data);
        } catch (error) {
            console.error('Failed to fetch todos', error);
        }
    };

    const addTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodoTitle.trim()) return;

        try {
            const input: CreateTodoInput = { title: newTodoTitle };
            const response = await axios.post<Todo>(API_URL, input);
            setTodos([...todos, response.data]);
            setNewTodoTitle('');
        } catch (error) {
            console.error('Failed to add todo', error);
        }
    };

    const toggleTodo = async (todo: Todo) => {
        try {
            const input: UpdateTodoInput = {
                id: todo.id,
                completed: !todo.completed
            };
            const response = await axios.put<Todo>(`${API_URL}/${todo.id}`, input);
            setTodos(todos.map(t => t.id === todo.id ? response.data : t));
        } catch (error) {
            console.error('Failed to toggle todo', error);
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setTodos(todos.filter(t => t.id !== id));
        } catch (error) {
            console.error('Failed to delete todo', error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Todo List</h1>
            <form onSubmit={addTodo} className="flex mb-6">
                <input
                    type="text"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    placeholder="Enter new todo"
                    className="flex-grow p-2 border rounded-l-md"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
                >
                    Add
                </button>
            </form>
            <ul>
                {todos.map(todo => (
                    <li
                        key={todo.id}
                        className="flex justify-between items-center p-3 border-b last:border-b-0"
                    >
                        <span
                            className={`flex-grow ${todo.completed ? 'line-through text-gray-400' : ''}`}
                        >
                            {todo.title}
                        </span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => toggleTodo(todo)}
                                className={`p-1 rounded ${todo.completed
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-green-500 text-white'
                                    }`}
                            >
                                {todo.completed ? 'Undo' : 'Complete'}
                            </button>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="bg-red-500 text-white p-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};