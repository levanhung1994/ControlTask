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
  PlayCircle,
  FileText,
  HelpCircle,
  LogOut,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Gamepad2,
  Target,
  Trophy,
  Volume2,
  Languages,
  Sparkles,
  Repeat,
  Wand2,
  BookA
} from 'lucide-react';

const CustomStyles = () => (
  <style>
    {`
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
      .animate-float { animation: float 3s ease-in-out infinite; display: inline-block; }

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

      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-spin-slow { animation: spin-slow 8s linear infinite; display: inline-block; }

      @keyframes glow-pulse {
        0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(250, 204, 21, 0.6)); }
        50% { transform: scale(1.05); filter: drop-shadow(0 0 20px rgba(250, 204, 21, 0.9)); }
      }
      .animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; display: inline-block; }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      .animate-shake { animation: shake 0.3s ease-in-out; }
      
      .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      
      .custom-select {
        appearance: none;
        background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1.2em;
        padding-right: 2.5rem;
      }

      .tooltip-word {
        position: relative;
        display: inline-block;
        cursor: pointer;
        padding: 0 3px;
        border-radius: 6px;
        transition: all 0.2s ease;
        border-bottom: 2px dashed #cbd5e1;
        font-weight: 700;
        color: #334155;
      }
      .tooltip-word:hover {
        background-color: #fce7f3;
        color: #be185d;
        border-bottom-color: #be185d;
        transform: translateY(-2px);
      }
      .tooltip-word:active {
        transform: scale(0.95);
      }
    `}
  </style>
);

const MOCK_TASKS = [
  {
    id: '1',
    title: 'Lên kế hoạch tuần mới',
    description: 'Sắp xếp công việc và mục tiêu cho tuần này.',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    dueDate: new Date().toISOString().split('T')[0],
    endTime: '10:00',
    priority: 'Cao',
    status: 'Chưa bắt đầu',
    category: 'Công việc'
  }
];

const PREDEFINED_TOPICS = [
  'Giao tiếp cơ bản', 
  'Công sở', 
  'Thể thao', 
  'Du lịch', 
  'Hàng ngày', 
  'Bán hàng', 
  'IT - Công nghệ',
  'Khác'
];

const PREDEFINED_TASKS = [
  'Skin care', 'Tập thể dục', 'Liên lạc khách hàng', 'Uống thuốc', 'Uống cafe', 'Đọc sách', 'Dọn dẹp', 'Học ngoại ngữ'
];

const TIME_OPTIONS = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2).toString().padStart(2, '0');
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

