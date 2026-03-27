// ============================================
// TaskFlow - Main React Application
// Author: Student Developer
// Date: March 2026
// Description: A complete task management app
// with login, signup, and kanban board
// ============================================

const { useState, useEffect } = React;

// ============================================
// STORAGE KEYS - For localStorage
// ============================================
const STORAGE_TASKS = 'taskflow_tasks';
const STORAGE_USERS = 'taskflow_users';
const STORAGE_CURRENT_USER = 'taskflow_current_user';

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get current date and time in YYYY-MM-DDTHH:mm format
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Format date for display
function formatDate(dateTimeString) {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ============================================
// SAMPLE DATA
// ============================================
const sampleTasks = [
    {
        id: 1,
        title: 'Design system audit',
        description: 'Review all UI components for consistency and accessibility',
        priority: 'high',
        tags: ['design', 'ui'],
        dueDate: getCurrentDateTime(),
        status: 'todo',
        completed: false,
        createdBy: 'Alex'
    },
    {
        id: 2,
        title: 'API integration tests',
        description: 'Write comprehensive tests for auth endpoints',
        priority: 'high',
        tags: ['backend', 'testing'],
        dueDate: getCurrentDateTime(),
        status: 'inprogress',
        completed: false,
        createdBy: 'Sarah'
    },
    {
        id: 3,
        title: 'Update documentation',
        description: 'Reflect recent changes in onboarding guide',
        priority: 'low',
        tags: ['docs'],
        dueDate: '2026-04-15T14:30',
        status: 'todo',
        completed: false,
        createdBy: 'Mike'
    },
    {
        id: 4,
        title: 'Performance profiling',
        description: 'Identify bundle size issues and optimize loading',
        priority: 'medium',
        tags: ['dev', 'performance'],
        dueDate: '2026-04-10T10:00',
        status: 'inprogress',
        completed: false,
        createdBy: 'Alex'
    },
    {
        id: 5,
        title: 'Stakeholder presentation',
        description: 'Prepare Q2 review slides and demo',
        priority: 'high',
        tags: ['presentation'],
        dueDate: '2026-04-05T15:00',
        status: 'done',
        completed: true,
        createdBy: 'Sarah'
    }
];

const COLUMNS = [
    { id: 'todo', title: '📝 To Do', icon: '📝' },
    { id: 'inprogress', title: '⚙️ In Progress', icon: '⚙️' },
    { id: 'done', title: '✅ Completed', icon: '✅' }
];

const PRIORITIES = ['high', 'medium', 'low'];

// ============================================
// LOGIN SCREEN COMPONENT
// ============================================
const LoginScreen = ({ onLogin, onSwitchToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        const storedUsers = JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]');
        const user = storedUsers.find(u => u.email === email && u.password === password);

        if (user) {
            onLogin({ email: user.email, name: user.name });
        } else {
            setError('Invalid email or password. Please create an account first.');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="logo-icon">✓</div>
                    <div className="logo-text">Task<span>Flow</span></div>
                </div>
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to manage your tasks</p>

                {error && <div className="error-message">{error}</div>}

                <div className="input-group">
                    <label className="input-label">Email Address</label>
                    <input
                        type="email"
                        className="input-field"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Password</label>
                    <input
                        type="password"
                        className="input-field"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </div>

                <button className="auth-btn" onClick={handleLogin}>
                    Login →
                </button>

                <div className="auth-switch">
                    Don't have an account?
                    <span onClick={onSwitchToSignup}>Create Account</span>
                </div>
            </div>
        </div>
    );
};

// ============================================
// SIGNUP SCREEN COMPONENT
// ============================================
const SignupScreen = ({ onSignup, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignup = () => {
        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        const storedUsers = JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]');
        if (storedUsers.find(u => u.email === email)) {
            setError('User with this email already exists');
            return;
        }

        const newUser = { name, email, password };
        storedUsers.push(newUser);
        localStorage.setItem(STORAGE_USERS, JSON.stringify(storedUsers));

        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
            onSignup({ email, name });
        }, 1500);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="logo-icon">✓</div>
                    <div className="logo-text">Task<span>Flow</span></div>
                </div>
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join TaskFlow and start managing your tasks</p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Email Address</label>
                    <input
                        type="email"
                        className="input-field"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Password</label>
                    <input
                        type="password"
                        className="input-field"
                        placeholder="•••••••• (min. 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Confirm Password</label>
                    <input
                        type="password"
                        className="input-field"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button className="auth-btn" onClick={handleSignup}>
                    Create Account →
                </button>

                <div className="auth-switch">
                    Already have an account?
                    <span onClick={onSwitchToLogin}>Sign In</span>
                </div>
            </div>
        </div>
    );
};

