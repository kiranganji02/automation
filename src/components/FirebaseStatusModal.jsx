import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaDatabase, FaCheckCircle, FaExclamationCircle, FaCog, 
  FaTimes, FaExternalLinkAlt, FaSync, FaServer, FaShieldAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { isFirebaseConfigured, firebaseConfig } from '../firebase/config';
import { testDatabaseConnection } from '../firebase/db';

export default function FirebaseStatusModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [activeTab, setActiveTab] = useState('status'); // 'status' | 'config' | 'guide'
  
  const [formData, setFormData] = useState({
    apiKey: firebaseConfig.apiKey || '',
    authDomain: firebaseConfig.authDomain || '',
    projectId: firebaseConfig.projectId || '',
    storageBucket: firebaseConfig.storageBucket || '',
    messagingSenderId: firebaseConfig.messagingSenderId || '',
    appId: firebaseConfig.appId || '',
  });

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testDatabaseConnection();
      setTestResult(res);
      if (res.success) {
        toast.success('Firebase Firestore connected successfully! 🔥');
      } else {
        toast.warn(res.message);
      }
    } catch (e) {
      setTestResult({ success: false, mode: 'error', message: e.message });
      toast.error('Connection test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('ipc_firebase_config', JSON.stringify(formData));
      toast.success('Firebase configuration saved! Reloading to apply changes...');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      toast.error('Failed to save configuration');
    }
  };

  const handleClearConfig = () => {
    localStorage.removeItem('ipc_firebase_config');
    toast.info('Firebase configuration cleared. Switched to LocalStorage mode.');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <>
      {/* Trigger Button in Header */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
          isFirebaseConfigured
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-sm'
            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
        }`}
        title="Database status & configuration"
      >
        <FaDatabase className={isFirebaseConfigured ? 'text-emerald-500 animate-pulse' : 'text-amber-500'} />
        <span className="hidden sm:inline">
          {isFirebaseConfigured ? 'Firebase Active' : 'Database: Local'}
        </span>
      </button>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${isFirebaseConfigured ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                    <FaDatabase className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Firebase Database Connection</h3>
                    <p className="text-xs text-slate-500">Cloud Firestore sync & offline persistence</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 px-6 pt-2 bg-slate-50/50">
                <button
                  onClick={() => setActiveTab('status')}
                  className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 ${
                    activeTab === 'status'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Status & Test
                </button>
                <button
                  onClick={() => setActiveTab('config')}
                  className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 ${
                    activeTab === 'config'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Configure Credentials
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 ${
                    activeTab === 'guide'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Setup Guide
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto space-y-4">
                {activeTab === 'status' && (
                  <div className="space-y-4">
                    {/* Status card */}
                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                      isFirebaseConfigured
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50/60 border-amber-200 text-amber-900'
                    }`}>
                      {isFirebaseConfigured ? (
                        <FaCheckCircle className="text-xl text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <FaExclamationCircle className="text-xl text-amber-600 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <h4 className="font-bold text-sm">
                          {isFirebaseConfigured ? 'Firebase Project Connected' : 'Running in Offline / LocalStorage Mode'}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {isFirebaseConfigured
                            ? `Connected to Firebase project: "${firebaseConfig.projectId}". Changes sync to Cloud Firestore in real time.`
                            : 'All your resumes, mock interviews, and student preparation progress are currently securely saved in your browser storage. To connect to Cloud Firestore, fill in your credentials in the "Configure Credentials" tab.'}
                        </p>
                      </div>
                    </div>

                    {/* Firestore Collections Info */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FaServer className="text-primary-500" /> Database Collections
                      </h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-white rounded-lg border border-slate-100 flex items-center justify-between">
                          <span className="text-slate-600">users</span>
                          <span className="text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded font-mono">Profile</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-100 flex items-center justify-between">
                          <span className="text-slate-600">resumes</span>
                          <span className="text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded font-mono">Analysis</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-100 flex items-center justify-between">
                          <span className="text-slate-600">interviews</span>
                          <span className="text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded font-mono">Scores</span>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-slate-100 flex items-center justify-between">
                          <span className="text-slate-600">prep_plans</span>
                          <span className="text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded font-mono">Roadmaps</span>
                        </div>
                      </div>
                    </div>

                    {/* Test Button */}
                    <div className="pt-2">
                      <button
                        onClick={handleTest}
                        disabled={isTesting}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs transition disabled:opacity-60"
                      >
                        <FaSync className={isTesting ? 'animate-spin' : ''} />
                        {isTesting ? 'Testing Firestore Ping...' : 'Test Database Connection'}
                      </button>
                    </div>

                    {testResult && (
                      <div className={`p-3 rounded-xl text-xs border ${
                        testResult.success
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}>
                        <strong>Result:</strong> {testResult.message}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'config' && (
                  <form onSubmit={handleSaveConfig} className="space-y-3">
                    <p className="text-xs text-slate-500">
                      Paste your Firebase web app config values below (or add them in your <code className="bg-slate-100 px-1 py-0.5 rounded text-primary-600 font-mono">.env</code> file):
                    </p>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600">API Key</label>
                        <input
                          type="text"
                          required
                          value={formData.apiKey}
                          onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                          placeholder="AIzaSy..."
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600">Project ID</label>
                        <input
                          type="text"
                          required
                          value={formData.projectId}
                          onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                          placeholder="my-placement-coach"
                          className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary-500 font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Auth Domain</label>
                          <input
                            type="text"
                            value={formData.authDomain}
                            onChange={e => setFormData({ ...formData, authDomain: e.target.value })}
                            placeholder="my-project.firebaseapp.com"
                            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Storage Bucket</label>
                          <input
                            type="text"
                            value={formData.storageBucket}
                            onChange={e => setFormData({ ...formData, storageBucket: e.target.value })}
                            placeholder="my-project.appspot.com"
                            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary-500 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Messaging Sender ID</label>
                          <input
                            type="text"
                            value={formData.messagingSenderId}
                            onChange={e => setFormData({ ...formData, messagingSenderId: e.target.value })}
                            placeholder="1234567890"
                            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600">App ID</label>
                          <input
                            type="text"
                            value={formData.appId}
                            onChange={e => setFormData({ ...formData, appId: e.target.value })}
                            placeholder="1:123456:web:abcd"
                            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-primary-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold rounded-xl text-xs hover:shadow transition"
                      >
                        Save & Connect to Firebase
                      </button>
                      <button
                        type="button"
                        onClick={handleClearConfig}
                        className="px-3 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs hover:bg-slate-50 transition"
                      >
                        Reset to Local
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === 'guide' && (
                  <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                    <h5 className="font-bold text-slate-800 text-sm">How to connect Firebase in 3 steps:</h5>
                    <ol className="list-decimal pl-4 space-y-2">
                      <li>
                        <strong>Create a Firebase Project:</strong> Visit{' '}
                        <a
                          href="https://console.firebase.google.com/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary-600 font-medium inline-flex items-center gap-1 hover:underline"
                        >
                          Firebase Console <FaExternalLinkAlt className="text-[9px]" />
                        </a>{' '}
                        and click <em>Add Project</em>.
                      </li>
                      <li>
                        <strong>Enable Cloud Firestore Database:</strong> In the left sidebar, click <em>Firestore Database</em> &rarr; <em>Create Database</em> &rarr; Start in <strong>Test mode</strong> (allows read/write).
                      </li>
                      <li>
                        <strong>Register a Web App:</strong> In Project Settings &rarr; General &rarr; Your Apps &rarr; click the <strong>&lt;/&gt; (Web)</strong> icon. Copy your configuration keys and paste them in the <em>Configure Credentials</em> tab or in <code className="bg-slate-100 px-1 py-0.5 rounded text-primary-600 font-mono">.env</code>.
                      </li>
                    </ol>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-blue-800">
                      <FaShieldAlt className="text-base shrink-0 text-blue-600" />
                      <span>The website features automatic dual-mode: data is safely stored locally in offline mode, and automatically syncs to Firebase Cloud Firestore when connected.</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
