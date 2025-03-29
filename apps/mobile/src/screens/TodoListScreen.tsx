// apps/mobile/src/screens/TodoListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { Todo, CreateTodoInput, UpdateTodoInput } from '@todo-monorepo/datasource';
import axios from 'axios';

const API_URL = 'http://localhost:3000/todos';

export const TodoListScreen: React.FC = () => {
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

    const addTodo = async () => {
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
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newTodoTitle}
                    onChangeText={setNewTodoTitle}
                    placeholder="Enter new todo"
                />
                <Button title="Add" onPress={addTodo} />
            </View>
            <FlatList
                data={todos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.todoItem}>
                        <Text
                            style={[
                                styles.todoText,
                                item.completed && styles.completedTodo
                            ]}
                        >
                            {item.title}
                        </Text>
                        <View style={styles.todoActions}>
                            <Button
                                title={item.completed ? "Undo" : "Complete"}
                                onPress={() => toggleTodo(item)}
                            />
                            <Button
                                title="Delete"
                                color="red"
                                onPress={() => deleteTodo(item.id)}
                            />
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginRight: 10
    },
    todoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5
    },
    todoText: {
        flex: 1
    },
    completedTodo: {
        textDecorationLine: 'line-through',
        color: 'gray'
    },
    todoActions: {
        flexDirection: 'row'
    }
});