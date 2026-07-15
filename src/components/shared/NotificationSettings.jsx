import React, { useState } from 'react';
import { Bell, BellOff, Mail, Smartphone, MessageSquare, CheckCircle2 } from 'lucide-react';

const SETTINGS = [
  { id: 'push',         icon: Smartphone,    label: 'Push Notifications',  desc: 'Alerts on your device' },
  { id: 'email',        icon: Mail,           label: 'Email Notifications', desc: 'Updates via email' },
  { id: 'announcements',icon: Bell,           label: 'Announcements',       desc: 'New announcements & notices' },
  { id: 'messages',     icon: MessageSquare,  label: 'Messages',            desc: 'Direct messages & replies' },
];

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-gray-200'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const NotificationSettings = () => {
  const [prefs, setPrefs] = useState({ push: true, email: true, announcements: true, messages: false });
  const [saved, setSaved] = useState(false);

  const toggle = key => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
          <Bell className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Notification Preferences</h3>
          <p className="text-xs text-gray-500">Choose what you want to be notified about</p>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {SETTINGS.map(({ id, icon: Icon, label, desc }) => (
          <div key={id} className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${prefs[id] ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
            <Toggle checked={prefs[id]} onChange={() => toggle(id)} />
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-gray-100">
        <button
          onClick={save}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-green-100 text-green-700' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
        >
          {saved ? <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" />Saved!</span> : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
