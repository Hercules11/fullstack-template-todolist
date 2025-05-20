import {
    Card,
    // CardHeader,
    // CardFooter,
    // CardTitle,
    // CardAction,
    // CardDescription,
    CardContent,
    Checkbox,
    Button,
} from "@todo-monorepo/ui"
import { Edit, Trash2 } from "lucide-react";
import type { TodoState, TodoOperate } from "@todo-monorepo/datasource"

export const TodoListItem = ({
    id,
    title,
    description,
    completed,
    // isPending,
    // createdAt,
    // updatedAt,
    toggleTodoStatus,
    openEditMode,
    openDeleteConfirm,
}: TodoState & TodoOperate) => {

    return (
        <Card key={id} className="overflow-hidden py-4 mb-[1rem]">
            <CardContent className="p-0">
                <div className="flex items-start justify-between gap-1 mx-2">
                    {/* Checkbox and Task Details */}
                    <div className="flex flex-1 flex-col flex-start text-left items-start">

                        <label htmlFor={`todo-${id}`} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                            id={`todo-${id}`}
                            checked={completed}
                            onCheckedChange={() => toggleTodoStatus(id)}
                            className="shrink-0"
                        />
                            <h3
                                className={`text-lg font-medium ${completed ? "line-through text-gray-500" : ""
                                    }`}
                            >
                                {title}
                            </h3>
                        </label>
                        {description && (
                            <p
                                className={`text-sm mt-1 ml-6 ${completed ? "line-through text-gray-400" : "text-gray-600"
                                    }`}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditMode(id)}
                            className="h-8 w-8 text-gray-500 hover:text-blue-600"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteConfirm(id)}
                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}