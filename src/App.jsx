import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  CalendarDays, 
  Calendar, 
  BarChart3, 
  Plus, 
  Search, 
  Filter,
  X,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Menu,
  CheckCircle2,
  Clock,
  AlertCircle,
  Briefcase,
  BookOpen,
  Activity,
  User,
  Star,
  Check,
  Globe,
  UploadCloud,
  PlayCircle,
  RefreshCw,
  FileText
} from 'lucide-react';

const CustomStyles = () => (
  <style>
    {`
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      
      @keyframes jump {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      .animate-jump { animation: jump 1s ease-in-out infinite; display: inline-block; }
      
      @keyframes popBadge {
        0% { transform: scale(0.5); opacity: 0; }
        70% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-badge-pop { animation: popBadge 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .animate-float { animation: float 3s ease-in-out infinite; }

      @keyframes wave {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-15deg); }
        75% { transform: rotate(15deg); }
      }
      .animate-wave { animation: wave 2.5s ease-in-out infinite; display: inline-block; transform-origin: 70% 70%; }

      @keyframes pop-in {
        0% { opacity: 0; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
      }
      .animate-pop-in { animation: pop-in 0.3s ease-out forwards; }
      
      .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    `}
  </style>
);

const MOCK_TASKS = [
  {
    id: '1',
    title: 'Hoàn thành báo cáo dự án Alpha',
    description: 'Tổng hợp số liệu và viết báo cáo.',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    dueDate: new Date().toISOString().split('T')[0],
    endTime: '11:00',
    priority: 'Cao',
    status: 'Đang làm',
    category: 'Công việc',
    notes: ''
  },
  {
    id: '2',
    title: 'Họp với khách hàng',
    description: 'Trao đổi về requirement.',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    dueDate: new Date().toISOString().split('T')[0],
    endTime: '11:30',
    priority: 'Cao',
    status: 'Chưa bắt đầu',
    category: 'Công việc',
    notes: ''
  }
];

