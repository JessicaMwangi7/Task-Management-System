import { useState } from 'react';

const TaskList = () => {
    const [tasks, setTasks] = useState({
        pending: [
            { id: 1, title: 'Design homepage', description: 'Create wireframes for the homepage' },
            { id: 2, title: 'Set up database', description: 'Initialize MongoDB connection' }
        ],
        inProgress: [
            { id: 3, title: 'Build login API', description: 'Implement JWT authentication' }
        ],
        done: [
            { id: 4, title: 'Project setup', description: 'Initialize React app with Tailwind' }
        ]
    });

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'pending'
    });

    const handleAddTask = () => {
        if (!newTask.title.trim()) return;

        const task = {
            id: Date.now(),
            title: newTask.title,
            description: newTask.description
        };

        setTasks(prev => ({
            ...prev,
            [newTask.status]: [...prev[newTask.status], task]
        }));

        setNewTask({
            title: '',
            description: '',
            status: 'pending'
        });
    };

    const moveTask = (taskId, fromStatus, toStatus) => {
        const taskIndex = tasks[fromStatus].findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;

        const taskToMove = tasks[fromStatus][taskIndex];

        setTasks(prev => ({
            ...prev,
            [fromStatus]: prev[fromStatus].filter(t => t.id !== taskId),
            [toStatus]: [...prev[toStatus], taskToMove]
        }));
    };

    const deleteTask = (taskId, status) => {
        setTasks(prev => ({
            ...prev,
            [status]: prev[status].filter(t => t.id !== taskId)
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Task Board</h1>

                {/* Add Task Form */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                placeholder="Task title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                placeholder="Task description"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleAddTask}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
                            >
                                Add Task
                            </button>
                            <select
                                className="ml-2 p-2 border border-gray-300 rounded-md"
                                value={newTask.status}
                                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                            >
                                <option value="pending">Pending</option>
                                <option value="inProgress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Task Board */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Pending Column */}
                    <div className="bg-blue-50 p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-blue-800 mb-4 flex justify-between items-center">
                            Pending
                            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">
                                {tasks.pending.length}
                            </span>
                        </h2>
                        <div className="space-y-4">
                            {tasks.pending.map(task => (
                                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                                    <h3 className="font-medium text-gray-800">{task.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                    <div className="flex justify-between mt-3">
                                        <button
                                            onClick={() => moveTask(task.id, 'pending', 'inProgress')}
                                            className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200"
                                        >
                                            Start Progress
                                        </button>
                                        <button
                                            onClick={() => deleteTask(task.id, 'pending')}
                                            className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="bg-yellow-50 p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-yellow-800 mb-4 flex justify-between items-center">
                            In Progress
                            <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-sm">
                                {tasks.inProgress.length}
                            </span>
                        </h2>
                        <div className="space-y-4">
                            {tasks.inProgress.map(task => (
                                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
                                    <h3 className="font-medium text-gray-800">{task.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                    <div className="flex justify-between mt-3">
                                        <div>
                                            <button
                                                onClick={() => moveTask(task.id, 'inProgress', 'pending')}
                                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 mr-2"
                                            >
                                                Move Back
                                            </button>
                                            <button
                                                onClick={() => moveTask(task.id, 'inProgress', 'done')}
                                                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                                            >
                                                Mark Done
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => deleteTask(task.id, 'inProgress')}
                                            className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Done Column */}
                    <div className="bg-green-50 p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-green-800 mb-4 flex justify-between items-center">
                            Done
                            <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm">
                                {tasks.done.length}
                            </span>
                        </h2>
                        <div className="space-y-4">
                            {tasks.done.map(task => (
                                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                                    <h3 className="font-medium text-gray-800">{task.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                    <div className="flex justify-between mt-3">
                                        <button
                                            onClick={() => moveTask(task.id, 'done', 'inProgress')}
                                            className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200"
                                        >
                                            Reopen
                                        </button>
                                        <button
                                            onClick={() => deleteTask(task.id, 'done')}
                                            className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskList;