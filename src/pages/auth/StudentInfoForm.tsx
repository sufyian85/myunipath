import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Calendar, Mail, Upload, X, Lock, School, Phone } from 'lucide-react';
import { api, clearApiSessionId } from '../../lib/api';
import { useStudent } from '../../context/StudentContext';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../../components/theme/ThemeToggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

export function StudentInfoForm() {
  const { studentData, login, isLoggedIn, updateStudentData } = useStudent();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { redirectTo?: string } | null)?.redirectTo;

  const [name, setName] = useState(studentData.name || '');
  const [age, setAge] = useState(studentData.age || '');
  const [email, setEmail] = useState(studentData.email || '');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [highestQualification, setHighestQualification] = useState('');
  const [spmFile, setSpmFile] = useState<File | null>(studentData.spmResult || null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = isLoggedIn;

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setSpmFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSpmFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (name && age && email && (isEditMode ? true : password)) {
        if (isEditMode) {
          const res = await api.updateStudent({
            name,
            age,
            email,
            password: password || undefined,
            school_name: schoolName || undefined,
            phone_number: phoneNumber || undefined,
            highest_qualification: highestQualification,
            transcript: spmFile,
          });

          if (res.success && res.student) {
            login(res.student);
            updateStudentData({ spmResult: spmFile });
            navigate(redirectTo || '/profile', { replace: true });
          }
        } else {
          // Clear the old session so a fresh session_id is generated for the new account
          clearApiSessionId();

          const res = await api.createStudent({
            name,
            age,
            email,
            password,
            school_name: schoolName || undefined,
            phone_number: phoneNumber || undefined,
            highest_qualification: highestQualification,
            transcript: spmFile,
          });

          if (res.success && res.student) {
            login(res.student);
            updateStudentData({ spmResult: spmFile });
            navigate(redirectTo || '/profile', { replace: true });
          }
        }
      } else {
        setError('Please fill in all required fields' + (!isEditMode ? ' including password' : ''));
      }
    } catch (err: any) {
      setError(err.message || (isEditMode ? 'Failed to update profile. Email might already be taken.' : 'Failed to create account. Email might already exist.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col selection:bg-primary/20">
      {/* UNITEN Brand Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(15,51,97,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(227,70,40,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <img
              src="/myunipath-emblem.svg"
              alt="MyUniPath"
              className="w-8 h-8 object-contain drop-shadow-sm"
            />
            <span className="text-xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #0F3361, #e34628)' }}>
              MyUniPath
            </span>
          </button>
          <div className="flex items-center gap-4">
            {/* Institutional logos — right side of header (HCI: affiliation branding) */}
            <div className="hidden sm:flex items-center gap-3">
              <img src="/cci-logo.png" alt="CCI" className="h-7 object-contain opacity-80 hover:opacity-100 transition-opacity" />
              <div className="w-px h-5 bg-border" />
              <img src="/uniten-logo.png" alt="UNITEN" className="h-7 object-contain opacity-80 hover:opacity-100 transition-opacity" />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">{isEditMode ? 'Edit Profile' : "Let's Get Started"}</h1>
            <p className="text-muted-foreground">{isEditMode ? 'Update your personal details below' : 'Tell us a bit about yourself to personalize your experience'}</p>
          </div>

          {/* Form Card */}
          <div className="bg-card text-card-foreground rounded-3xl shadow-xl p-8 border border-border">
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border-l-4 border-destructive text-destructive text-sm rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm mb-2 text-foreground font-medium">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-border bg-background text-foreground rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm mb-2 text-foreground font-medium">
                  Age <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    id="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-border bg-background text-foreground rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
                    placeholder="Enter your age"
                    min="15"
                    max="100"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm mb-2 text-foreground font-medium">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-border bg-background text-foreground rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              {/* School Name */}
              <div>
                <label htmlFor="school-name" className="block text-sm mb-2 text-foreground font-medium">
                  School / Institution Name
                </label>
                <div className="relative">
                  <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    id="school-name"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-border bg-background text-foreground rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
                    placeholder="e.g. SMK Seri Ampang"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone-number" className="block text-sm mb-2 text-foreground font-medium">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    id="phone-number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-border bg-background text-foreground rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
                    placeholder="e.g. 012-3456789"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm mb-2 text-foreground font-medium">
                  {isEditMode ? 'Change Password (Optional)' : 'Create Password'} {!isEditMode && <span className="text-destructive">*</span>}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-border bg-background text-foreground rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-muted-foreground"
                    placeholder={isEditMode ? 'Leave blank to keep current password' : 'Create a password'}
                    required={!isEditMode}
                    minLength={6}
                  />
                </div>
              </div>

              {/* Highest Qualification */}
              <div>
                <label className="block text-sm mb-2 text-foreground font-medium">
                  Highest Qualification <span className="text-destructive">*</span>
                </label>
                <Select value={highestQualification} onValueChange={setHighestQualification} required>
                  <SelectTrigger className="w-full py-3 h-auto min-h-[44px] border border-border bg-background text-foreground rounded-xl focus:ring-1 focus:ring-primary focus:border-primary text-base">
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SPM">SPM</SelectItem>
                    <SelectItem value="Foundation">Foundation</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                    <SelectItem value="Master's">Master's</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transcripts Result Upload */}
              <div>
                <label htmlFor="spm-result" className="block text-sm mb-2 text-foreground font-medium">
                  Upload transcripts and results
                </label>

                {!spmFile ? (
                  <label
                    htmlFor="spm-result"
                    className="w-full border-2 border-dashed border-border bg-background hover:bg-secondary/30 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all group"
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mb-3 group-hover:text-primary transition-colors" />
                    <p className="text-foreground font-medium mb-1">Click to upload document</p>
                    <p className="text-sm text-muted-foreground">PDF, JPG, or PNG (Max 5MB)</p>
                    <input
                      type="file"
                      id="spm-result"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="border border-primary/30 bg-primary/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Upload className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{spmFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(spmFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="w-8 h-8 bg-destructive/10 text-destructive rounded-full flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full min-h-[44px] font-semibold py-3 rounded-xl transition-all shadow-md text-white ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                  style={{ background: '#e34628' }}
                >
                  {isLoading ? (isEditMode ? 'Updating Profile...' : 'Creating Account...') : (isEditMode ? 'Save Changes' : 'Continue to Profile')}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