// ============================================
// TASK MODAL COMPONENT
// ============================================
const TaskModal = ({ task, onClose, onSave }) => {
    const isEditing = task && task.id;
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || 'medium',
        tags: task?.tags?.join(', ') || '',
        dueDate: task?.dueDate || '',
        status: task?.status || 'todo'
    });

    const handleSave = () => {
        if (!formData.title.trim()) {
            alert('Please enter a task title');
            return;
        }

        const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
        const newTask = {
            ...task,
            id: task?.id || Date.now(),
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            tags: tagsArray,
            dueDate: formData.dueDate,
            status: formData.status,
            completed: task?.completed || false,
            createdBy: task?.createdBy || 'You'
        };
        onSave(newTask);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{isEditing ? '✏️ Edit Task' : '➕ New Task'}</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="form-group">
                    <label className="form-label">Title *</label>
                    <input
                        className="form-input"
                        placeholder="What needs to be done?"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        autoFocus
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Add details..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Priority</label>
                    <div className="radio-group">
                        {PRIORITIES.map(p => (
                            <div
                                key={p}
                                className={`radio-option ${formData.priority === p ? `active-${p}` : ''}`}
                                onClick={() => setFormData({ ...formData, priority: p })}
                            >
                                {p === 'high' ? '🔴 HIGH' : p === 'medium' ? '🟠 MEDIUM' : '🔵 LOW'}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                        {COLUMNS.map(col => (
                            <option key={col.id} value={col.id}>{col.title}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Due Date & Time</label>
                    <input
                        type="datetime-local"
                        className="form-input"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Tags (comma separated)</label>
                    <input
                        className="form-input"
                        placeholder="design, frontend, urgent"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                </div>

                <div className="modal-footer">
                    <button className="btn" style={{ background: '#334155', color: '#94a3b8' }} onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        {isEditing ? '💾 Save Changes' : '✨ Create Task'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================
// TASK CARD COMPONENT
// ============================================
const TaskCard = ({ task, onDelete, onToggleComplete, onEdit }) => {
    const today = new Date();
    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
    const isOverdue = task.dueDate && taskDate < today && !task.completed;

    const getPriorityClass = () => {
        switch (task.priority) {
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            default: return 'priority-low';
        }
    };

    return (
        <div className={`task-card ${task.completed ? 'completed' : ''}`} onClick={() => onEdit(task)}>
            <div className="task-header">
                <div className="task-title">{task.title}</div>
                <span className={`priority-badge ${getPriorityClass()}`}>
                    {task.priority}
                </span>
            </div>
            {task.description && <div className="task-description">{task.description}</div>}
            <div className="task-meta">
                {task.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                ))}
                {task.dueDate && (
                    <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                        📅 {formatDate(task.dueDate)}
                    </span>
                )}
                <span>👤 {task.createdBy || 'Team'}</span>
            </div>
            <div className="task-actions" onClick={(e) => e.stopPropagation()}>
                <button className="action-btn complete" onClick={() => onToggleComplete(task.id)}>
                    {task.completed ? '↩️ Undo' : '✓ Complete'}
                </button>
                <button className="action-btn delete" onClick={() => onDelete(task.id)}>
                    🗑️ Delete
                </button>
            </div>
        </div>
    );
};

// ============================================
// MAIN TASK BOARD COMPONENT
// ============================================
const TaskBoard = ({ user, onLogout }) => {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem(STORAGE_TASKS);
        return saved ? JSON.parse(saved) : sampleTasks;
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_TASKS, JSON.stringify(tasks));
    }, [tasks]);

    // Task CRUD operations
    const addOrUpdateTask = (task) => {
        setTasks(prev => {
            const exists = prev.find(t => t.id === task.id);
            if (exists) {
                return prev.map(t => t.id === task.id ? task : t);
            } else {
                return [task, ...prev];
            }
        });
    };

    const deleteTask = (id) => {
        if (window.confirm('Delete this task?')) {
            setTasks(prev => prev.filter(t => t.id !== id));
        }
    };

    const toggleComplete = (id) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                const newCompleted = !t.completed;
                return {
                    ...t,
                    completed: newCompleted,
                    status: newCompleted ? 'done' : 'todo'
                };
            }
            return t;
        }));
    };

    // Filter tasks based on search and priority
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = searchQuery === '' ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

        return matchesSearch && matchesPriority;
    });

    // Statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
    const overdueTasks = tasks.filter(t => {
        return t.dueDate && new Date(t.dueDate) < new Date() && !t.completed;
    }).length;

    return (
        <div className="app">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="main-logo">
                    <div className="main-logo-icon">✓</div>
                    <div className="main-logo-text">Task<span>Flow</span></div>
                </div>

                <div className="user-info">
                    <div className="user-name">👤 {user.name || user.email.split('@')[0]}</div>
                    <div className="user-email">{user.email}</div>
                    <div className="shared-badge">
                        🌐 shared board · everyone sees all tasks
                    </div>
                </div>

                <div className="nav-item">
                    <span>📋 All Tasks</span>
                    <span className="nav-count">{totalTasks}</span>
                </div>
                <div className="nav-item">
                    <span>📝 To Do</span>
                    <span className="nav-count">{tasks.filter(t => t.status === 'todo').length}</span>
                </div>
                <div className="nav-item">
                    <span>⚙️ In Progress</span>
                    <span className="nav-count">{inProgressTasks}</span>
                </div>
                <div className="nav-item">
                    <span>✅ Completed</span>
                    <span className="nav-count">{completedTasks}</span>
                </div>

                <div className="progress-section">
                    <div className="progress-header">
                        <span>📈 Progress</span>
                        <span style={{ color: '#22c55e' }}>{progress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <button className="logout-btn" onClick={onLogout}>
                    🚪 Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div className="top-bar">
                    <h1 className="page-title">
                        Task Board <span>{filteredTasks.length} tasks</span>
                    </h1>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <div className="search-box">
                            🔍
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary" onClick={() => {
                            setEditingTask(null);
                            setModalOpen(true);
                        }}>
                            + New Task
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Tasks</div>
                        <div className="stat-value">{totalTasks}</div>
                        <div className="stat-sub">across all columns</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Completed</div>
                        <div className="stat-value">{completedTasks}</div>
                        <div className="stat-sub">{progress}% done</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">In Progress</div>
                        <div className="stat-value">{inProgressTasks}</div>
                        <div className="stat-sub">active right now</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">⚠️ Overdue</div>
                        <div className="stat-value">{overdueTasks}</div>
                        <div className="stat-sub">need attention</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="filter-buttons">
                    {['all', 'high', 'medium', 'low'].map(filter => (
                        <button
                            key={filter}
                            className={`filter-btn ${priorityFilter === filter ? 'active' : ''}`}
                            onClick={() => setPriorityFilter(filter)}
                        >
                            {filter === 'all' ? '🎯 All Priorities' :
                             filter === 'high' ? '🔴 High Priority' :
                             filter === 'medium' ? '🟠 Medium Priority' : '🔵 Low Priority'}
                        </button>
                    ))}
                </div>

                {/* Kanban Board */}
                <div className="kanban-board">
                    {COLUMNS.map(column => {
                        const columnTasks = filteredTasks.filter(t => t.status === column.id);
                        return (
                            <div key={column.id} className="column">
                                <div className="column-header">
                                    <span className="column-title">{column.title}</span>
                                    <span className="column-count">{columnTasks.length}</span>
                                </div>
                                <div className="column-body">
                                    {columnTasks.length === 0 ? (
                                        <div className="empty-state">
                                            ✨ No tasks here
                                        </div>
                                    ) : (
                                        columnTasks.map(task => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onDelete={deleteTask}
                                                onToggleComplete={toggleComplete}
                                                onEdit={(task) => {
                                                    setEditingTask(task);
                                                    setModalOpen(true);
                                                }}
                                            />
                                        ))
                                    )}
                                    <button
                                        className="add-task-btn"
                                        onClick={() => {
                                            setEditingTask({ status: column.id });
                                            setModalOpen(true);
                                        }}
                                    >
                                        + Add Task
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Modal */}
            {modalOpen && (
                <TaskModal
                    task={editingTask}
                    onClose={() => {
                        setModalOpen(false);
                        setEditingTask(null);
                    }}
                    onSave={addOrUpdateTask}
                />
            )}
        </div>
    );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
const App = () => {
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem(STORAGE_CURRENT_USER);
        return saved ? JSON.parse(saved) : null;
    });
    const [showSignup, setShowSignup] = useState(false);

    const handleLogin = (user) => {
        setCurrentUser(user);
        localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(user));
    };

    const handleSignup = (user) => {
        setCurrentUser(user);
        localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(user));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem(STORAGE_CURRENT_USER);
    };

    if (!currentUser) {
        if (showSignup) {
            return <SignupScreen onSignup={handleSignup} onSwitchToLogin={() => setShowSignup(false)} />;
        }
        return <LoginScreen onLogin={handleLogin} onSwitchToSignup={() => setShowSignup(true)} />;
    }

    return <TaskBoard user={currentUser} onLogout={handleLogout} />;
};

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(<App />);