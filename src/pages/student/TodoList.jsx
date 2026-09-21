import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaEdit, FaCheck, FaPlus, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('All'); // All, Active, Completed
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [newTask, setNewTask] = useState({ title: '', priority: 'Medium', dueDate: '', category: 'General' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const savedTodos = localStorage.getItem('ipc_todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ipc_todos', JSON.stringify(todos));
  }, [todos]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    const task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
    };
    setTodos([...todos, task]);
    setNewTask({ title: '', priority: 'Medium', dueDate: '', category: 'General' });
    toast.success('Task added successfully!');
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
    toast.info('Task deleted.');
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'Active' && t.completed) return false;
    if (filter === 'Completed' && !t.completed) return false;
    if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm text-center md:text-left md:flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Tasks</h1>
          <p className="text-slate-500 mt-2">Manage your placement preparation tasks</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <div className="bg-blue-50 px-4 py-2 rounded-xl">
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">Total</p>
            <p className="text-xl font-bold text-blue-800">{stats.total}</p>
          </div>
          <div className="bg-emerald-50 px-4 py-2 rounded-xl">
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide">Done</p>
            <p className="text-xl font-bold text-emerald-800">{stats.completed}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <input 
              type="text" placeholder="What needs to be done?" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
              required
            />
          </div>
          <div className="md:col-span-2">
            <select 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value})}
            >
              <option value="General">General</option>
              <option value="Coding">Coding</option>
              <option value="Resume">Resume</option>
              <option value="Interview">Interview</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <select 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <input 
              type="date"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
              <FaPlus /> Add
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-slate-50">
          <div className="flex gap-2">
            {['All', 'Active', 'Completed'].map(f => (
              <button 
                key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === f ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-slate-400" />
            <select 
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none"
              value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="General">General</option>
              <option value="Coding">Coding</option>
              <option value="Resume">Resume</option>
              <option value="Interview">Interview</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <AnimatePresence>
            {filteredTodos.length > 0 ? filteredTodos.map(todo => (
              <motion.div 
                key={todo.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 flex items-center gap-4 hover:bg-slate-50 transition ${todo.completed ? 'opacity-60' : ''}`}
              >
                <button 
                  onClick={() => toggleComplete(todo.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    todo.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-emerald-500'
                  }`}
                >
                  <FaCheck className="text-xs" />
                </button>
                
                <div className="flex-1 min-w-0">
                  {editingId === todo.id ? (
                    <input 
                      autoFocus
                      className="w-full p-1 bg-white border-b-2 border-blue-500 focus:outline-none"
                      value={todo.title}
                      onChange={(e) => setTodos(todos.map(t => t.id === todo.id ? {...t, title: e.target.value} : t))}
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                    />
                  ) : (
                    <h3 className={`font-medium truncate ${todo.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                      {todo.title}
                    </h3>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs font-medium">
                    <span className={`px-2 py-0.5 rounded text-white ${
                      todo.priority === 'High' ? 'bg-red-500' : todo.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}>
                      {todo.priority}
                    </span>
                    <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{todo.category}</span>
                    {todo.dueDate && <span className="text-slate-400">Due: {todo.dueDate}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setEditingId(todo.id)} className="p-2 text-slate-400 hover:text-blue-500 transition rounded-full hover:bg-blue-50">
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteTodo(todo.id)} className="p-2 text-slate-400 hover:text-red-500 transition rounded-full hover:bg-red-50">
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="p-12 text-center text-slate-500">
                <p>No tasks found for the current filters.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoList;