export default function PlanFlow() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // English App State
  const [vocabList, setVocabList] = useState([]);
  const [pasteExcelText, setPasteExcelText] = useState('');
  const [vocabTopic, setVocabTopic] = useState('Chung');
  const [quizTopic, setQuizTopic] = useState('Tất cả');
  const [quizTime, setQuizTime] = useState(0);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterPriority, setFilterPriority] = useState('Tất cả');
  const [filterCategory, setFilterCategory] = useState('Tất cả');

  const [formData, setFormData] = useState({
    title: '', description: '', 
    startDate: new Date().toISOString().split('T')[0], startTime: '09:00',
    dueDate: new Date().toISOString().split('T')[0], endTime: '10:00',
    priority: 'Trung bình', status: 'Chưa bắt đầu', category: 'Công việc', notes: ''
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem('planflow_tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    else {
      setTasks(MOCK_TASKS);
      localStorage.setItem('planflow_tasks', JSON.stringify(MOCK_TASKS));
    }

    const savedVocab = localStorage.getItem('planflow_vocab');
    if (savedVocab) setVocabList(JSON.parse(savedVocab));
  }, []);

  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem('planflow_tasks', JSON.stringify(newTasks));
  };

  const saveVocab = (newVocab) => {
    setVocabList(newVocab);
    localStorage.setItem('planflow_vocab', JSON.stringify(newVocab));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData(task);
    } else {
      setEditingTask(null);
      setFormData({
        title: '', description: '',
        startDate: new Date().toISOString().split('T')[0], startTime: '09:00',
        dueDate: new Date().toISOString().split('T')[0], endTime: '10:00',
        priority: 'Trung bình', status: 'Chưa bắt đầu', category: 'Công việc', notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingTask) {
      const updatedTasks = tasks.map(t => t.id === editingTask.id ? { ...formData, id: t.id } : t);
      saveTasks(updatedTasks);
    } else {
      const newTask = { ...formData, id: Date.now().toString() };
      saveTasks([...tasks, newTask]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa công việc này?')) {
      const updatedTasks = tasks.filter(t => t.id !== id);
      saveTasks(updatedTasks);
      setIsModalOpen(false);
    }
  };

  const toggleTaskStatus = (task) => {
    const newStatus = task.status === 'Hoàn thành' ? 'Chưa bắt đầu' : 'Hoàn thành';
    const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t);
    saveTasks(updatedTasks);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Chưa bắt đầu': return 'text-slate-500 bg-slate-100 border-slate-200';
      case 'Đang làm': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Hoàn thành': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Tạm hoãn': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-slate-500 bg-slate-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Cao': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'Trung bình': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Thấp': return 'text-teal-600 bg-teal-50 border-teal-200';
      default: return 'text-slate-500 bg-slate-100';
    }
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Hoàn thành').length;
    const doing = tasks.filter(t => t.status === 'Đang làm').length;
    const today = new Date().toISOString().split('T')[0];
    const overdue = tasks.filter(t => t.dueDate < today && t.status !== 'Hoàn thành').length;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, doing, overdue, rate };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'Tất cả' || task.status === filterStatus;
      const matchPriority = filterPriority === 'Tất cả' || task.priority === filterPriority;
      const matchCategory = filterCategory === 'Tất cả' || task.category === filterCategory;
      return matchSearch && matchStatus && matchPriority && matchCategory;
    });
  }, [tasks, searchTerm, filterStatus, filterPriority, filterCategory]);

  const DashboardTab = () => (
    <div className="animate-pop-in space-y-6">
      <div className="bg-gradient-to-r from-pink-100/80 via-purple-100/80 to-indigo-100/80 p-6 sm:p-8 rounded-3xl shadow-sm border border-white/60 relative overflow-hidden backdrop-blur-sm">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-3 mb-2">
            Xin chào! <span className="animate-wave text-3xl sm:text-4xl">👋</span>
          </h1>
          <p className="text-slate-600 font-medium text-sm sm:text-base">Chúc bạn một ngày làm việc thật hiệu quả và ngập tràn năng lượng nhé! ✨</p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-6xl sm:text-7xl animate-float opacity-80 hidden sm:block">
          🚀
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-indigo-50 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform"><ListTodo className="w-6 h-6" /></div>
            <h3 className="font-semibold text-slate-600">Tổng cộng</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-emerald-50 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform"><CheckCircle2 className="w-6 h-6" /></div>
            <h3 className="font-semibold text-slate-600">Hoàn thành</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.completed}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-blue-50 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform"><Clock className="w-6 h-6" /></div>
            <h3 className="font-semibold text-slate-600">Đang làm</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.doing}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-rose-50 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform"><AlertCircle className="w-6 h-6" /></div>
            <h3 className="font-semibold text-slate-600">Quá hạn</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.overdue}</p>
        </div>
      </div>

      {/* Progress & Today Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Tỷ lệ hoàn thành</h2>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-48 h-48 flex items-center justify-center bg-indigo-50 rounded-full mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-indigo-100"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500 drop-shadow-md"
                  strokeDasharray={`${stats.rate}, 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-4xl font-black text-indigo-600 flex items-center flex-col">
                {stats.rate}%
                <span className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Tiến độ</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-bold text-slate-800">Cần làm hôm nay</h2>
             <button onClick={() => setActiveTab('tasks')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl">Xem tất cả</button>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
            {tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0]).length === 0 ? (
               <div className="text-center py-10 text-slate-400 font-medium">Không có công việc nào hạn hôm nay 🎉</div>
            ) : (
              tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0]).map(task => (
                <div key={task.id} className="p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors flex items-start gap-4">
                  <div className={`mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full ${task.status === 'Hoàn thành' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-indigo-400'}`}></div>
                  <div>
                    <h4 className={`font-semibold text-slate-800 ${task.status === 'Hoàn thành' ? 'text-emerald-600' : ''}`}>{task.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.startTime || '09:00'} - {task.endTime || '10:00'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const TasksTab = () => (
    <div className="animate-pop-in h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Danh sách công việc</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg font-medium"
        >
          <Plus className="w-5 h-5" /> Thêm công việc
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm công việc..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 flex-1 min-w-[140px]">
            <Filter className="w-4 h-4 text-slate-500" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-transparent outline-none flex-1 font-medium text-slate-700">
              <option value="Tất cả">Trạng thái (Tất cả)</option>
              <option value="Chưa bắt đầu">Chưa bắt đầu</option>
              <option value="Đang làm">Đang làm</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Tạm hoãn">Tạm hoãn</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar pb-20 sm:pb-0">
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border border-white flex flex-col items-center">
              <div className="text-6xl animate-bounce mb-4">🔍</div>
              <p className="text-slate-600 font-bold text-lg">Không tìm thấy công việc nào!</p>
            </div>
          ) : (
            filteredTasks.map(task => {
              const isDone = task.status === 'Hoàn thành';
              return (
                <div key={task.id} className={`p-4 sm:p-5 rounded-3xl transition-all group flex flex-col sm:flex-row sm:items-center gap-4 ${
                  isDone ? 'bg-gradient-to-r from-emerald-50 to-green-100/60 border border-emerald-200 shadow-sm' : 'bg-white border border-slate-100 shadow-sm hover:shadow-md'
                }`}>
                  <button 
                    onClick={() => toggleTaskStatus(task)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-emerald-400'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <div className="flex items-center flex-wrap gap-2">
                        <h3 className={`font-bold text-base sm:text-lg ${isDone ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {task.title}
                        </h3>
                        {isDone && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-emerald-400 to-green-500 text-white text-[10px] sm:text-xs font-bold rounded-full animate-badge-pop">
                            <span className="animate-jump">🎉</span> Xuất sắc!
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 sm:ml-auto flex-wrap">
                         <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border ${getStatusColor(task.status)} font-medium`}>{task.status}</span>
                         <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)} font-medium`}>Ưu tiên: {task.priority}</span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm mb-3 line-clamp-2">{task.description}</p>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg w-fit text-xs font-medium text-slate-500">
                      <Calendar className="w-3.5 h-3.5" /> 
                      {task.startDate} ({task.startTime || '09:00'}) → {task.dueDate} ({task.endTime || '10:00'})
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col gap-2 pt-3 sm:pt-0 justify-end">
                    <button onClick={() => handleOpenModal(task)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" title="Sửa"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(task.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl" title="Xóa"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  );

  const WeekTab = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getWeekDays = (date) => {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(date.setDate(diff));
      return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(monday); d.setDate(monday.getDate() + i); return d;
      });
    };

    const weekDays = getWeekDays(new Date(currentDate));
    const hours = Array.from({ length: 24 }).map((_, i) => i);

    const calculateOverlaps = (dayTasks) => {
      const sorted = [...dayTasks].sort((a,b) => (a.startTime||'09:00').localeCompare(b.startTime||'09:00'));
      const cols = [];
      sorted.forEach(task => {
        let placed = false;
        for (let i = 0; i < cols.length; i++) {
          const lastTask = cols[i][cols[i].length - 1];
          if ((lastTask.endTime||'10:00') <= (task.startTime||'09:00')) {
            cols[i].push(task); task.colIdx = i; placed = true; break;
          }
        }
        if (!placed) {
          cols.push([task]); task.colIdx = cols.length - 1;
        }
      });
      sorted.forEach(t => t.maxCol = cols.length);
      return sorted;
    };

    return (
      <div className="h-full flex flex-col animate-pop-in pb-20 sm:pb-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            Lịch tuần <span className="animate-bounce">📅</span>
          </h1>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-1">
             <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))} className="p-1.5 rounded-lg hover:bg-indigo-50"><ChevronLeft className="w-5 h-5"/></button>
             <span className="text-sm font-bold px-2">Tháng {weekDays[0].getMonth() + 1}, {weekDays[0].getFullYear()}</span>
             <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))} className="p-1.5 rounded-lg hover:bg-indigo-50"><ChevronRight className="w-5 h-5"/></button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-sm flex flex-col custom-scrollbar">
          <div className="min-w-[700px] w-full flex flex-col h-fit">
            <div className="flex border-b border-indigo-50/50 bg-white/95 sticky top-0 z-30">
              <div className="w-14 sm:w-20 flex-shrink-0 sticky left-0 bg-white/95 z-40 border-r border-indigo-50/50"></div>
              {weekDays.map((day, i) => (
                <div key={i} className="flex-1 p-2 text-center border-r border-indigo-50/50 min-w-[100px] bg-slate-50/30">
                  <div className={`text-xs font-bold mb-1 uppercase ${day.toISOString().split('T')[0] === new Date().toISOString().split('T')[0] ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {['T2','T3','T4','T5','T6','T7','CN'][i]}
                  </div>
                  <div className={`text-lg font-black mx-auto flex items-center justify-center w-8 h-8 rounded-full ${day.toISOString().split('T')[0] === new Date().toISOString().split('T')[0] ? 'text-white bg-indigo-500' : 'text-slate-700'}`}>
                    {day.getDate()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative flex flex-1">
               <div className="w-14 sm:w-20 flex-shrink-0 border-r border-indigo-50/50 bg-white/95 sticky left-0 z-20 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
                  {hours.map(hour => (
                    <div key={hour} className="h-20 border-b border-indigo-50/50 flex items-start justify-center py-2 text-xs text-slate-400 font-bold bg-slate-50/30">
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                  ))}
               </div>
               
               <div className="flex-1 flex">
                  {weekDays.map((day, i) => {
                     const dateStr = day.toISOString().split('T')[0];
                     const rawDayTasks = tasks.filter(t => t.startDate === dateStr || t.dueDate === dateStr);
                     const processedTasks = calculateOverlaps(rawDayTasks);
                     
                     return (
                       <div key={i} className={`flex-1 border-r border-indigo-50/50 relative min-w-[100px] ${dateStr === new Date().toISOString().split('T')[0] ? 'bg-indigo-50/20' : ''}`}>
                          {hours.map(hour => <div key={hour} className="h-20 border-b border-slate-50/50 w-full"></div>)}
                          
                          {processedTasks.map(task => {
                             const startH = task.startTime ? parseInt(task.startTime.split(':')[0]) : 9;
                             const startM = task.startTime ? parseInt(task.startTime.split(':')[1]) : 0;
                             let endH = task.endTime ? parseInt(task.endTime.split(':')[0]) : startH + 1;
                             let endM = task.endTime ? parseInt(task.endTime.split(':')[1]) : 0;
                             if (endH < startH || (endH === startH && endM < startM)) endH = startH + 1;
                             
                             const top = (startH * 80) + (startM / 60) * 80;
                             const height = Math.max(((endH * 80) + (endM / 60) * 80) - top, 40); 
                             
                             const widthPercent = 100 / task.maxCol;
                             const leftPercent = task.colIdx * widthPercent;
                             
                             const isDone = task.status === 'Hoàn thành';
                             return (
                               <div 
                                 key={task.id} onClick={() => handleOpenModal(task)}
                                 className={`absolute rounded-xl p-1.5 text-xs cursor-pointer shadow-sm border overflow-hidden hover:z-30 transition-all backdrop-blur-md
                                  ${isDone ? 'bg-emerald-100/90 border-emerald-200 text-emerald-800' : 'bg-indigo-100/90 border-indigo-200 text-indigo-800'}`}
                                 style={{ top: `${top}px`, height: `${height}px`, width: `calc(${widthPercent}% - 4px)`, left: `calc(${leftPercent}% + 2px)` }}
                               >
                                 <div className="font-bold truncate leading-tight">{task.title}</div>
                                 <div className="text-[9px] opacity-90">{task.startTime} - {task.endTime}</div>
                               </div>
                             )
                          })}
                       </div>
                     )
                  })}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EnglishTab = () => {
    const [quizMode, setQuizMode] = useState(false);
    const [currentQuizWord, setCurrentQuizWord] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [quizStatus, setQuizStatus] = useState(null); 

    const uniqueTopics = useMemo(() => {
      const topics = vocabList.map(v => v.topic || 'Chung');
      return ['Tất cả', ...new Set(topics)];
    }, [vocabList]);

    useEffect(() => {
      let interval;
      if (quizMode && quizStatus === null) {
        interval = setInterval(() => {
          setQuizTime(prev => prev + 1);
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [quizMode, quizStatus]);

    const handlePasteExcel = () => {
      if(!pasteExcelText.trim()) return;
      const lines = pasteExcelText.split('\n');
      const newVocab = [];
      const currentTopic = vocabTopic.trim() || 'Chung';
      lines.forEach(line => {
        let parts = line.split('\t'); 
        if(parts.length < 2) parts = line.split(','); 
        
        if (parts.length >= 2) {
          const en = parts[0].trim();
          const vi = parts[1].trim();
          if (en && vi) newVocab.push({ en, vi, id: Date.now() + Math.random(), topic: currentTopic });
        }
      });
      if(newVocab.length > 0) {
        saveVocab([...vocabList, ...newVocab]);
        setPasteExcelText('');
        alert(`Đã thêm thành công ${newVocab.length} từ vựng vào chủ đề "${currentTopic}"!`);
      } else {
        alert("Không tìm thấy từ vựng hợp lệ. Hãy dán 2 cột (Tiếng Anh - Tiếng Việt) nhé.");
      }
    };

    const startQuiz = () => {
      const pool = quizTopic === 'Tất cả' ? vocabList : vocabList.filter(v => (v.topic || 'Chung') === quizTopic);
      if(pool.length === 0) return alert('Chưa có từ vựng nào trong chủ đề này!');
      setQuizMode(true);
      pickRandomWord(pool);
    };

    const pickRandomWord = (pool = null) => {
      const currentPool = pool || (quizTopic === 'Tất cả' ? vocabList : vocabList.filter(v => (v.topic || 'Chung') === quizTopic));
      if(currentPool.length === 0) {
         alert('Đã hết từ vựng trong chủ đề này!');
         setQuizMode(false);
         return;
      }
      const idx = Math.floor(Math.random() * currentPool.length);
      setCurrentQuizWord(currentPool[idx]);
      setUserAnswer('');
      setQuizStatus(null);
      setQuizTime(0);
    };

    const checkAnswer = (e) => {
      e.preventDefault();
      if(!userAnswer.trim()) return;
      if (userAnswer.toLowerCase().trim() === currentQuizWord.en.toLowerCase().trim()) {
        setQuizStatus('correct');
      } else {
        setQuizStatus('incorrect');
      }
    };

    const renderHint = () => {
      if (!currentQuizWord) return null;
      const word = currentQuizWord.en;
      let hintChars = 0;
      if (quizTime >= 10) {
        hintChars = 1 + Math.floor((quizTime - 10) / 5);
      }
      if (hintChars === 0) return null;

      const revealCount = Math.min(hintChars, word.length);
      const revealed = word.substring(0, revealCount);
      const hidden = '_ '.repeat(word.length - revealCount);
      
      return (
         <div className="mt-4 text-slate-500 font-medium animate-pop-in bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-sm">
           💡 Gợi ý: <span className="font-bold text-indigo-600 tracking-widest text-lg ml-2">{revealed}{hidden}</span>
           <div className="text-xs text-slate-400 mt-1">(Gợi ý tự động thêm sau mỗi 5s)</div>
         </div>
      );
    };

    if (quizMode) {
      return (
        <div className="h-full flex flex-col items-center justify-center animate-pop-in space-y-6">
          <button onClick={() => setQuizMode(false)} className="absolute top-8 left-8 sm:top-12 sm:left-12 font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2">
            <ChevronLeft /> Quay lại
          </button>
          
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-lg border border-slate-100 max-w-lg w-full text-center relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">
              Chủ đề: {currentQuizWord?.topic || 'Chung'}
            </div>
            <h2 className="text-slate-500 font-bold mb-2 uppercase tracking-widest text-sm mt-4">Nghĩa Tiếng Việt</h2>
            <div className="text-3xl sm:text-4xl font-black text-indigo-700 mb-8">{currentQuizWord?.vi}</div>
            
            <form onSubmit={checkAnswer} className="space-y-4">
              <input 
                type="text" 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Nhập từ Tiếng Anh..."
                className="w-full text-center text-xl p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                autoFocus
                disabled={quizStatus !== null}
              />
              
              {quizStatus === null && renderHint()}

              {quizStatus === null ? (
                <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-md mt-4">
                  Kiểm tra
                </button>
              ) : quizStatus === 'correct' ? (
                <div className="space-y-4 animate-pop-in mt-4">
                  <div className="text-emerald-500 font-bold text-lg flex items-center justify-center gap-2">
                    <CheckCircle2 /> Chính xác! <span className="animate-jump">🎉</span>
                  </div>
                  <button type="button" onClick={() => pickRandomWord()} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-md flex justify-center items-center gap-2">
                    Từ tiếp theo <ChevronRight className="w-5 h-5"/>
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-pop-in mt-4">
                  <div className="text-rose-500 font-bold text-lg flex items-center justify-center gap-2">
                    <AlertCircle /> Sai rồi, đáp án là: <span className="text-rose-700 font-black">"{currentQuizWord.en}"</span>
                  </div>
                  <button type="button" onClick={() => pickRandomWord()} className="w-full py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-2xl transition-all shadow-md">
                    Bỏ qua & Từ tiếp theo
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )
    }

    return (
      <div className="animate-pop-in flex flex-col h-full space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             Học Tiếng Anh <Globe className="text-indigo-500 w-6 h-6 animate-pulse" />
          </h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select 
              value={quizTopic} 
              onChange={(e) => setQuizTopic(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-200 flex-1 sm:flex-none"
            >
              {uniqueTopics.map(topic => (
                <option key={topic} value={topic}>Chủ đề: {topic}</option>
              ))}
            </select>
            <button onClick={startQuiz} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md font-bold flex-1 sm:flex-none whitespace-nowrap">
              <PlayCircle className="w-5 h-5" /> Bài tập
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Box Thêm từ vựng */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col lg:col-span-1">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-500"/> Thêm từ vựng</h2>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Copy 2 cột (Cột A: Tiếng Anh, Cột B: Tiếng Việt) từ Excel và dán vào ô bên dưới.
            </p>
            
            <input 
              type="text" 
              value={vocabTopic}
              onChange={(e) => setVocabTopic(e.target.value)}
              placeholder="Nhập chủ đề (VD: Động vật, IT...)"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm mb-3 font-medium"
            />

            <textarea 
              value={pasteExcelText}
              onChange={(e) => setPasteExcelText(e.target.value)}
              placeholder="Ví dụ dán:&#10;Apple&#9;Quả táo&#10;Banana&#9;Quả chuối"
              className="w-full flex-1 min-h-[150px] p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-sm mb-4 custom-scrollbar"
            ></textarea>
            
            <button onClick={handlePasteExcel} className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold py-3 px-4 rounded-xl transition-colors">
              Thêm từ vựng
            </button>
          </div>

          {/* Danh sách từ vựng */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2 flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-800">Kho từ vựng của bạn ({vocabList.length} từ)</h2>
              <button onClick={() => {if(window.confirm('Xóa sạch kho từ vựng?')) saveVocab([])}} className="text-sm text-rose-500 hover:text-rose-600 font-semibold bg-rose-50 px-3 py-1 rounded-lg">Xóa tất cả</button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar border rounded-2xl">
              {vocabList.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                   <BookOpen className="w-12 h-12 mb-3 opacity-20" />
                   <p className="font-medium">Chưa có từ vựng nào.</p>
                 </div>
              ) : (
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 sticky top-0 font-bold text-slate-700 shadow-sm z-10">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      <th className="py-3 px-4 border-l">Tiếng Anh</th>
                      <th className="py-3 px-4 border-l">Tiếng Việt</th>
                      <th className="py-3 px-4 border-l">Chủ đề</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vocabList.map((v, i) => (
                      <tr key={v.id} className="border-b last:border-0 hover:bg-indigo-50/50 transition-colors">
                        <td className="py-3 px-4 text-center text-slate-400 font-medium">{i + 1}</td>
                        <td className="py-3 px-4 border-l font-bold text-indigo-700">{v.en}</td>
                        <td className="py-3 px-4 border-l">{v.vi}</td>
                        <td className="py-3 px-4 border-l">
                          <span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-semibold text-slate-600">{v.topic || 'Chung'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  };

  const MonthTab = () => { 
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear(); const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const startDayOffset = firstDay === 0 ? 6 : firstDay - 1;
    const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    return (
      <div className="h-full flex flex-col animate-pop-in pb-20 sm:pb-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">Lịch tháng <span className="animate-bounce">🗓️</span></h1>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-1">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-1.5 hover:bg-indigo-50"><ChevronLeft className="w-5 h-5" /></button>
            <span className="text-sm font-bold px-4 w-32 text-center">Tháng {month + 1}, {year}</span>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-1.5 hover:bg-indigo-50"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex-1 bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-sm flex flex-col overflow-hidden">
          <div className="grid grid-cols-7 border-b border-indigo-50/50 bg-indigo-50/30">
            {dayNames.map(day => <div key={day} className="py-3 text-center text-xs font-black text-indigo-400">{day}</div>)}
          </div>
          <div className="flex-1 grid grid-cols-7 grid-rows-5 sm:grid-rows-auto overflow-y-auto custom-scrollbar">
            {Array.from({ length: startDayOffset }).map((_, i) => <div key={`empty-${i}`} className="border-r border-b border-indigo-50/50 p-2 opacity-30 bg-slate-50/50"></div>)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
              const dayTasks = tasks.filter(t => t.startDate === dateStr || t.dueDate === dateStr);
              return (
                <div key={date} className={`border-r border-b border-indigo-50/50 p-1 sm:p-2 min-h-[80px] sm:min-h-[100px] hover:bg-indigo-50/40 group ${dateStr === new Date().toISOString().split('T')[0] ? 'bg-indigo-50/30' : ''}`}>
                  <div className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${dateStr === new Date().toISOString().split('T')[0] ? 'bg-indigo-500 text-white' : 'text-slate-600'}`}>{date}</div>
                  <div className="space-y-1 max-h-[60px] overflow-hidden">
                    {dayTasks.map(task => (
                      <div key={task.id} onClick={() => handleOpenModal(task)} className={`text-[9px] p-1 rounded-lg truncate cursor-pointer ${task.status === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'}`}>{task.title}</div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  };

  const ReportTab = () => (
    <div className="animate-pop-in space-y-6 pb-20 sm:pb-0">
      <h1 className="text-2xl font-bold text-slate-800">Báo cáo hiệu suất</h1>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Trạng thái công việc</h2>
        <div className="space-y-6">
          {[
            { label: 'Hoàn thành', count: stats.completed, color: 'bg-emerald-400' },
            { label: 'Đang làm', count: stats.doing, color: 'bg-blue-400' },
            { label: 'Chưa bắt đầu', count: tasks.filter(t => t.status === 'Chưa bắt đầu').length, color: 'bg-slate-300' },
            { label: 'Tạm hoãn', count: tasks.filter(t => t.status === 'Tạm hoãn').length, color: 'bg-amber-400' }
          ].map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm font-medium mb-2 text-slate-600">
                <span>{item.label}</span>
                <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{item.count} / {stats.total}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div className={`${item.color} h-3 rounded-full transition-all duration-1000`} style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/60 to-purple-50 font-sans text-slate-800 flex selection:bg-indigo-200">
      <CustomStyles />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-indigo-50 px-4 py-3 flex justify-between items-center z-40 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 font-black text-xl tracking-tight">
          <CalendarDays className="w-6 h-6 text-indigo-500" /> PlanFlow <span className="animate-wave ml-1">✨</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-indigo-50 rounded-xl text-indigo-600 hover:bg-indigo-100 transition-colors">
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex">
        <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-indigo-50 flex flex-col transition-transform duration-300 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-6 hidden md:flex items-center gap-2 text-indigo-600 font-black text-2xl tracking-tight group cursor-default">
            <CalendarDays className="w-8 h-8 text-indigo-500 group-hover:rotate-12 transition-transform duration-300" /> PlanFlow <span className="animate-wave ml-1 text-2xl">✨</span>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto mt-16 md:mt-0">
            {[
              { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Tổng quan' },
              { id: 'tasks', icon: <ListTodo className="w-5 h-5" />, label: 'Công việc' },
              { id: 'week', icon: <CalendarDays className="w-5 h-5" />, label: 'Lịch Tuần' },
              { id: 'month', icon: <Calendar className="w-5 h-5" />, label: 'Lịch Tháng' },
              { id: 'reports', icon: <BarChart3 className="w-5 h-5" />, label: 'Báo cáo' },
              { id: 'english', icon: <Globe className="w-5 h-5 text-emerald-500" />, label: 'Học Tiếng Anh' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200/50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className={`${activeTab === item.id ? 'scale-110 text-white' : ''} transition-transform`}>
                  {item.icon}
                </div>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-8 h-screen overflow-y-auto w-full pt-20 md:pt-8 relative max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'tasks' && <TasksTab />}
          {activeTab === 'week' && <WeekTab />}
          {activeTab === 'month' && <MonthTab />}
          {activeTab === 'reports' && <ReportTab />}
          {activeTab === 'english' && <EnglishTab />}
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-pop-in overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 my-8">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl">
              <h2 className="text-xl font-bold text-slate-800">{editingTask ? 'Cập nhật công việc' : 'Thêm công việc mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 bg-slate-100 rounded-full text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Tên công việc <span className="text-rose-500">*</span></label>
                  <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all outline-none font-medium" placeholder="Nhập tên công việc..."/>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Mô tả</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="2" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-300 transition-all outline-none resize-none font-medium" placeholder="Mô tả chi tiết..."></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Ngày bắt đầu</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-300 outline-none font-medium text-slate-700"/>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Giờ bắt đầu</label>
                    <input type="time" name="startTime" value={formData.startTime || '09:00'} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-300 outline-none font-medium text-slate-700"/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Hạn hoàn thành</label>
                    <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-300 outline-none font-medium text-slate-700"/>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Giờ kết thúc</label>
                    <input type="time" name="endTime" value={formData.endTime || '10:00'} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-300 outline-none font-medium text-slate-700"/>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Nhóm phân loại</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-300 outline-none font-medium text-slate-700">
                    <option value="Công việc">Công việc</option><option value="Học tập">Học tập</option><option value="Sức khỏe">Sức khỏe</option><option value="Cá nhân">Cá nhân</option><option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Mức độ ưu tiên</label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-300 outline-none font-medium text-slate-700">
                    <option value="Thấp">Thấp</option><option value="Trung bình">Trung bình</option><option value="Cao">Cao</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Trạng thái</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-300 outline-none font-medium text-slate-700">
                    <option value="Chưa bắt đầu">Chưa bắt đầu</option><option value="Đang làm">Đang làm</option><option value="Hoàn thành">Hoàn thành</option><option value="Tạm hoãn">Tạm hoãn</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Hủy bỏ</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all">{editingTask ? 'Lưu thay đổi' : 'Tạo công việc'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}