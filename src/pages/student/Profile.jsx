import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser, FaGraduationCap, FaCode, FaLink, FaSave, FaCamera,
  FaBriefcase, FaTrophy, FaLanguage, FaHeart, FaMapMarkerAlt,
  FaPhone, FaEnvelope, FaBirthdayCake, FaVenusMars, FaIdCard,
  FaBookOpen, FaLaptopCode, FaCertificate, FaProjectDiagram,
  FaGithub, FaLinkedin, FaGlobe, FaTwitter, FaFileAlt,
  FaPlus, FaTimes, FaCheckCircle, FaExclamationTriangle, FaRocket,
  FaStar, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

// ── Default profile structure ───────────────────────────────────────
const DEFAULT_PROFILE = {
  // Personal
  name: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  nationality: 'Indian',
  address: '',
  city: '',
  state: '',
  pincode: '',
  bio: '',

  // Academic — Current
  college: '',
  university: '',
  department: '',
  degree: 'B.Tech',
  specialization: '',
  year: '3rd Year',
  semester: '6',
  cgpa: '',
  backlogs: '0',
  expectedGraduation: '',
  rollNumber: '',
  section: '',

  // Academic — 12th / Intermediate
  school12: '',
  board12: 'CBSE',
  percentage12: '',
  yearOfPassing12: '',
  stream12: 'Science',

  // Academic — 10th
  school10: '',
  board10: 'CBSE',
  percentage10: '',
  yearOfPassing10: '',

  // Skills
  skills: [],
  programmingLanguages: [],
  frameworksLibraries: [],
  toolsPlatforms: [],
  softSkills: [],

  // Projects
  projects: [
    { title: '', description: '', techStack: '', link: '' }
  ],

  // Experience / Internships
  experiences: [
    { company: '', role: '', duration: '', description: '' }
  ],

  // Certifications
  certifications: [
    { name: '', issuer: '', year: '', link: '' }
  ],

  // Achievements
  achievements: [],

  // Languages known
  languages: ['English', 'Hindi'],

  // Interests / Hobbies
  hobbies: [],

  // Career
  careerObjective: '',
  targetRole: 'Software Developer',
  preferredLocations: '',
  expectedCTC: '',
  noticePeriod: 'Immediate',
  willingToRelocate: 'Yes',

  // Social Links
  github: '',
  linkedin: '',
  portfolio: '',
  twitter: '',
  leetcode: '',
  hackerrank: '',
  codechef: '',
  resume: '',
};

// ── Helpers ─────────────────────────────────────────────────────────
const InputField = ({ label, name, value, onChange, type = 'text', placeholder, icon: Icon, half }) => (
  <div className={half ? '' : ''}>
    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />}
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder || label}
        className={`w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none focus:border-primary-500 transition text-sm text-slate-700 ${Icon ? 'pl-9' : ''}`}
      />
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, options, icon: Icon }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />}
      <select
        name={name}
        value={value || ''}
        onChange={onChange}
        className={`w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition text-sm text-slate-700 ${Icon ? 'pl-9' : ''}`}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{label}</label>
    <textarea
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder || label}
      rows={rows}
      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none text-sm text-slate-700 leading-relaxed"
    />
  </div>
);

const SectionCard = ({ title, icon: Icon, iconColor, children, collapsible = false }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => collapsible && setOpen(!open)}
        className={`w-full flex items-center justify-between p-5 border-b border-slate-100 ${collapsible ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${iconColor} flex items-center justify-center text-lg`}>
            <Icon />
          </div>
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        </div>
        {collapsible && (open ? <FaChevronUp className="text-slate-400" /> : <FaChevronDown className="text-slate-400" />)}
      </button>
      {open && <div className="p-5 space-y-4">{children}</div>}
    </div>
  );
};