export default function App() {
  // Quản lý User & Auth
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Auth Form State
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Các State của App
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isGeneratingSteps, setIsGeneratingSteps] = useState(false); // Trạng thái AI sinh task
  
  // States dành cho Học Tiếng Anh
  const [engSubTab, setEngSubTab] = useState('vocab'); 
  const [vocabList, setVocabList] = useState([]);
  const [pasteExcelText, setPasteExcelText] = useState('');
  const [vocabTopic, setVocabTopic] = useState(PREDEFINED_TOPICS[0]);
  const [customTopic, setCustomTopic] = useState('');
  const [quizTopic, setQuizTopic] = useState('Tất cả');
  const [quizTime, setQuizTime] = useState(10);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuizWord, setCurrentQuizWord] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [quizStatus, setQuizStatus] = useState(null);

  // Truyện AI
  const [aiStory, setAiStory] = useState(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  // Dịch thuật Tiếng Anh
  const [readingText, setReadingText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [wordMeanings, setWordMeanings] = useState({});
  const [savedReadings, setSavedReadings] = useState([]);

  // States dành cho Mini Game Ghép Từ
  const [matchGameMode, setMatchGameMode] = useState(false);
  const [matchDataEn, setMatchDataEn] = useState([]);
  const [matchDataVi, setMatchDataVi] = useState([]);
  const [selectedEnId, setSelectedEnId] = useState(null);
  const [selectedViId, setSelectedViId] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [matchError, setMatchError] = useState(false);

  // Lịch
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  // Bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');

  const [formData, setFormData] = useState({
    title: '', description: '', 
    startDate: new Date().toISOString().split('T')[0], startTime: '09:00',
    dueDate: new Date().toISOString().split('T')[0], endTime: '10:00',
    priority: 'Trung bình', status: 'Chưa bắt đầu', category: 'Công việc',
    isRecurring: false
  });

  // Khởi tạo ứng dụng & Load tài khoản
  useEffect(() => {
    const savedUsers = localStorage.getItem('planflow_users');
    let currentUsersList = [];
    if (savedUsers) {
      currentUsersList = JSON.parse(savedUsers);
      setUsers(currentUsersList);
    } else {
      const defaultAdmin = [{ username: 'admin', password: 'admin', role: 'admin' }];
      localStorage.setItem('planflow_users', JSON.stringify(defaultAdmin));
      setUsers(defaultAdmin);
      currentUsersList = defaultAdmin;
    }

    const savedUser = localStorage.getItem('planflow_currentUser');
    if (savedUser) {
      if (currentUsersList.find(u => u.username === savedUser)) {
        setCurrentUser(savedUser);
        loadUserData(savedUser);
      } else {
        localStorage.removeItem('planflow_currentUser');
      }
    }
  }, []);

  const loadUserData = (username) => {
    const savedTasks = localStorage.getItem(`planflow_tasks_${username}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(MOCK_TASKS);
    }

    const savedVocab = localStorage.getItem(`planflow_vocab_${username}`);
    if (savedVocab) {
      setVocabList(JSON.parse(savedVocab));
    } else {
      setVocabList([]);
    }

    const savedR = localStorage.getItem(`planflow_readings_${username}`);
    if (savedR) {
      setSavedReadings(JSON.parse(savedR));
    } else {
      setSavedReadings([]);
    }
  };

  // Xác thực (Đăng nhập / Đăng ký)
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const { username, password } = authForm;
    if (!username.trim() || !password.trim()) {
      return alert("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu!");
    }

    if (authMode === 'login') {
      const user = users.find(u => u.username === username.trim() && u.password === password);
      if (user) {
        localStorage.setItem('planflow_currentUser', user.username);
        setCurrentUser(user.username);
        loadUserData(user.username);
      } else {
        alert("Sai tên đăng nhập hoặc mật khẩu! Vui lòng kiểm tra lại.");
      }
    } else {
      if (users.find(u => u.username.toLowerCase() === username.trim().toLowerCase())) {
        return alert("Tên đăng nhập này đã tồn tại! Vui lòng chọn tên khác.");
      }
      const newUser = { username: username.trim(), password: password, role: 'user' };
      const newUsersList = [...users, newUser];
      setUsers(newUsersList);
      localStorage.setItem('planflow_users', JSON.stringify(newUsersList));
      alert("🎉 Đăng ký thành công! Đang tự động đăng nhập...");
      
      localStorage.setItem('planflow_currentUser', newUser.username);
      setCurrentUser(newUser.username);
      loadUserData(newUser.username);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('planflow_currentUser');
    setCurrentUser(null);
    setTasks([]);
    setVocabList([]);
    setSavedReadings([]);
    setAuthForm({ username: '', password: '' });
  };

  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    if (currentUser) {
      localStorage.setItem(`planflow_tasks_${currentUser}`, JSON.stringify(newTasks));
    }
  };

  const saveVocab = (newVocab) => {
    setVocabList(newVocab);
    if (currentUser) {
      localStorage.setItem(`planflow_vocab_${currentUser}`, JSON.stringify(newVocab));
    }
  };

  // --- HÀM GỌI GEMINI API DÙNG CHUNG ---
  const callGeminiAPI = async (prompt, schema) => {
    const apiKey = ""; // API Key của Gemini. Trong môi trường này đã được cấp ngầm.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      })
    });
    
    if (!response.ok) throw new Error("API Lỗi");
    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  };

  // --- AI PHÂN NHỎ CÔNG VIỆC ---
  const handleAITaskBreakdown = async () => {
    if (!formData.title.trim()) {
      return alert("Bạn cần nhập Tên công việc trước khi nhờ AI phân tích nhé!");
    }
    setIsGeneratingSteps(true);
    try {
      const schema = {
        type: "OBJECT",
        properties: {
          steps: {
            type: "ARRAY",
            items: { type: "STRING" }
          }
        }
      };
      const prompt = `Tôi có công việc là: "${formData.title}". Hãy đóng vai trò là một chuyên gia quản lý thời gian, chia nhỏ công việc này thành 3 đến 5 bước thực hiện cực kỳ ngắn gọn và hiệu quả.`;
      
      const result = await callGeminiAPI(prompt, schema);
      
      if (result.steps && result.steps.length > 0) {
        const stepsText = result.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n');
        setFormData(prev => ({
          ...prev, 
          description: prev.description 
            ? `${prev.description}\n\n✨ AI Gợi ý các bước:\n${stepsText}`
            : `✨ AI Gợi ý các bước:\n${stepsText}`
        }));
      }
    } catch (e) {
      console.error(e);
      alert("Đã xảy ra lỗi khi gọi AI. Vui lòng thiết lập API Key hoặc thử lại sau.");
    }
    setIsGeneratingSteps(false);
  };

  // --- CÁC HÀM XỬ LÝ CÔNG VIỆC ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({...task, isRecurring: false});
    } else {
      setEditingTask(null);
      setFormData({
        title: '', description: '',
        startDate: new Date().toISOString().split('T')[0], startTime: '09:00',
        dueDate: new Date().toISOString().split('T')[0], endTime: '10:00',
        priority: 'Trung bình', status: 'Chưa bắt đầu', category: 'Công việc',
        isRecurring: false
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
      if (formData.isRecurring && formData.startDate !== formData.dueDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.dueDate);
        const newTasks = [];
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateString = d.toISOString().split('T')[0];
          newTasks.push({
            ...formData,
            id: Date.now().toString() + Math.random().toString().slice(2, 8),
            startDate: dateString,
            dueDate: dateString, 
            isRecurring: false
          });
        }
        saveTasks([...tasks, ...newTasks]);
        alert(`Đã tạo thành công ${newTasks.length} công việc lặp lại!`);
      } else {
        const newTask = { ...formData, id: Date.now().toString(), isRecurring: false };
        saveTasks([...tasks, newTask]);
      }
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

  const getTaskBackground = (status) => {
    switch(status) {
      case 'Hoàn thành': return 'bg-gradient-to-r from-emerald-100 to-teal-50 border-emerald-200 shadow-sm';
      case 'Tạm hoãn': return 'bg-gradient-to-r from-rose-100 to-pink-50 border-rose-200 shadow-sm'; 
      case 'Chưa bắt đầu': return 'bg-gradient-to-r from-slate-100 to-gray-50 border-slate-200 shadow-sm'; 
      case 'Đang làm': return 'bg-gradient-to-r from-amber-100 to-yellow-50 border-amber-200 shadow-sm'; 
      default: return 'bg-white/80 border-slate-100';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'Chưa bắt đầu': return 'text-slate-600 bg-slate-200/60 border border-slate-300';
      case 'Đang làm': return 'text-amber-700 bg-amber-200/60 border border-amber-300';
      case 'Hoàn thành': return 'text-emerald-700 bg-emerald-200/60 border border-emerald-300';
      case 'Tạm hoãn': return 'text-rose-700 bg-rose-200/60 border border-rose-300';
      default: return 'text-slate-500 bg-slate-100 border border-slate-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Cao': return 'text-rose-700 bg-rose-100 border border-rose-200 shadow-sm';
      case 'Trung bình': return 'text-orange-700 bg-orange-100 border border-orange-200 shadow-sm';
      case 'Thấp': return 'text-teal-700 bg-teal-100 border border-teal-200 shadow-sm';
      default: return 'text-slate-600 bg-slate-100 border border-slate-200 shadow-sm';
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
      return matchSearch && matchStatus;
    });
  }, [tasks, searchTerm, filterStatus]);


  // --- HỌC TIẾNG ANH LOGIC ---
  useEffect(() => {
    let interval;
    if (quizMode && quizStatus === null && quizTime > 0) {
      interval = setInterval(() => {
        setQuizTime(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizMode, quizStatus, quizTime]);

  const handlePasteExcel = (e) => {
    e.preventDefault();
    if(!pasteExcelText.trim()) return;
    
    const lines = pasteExcelText.split('\n');
    const newVocab = [];
    const finalTopic = (vocabTopic === 'Khác' ? customTopic : vocabTopic).trim() || 'Chung';

    lines.forEach(line => {
      if (!line.trim()) return;
      let parts = line.split('\t');
      if (parts.length < 2) parts = line.split(',');

      if (parts.length >= 2) {
        const en = parts[0].trim();
        const vi = parts[1].trim();
        if (en && vi) {
          newVocab.push({ 
            id: Date.now() + Math.random(), 
            en, 
            vi, 
            topic: finalTopic 
          });
        }
      }
    });

    if (newVocab.length > 0) {
      saveVocab([...vocabList, ...newVocab]);
      setPasteExcelText('');
      setCustomTopic('');
      alert(`Đã nạp thành công ${newVocab.length} từ vựng vào chủ đề "${finalTopic}"!`);
    } else {
      alert('Không phân tích được dữ liệu. Vui lòng đảm bảo copy đúng 2 cột từ Excel (Tiếng Anh, Nghĩa Việt).');
    }
  };

  const deleteVocab = (id) => {
    if(window.confirm('Bạn có chắc muốn xóa từ vựng này không?')) {
      const newList = vocabList.filter(v => v.id !== id);
      saveVocab(newList);
    }
  };

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        (voice.lang.includes('en') && (voice.name.includes('Female') || voice.name.includes('Zira') || voice.name.includes('Samantha') || voice.name.includes('Victoria')))
      ) || voices.find(voice => voice.lang === 'en-US' || voice.lang === 'en-GB');

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Trình duyệt của bạn không hỗ trợ tính năng phát âm.');
    }
  };

  const startQuiz = () => {
    const pool = quizTopic === 'Tất cả' ? vocabList : vocabList.filter(v => v.topic === quizTopic);
    if(pool.length === 0) return alert('Chưa có từ vựng nào trong chủ đề này để làm bài tập!');
    setAiStory(null);
    setQuizMode(true);
    setMatchGameMode(false);
    pickRandomWord(pool);
  };

  const startMatchGame = () => {
    const pool = quizTopic === 'Tất cả' ? vocabList : vocabList.filter(v => v.topic === quizTopic);
    if(pool.length < 5) return alert('Cần ít nhất 5 từ vựng trong chủ đề này để chơi trò ghép từ!');
    
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);
    const enList = shuffledPool.map(v => ({ id: v.id, text: v.en })).sort(() => 0.5 - Math.random());
    const viList = shuffledPool.map(v => ({ id: v.id, text: v.vi })).sort(() => 0.5 - Math.random());
    
    setMatchDataEn(enList);
    setMatchDataVi(viList);
    setMatchedIds([]);
    setSelectedEnId(null);
    setSelectedViId(null);
    setAiStory(null);
    setMatchGameMode(true);
    setQuizMode(false);
  };

  // --- TRUYỆN AI TỪ VỰNG ---
  const handleAIVocabStory = async () => {
    const pool = quizTopic === 'Tất cả' ? vocabList : vocabList.filter(v => v.topic === quizTopic);
    if (pool.length < 3) return alert('Bạn cần có ít nhất 3 từ vựng trong danh sách để AI sáng tác truyện!');
    
    setIsGeneratingStory(true);
    setMatchGameMode(false);
    setQuizMode(false);
    
    try {
      const randomWords = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5).map(v => v.en);
      const schema = {
        type: "OBJECT",
        properties: {
          story: { type: "STRING" },
          translation: { type: "STRING" }
        }
      };
      const prompt = `Đóng vai trò là một giáo viên tiếng Anh sáng tạo. Hãy viết một đoạn truyện ngắn hài hước hoặc truyền cảm hứng (khoảng 3-4 câu) bằng tiếng Anh. 
      BẮT BUỘC sử dụng TẤT CẢ các từ vựng sau trong câu chuyện: ${randomWords.join(', ')}. Sau đó cung cấp bản dịch tiếng Việt.`;
      
      const result = await callGeminiAPI(prompt, schema);
      
      setAiStory({
        words: randomWords,
        story: result.story,
        translation: result.translation
      });
    } catch (e) {
      console.error(e);
      alert("Đã xảy ra lỗi khi tạo truyện bằng AI.");
    }
    setIsGeneratingStory(false);
  };

  const handleSelectMatch = (side, id) => {
    if (matchedIds.includes(id) || matchError) return;

    if (side === 'en') {
      if (selectedEnId === id) return setSelectedEnId(null);
      setSelectedEnId(id);
      if (selectedViId) checkMatch(id, selectedViId);
    } else {
      if (selectedViId === id) return setSelectedViId(null);
      setSelectedViId(id);
      if (selectedEnId) checkMatch(selectedEnId, id);
    }
  };

  const checkMatch = (enId, viId) => {
    if (enId === viId) {
      setMatchedIds(prev => [...prev, enId]);
      setSelectedEnId(null);
      setSelectedViId(null);
    } else {
      setMatchError(true);
      setTimeout(() => {
        setMatchError(false);
        setSelectedEnId(null);
        setSelectedViId(null);
      }, 600);
    }
  };

  const pickRandomWord = (pool = null) => {
    const currentPool = pool || (quizTopic === 'Tất cả' ? vocabList : vocabList.filter(v => v.topic === quizTopic));
    if(currentPool.length === 0) {
       alert('Đã hết từ vựng trong chủ đề được chọn!');
       setQuizMode(false);
       return;
    }
    const idx = Math.floor(Math.random() * currentPool.length);
    setCurrentQuizWord(currentPool[idx]);
    setUserAnswer('');
    setQuizStatus(null);
    setQuizTime(10);
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

  const getHintWord = () => {
    if (!currentQuizWord) return '';
    const target = currentQuizWord.en;
    if (quizTime > 5) return '_ '.repeat(target.length).trim();
    if (quizTime > 0) return target.charAt(0) + ' ' + '_ '.repeat(target.length - 1).trim();
    return target.substring(0, 2) + ' ' + '_ '.repeat(target.length - 2).trim();
  };

  const uniqueTopics = useMemo(() => {
    const topics = vocabList.map(v => v.topic || 'Giao tiếp cơ bản');
    return ['Tất cả', ...new Set(topics)];
  }, [vocabList]);

  // --- DỊCH ĐOẠN VĂN GEMINI API ---
  const handleTranslate = async () => {
    if (!readingText.trim()) return;
    setIsTranslating(true);
    try {
      const schema = {
        type: "OBJECT",
        properties: {
          translatedText: { type: "STRING" },
          wordMeanings: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                word: { type: "STRING" },
                meaning: { type: "STRING" }
              }
            }
          }
        }
      };
      const prompt = `Dịch đoạn văn tiếng Anh sau sang tiếng Việt một cách tự nhiên. ĐỒNG THỜI, trích xuất danh sách các từ vựng quan trọng trong bài và nghĩa của nó. \nĐoạn văn: ${readingText}`;
      
      const parsed = await callGeminiAPI(prompt, schema);
      
      setTranslatedText(parsed.translatedText || "Không có bản dịch.");
      
      const normalizedMeanings = {};
      if (parsed.wordMeanings && Array.isArray(parsed.wordMeanings)) {
        parsed.wordMeanings.forEach(item => {
          if(item.word && item.meaning) {
            normalizedMeanings[item.word.toLowerCase()] = item.meaning;
          }
        });
      }
      setWordMeanings(normalizedMeanings);

    } catch(e) {
      console.error(e);
      setTranslatedText("Oops! Đã xảy ra lỗi khi dịch (Bạn cần cung cấp API Key nếu chạy code này ở máy cá nhân).");
    }
    setIsTranslating(false);
  };

  const handleSaveReading = () => {
    if (!readingText || !translatedText) return;
    const newReading = {
      id: Date.now().toString(),
      text: readingText,
      translated: translatedText,
      meanings: wordMeanings,
      date: new Date().toLocaleString('vi-VN')
    };
    const updated = [newReading, ...savedReadings];
    setSavedReadings(updated);
    if (currentUser) localStorage.setItem(`planflow_readings_${currentUser}`, JSON.stringify(updated));
    alert("Đã lưu đoạn văn thành công!");
  };

  const deleteReading = (id) => {
    if(window.confirm('Bạn có chắc muốn xóa bài đọc này?')) {
      const updated = savedReadings.filter(r => r.id !== id);
      setSavedReadings(updated);
      if (currentUser) localStorage.setItem(`planflow_readings_${currentUser}`, JSON.stringify(updated));
    }
  };


  // ==========================================
  // RENDER CÁC TAB 
  // ==========================================

  const renderDashboardTab = () => {
    const hour = new Date().getHours();
    let greetText = "Chào buổi tối";
    let greetEmoji = "🌙";
    let greetSub = "Nhớ dành thời gian nghỉ ngơi thư giãn nhé! 🍵";
    let emojiClass = "animate-float";

    if (hour >= 5 && hour < 12) {
      greetText = "Chào buổi sáng";
      greetEmoji = "🌅";
      greetSub = "Bắt đầu một ngày mới đầy năng lượng nhé! ☕";
      emojiClass = "animate-jump";
    } else if (hour >= 12 && hour < 18) {
      greetText = "Chào buổi chiều";
      greetEmoji = "☀️";
      greetSub = "Giữ vững phong độ làm việc xuất sắc nhé! 💪";
      emojiClass = "animate-glow-pulse text-yellow-400";
    }

    return (
      <div className="animate-pop-in space-y-6">
        <div className="bg-gradient-to-r from-pink-200/80 via-purple-200/80 to-indigo-200/80 p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60 relative overflow-hidden backdrop-blur-md">
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 flex items-center gap-3 mb-2">
              {greetText}, <span className="text-indigo-700 capitalize">{currentUser}</span>! <span className={`text-4xl sm:text-5xl ${emojiClass}`}>{greetEmoji}</span>
            </h1>
            <p className="text-slate-700 font-medium text-sm sm:text-lg">{greetSub}</p>
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-7xl sm:text-8xl animate-float opacity-90 hidden sm:block drop-shadow-xl">
            🚀
          </div>
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/30 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 right-20 w-40 h-40 bg-pink-300/30 rounded-full blur-2xl"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-white/80 backdrop-blur-lg p-5 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform"><ListTodo className="w-6 h-6 animate-pulse" /></div>
              <h3 className="font-bold text-slate-600 text-sm sm:text-base">Tổng cộng</h3>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-5 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform"><CheckCircle2 className="w-6 h-6" /></div>
              <h3 className="font-bold text-slate-600 text-sm sm:text-base">Hoàn thành</h3>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-slate-800">{stats.completed}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-5 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform"><Clock className="w-6 h-6" /></div>
              <h3 className="font-bold text-slate-600 text-sm sm:text-base">Đang làm</h3>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-slate-800">{stats.doing}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg p-5 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform"><AlertCircle className="w-6 h-6 animate-bounce" /></div>
              <h3 className="font-bold text-slate-600 text-sm sm:text-base">Quá hạn</h3>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-slate-800">{stats.overdue}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-4 self-start flex items-center gap-2">Tỷ lệ hoàn thành <Activity className="w-5 h-5 text-pink-500 animate-pulse"/></h2>
            <div className="relative w-48 h-48 flex items-center justify-center bg-gradient-to-br from-pink-50 to-indigo-50 rounded-full my-4 shadow-inner border-4 border-white">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-white" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-pink-400 drop-shadow-md transition-all duration-1000" strokeDasharray={`${stats.rate}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute text-4xl font-black text-pink-600 flex flex-col items-center">
                {stats.rate}%
                <span className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Tiến độ</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">Hôm nay có gì? <Star className="w-5 h-5 text-amber-400 animate-jump"/></h2>
               <button onClick={() => setActiveTab('tasks')} className="text-sm font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-500 px-4 py-2 rounded-xl transition-colors shadow-sm">Xem hết</button>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[220px] custom-scrollbar pr-2">
              {tasks.length === 0 ? (
                 <div className="text-center py-10 text-slate-400 font-bold">Lên kế hoạch ngay thôi nào! 🎉</div>
              ) : (
                tasks.slice(0, 3).map(task => (
                  <div key={task.id} className="p-4 rounded-2xl bg-white/60 border border-slate-100 hover:bg-white hover:-translate-y-0.5 hover:shadow-md transition-all flex items-start gap-3">
                    <div className={`mt-1.5 flex-shrink-0 w-3 h-3 rounded-full shadow-sm ${task.status === 'Hoàn thành' ? 'bg-emerald-400' : 'bg-pink-400'}`}></div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-800 text-sm truncate">{task.title}</h4>
                      <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/> {task.startTime || '09:00'} - {task.endTime || '10:00'} | {task.category}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTasksTab = () => (
    <div className="animate-pop-in h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-extrabold text-slate-800">Danh mục công việc 📝</h1>
        <button onClick={() => handleOpenModal()} className="bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 font-bold w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" /> Thêm công việc
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-white shadow-sm mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
            <input type="text" placeholder="Tìm kiếm công việc theo tên..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-pink-50 focus:border-pink-400 outline-none transition-all font-bold text-slate-700 shadow-sm"/>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="w-4 h-4 text-indigo-500" />
            </div>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)} 
              className="custom-select w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all font-bold text-slate-700 shadow-sm hover:border-indigo-300"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Chưa bắt đầu">Chưa bắt đầu</option>
              <option value="Đang làm">Đang làm</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Tạm hoãn">Tạm hoãn</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar space-y-4 pr-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-white shadow-sm flex flex-col items-center">
            <div className="text-6xl mb-4 animate-bounce">📭</div>
            <p className="text-slate-600 font-bold text-lg">Không tìm thấy công việc nào phù hợp.</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isDone = task.status === 'Hoàn thành';
            return (
              <div key={task.id} className={`p-5 rounded-3xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 flex flex-col sm:flex-row sm:items-center gap-4 ${getTaskBackground(task.status)} border-2`}>
                <button onClick={() => toggleTaskStatus(task)} className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-200' : 'border-slate-300 bg-white text-transparent hover:border-pink-400'}`}>
                  <Check className="w-5 h-5" />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className={`font-extrabold text-lg sm:text-xl ${isDone ? 'text-emerald-700' : 'text-slate-800'}`}>{task.title}</h3>
                    {isDone && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-[11px] font-black rounded-full animate-badge-pop shadow-sm border border-emerald-300">
                        <span className="animate-jump">🎉</span> Tuyệt vời!
                      </div>
                    )}
                    <span className="text-[11px] font-black px-2.5 py-1 bg-white/90 rounded-lg border border-slate-200/60 text-slate-600 ml-auto sm:ml-0 shadow-sm">{task.category}</span>
                  </div>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-3 font-medium whitespace-pre-wrap">{task.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600">
                    <span className={`px-2.5 py-1 rounded-lg ${getStatusBadgeColor(task.status)} shadow-sm`}>{task.status}</span>
                    <span className={`px-2.5 py-1 rounded-lg ${getPriorityColor(task.priority)}`}>Ưu tiên: {task.priority}</span>
                    <span className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200/50 shadow-sm"><Clock className="w-4 h-4 text-indigo-400" />{task.startDate} ({task.startTime}) - {task.dueDate} ({task.endTime})</span>
                  </div>
                </div>
                
                <div className="flex sm:flex-col gap-2 justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-200/40">
                  <button onClick={() => handleOpenModal(task)} className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors shadow-sm bg-white border border-slate-200 hover:border-indigo-200"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(task.id)} className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shadow-sm bg-white border border-slate-200 hover:border-rose-200"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );

  const renderWeekTab = () => {
    const getWeekDays = (date) => {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(date.setDate(diff));
      return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(monday); d.setDate(monday.getDate() + i); return d;
      });
    };

    const weekDays = getWeekDays(new Date(currentWeekDate));
    const hours = Array.from({ length: 24 }).map((_, i) => i);

    return (
      <div className="h-full flex flex-col animate-pop-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">Lịch trình Tuần <span className="animate-wave inline-block">📅</span></h1>
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm p-1.5 border border-white">
             <button onClick={() => setCurrentWeekDate(new Date(currentWeekDate.setDate(currentWeekDate.getDate() - 7)))} className="p-2 rounded-xl hover:bg-pink-50 text-slate-500 hover:text-pink-600 transition-colors"><ChevronLeft className="w-5 h-5"/></button>
             <span className="text-sm font-black px-3 text-slate-700">T{weekDays[0].getMonth() + 1}/{weekDays[0].getFullYear()}</span>
             <button onClick={() => setCurrentWeekDate(new Date(currentWeekDate.setDate(currentWeekDate.getDate() + 7)))} className="p-2 rounded-xl hover:bg-pink-50 text-slate-500 hover:text-pink-600 transition-colors"><ChevronRight className="w-5 h-5"/></button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col custom-scrollbar">
          <div className="min-w-[750px] w-full flex flex-col h-fit">
            <div className="flex border-b border-slate-100 bg-white/90 sticky top-0 z-30 shadow-sm">
              <div className="w-16 flex-shrink-0 sticky left-0 bg-white/90 z-40 border-r border-slate-100"></div>
              {weekDays.map((day, i) => {
                const isToday = day.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
                return (
                  <div key={i} className={`flex-1 p-3 text-center border-r border-slate-100 last:border-r-0 min-w-[90px] ${isToday ? 'bg-pink-50/50' : ''}`}>
                    <div className={`text-[11px] font-black uppercase mb-1 ${isToday ? 'text-pink-500' : 'text-slate-400'}`}>
                      {['T2','T3','T4','T5','T6','T7','CN'][i]}
                    </div>
                    <div className={`text-base font-black mx-auto w-8 h-8 flex items-center justify-center rounded-full shadow-sm ${isToday ? 'text-white bg-gradient-to-tr from-pink-400 to-indigo-400' : 'text-slate-700 bg-white border border-slate-100'}`}>
                      {day.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="relative flex flex-1">
               <div className="w-16 flex-shrink-0 border-r border-slate-100 bg-white/90 sticky left-0 z-20 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
                  {hours.map(hour => (
                    <div key={hour} className="h-20 border-b border-slate-100 flex items-start justify-center pt-2 text-[11px] text-slate-400 font-bold bg-slate-50/50">
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                  ))}
               </div>
               
               <div className="flex-1 flex">
                  {weekDays.map((day, i) => {
                     const dateStr = day.toISOString().split('T')[0];
                     const dayTasks = tasks.filter(t => t.startDate === dateStr);
                     const isToday = dateStr === new Date().toISOString().split('T')[0];
                     
                     return (
                       <div key={i} className={`flex-1 border-r border-slate-100 last:border-r-0 relative min-w-[90px] ${isToday ? 'bg-pink-50/20' : 'bg-white'}`}>
                          {hours.map(hour => <div key={hour} className="h-20 border-b border-slate-100/60"></div>)}
                          
                          {dayTasks.map(task => {
                             const startH = task.startTime ? parseInt(task.startTime.split(':')[0]) : 9;
                             const startM = task.startTime ? parseInt(task.startTime.split(':')[1]) : 0;
                             const top = (startH * 80) + (startM / 60) * 80;
                             
                             return (
                               <div key={task.id} onClick={() => handleOpenModal(task)} className={`absolute left-1 right-1 rounded-xl p-2 text-[11px] cursor-pointer border overflow-hidden hover:z-30 hover:-translate-y-0.5 hover:shadow-lg transition-all ${task.status === 'Hoàn thành' ? 'bg-gradient-to-br from-emerald-100 to-teal-50 border-emerald-200 text-emerald-900 shadow-md' : 'bg-gradient-to-br from-indigo-100 to-purple-50 border-indigo-200 text-indigo-900 shadow-md'}`} style={{ top: `${top}px`, height: '64px' }}>
                                 <div className="font-extrabold truncate leading-tight mb-0.5">{task.title}</div>
                                 <div className="opacity-70 font-semibold text-[9px] flex items-center gap-1"><Clock className="w-3 h-3"/> {task.startTime}</div>
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

  const renderMonthTab = () => {
    const year = currentMonthDate.getFullYear(); 
    const month = currentMonthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const startDayOffset = firstDay === 0 ? 6 : firstDay - 1;
    const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    return (
      <div className="h-full flex flex-col animate-pop-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">Lịch trình Tháng <span className="animate-bounce inline-block">🗓️</span></h1>
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm p-1.5 border border-white">
            <button onClick={() => setCurrentMonthDate(new Date(year, month - 1, 1))} className="p-2 rounded-xl hover:bg-pink-50 text-slate-500 hover:text-pink-600 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <span className="text-sm font-black px-4 text-center text-slate-700">Tháng {month + 1}, {year}</span>
            <button onClick={() => setCurrentMonthDate(new Date(year, month + 1, 1))} className="p-2 rounded-xl hover:bg-pink-50 text-slate-500 hover:text-pink-600 transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-100 bg-white/90 shadow-sm">
            {dayNames.map(day => <div key={day} className="py-3 text-center text-xs font-black text-slate-400 uppercase tracking-widest">{day}</div>)}
          </div>
          <div className="flex-1 grid grid-cols-7 custom-scrollbar overflow-y-auto bg-slate-50/30">
            {Array.from({ length: startDayOffset }).map((_, i) => <div key={`empty-${i}`} className="border-r border-b border-slate-100/50 p-1 bg-slate-100/30"></div>)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
              const dayTasks = tasks.filter(t => t.startDate === dateStr);
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              return (
                <div key={date} className={`border-r border-b border-slate-100/60 p-2 min-h-[100px] hover:bg-white transition-colors group ${isToday ? 'bg-pink-50/40' : 'bg-white/50'}`}>
                  <div className={`text-xs font-black w-7 h-7 flex items-center justify-center rounded-full mb-2 shadow-sm ${isToday ? 'bg-gradient-to-tr from-pink-400 to-indigo-400 text-white' : 'text-slate-600 bg-white border border-slate-100'}`}>{date}</div>
                  <div className="space-y-1.5 max-h-[70px] overflow-hidden custom-scrollbar">
                    {dayTasks.map(task => (
                      <div key={task.id} onClick={() => handleOpenModal(task)} className={`text-[10px] px-2 py-1 rounded-lg truncate cursor-pointer font-bold shadow-sm hover:scale-105 transition-transform ${task.status === 'Hoàn thành' ? 'bg-gradient-to-r from-emerald-100 to-teal-50 text-emerald-800 border border-emerald-200' : 'bg-gradient-to-r from-indigo-100 to-purple-50 text-indigo-800 border border-indigo-200'}`}>{task.title}</div>
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

  const renderReportTab = () => {
    const categories = ['Công việc', 'Học tập', 'Sức khỏe', 'Cá nhân', 'Khác'];
    const catIcons = {
      'Công việc': <Briefcase className="w-7 h-7 text-blue-500" />,
      'Học tập': <BookOpen className="w-7 h-7 text-indigo-500" />,
      'Sức khỏe': <Activity className="w-7 h-7 text-emerald-500" />,
      'Cá nhân': <UserIcon className="w-7 h-7 text-pink-500" />,
      'Khác': <Star className="w-7 h-7 text-amber-500" />
    };

    const categoryStats = categories.map(cat => {
      const catTasks = tasks.filter(t => t.category === cat);
      const total = catTasks.length;
      const completed = catTasks.filter(t => t.status === 'Hoàn thành').length;
      const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
      return { label: cat, total, completed, rate };
    });

    return (
      <div className="animate-pop-in space-y-8 pb-20 sm:pb-0">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 flex items-center gap-3">
          Báo cáo hiệu suất <BarChart3 className="w-10 h-10 text-indigo-500 animate-pulse"/>
        </h1>
        
        {/* Tổng quan thẻ nổi */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Hoàn thành', count: stats.completed, bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <CheckCircle2 className="w-6 h-6" /> },
            { label: 'Đang làm', count: stats.doing, bg: 'bg-blue-50', text: 'text-blue-600', icon: <Clock className="w-6 h-6" /> },
            { label: 'Chưa bắt đầu', count: tasks.filter(t => t.status === 'Chưa bắt đầu').length, bg: 'bg-slate-100', text: 'text-slate-600', icon: <ListTodo className="w-6 h-6" /> },
            { label: 'Tạm hoãn', count: tasks.filter(t => t.status === 'Tạm hoãn').length, bg: 'bg-rose-50', text: 'text-rose-600', icon: <AlertCircle className="w-6 h-6" /> }
          ].map((item, idx) => (
            <div key={idx} className={`${item.bg} p-6 rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
              <div className="relative z-10">
                <div className={`mb-4 inline-flex p-3 bg-white rounded-2xl shadow-sm ${item.text} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div className="text-4xl font-black text-slate-800 mb-1">{item.count}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.label}</div>
              </div>
              <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-20 bg-current ${item.text} blur-2xl`}></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Vòng tròn tiến độ */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-1 flex flex-col items-center justify-center">
            <h2 className="text-xl font-black text-slate-700 mb-8 self-start flex items-center gap-2">
              <Target className="w-6 h-6 text-rose-400"/> Tỷ lệ tổng quan
            </h2>
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-indigo-500 drop-shadow-md transition-all duration-1000 ease-out" strokeDasharray={`${stats.rate}, 100`} strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute text-5xl font-black text-indigo-600 flex flex-col items-center bg-white w-40 h-40 rounded-full justify-center shadow-inner border border-slate-50">
                {stats.rate}%
                <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">Hoàn thành</span>
              </div>
            </div>
          </div>

          {/* Phân tích thanh tiến độ chi tiết */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-2">
            <h2 className="text-xl font-black text-slate-700 mb-8 flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-400"/> Phân tích theo hạng mục
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {categoryStats.map((cat, idx) => (
                <div key={idx} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all group flex items-start gap-5">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                    {catIcons[cat.label]}
                  </div>
                  <div className="flex-1 w-full mt-1">
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-extrabold text-slate-800 text-lg">{cat.label}</span>
                      <span className="text-xs font-black px-2.5 py-1 bg-white rounded-lg shadow-sm border border-slate-100">{cat.completed} / {cat.total}</span>
                    </div>
                    <div className="w-full bg-slate-200/50 rounded-full h-3 overflow-hidden mt-3 shadow-inner">
                      <div className={`h-3 rounded-full transition-all duration-1000 ${cat.rate >= 80 ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : cat.rate >= 40 ? 'bg-gradient-to-r from-amber-300 to-yellow-400' : cat.rate > 0 ? 'bg-gradient-to-r from-indigo-400 to-blue-400' : 'bg-slate-300'}`} style={{ width: `${cat.rate}%` }}></div>
                    </div>
                    <div className="text-[11px] font-black text-right mt-1.5 text-slate-400">{cat.rate}% TIẾN ĐỘ</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEnglishTab = () => {
    return (
      <div className="animate-pop-in flex flex-col h-full space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
             Học Tiếng Anh <Globe className="text-pink-500 w-8 h-8 animate-spin-slow drop-shadow-md" />
          </h1>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-sm overflow-x-auto w-full sm:w-auto custom-scrollbar">
             <button onClick={() => {setEngSubTab('vocab'); setAiStory(null)}} className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${engSubTab === 'vocab' ? 'bg-pink-100 text-pink-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                Từ vựng & Trò chơi
             </button>
             <button onClick={() => setEngSubTab('reading')} className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${engSubTab === 'reading' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                Dịch & Luyện Đọc AI
             </button>
          </div>
        </div>

        {engSubTab === 'vocab' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {matchGameMode ? (
              <div className="h-full flex flex-col items-center py-6 space-y-6 animate-pop-in overflow-y-auto">
                <button onClick={() => setMatchGameMode(false)} className="font-extrabold text-slate-500 hover:text-pink-600 flex items-center gap-1.5 transition-colors self-start mb-2 bg-white/60 px-4 py-2 rounded-xl backdrop-blur-sm shadow-sm hover:shadow-md border border-white">
                  <ChevronLeft className="w-5 h-5"/> Thoát trò chơi
                </button>
                
                <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-4xl w-full relative min-h-[500px] flex flex-col items-center">
                  <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2">
                    <Gamepad2 className="w-8 h-8 text-indigo-500"/> Thử Thách Ghép Từ
                  </h2>
                  
                  {matchedIds.length === matchDataEn.length && matchDataEn.length > 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center animate-pop-in space-y-6">
                      <Trophy className="w-32 h-32 text-yellow-400 animate-bounce drop-shadow-xl" />
                      <h3 className="text-4xl font-black text-emerald-500">XUẤT SẮC! 🎉</h3>
                      <p className="text-slate-600 font-bold text-lg">Bạn đã xuất sắc ghép đúng tất cả các từ.</p>
                      <button onClick={startMatchGame} className="mt-4 py-4 px-10 bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white font-black rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-pink-300/50 transition-all text-lg">
                        Chơi Lại Vòng Mới 🚀
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6 sm:gap-16 w-full flex-1">
                      <div className="space-y-4">
                        <h3 className="text-center font-bold text-slate-400 uppercase tracking-widest text-xs mb-4">Tiếng Anh</h3>
                        {matchDataEn.map(word => {
                          const isMatched = matchedIds.includes(word.id);
                          const isSelected = selectedEnId === word.id;
                          const isError = matchError && isSelected;
                          
                          let btnClass = "bg-white border-2 border-slate-100 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 shadow-sm";
                          if (isMatched) btnClass = "bg-emerald-50 border-emerald-200 text-emerald-600 opacity-50 scale-95 cursor-not-allowed";
                          else if (isError) btnClass = "bg-rose-100 border-rose-400 text-rose-700 animate-shake";
                          else if (isSelected) btnClass = "bg-indigo-100 border-indigo-400 text-indigo-800 scale-105 shadow-md z-10 relative";

                          return (
                            <button key={`en-${word.id}`} onClick={() => handleSelectMatch('en', word.id)} disabled={isMatched} className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all duration-300 ${btnClass}`}>
                              {word.text}
                            </button>
                          );
                        })}
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-center font-bold text-slate-400 uppercase tracking-widest text-xs mb-4">Ý Nghĩa</h3>
                        {matchDataVi.map(word => {
                          const isMatched = matchedIds.includes(word.id);
                          const isSelected = selectedViId === word.id;
                          const isError = matchError && isSelected;
                          
                          let btnClass = "bg-white border-2 border-slate-100 text-slate-700 hover:border-pink-200 hover:bg-pink-50 shadow-sm";
                          if (isMatched) btnClass = "bg-emerald-50 border-emerald-200 text-emerald-600 opacity-50 scale-95 cursor-not-allowed";
                          else if (isError) btnClass = "bg-rose-100 border-rose-400 text-rose-700 animate-shake";
                          else if (isSelected) btnClass = "bg-pink-100 border-pink-400 text-pink-800 scale-105 shadow-md z-10 relative";

                          return (
                            <button key={`vi-${word.id}`} onClick={() => handleSelectMatch('vi', word.id)} disabled={isMatched} className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 ${btnClass}`}>
                              {word.text}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : quizMode ? (
              <div className="h-full flex flex-col items-center justify-center space-y-5 py-6">
                <button onClick={() => setQuizMode(false)} className="font-extrabold text-slate-500 hover:text-pink-600 flex items-center gap-1.5 transition-colors self-start mb-2 bg-white/60 px-4 py-2 rounded-xl backdrop-blur-sm shadow-sm hover:shadow-md border border-white">
                  <ChevronLeft className="w-5 h-5"/> Quay lại kho từ vựng
                </button>
                
                <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-xl w-full text-center relative min-h-[420px] flex flex-col">
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 text-xs font-black px-3.5 py-1.5 rounded-full shadow-sm border border-white">
                    Chủ đề: {currentQuizWord?.topic}
                  </div>
                  
                  <h2 className="text-slate-400 font-bold mb-2 uppercase tracking-widest text-xs mt-6 flex items-center justify-center gap-2">
                    Nghĩa Tiếng Việt <Globe className="w-4 h-4 text-pink-400 animate-spin-slow"/>
                  </h2>
                  <div className="text-3xl sm:text-4xl font-black text-slate-800 mb-8 drop-shadow-sm">{currentQuizWord?.vi}</div>
                  
                  <form onSubmit={checkAnswer} className="space-y-5 flex-1 flex flex-col justify-between">
                    <input 
                      type="text" 
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Gõ từ Tiếng Anh vào đây..."
                      className="w-full text-center text-xl p-4 bg-white/60 border-2 border-pink-100 rounded-2xl focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-50 outline-none transition-all font-black text-slate-700 shadow-inner"
                      autoFocus
                      disabled={quizStatus !== null}
                    />
                    
                    <div className="min-h-[140px] flex flex-col justify-center">
                      {quizStatus === null && (
                        <div className="bg-white/60 border border-white shadow-sm p-4 rounded-3xl text-sm text-slate-600 font-bold backdrop-blur-sm">
                          ⏳ Thời gian còn lại: <span className={`font-black text-lg ${quizTime <= 3 ? 'text-rose-500 animate-pulse' : 'text-indigo-600'}`}>{quizTime}s</span>
                          <div className="mt-3 font-mono text-xl tracking-[0.3em] text-pink-600 font-black bg-pink-50/50 py-2.5 px-4 rounded-2xl border border-pink-100 shadow-inner">
                            {getHintWord()}
                          </div>
                        </div>
                      )}

                      {quizStatus === 'correct' && (
                        <div className="space-y-4 animate-pop-in">
                          <div className="text-emerald-500 font-black text-xl flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-7 h-7"/> XUẤT SẮC! <span className="animate-jump text-2xl">🎉</span>
                          </div>
                          <button type="button" onClick={() => pickRandomWord()} className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-2xl transition-all shadow-lg hover:-translate-y-1 hover:shadow-emerald-200/50 flex justify-center items-center gap-2 text-base">
                            Chinh phục từ tiếp theo <ChevronRight className="w-5 h-5"/>
                          </button>
                        </div>
                      )}

                      {quizStatus === 'incorrect' && (
                        <div className="space-y-4 animate-pop-in">
                          <div className="text-rose-500 font-bold text-base flex flex-col items-center gap-1.5">
                            <span className="flex items-center gap-1"><AlertCircle className="w-5 h-5"/> Ôi chưa chính xác rồi!</span>
                            <span className="text-slate-600">Đáp án đúng là: <span className="text-rose-600 font-black text-2xl drop-shadow-sm ml-1">"{currentQuizWord.en}"</span></span>
                          </div>
                          <button type="button" onClick={() => pickRandomWord()} className="w-full py-4 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl transition-all hover:-translate-y-1 shadow-sm text-base">
                            Bỏ qua & Học từ khác
                          </button>
                        </div>
                      )}
                    </div>

                    {quizStatus === null && (
                      <button type="submit" className="w-full py-4 bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white font-black rounded-2xl transition-all shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 text-base mt-auto">
                        Kiểm tra đáp án
                      </button>
                    )}
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-none">
                  <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:col-span-1">
                    <h2 className="font-extrabold text-slate-800 mb-2 flex items-center gap-2 text-lg">
                      <FileText className="w-6 h-6 text-indigo-500"/> Nạp dữ liệu Excel
                    </h2>
                    <div className="text-slate-500 text-[11px] mb-5 leading-relaxed bg-indigo-50/50 p-3 rounded-xl border border-indigo-50">
                      <span className="font-bold flex items-center gap-1 mb-1 text-indigo-500"><HelpCircle className="w-3.5 h-3.5"/> Cấu trúc các cột khi Copy:</span>
                      1. Tiếng Anh &nbsp;&nbsp;|&nbsp;&nbsp; 2. Nghĩa Việt
                    </div>
                    
                    <form onSubmit={handlePasteExcel} className="flex flex-col space-y-4">
                      <div>
                        <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">1. Phân loại chủ đề</label>
                        <select 
                          value={vocabTopic}
                          onChange={(e) => setVocabTopic(e.target.value)}
                          className="custom-select w-full px-4 py-3 bg-white border border-pink-100 rounded-2xl outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50 text-sm font-bold text-slate-700 shadow-sm transition-all cursor-pointer hover:border-pink-300"
                        >
                          {PREDEFINED_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {vocabTopic === 'Khác' && (
                          <input 
                            type="text"
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                            placeholder="Nhập tên chủ đề mới của bạn..."
                            className="w-full mt-3 px-4 py-3 bg-white border border-pink-100 rounded-2xl outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50 text-sm font-bold text-slate-700 shadow-sm animate-pop-in transition-all hover:border-pink-300"
                            required
                          />
                        )}
                      </div>

                      <div className="flex flex-col">
                        <label className="block text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">2. Dán dữ liệu</label>
                        <textarea 
                          value={pasteExcelText}
                          onChange={(e) => setPasteExcelText(e.target.value)}
                          placeholder="Ví dụ dán:&#10;apple&#9;quả táo&#10;banana&#9;quả chuối"
                          className="w-full h-32 p-4 bg-white/50 border-2 border-indigo-50 rounded-2xl resize-none outline-none focus:border-indigo-300 focus:bg-white font-mono text-sm custom-scrollbar border-dashed shadow-inner font-medium text-slate-600"
                          required
                        ></textarea>
                      </div>
                      
                      <button type="submit" className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-extrabold py-3.5 px-4 rounded-2xl transition-all hover:-translate-y-1 shadow-sm text-sm">
                        Nạp vào kho từ vựng
                      </button>
                    </form>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:col-span-2 flex flex-col h-[500px]">
                    <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
                      <div className="flex items-center gap-3">
                        <select 
                          value={quizTopic} 
                          onChange={(e) => setQuizTopic(e.target.value)} 
                          className="custom-select bg-white border border-slate-200 text-slate-700 font-extrabold px-3 py-2 rounded-xl outline-none text-xs shadow-sm hover:border-indigo-200 transition-all cursor-pointer"
                        >
                          {uniqueTopics.map(topic => <option key={topic} value={topic}>Chủ đề: {topic}</option>)}
                        </select>
                        <span className="bg-pink-100 text-pink-600 px-2 py-0.5 rounded-lg text-xs font-bold whitespace-nowrap">{vocabList.length} từ</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button onClick={startQuiz} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all font-bold text-xs">
                          <PlayCircle className="w-4 h-4" /> Gõ từ
                        </button>
                        <button onClick={startMatchGame} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all font-bold text-xs">
                          <Gamepad2 className="w-4 h-4" /> Ghép từ
                        </button>
                        <button onClick={handleAIVocabStory} disabled={isGeneratingStory} className="bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 text-purple-700 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all font-bold text-xs border border-purple-200">
                          {isGeneratingStory ? <Wand2 className="w-4 h-4 animate-spin"/> : <Wand2 className="w-4 h-4" />} Truyện AI
                        </button>
                        <button onClick={() => {if(window.confirm('Bạn có chắc muốn xóa sạch toàn bộ từ vựng?')) saveVocab([])}} className="text-xs text-rose-500 hover:text-white font-bold bg-rose-50 hover:bg-rose-500 px-3 py-2 rounded-xl transition-colors shadow-sm">Xóa</button>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar border border-slate-100 rounded-3xl bg-white shadow-inner">
                      {vocabList.length === 0 ? (
                         <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                           <BookOpen className="w-16 h-16 mb-4 opacity-30 text-indigo-500 animate-float" />
                           <p className="text-sm font-bold">Kho từ vựng đang trống trơn!</p>
                           <p className="text-xs mt-1">Hãy dán dữ liệu Excel từ bảng bên trái vào nhé.</p>
                         </div>
                      ) : (
                        <table className="w-full text-left text-sm text-slate-600 border-collapse">
                          <thead className="bg-slate-50/80 backdrop-blur-md sticky top-0 font-black text-slate-500 shadow-sm z-10 text-[10px] uppercase tracking-wider">
                            <tr>
                              <th className="py-3 px-4 w-12 text-center">#</th>
                              <th className="py-3 px-4 border-l border-slate-100">Từ vựng (Tiếng Anh)</th>
                              <th className="py-3 px-4 border-l border-slate-100">Dịch nghĩa</th>
                              <th className="py-3 px-4 border-l border-slate-100 text-center">Chủ đề</th>
                              <th className="py-3 px-4 border-l border-slate-100 text-center">Xóa</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vocabList.map((v, i) => (
                              <tr key={v.id} className="border-b border-slate-50 bg-white last:border-0 hover:bg-indigo-50/40 transition-colors group">
                                <td className="py-3 px-4 text-center text-slate-400 font-bold text-xs">{i + 1}</td>
                                <td className="py-3 px-4 border-l border-slate-50 font-black text-indigo-600 group-hover:text-indigo-700">
                                  <div className="flex items-center gap-2">
                                    {v.en}
                                    <button onClick={() => playAudio(v.en)} title="Nghe phát âm" className="p-1.5 bg-pink-50 hover:bg-pink-100 text-pink-500 rounded-full transition-colors opacity-80 hover:opacity-100 shadow-sm">
                                      <Volume2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                                <td className="py-3 px-4 border-l border-slate-50 text-slate-700 font-bold">{v.vi}</td>
                                <td className="py-3 px-4 border-l border-slate-50 text-center">
                                  <span className="bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700 px-3 py-1 rounded-lg text-[10px] font-black border border-purple-100 shadow-sm whitespace-nowrap">{v.topic}</span>
                                </td>
                                <td className="py-3 px-4 border-l border-slate-50 text-center">
                                  <button onClick={() => deleteVocab(v.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50"><Trash2 className="w-4 h-4"/></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>

                {/* Khu vực hiển thị truyện AI */}
                {aiStory && (
                  <div className="bg-gradient-to-br from-purple-100 to-pink-50 p-6 rounded-[2rem] border border-purple-200 shadow-lg animate-pop-in relative">
                    <button onClick={() => setAiStory(null)} className="absolute top-4 right-4 p-2 bg-white/50 rounded-full text-slate-500 hover:text-rose-500 transition-colors"><X className="w-4 h-4"/></button>
                    <h3 className="text-lg font-black text-purple-800 mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5"/> Truyện Cực Ngắn Ghi Nhớ Từ Vựng</h3>
                    <p className="text-sm font-bold text-slate-600 mb-4">Các từ được sử dụng: <span className="text-pink-600">{aiStory.words.join(', ')}</span></p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/80 p-5 rounded-2xl shadow-inner border border-white">
                        <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-2 flex items-center gap-1"><BookA className="w-4 h-4"/> Story</h4>
                        <p className="text-slate-700 font-medium leading-relaxed">
                          {aiStory.story.split(/(\s+)/).map((word, i) => {
                             const clean = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').toLowerCase();
                             const isVocab = aiStory.words.some(w => w.toLowerCase() === clean);
                             return isVocab ? <span key={i} className="font-bold text-pink-600 bg-pink-100 px-1 rounded">{word}</span> : <span key={i}>{word}</span>;
                          })}
                        </p>
                        <button onClick={() => playAudio(aiStory.story)} className="mt-3 text-xs flex items-center gap-1 font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"><Volume2 className="w-4 h-4"/> Đọc truyện</button>
                      </div>
                      <div className="bg-white/80 p-5 rounded-2xl shadow-inner border border-white">
                        <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Languages className="w-4 h-4"/> Bản Dịch</h4>
                        <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{aiStory.translation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {engSubTab === 'reading' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col flex-1">
              <h2 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                <Languages className="w-6 h-6 text-indigo-500"/> Đoạn văn Tiếng Anh
              </h2>
              <textarea 
                value={readingText}
                onChange={(e) => setReadingText(e.target.value)}
                placeholder="Dán đoạn văn tiếng Anh cần luyện đọc và dịch vào đây..."
                className="w-full flex-1 p-5 bg-white border-2 border-slate-100 rounded-2xl resize-none outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 font-medium text-slate-700 custom-scrollbar shadow-inner text-base"
              />
              <button 
                onClick={handleTranslate} 
                disabled={isTranslating}
                className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black py-4 px-4 rounded-2xl transition-all hover:-translate-y-1 shadow-lg shadow-indigo-200/50 flex items-center justify-center gap-2 text-base disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isTranslating ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />} 
                {isTranslating ? 'Đang phân tích và dịch...' : 'Dịch & Phân Tích Đoạn Văn'}
              </button>

              {/* Danh sách bài đọc đã lưu */}
              <div className="mt-6 border-t border-slate-100 pt-6 flex-1 overflow-hidden flex flex-col">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-pink-500"/> Bài đọc đã lưu</h3>
                <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                  {savedReadings.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4 font-medium">Chưa có bài đọc nào được lưu.</p>
                  ) : (
                    savedReadings.map(r => (
                      <div key={r.id} className="p-4 bg-slate-50/80 rounded-2xl hover:bg-indigo-50 cursor-pointer group flex justify-between items-start transition-colors border border-slate-100" onClick={() => {
                          setReadingText(r.text);
                          setTranslatedText(r.translated);
                          setWordMeanings(r.meanings || {});
                      }}>
                        <div className="flex-1 min-w-0 pr-3">
                            <p className="text-sm font-bold text-slate-700 line-clamp-2">{r.text}</p>
                            <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">{r.date}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); deleteReading(r.id); }} className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-100 transition-colors"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {translatedText && (
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col flex-1 overflow-y-auto custom-scrollbar relative">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/90 backdrop-blur-md pb-2 z-10">
                  <h2 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                    Kết quả phân tích
                  </h2>
                  <button onClick={handleSaveReading} className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm">
                    💾 Lưu bài đọc
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50 shadow-inner">
                    <h3 className="text-sm font-black text-indigo-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Volume2 className="w-4 h-4" /> Luyện Đọc & Tra Từ
                    </h3>
                    <p className="text-xs text-indigo-500 mb-5 font-semibold">💡 Di chuột (Hover) vào từ để xem nghĩa. Click để nghe phát âm!</p>
                    <p className="text-xl leading-relaxed text-slate-700">
                      {readingText.split(/(\s+)/).map((word, i) => {
                         if(word.trim().length === 0) return <span key={i}>{word}</span>;
                         const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').toLowerCase();
                         const meaning = wordMeanings[cleanWord] || wordMeanings[word.toLowerCase()];
                         
                         return (
                           <span 
                             key={i} 
                             onClick={() => playAudio(cleanWord)} 
                             className="relative inline-block cursor-pointer px-0.5 mx-0.5 rounded transition-colors group border-b-2 border-dashed border-slate-300 hover:bg-pink-100 hover:text-pink-600 hover:border-pink-400 font-semibold"
                           >
                              {word}
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex flex-col items-center z-50 pointer-events-none w-max max-w-[250px] animate-pop-in">
                                <span className="bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl text-center whitespace-pre-wrap leading-tight">
                                  {meaning ? `Nghĩa: ${meaning}` : '🔊 Click để nghe'}
                                </span>
                                <span className="w-2 h-2 bg-slate-800 rotate-45 -mt-1"></span>
                              </span>
                           </span>
                         )
                      })}
                    </p>
                  </div>
                  
                  <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/50 shadow-sm">
                    <h3 className="text-sm font-black text-emerald-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Languages className="w-4 h-4" /> Bản Dịch Nghĩa
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">
                      {translatedText}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-sky-50 to-indigo-100 flex items-center justify-center p-4 selection:bg-pink-200 font-sans">
        <CustomStyles />
        <div className="bg-white/80 backdrop-blur-2xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white max-w-md w-full animate-pop-in text-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-300/40 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-300/40 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="bg-white w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-md border border-slate-50">
              <CalendarDays className="w-10 h-10 text-pink-500 animate-bounce" />
            </div>
            
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">PlanFlow <span className="animate-wave ml-1 text-2xl">✨</span></h1>
            <p className="text-slate-500 font-semibold mb-8 text-sm">
              {authMode === 'login' ? 'Chào mừng bạn quay trở lại!' : 'Đăng ký tài khoản mới để bắt đầu.'}
            </p>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
                <input 
                  type="text" 
                  required
                  value={authForm.username}
                  onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                  placeholder="Tên đăng nhập"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50 font-bold text-slate-700 shadow-sm transition-all"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                  placeholder="Mật khẩu"
                  className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50 font-bold text-slate-700 shadow-sm transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button type="submit" className="w-full py-4 mt-2 bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white font-black rounded-2xl transition-all shadow-lg hover:shadow-pink-300/50 hover:-translate-y-1 text-base uppercase tracking-widest">
                {authMode === 'login' ? 'Đăng nhập 🚀' : 'Đăng ký ngay 🎉'}
              </button>
            </form>

            <div className="mt-8 text-sm font-semibold text-slate-500">
              {authMode === 'login' ? (
                <>Chưa có tài khoản? <button onClick={() => setAuthMode('register')} className="text-indigo-600 hover:text-pink-500 transition-colors">Đăng ký ngay</button></>
              ) : (
                <>Đã có tài khoản? <button onClick={() => setAuthMode('login')} className="text-indigo-600 hover:text-pink-500 transition-colors">Đăng nhập</button></>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-sky-50 to-indigo-100 font-sans text-slate-800 flex selection:bg-pink-200">
      <CustomStyles />
      
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-white px-5 py-4 flex justify-between items-center z-40 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 font-black text-xl tracking-tight drop-shadow-sm">
          <CalendarDays className="w-6 h-6 text-pink-500" /> PlanFlow <span className="animate-wave ml-0.5">✨</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-white rounded-xl text-indigo-600 hover:bg-pink-50 transition-colors shadow-sm">
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex w-full">
        {/* Sidebar Left */}
        <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white/60 backdrop-blur-2xl border-r border-white flex flex-col transition-transform duration-300 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-8 hidden md:flex items-center gap-2 text-indigo-600 font-black text-2xl tracking-tight group cursor-default drop-shadow-sm">
            <CalendarDays className="w-8 h-8 text-pink-500 group-hover:rotate-12 transition-transform duration-300" /> PlanFlow <span className="animate-wave ml-0.5 text-2xl">✨</span>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto mt-16 md:mt-0 custom-scrollbar">
            {[
              { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Tổng quan' },
              { id: 'tasks', icon: <ListTodo className="w-5 h-5" />, label: 'Công việc lặp' },
              { id: 'week', icon: <CalendarDays className="w-5 h-5" />, label: 'Lịch Tuần' },
              { id: 'month', icon: <Calendar className="w-5 h-5" />, label: 'Lịch Tháng' },
              { id: 'reports', icon: <BarChart3 className="w-5 h-5" />, label: 'Báo cáo' },
              { id: 'english', icon: <Globe className="w-5 h-5" />, label: 'Học Tiếng Anh' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-extrabold text-sm transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-pink-400 to-indigo-400 text-white shadow-lg shadow-pink-200/50 scale-[1.02]' 
                    : 'text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm'
                }`}
              >
                <div className={`${activeTab === item.id ? 'scale-110 text-white' : (item.id === 'english' ? 'text-emerald-500' : '')} transition-transform`}>
                  {item.icon}
                </div>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-5 border-t border-white/60">
            <div className="flex flex-col items-center gap-3 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-white shadow-sm">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đang hoạt động</p>
                <p className="text-sm font-black text-indigo-700 capitalize">{currentUser}</p>
              </div>
              <button onClick={handleLogout} className="mt-2 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100 transition-all text-xs shadow-sm bg-white">
                <LogOut className="w-3.5 h-3.5"/> Đăng xuất
              </button>
            </div>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-8 h-screen overflow-y-auto w-full pt-20 md:pt-8 relative max-w-7xl mx-auto custom-scrollbar">
          {activeTab === 'dashboard' && renderDashboardTab()}
          {activeTab === 'tasks' && renderTasksTab()}
          {activeTab === 'week' && renderWeekTab()}
          {activeTab === 'month' && renderMonthTab()}
          {activeTab === 'reports' && renderReportTab()}
          {activeTab === 'english' && renderEnglishTab()}
        </main>
      </div>

      {/* Form Dialog Thêm/Sửa Công việc */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-pop-in overflow-y-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] w-full max-w-xl shadow-2xl border border-white my-4 mt-20 sm:mt-4">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white/50 rounded-t-[2rem]">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                {editingTask ? 'Cập nhật công việc 🛠️' : 'Thêm công việc kế hoạch 🎯'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-rose-50 hover:text-rose-500 bg-slate-100 rounded-xl text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <label className="block font-black text-slate-700 uppercase text-xs tracking-wider">Tên công việc <span className="text-rose-500">*</span></label>
                </div>
                <div className="flex gap-2">
                  <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none font-bold text-slate-700 shadow-sm transition-all hover:border-indigo-200" placeholder="Ví dụ: Đọc sách buổi tối..."/>
                  {/* NÚT AI PHÂN TÍCH */}
                  <button type="button" onClick={handleAITaskBreakdown} disabled={isGeneratingSteps} className="px-4 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-sm whitespace-nowrap">
                    {isGeneratingSteps ? <Sparkles className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4 text-purple-500"/>} 
                    AI Gợi ý
                  </button>
                </div>
                
                <div className="mt-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">💡 Gợi ý nhanh:</p>
                  <div className="flex flex-wrap gap-2">
                    {PREDEFINED_TASKS.map(pt => (
                      <span 
                        key={pt} 
                        onClick={() => setFormData(prev => ({...prev, title: pt}))}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold cursor-pointer transition-colors border border-indigo-100 hover:border-indigo-300 shadow-sm"
                      >
                        + {pt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 mb-1.5 uppercase text-xs tracking-wider">Mô tả chi tiết / Các bước</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none resize-none font-semibold text-slate-600 shadow-sm transition-all hover:border-indigo-200 custom-scrollbar" placeholder="Ghi chú nội dung... (Hoặc nhấn nút 'AI Gợi ý' để AI tự động lên danh sách bước đi cho bạn)"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-700 mb-1.5 uppercase text-xs tracking-wider">Từ ngày (Bắt đầu)</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-600 shadow-sm transition-all hover:border-indigo-200 cursor-pointer"/>
                </div>
                <div>
                  <label className="block font-black text-slate-700 mb-1.5 uppercase text-xs tracking-wider">Đến ngày (Kết thúc)</label>
                  <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-600 shadow-sm transition-all hover:border-indigo-200 cursor-pointer"/>
                </div>
              </div>

              {!editingTask && formData.startDate !== formData.dueDate && (
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 shadow-inner animate-pop-in">
                  <label className="flex items-center gap-3 cursor-pointer text-sm font-bold text-indigo-800">
                    <input 
                      type="checkbox" 
                      name="isRecurring" 
                      checked={formData.isRecurring} 
                      onChange={handleInputChange} 
                      className="w-5 h-5 text-indigo-600 rounded-md focus:ring-indigo-500 border-indigo-300 cursor-pointer"
                    />
                    <Repeat className="w-4 h-4" />
                    Tạo lặp lại mỗi ngày trong khoảng thời gian này
                  </label>
                  <p className="text-xs text-indigo-500 mt-2 font-medium ml-8">Hệ thống sẽ tách ra thành nhiều công việc riêng lẻ cho từng ngày để bạn dễ dàng đánh dấu hoàn thành.</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-700 mb-1.5 uppercase text-xs tracking-wider">Khung Giờ bắt đầu</label>
                  <select name="startTime" value={formData.startTime} onChange={handleInputChange} className="custom-select w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-600 shadow-sm transition-all hover:border-indigo-200 cursor-pointer">
                    {TIME_OPTIONS.map(time => <option key={`start-${time}`} value={time}>{time}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-700 mb-1.5 uppercase text-xs tracking-wider">Khung Giờ kết thúc</label>
                  <select name="endTime" value={formData.endTime} onChange={handleInputChange} className="custom-select w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-600 shadow-sm transition-all hover:border-indigo-200 cursor-pointer">
                    {TIME_OPTIONS.map(time => <option key={`end-${time}`} value={time}>{time}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-black text-slate-700 mb-1.5 uppercase text-xs tracking-wider">Phân loại</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="custom-select w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-600 shadow-sm transition-all hover:border-indigo-200 cursor-pointer">
                    <option value="Công việc">💼 Công việc</option>
                    <option value="Học tập">📚 Học tập</option>
                    <option value="Sức khỏe">🏃 Sức khỏe</option>
                    <option value="Cá nhân">👤 Cá nhân</option>
                    <option value="Khác">⭐ Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black text-slate-700 mb-1.5 uppercase text-xs tracking-wider">Ưu tiên</label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange} className="custom-select w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-600 shadow-sm transition-all hover:border-indigo-200 cursor-pointer">
                    <option value="Thấp">🟢 Thấp</option>
                    <option value="Trung bình">🟡 Trung bình</option>
                    <option value="Cao">🔴 Cao</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black text-slate-700 mb-1.5 uppercase text-xs tracking-wider">Trạng thái</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="custom-select w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-600 shadow-sm transition-all hover:border-indigo-200 cursor-pointer">
                    <option value="Chưa bắt đầu">⏳ Chưa bắt đầu</option>
                    <option value="Đang làm">⚡ Đang làm</option>
                    <option value="Hoàn thành">✅ Hoàn thành</option>
                    <option value="Tạm hoãn">⏸️ Tạm hoãn</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-2xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">Hủy bỏ</button>
                <button type="submit" className="px-6 py-3 rounded-2xl font-black text-white bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 shadow-lg hover:shadow-pink-300/50 hover:-translate-y-0.5 transition-all">Lưu công việc</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}