import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaPlus, FaTrash, FaUser, FaGraduationCap, FaBriefcase, FaCode, FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const initialData = {
  personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '', github: '' },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: ''
};

const Resume = () => {
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('ipc_resume');
    return saved ? JSON.parse(saved) : initialData;
  });
  
  const [activeStep, setActiveStep] = useState(0);
  const [template, setTemplate] = useState('modern');

  useEffect(() => {
    localStorage.setItem('ipc_resume', JSON.stringify(resumeData));
  }, [resumeData]);

  const steps = [
    { title: 'Personal', icon: <FaUser /> },
    { title: 'Education', icon: <FaGraduationCap /> },
    { title: 'Experience', icon: <FaBriefcase /> },
    { title: 'Projects', icon: <FaCode /> },
    { title: 'Summary & Skills', icon: <FaFileAlt /> }
  ];

  const handlePersonalChange = (e) => {
    setResumeData({
      ...resumeData,
      personalInfo: { ...resumeData.personalInfo, [e.target.name]: e.target.value }
    });
  };

  const handleArrayChange = (field, index, e) => {
    const newArray = [...resumeData[field]];
    newArray[index][e.target.name] = e.target.value;
    setResumeData({ ...resumeData, [field]: newArray });
  };

  const addArrayItem = (field, emptyItem) => {
    setResumeData({ ...resumeData, [field]: [...resumeData[field], emptyItem] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = resumeData[field].filter((_, i) => i !== index);
    setResumeData({ ...resumeData, [field]: newArray });
  };

  const handlePrint = () => {
    window.print();
    toast.success("Resume ready for download/print!");
  };

  const renderForm = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Full Name" value={resumeData.personalInfo.name} onChange={handlePersonalChange} className="form-input" />
              <input type="email" name="email" placeholder="Email" value={resumeData.personalInfo.email} onChange={handlePersonalChange} className="form-input" />
              <input type="text" name="phone" placeholder="Phone Number" value={resumeData.personalInfo.phone} onChange={handlePersonalChange} className="form-input" />
              <input type="text" name="location" placeholder="Location (City, State)" value={resumeData.personalInfo.location} onChange={handlePersonalChange} className="form-input" />
              <input type="text" name="linkedin" placeholder="LinkedIn URL" value={resumeData.personalInfo.linkedin} onChange={handlePersonalChange} className="form-input" />
              <input type="text" name="github" placeholder="GitHub URL" value={resumeData.personalInfo.github} onChange={handlePersonalChange} className="form-input" />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">Education</h3>
              <button onClick={() => addArrayItem('education', { school: '', degree: '', year: '', grade: '' })} className="text-sm bg-primary-50 text-primary-600 px-3 py-1 rounded-md flex items-center gap-1 hover:bg-primary-100 transition-colors">
                <FaPlus /> Add
              </button>
            </div>
            {resumeData.education.map((edu, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-lg space-y-3 relative bg-slate-50">
                <button onClick={() => removeArrayItem('education', idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700"><FaTrash size={14} /></button>
                <input type="text" name="school" placeholder="Institution Name" value={edu.school} onChange={(e) => handleArrayChange('education', idx, e)} className="form-input w-full" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input type="text" name="degree" placeholder="Degree / Stream" value={edu.degree} onChange={(e) => handleArrayChange('education', idx, e)} className="form-input col-span-2" />
                  <input type="text" name="year" placeholder="Year (e.g. 2020-2024)" value={edu.year} onChange={(e) => handleArrayChange('education', idx, e)} className="form-input" />
                </div>
                <input type="text" name="grade" placeholder="CGPA / Percentage" value={edu.grade} onChange={(e) => handleArrayChange('education', idx, e)} className="form-input w-full" />
              </div>
            ))}
            {resumeData.education.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No education added yet.</p>}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">Experience / Internships</h3>
              <button onClick={() => addArrayItem('experience', { company: '', role: '', duration: '', description: '' })} className="text-sm bg-primary-50 text-primary-600 px-3 py-1 rounded-md flex items-center gap-1 hover:bg-primary-100 transition-colors">
                <FaPlus /> Add
              </button>
            </div>
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-lg space-y-3 relative bg-slate-50">
                <button onClick={() => removeArrayItem('experience', idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700"><FaTrash size={14} /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" name="company" placeholder="Company / Organization" value={exp.company} onChange={(e) => handleArrayChange('experience', idx, e)} className="form-input" />
                  <input type="text" name="role" placeholder="Role / Title" value={exp.role} onChange={(e) => handleArrayChange('experience', idx, e)} className="form-input" />
                </div>
                <input type="text" name="duration" placeholder="Duration (e.g. May 2023 - July 2023)" value={exp.duration} onChange={(e) => handleArrayChange('experience', idx, e)} className="form-input w-full" />
                <textarea name="description" placeholder="Description of your work (bullet points recommended)" value={exp.description} onChange={(e) => handleArrayChange('experience', idx, e)} className="form-input w-full h-24 resize-none"></textarea>
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
             <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">Projects</h3>
              <button onClick={() => addArrayItem('projects', { title: '', tech: '', description: '' })} className="text-sm bg-primary-50 text-primary-600 px-3 py-1 rounded-md flex items-center gap-1 hover:bg-primary-100 transition-colors">
                <FaPlus /> Add
              </button>
            </div>
            {resumeData.projects.map((proj, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-lg space-y-3 relative bg-slate-50">
                <button onClick={() => removeArrayItem('projects', idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700"><FaTrash size={14} /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" name="title" placeholder="Project Title" value={proj.title} onChange={(e) => handleArrayChange('projects', idx, e)} className="form-input" />
                  <input type="text" name="tech" placeholder="Technologies Used" value={proj.tech} onChange={(e) => handleArrayChange('projects', idx, e)} className="form-input" />
                </div>
                <textarea name="description" placeholder="Project Description" value={proj.description} onChange={(e) => handleArrayChange('projects', idx, e)} className="form-input w-full h-24 resize-none"></textarea>
              </div>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Professional Summary & Skills</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Professional Summary</label>
                <textarea 
                  name="summary" 
                  value={resumeData.summary} 
                  onChange={(e) => setResumeData({...resumeData, summary: e.target.value})} 
                  placeholder="A brief summary of your background, skills, and goals..." 
                  className="form-input w-full h-24 resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Skills (comma separated)</label>
                <textarea 
                  name="skills" 
                  value={resumeData.skills} 
                  onChange={(e) => setResumeData({...resumeData, skills: e.target.value})} 
                  placeholder="React, Node.js, Python, Data Structures, Algorithms..." 
                  className="form-input w-full h-20 resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const templateColors = {
    modern: 'text-primary-600 border-primary-500',
    professional: 'text-slate-800 border-slate-800',
    minimal: 'text-gray-900 border-gray-300'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Resume Builder</h1>
          <p className="text-slate-500 text-sm mt-1">Create an ATS-friendly resume in minutes</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={template} onChange={(e) => setTemplate(e.target.value)} className="form-select text-sm py-2 px-3 border-slate-300 rounded-lg">
            <option value="modern">Modern (Blue)</option>
            <option value="professional">Professional (Dark)</option>
            <option value="minimal">Minimal (Gray)</option>
          </select>
          <button onClick={handlePrint} className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm">
            <FaDownload /> Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Editor Side - Hidden when printing */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 print:hidden flex flex-col">
          {/* Progress Indicator */}
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 -translate-y-1/2"></div>
            {steps.map((step, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveStep(idx)}
                className={`flex flex-col items-center gap-2 bg-white px-2`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${activeStep === idx ? 'border-primary-500 bg-primary-50 text-primary-500' : activeStep > idx ? 'border-primary-400 bg-primary-400 text-white' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
                  {step.icon}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${activeStep === idx ? 'text-primary-600' : 'text-slate-500'}`}>{step.title}</span>
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar">
            {renderForm()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-auto pt-4 border-t border-slate-100">
            <button 
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 text-sm font-medium transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
              disabled={activeStep === steps.length - 1}
              className="px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg disabled:opacity-50 text-sm font-medium transition-colors"
            >
              Next Step
            </button>
          </div>
        </div>

        {/* Live Preview Side & Print Area */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 print:p-0 print:border-none print:shadow-none min-h-[842px] overflow-y-auto print:overflow-visible">
          <div className="max-w-[800px] mx-auto print:w-full font-sans text-sm text-slate-800 space-y-5">
            {/* Header */}
            <div className="text-center border-b-2 pb-4" style={{ borderColor: template === 'modern' ? '#3b82f6' : template === 'professional' ? '#1e293b' : '#d1d5db' }}>
              <h1 className={`text-3xl font-bold uppercase tracking-wider ${templateColors[template].split(' ')[0]}`}>{resumeData.personalInfo.name || 'YOUR NAME'}</h1>
              <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs text-slate-600">
                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span>• {resumeData.personalInfo.location}</span>}
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-1 text-xs text-slate-600">
                {resumeData.personalInfo.linkedin && <a href={resumeData.personalInfo.linkedin} className="text-blue-600">LinkedIn</a>}
                {resumeData.personalInfo.github && <a href={resumeData.personalInfo.github} className="text-gray-800">• GitHub</a>}
              </div>
            </div>

            {/* Summary */}
            {resumeData.summary && (
              <div className="space-y-1.5">
                 <h2 className={`text-base font-bold uppercase tracking-wider border-b ${templateColors[template].split(' ')[1]}`}>Professional Summary</h2>
                 <p className="text-sm leading-relaxed">{resumeData.summary}</p>
              </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
              <div className="space-y-2">
                 <h2 className={`text-base font-bold uppercase tracking-wider border-b ${templateColors[template].split(' ')[1]}`}>Education</h2>
                 {resumeData.education.map((edu, idx) => (
                   <div key={idx} className="flex justify-between">
                     <div>
                       <h3 className="font-semibold text-slate-900">{edu.school}</h3>
                       <p className="text-slate-700 italic">{edu.degree}</p>
                     </div>
                     <div className="text-right">
                       <p className="font-medium">{edu.year}</p>
                       <p className="text-slate-600">{edu.grade}</p>
                     </div>
                   </div>
                 ))}
              </div>
            )}

            {/* Experience */}
            {resumeData.experience.length > 0 && (
              <div className="space-y-3">
                 <h2 className={`text-base font-bold uppercase tracking-wider border-b ${templateColors[template].split(' ')[1]}`}>Experience</h2>
                 {resumeData.experience.map((exp, idx) => (
                   <div key={idx}>
                     <div className="flex justify-between items-baseline mb-1">
                       <h3 className="font-semibold text-slate-900">{exp.company}</h3>
                       <span className="text-xs font-medium">{exp.duration}</span>
                     </div>
                     <p className="text-slate-700 font-medium text-sm italic mb-1">{exp.role}</p>
                     <p className="text-sm whitespace-pre-wrap pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400">{exp.description}</p>
                   </div>
                 ))}
              </div>
            )}

            {/* Projects */}
            {resumeData.projects.length > 0 && (
              <div className="space-y-3">
                 <h2 className={`text-base font-bold uppercase tracking-wider border-b ${templateColors[template].split(' ')[1]}`}>Projects</h2>
                 {resumeData.projects.map((proj, idx) => (
                   <div key={idx}>
                     <div className="flex justify-between items-baseline mb-1">
                       <h3 className="font-semibold text-slate-900">{proj.title}</h3>
                       <span className="text-xs text-slate-600 font-medium">{proj.tech}</span>
                     </div>
                     <p className="text-sm whitespace-pre-wrap">{proj.description}</p>
                   </div>
                 ))}
              </div>
            )}

            {/* Skills */}
            {resumeData.skills && (
              <div className="space-y-1.5">
                 <h2 className={`text-base font-bold uppercase tracking-wider border-b ${templateColors[template].split(' ')[1]}`}>Skills</h2>
                 <p className="text-sm leading-relaxed">{resumeData.skills}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .form-input {
          @apply w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors bg-white;
        }
        @media print {
          @page { margin: 0.5cm; }
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .print\\:w-full { width: 100% !important; max-width: none !important; }
        }
      `}} />
    </motion.div>
  );
};

export default Resume;
