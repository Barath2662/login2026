import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { KeyRound, Mail, Phone, Building2, GraduationCap, Hash, User } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  const fields = [
    { icon: KeyRound, label: 'LOGIN ID', value: user?.login_id, color: '#E01B22', mono: true },
    { icon: User, label: 'Full Name', value: user?.name },
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: Phone, label: 'Phone', value: user?.phone },
    { icon: Building2, label: 'College', value: user?.college_name },
    { icon: GraduationCap, label: 'Department', value: user?.department },
    { icon: Hash, label: 'Roll Number', value: user?.roll_no },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-[#F7F2F2]">My Profile</h1>
          <p className="text-xs text-[#6B5A5C] font-mono mt-1">Your participant account details</p>
        </div>
      </div>

      <div className="bg-[#130C0E] border border-[#2A1A1D] rounded-[2px] divide-y divide-[#2A1A1D]">
        {fields.map(({ icon: Icon, label, value, color, mono }) => (
          <div key={label} className="flex items-center gap-4 px-6 py-4">
            <Icon className="w-4 h-4 shrink-0" style={{ color: color || '#6B5A5C' }} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono text-[#6B5A5C] uppercase tracking-wider">{label}</p>
              <p className={`text-sm text-[#F7F2F2] mt-0.5 truncate ${mono ? 'font-mono font-bold tracking-wider' : ''}`}
                style={color ? { color } : undefined}
              >
                {value || '—'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Student ID Code (if verified) */}
      {user?.student_id_code && (
        <div className="bg-[#0A0607] border border-[#1FA971] p-6 rounded-[2px] text-center space-y-2">
          <p className="text-[10px] font-mono text-[#A79798] uppercase tracking-[3px]">Official Student ID</p>
          <p className="text-3xl font-mono font-extrabold text-[#1FA971] tracking-[4px]">{user.student_id_code}</p>
        </div>
      )}
    </div>
  );
};