const TagInput = ({ tags, setTags, placeholder, color = 'bg-primary-50 text-primary-700 border-primary-200' }) => {
  const [input, setInput] = useState('');
  const addTag = (e) => {
    e.preventDefault();
    const val = input.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setInput('');
    }
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, i) => (
          <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border ${color}`}>
            {tag}
            <button type="button" onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="hover:text-red-500 transition">
              <FaTimes className="text-[10px]" />
            </button>
          </span>
        ))}
        {tags.length === 0 && <span className="text-xs text-slate-400 italic">None added yet</span>}
      </div>
      <form onSubmit={addTag} className="flex gap-2">
        <input
          type="text" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
        />
        <button type="submit" className="px-3 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition text-sm flex items-center gap-1">
          <FaPlus className="text-xs" /> Add
        </button>
      </form>
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────────────
const Profile = () => {
  const { user, login } = useAuth() || { user: null, login: () => {} };
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ipc_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(prev => ({ ...prev, ...parsed }));
      } else if (user) {
        setProfile(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
      }
    } catch (e) { console.error(e); }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem('ipc_profile', JSON.stringify(profile));
    if (login && user) login({ ...user, name: profile.name, email: profile.email });
    toast.success('Profile saved successfully! ✅');
  };

  // Dynamic array field helpers
  const updateProject = (idx, field, val) => {
    const updated = [...profile.projects];
    updated[idx] = { ...updated[idx], [field]: val };
    setProfile({ ...profile, projects: updated });
  };
  const addProject = () => setProfile({ ...profile, projects: [...profile.projects, { title: '', description: '', techStack: '', link: '' }] });
  const removeProject = (idx) => setProfile({ ...profile, projects: profile.projects.filter((_, i) => i !== idx) });

  const updateExperience = (idx, field, val) => {
    const updated = [...profile.experiences];
    updated[idx] = { ...updated[idx], [field]: val };
    setProfile({ ...profile, experiences: updated });
  };
  const addExperience = () => setProfile({ ...profile, experiences: [...profile.experiences, { company: '', role: '', duration: '', description: '' }] });
  const removeExperience = (idx) => setProfile({ ...profile, experiences: profile.experiences.filter((_, i) => i !== idx) });

  const updateCertification = (idx, field, val) => {
    const updated = [...profile.certifications];
    updated[idx] = { ...updated[idx], [field]: val };
    setProfile({ ...profile, certifications: updated });
  };
  const addCertification = () => setProfile({ ...profile, certifications: [...profile.certifications, { name: '', issuer: '', year: '', link: '' }] });
  const removeCertification = (idx) => setProfile({ ...profile, certifications: profile.certifications.filter((_, i) => i !== idx) });

  // Completion
  const calcCompletion = () => {
    const checks = [
      profile.name, profile.email, profile.phone, profile.college, profile.department,
      profile.degree, profile.cgpa, profile.bio, profile.github, profile.linkedin,
      profile.skills.length > 0, profile.programmingLanguages.length > 0,
      profile.projects.some(p => p.title), profile.careerObjective,
      profile.percentage12, profile.percentage10, profile.address,
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  };

  const completion = calcCompletion();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 pb-24">

      {/* ── Hero Banner ──────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
        <div className="h-36 bg-gradient-to-r from-primary-600 via-indigo-600 to-accent-500 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIvPjwvc3ZnPg==')] opacity-30" />
        </div>
        <div className="px-6 pb-6 flex flex-col md:flex-row items-center md:items-end justify-between relative">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-14 gap-4">
            <div className="w-28 h-28 rounded-2xl border-4 border-white bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-5xl text-primary-400 relative overflow-hidden group shadow-lg">
              {profile.name ? (
                <span className="text-3xl font-bold text-primary-600">
                  {profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              ) : (
                <FaUser />
              )}
              <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center cursor-pointer transition">
                <FaCamera className="text-white text-xl" />
              </div>
            </div>
            <div className="text-center md:text-left pb-2">
              <h1 className="text-2xl font-bold text-slate-800">{profile.name || 'Your Name'}</h1>
              <p className="text-slate-500 text-sm">{profile.degree} {profile.specialization && `in ${profile.specialization}`} {profile.department && `• ${profile.department}`}</p>
              <p className="text-slate-400 text-xs mt-1">{profile.college || 'Your College'} {profile.year && `• ${profile.year}`}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile</p>
              <p className={`text-2xl font-black ${completion >= 80 ? 'text-green-600' : completion >= 50 ? 'text-orange-500' : 'text-red-500'}`}>{completion}%</p>
            </div>
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className={completion >= 80 ? 'text-green-500' : completion >= 50 ? 'text-orange-500' : 'text-red-500'} strokeDasharray={`${completion}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {completion < 60 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <FaExclamationTriangle className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">Complete your profile!</p>
            <p className="text-xs text-amber-700 mt-0.5">A complete profile helps generate better skill gap analysis, prep plans, and career recommendations.</p>
          </div>
        </div>
      )}

      {/* ── 1. Personal Information ───────────────────────────────── */}
      <SectionCard title="Personal Information" icon={FaUser} iconColor="bg-blue-50 text-blue-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Full Name" name="name" value={profile.name} onChange={handleChange} icon={FaUser} placeholder="e.g. Kiran Kumar" />
          <InputField label="Email Address" name="email" value={profile.email} onChange={handleChange} type="email" icon={FaEnvelope} placeholder="e.g. kiran@email.com" />
          <InputField label="Phone Number" name="phone" value={profile.phone} onChange={handleChange} type="tel" icon={FaPhone} placeholder="e.g. +91 9876543210" />
          <InputField label="Date of Birth" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleChange} type="date" icon={FaBirthdayCake} />
          <SelectField label="Gender" name="gender" value={profile.gender} onChange={handleChange} options={['', 'Male', 'Female', 'Non-Binary', 'Prefer not to say']} icon={FaVenusMars} />
          <SelectField label="Blood Group" name="bloodGroup" value={profile.bloodGroup} onChange={handleChange} options={['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
          <InputField label="Nationality" name="nationality" value={profile.nationality} onChange={handleChange} />
          <InputField label="Aadhar / ID Number" name="rollNumber" value={profile.rollNumber} onChange={handleChange} icon={FaIdCard} placeholder="Optional" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <InputField label="City" name="city" value={profile.city} onChange={handleChange} icon={FaMapMarkerAlt} />
          <InputField label="State" name="state" value={profile.state} onChange={handleChange} />
          <InputField label="Pincode" name="pincode" value={profile.pincode} onChange={handleChange} />
        </div>
        <TextAreaField label="Full Address" name="address" value={profile.address} onChange={handleChange} placeholder="House No., Street, Area..." rows={2} />
        <TextAreaField label="About Me / Bio" name="bio" value={profile.bio} onChange={handleChange} placeholder="Write a short bio about yourself — your interests, goals, and what makes you unique..." rows={3} />
      </SectionCard>

      {/* ── 2. Academic — Current Degree ──────────────────────────── */}
      <SectionCard title="Current Education (Degree)" icon={FaGraduationCap} iconColor="bg-emerald-50 text-emerald-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="College / Institution" name="college" value={profile.college} onChange={handleChange} placeholder="e.g. JNTU Hyderabad" />
          <InputField label="University" name="university" value={profile.university} onChange={handleChange} placeholder="e.g. Jawaharlal Nehru Technological University" />
          <SelectField label="Degree" name="degree" value={profile.degree} onChange={handleChange} options={['B.Tech', 'B.E', 'B.Sc', 'BCA', 'MCA', 'M.Tech', 'M.Sc', 'MBA', 'Diploma', 'Other']} />
          <SelectField label="Department / Branch" name="department" value={profile.department} onChange={handleChange} options={['Computer Science & Engineering', 'AI & Machine Learning', 'Data Science & Analytics', 'Civil Engineering', 'Mechanical Engineering', 'Electronics & Communication (ECE)', 'Electrical & Electronics (EEE)', 'Information Technology', 'Other']} />
          <InputField label="Specialization" name="specialization" value={profile.specialization} onChange={handleChange} placeholder="e.g. Structural / Embedded / AI" />
          <InputField label="Section" name="section" value={profile.section} onChange={handleChange} placeholder="e.g. A" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <SelectField label="Year of Study" name="year" value={profile.year} onChange={handleChange} options={['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduated']} />
          <SelectField label="Current Semester" name="semester" value={profile.semester} onChange={handleChange} options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']} />
          <InputField label="CGPA / Percentage" name="cgpa" value={profile.cgpa} onChange={handleChange} placeholder="e.g. 8.5 or 85%" />
          <InputField label="Active Backlogs" name="backlogs" value={profile.backlogs} onChange={handleChange} placeholder="0" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <InputField label="Roll Number / USN" name="rollNumber" value={profile.rollNumber} onChange={handleChange} placeholder="e.g. 20CS1A0501" />
          <InputField label="Expected Graduation" name="expectedGraduation" value={profile.expectedGraduation} onChange={handleChange} placeholder="e.g. May 2024" />
        </div>
      </SectionCard>

      {/* ── 3. Academic — 12th & 10th ────────────────────────────── */}
      <SectionCard title="Previous Education (12th & 10th)" icon={FaBookOpen} iconColor="bg-indigo-50 text-indigo-600" collapsible>
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-indigo-100 rounded-full text-indigo-600 flex items-center justify-center text-xs font-black">12</span>
          12th / Intermediate / Diploma
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InputField label="School / College Name" name="school12" value={profile.school12} onChange={handleChange} placeholder="e.g. ABC Junior College" />
          <SelectField label="Board" name="board12" value={profile.board12} onChange={handleChange} options={['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other']} />
          <InputField label="Percentage / CGPA" name="percentage12" value={profile.percentage12} onChange={handleChange} placeholder="e.g. 92% or 9.2" />
          <InputField label="Year of Passing" name="yearOfPassing12" value={profile.yearOfPassing12} onChange={handleChange} placeholder="e.g. 2020" />
          <SelectField label="Stream" name="stream12" value={profile.stream12} onChange={handleChange} options={['Science', 'Commerce', 'Arts', 'Vocational', 'Other']} />
        </div>

        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2 pt-4 border-t border-slate-100">
          <span className="w-6 h-6 bg-indigo-100 rounded-full text-indigo-600 flex items-center justify-center text-xs font-black">10</span>
          10th / SSC / CBSE
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="School Name" name="school10" value={profile.school10} onChange={handleChange} placeholder="e.g. XYZ High School" />
          <SelectField label="Board" name="board10" value={profile.board10} onChange={handleChange} options={['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other']} />
          <InputField label="Percentage / CGPA" name="percentage10" value={profile.percentage10} onChange={handleChange} placeholder="e.g. 95% or 10.0" />
          <InputField label="Year of Passing" name="yearOfPassing10" value={profile.yearOfPassing10} onChange={handleChange} placeholder="e.g. 2018" />
        </div>
      </SectionCard>

      {/* ── 4. Skills ────────────────────────────────────────────── */}
      <SectionCard title="Skills & Technologies" icon={FaCode} iconColor="bg-amber-50 text-amber-600">
        <div className="space-y-5">
          <div>
            <p className="text-sm font-bold text-slate-700 mb-2">Programming Languages</p>
            <TagInput tags={profile.programmingLanguages} setTags={(t) => setProfile({ ...profile, programmingLanguages: t })} placeholder="e.g. Python, Java, C++" color="bg-blue-50 text-blue-700 border-blue-200" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700 mb-2">Frameworks & Libraries</p>
            <TagInput tags={profile.frameworksLibraries} setTags={(t) => setProfile({ ...profile, frameworksLibraries: t })} placeholder="e.g. React, Django, Spring Boot" color="bg-purple-50 text-purple-700 border-purple-200" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700 mb-2">Tools & Platforms</p>
            <TagInput tags={profile.toolsPlatforms} setTags={(t) => setProfile({ ...profile, toolsPlatforms: t })} placeholder="e.g. Git, Docker, AWS, VS Code" color="bg-teal-50 text-teal-700 border-teal-200" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700 mb-2">Soft Skills</p>
            <TagInput tags={profile.softSkills} setTags={(t) => setProfile({ ...profile, softSkills: t })} placeholder="e.g. Leadership, Communication, Teamwork" color="bg-orange-50 text-orange-700 border-orange-200" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700 mb-2">Other Skills</p>
            <TagInput tags={profile.skills} setTags={(t) => setProfile({ ...profile, skills: t })} placeholder="e.g. Data Structures, REST APIs, System Design" color="bg-slate-100 text-slate-700 border-slate-200" />
          </div>
        </div>
      </SectionCard>

      {/* ── 5. Projects ──────────────────────────────────────────── */}
      <SectionCard title="Projects" icon={FaProjectDiagram} iconColor="bg-pink-50 text-pink-600">
        <div className="space-y-5">
          {profile.projects.map((proj, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Project {idx + 1}</span>
                {profile.projects.length > 1 && (
                  <button type="button" onClick={() => removeProject(idx)} className="text-red-400 hover:text-red-600 text-xs font-medium flex items-center gap-1">
                    <FaTimes /> Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Project Title" value={proj.title} onChange={(e) => updateProject(idx, 'title', e.target.value)} className="p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm" />
                <input placeholder="Tech Stack (e.g. React, Node.js, MongoDB)" value={proj.techStack} onChange={(e) => updateProject(idx, 'techStack', e.target.value)} className="p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm" />
              </div>
              <textarea placeholder="Brief description of what you built and your contributions..." value={proj.description} onChange={(e) => updateProject(idx, 'description', e.target.value)} rows={2} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm resize-none" />
              <input placeholder="Project / GitHub Link (optional)" value={proj.link} onChange={(e) => updateProject(idx, 'link', e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm" />
            </div>
          ))}
          <button type="button" onClick={addProject} className="flex items-center gap-2 text-sm text-primary-600 font-semibold hover:text-primary-700 transition">
            <FaPlus /> Add Another Project
          </button>
        </div>
      </SectionCard>

      {/* ── 6. Experience / Internships ───────────────────────────── */}
      <SectionCard title="Experience & Internships" icon={FaBriefcase} iconColor="bg-green-50 text-green-600" collapsible>
        <div className="space-y-5">
          {profile.experiences.map((exp, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Experience {idx + 1}</span>
                {profile.experiences.length > 1 && (
                  <button type="button" onClick={() => removeExperience(idx)} className="text-red-400 hover:text-red-600 text-xs font-medium flex items-center gap-1">
                    <FaTimes /> Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input placeholder="Company Name" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} className="p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm" />
                <input placeholder="Role / Position" value={exp.role} onChange={(e) => updateExperience(idx, 'role', e.target.value)} className="p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm" />
                <input placeholder="Duration (e.g. May - Aug 2023)" value={exp.duration} onChange={(e) => updateExperience(idx, 'duration', e.target.value)} className="p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm" />
              </div>
              <textarea placeholder="Key responsibilities and achievements..." value={exp.description} onChange={(e) => updateExperience(idx, 'description', e.target.value)} rows={2} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm resize-none" />
            </div>
          ))}
          <button type="button" onClick={addExperience} className="flex items-center gap-2 text-sm text-primary-600 font-semibold hover:text-primary-700 transition">
            <FaPlus /> Add Another Experience
          </button>
        </div>
      </SectionCard>

      {/* ── 7. Certifications ────────────────────────────────────── */}
      <SectionCard title="Certifications & Courses" icon={FaCertificate} iconColor="bg-yellow-50 text-yellow-600" collapsible>
        <div className="space-y-5">
          {profile.certifications.map((cert, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Certification {idx + 1}</span>
                {profile.certifications.length > 1 && (
                  <button type="button" onClick={() => removeCertification(idx)} className="text-red-400 hover:text-red-600 text-xs font-medium flex items-center gap-1">
                    <FaTimes /> Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Certification Name" value={cert.name} onChange={(e) => updateCertification(idx, 'name', e.target.value)} className="p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm" />
                <input placeholder="Issuing Organization (e.g. AWS, Google)" value={cert.issuer} onChange={(e) => updateCertification(idx, 'issuer', e.target.value)} className="p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm" />
                <input placeholder="Year Obtained" value={cert.year} onChange={(e) => updateCertification(idx, 'year', e.target.value)} className="p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm" />
                <input placeholder="Credential Link (optional)" value={cert.link} onChange={(e) => updateCertification(idx, 'link', e.target.value)} className="p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm" />
              </div>
            </div>
          ))}
          <button type="button" onClick={addCertification} className="flex items-center gap-2 text-sm text-primary-600 font-semibold hover:text-primary-700 transition">
            <FaPlus /> Add Another Certification
          </button>
        </div>
      </SectionCard>

      {/* ── 8. Achievements & Languages & Hobbies ────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Achievements" icon={FaTrophy} iconColor="bg-rose-50 text-rose-600">
          <TagInput tags={profile.achievements} setTags={(t) => setProfile({ ...profile, achievements: t })} placeholder="e.g. 1st Place Hackathon 2023" color="bg-rose-50 text-rose-700 border-rose-200" />
        </SectionCard>

        <SectionCard title="Languages Known" icon={FaLanguage} iconColor="bg-cyan-50 text-cyan-600">
          <TagInput tags={profile.languages} setTags={(t) => setProfile({ ...profile, languages: t })} placeholder="e.g. Telugu, Tamil, French" color="bg-cyan-50 text-cyan-700 border-cyan-200" />
        </SectionCard>
      </div>

      <SectionCard title="Hobbies & Interests" icon={FaHeart} iconColor="bg-pink-50 text-pink-600">
        <TagInput tags={profile.hobbies} setTags={(t) => setProfile({ ...profile, hobbies: t })} placeholder="e.g. Competitive Programming, Chess, Blogging" color="bg-pink-50 text-pink-700 border-pink-200" />
      </SectionCard>

      {/* ── 9. Career Preferences ────────────────────────────────── */}
      <SectionCard title="Career Preferences" icon={FaRocket} iconColor="bg-violet-50 text-violet-600">
        <TextAreaField label="Career Objective" name="careerObjective" value={profile.careerObjective} onChange={handleChange} placeholder="Write a 2-3 line career objective statement..." rows={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <SelectField label="Target Role" name="targetRole" value={profile.targetRole} onChange={handleChange} options={[
            // CS & IT
            'Software Developer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'Cloud Engineer', 'QA Engineer',
            // AIML
            'AI / ML Engineer', 'Data Scientist', 'Data Analyst', 'Computer Vision Engineer',
            // Civil
            'Structural Design Engineer', 'Civil Site Engineer', 'BIM Engineer', 'Quantity Surveying Engineer',
            // Mechanical
            'Mechanical Design Engineer', 'CAD / CAM Engineer', 'Thermal & HVAC Engineer', 'Production Engineer',
            // ECE
            'Embedded Systems Engineer', 'VLSI Design Engineer', 'IoT & Firmware Engineer',
            // EEE
            'Electrical Systems Engineer', 'Industrial Automation Engineer', 'Power Systems Engineer',
            'Other'
          ]} />
          <InputField label="Preferred Locations" name="preferredLocations" value={profile.preferredLocations} onChange={handleChange} placeholder="e.g. Bangalore, Hyderabad, Remote" icon={FaMapMarkerAlt} />
          <InputField label="Expected CTC (LPA)" name="expectedCTC" value={profile.expectedCTC} onChange={handleChange} placeholder="e.g. 6-10 LPA" />
          <SelectField label="Notice Period" name="noticePeriod" value={profile.noticePeriod} onChange={handleChange} options={['Immediate', '15 Days', '1 Month', '2 Months', '3 Months']} />
          <SelectField label="Willing to Relocate?" name="willingToRelocate" value={profile.willingToRelocate} onChange={handleChange} options={['Yes', 'No', 'Maybe']} />
        </div>
      </SectionCard>

      {/* ── 10. Social & Coding Profiles ──────────────────────────── */}
      <SectionCard title="Social & Coding Profiles" icon={FaLink} iconColor="bg-purple-50 text-purple-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="GitHub" name="github" value={profile.github} onChange={handleChange} icon={FaGithub} placeholder="https://github.com/username" />
          <InputField label="LinkedIn" name="linkedin" value={profile.linkedin} onChange={handleChange} icon={FaLinkedin} placeholder="https://linkedin.com/in/username" />
          <InputField label="Portfolio Website" name="portfolio" value={profile.portfolio} onChange={handleChange} icon={FaGlobe} placeholder="https://yourportfolio.com" />
          <InputField label="Twitter / X" name="twitter" value={profile.twitter} onChange={handleChange} icon={FaTwitter} placeholder="https://twitter.com/username" />
          <InputField label="LeetCode" name="leetcode" value={profile.leetcode} onChange={handleChange} icon={FaLaptopCode} placeholder="https://leetcode.com/username" />
          <InputField label="HackerRank" name="hackerrank" value={profile.hackerrank} onChange={handleChange} icon={FaLaptopCode} placeholder="https://hackerrank.com/username" />
          <InputField label="CodeChef" name="codechef" value={profile.codechef} onChange={handleChange} icon={FaLaptopCode} placeholder="https://codechef.com/users/username" />
          <InputField label="Resume Link (Drive/URL)" name="resume" value={profile.resume} onChange={handleChange} icon={FaFileAlt} placeholder="https://drive.google.com/..." />
        </div>
      </SectionCard>

      {/* ── Save Button ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 pb-8">
        <p className="text-xs text-slate-400">All data is saved locally in your browser.</p>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl font-bold shadow-lg shadow-primary-200 hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <FaSave /> Save All Changes
        </button>
      </div>

    </motion.div>
  );
};

export default Profile;
