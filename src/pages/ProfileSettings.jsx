import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from 'firebase/auth';
import {
    Bell,
    Camera,
    GraduationCap,
    Lock,
    Mail,
    MapPin,
    Phone,
    Save,
    Shield,
    Trash2,
    User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase/firebase.config';

const ProfileSettings = () => {
  const { currentUser, userRole, updateUserRole, setAuthUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  // Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    photoUrl: '',
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Role-specific fields
  const [roleFields, setRoleFields] = useState({
    // For tutors
    education: '',
    subjects: [],
    experience: '',
    hourlyRate: '',
    // For students
    preferences: '',
    learningGoals: '',
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    paymentNotifications: true,
    applicationNotifications: true,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
  });

  // Load profile data from backend when component mounts
  // Sync form with currentUser (which now comes fully populated from AuthContext)
  useEffect(() => {
    if (currentUser) {
      setPersonalInfo({
        name: currentUser.displayName || currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        bio: currentUser.bio || '',
        photoUrl: currentUser.photoURL || currentUser.photoUrl || '',
      });
    }
  }, [currentUser]);

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleFieldsChange = (e) => {
    setRoleFields({
      ...roleFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked,
    });
  };

  const handlePrivacyChange = (e) => {
    setPrivacy({
      ...privacy,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send updated fields to backend
      const payload = {
        name: personalInfo.name,
        phone: personalInfo.phone,
        address: personalInfo.address,
        bio: personalInfo.bio,
        photoUrl: personalInfo.photoUrl,
      };
      const { data } = await api.put('/api/auth/me', payload);

      // Also update Firebase profile name if needed
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: personalInfo.name });
      }

      // Update AuthContext immediately so UI reflects changes without reload
      if (data?.user) {
         // Merge new data with existing currentUser to keep everything in sync
         const updatedUser = {
            ...currentUser,
            ...data.user,
            displayName: data.user.name || currentUser.displayName,
         };
         setAuthUser(updatedUser);
      }
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, passwordData.newPassword);
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save settings to localStorage or backend
      localStorage.setItem(`userSettings_${currentUser.uid}`, JSON.stringify({
        notifications,
        privacy,
        roleFields,
      }));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = () => {
    toast.info('Profile picture upload coming soon');
    // Implement profile picture upload
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'role', label: userRole === 'tutor' ? 'Teaching Info' : userRole === 'student' ? 'Student Info' : 'Admin Info', icon: GraduationCap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <User className="text-primary" size={40} />
          Profile Settings
        </h1>
        <p className="text-base-content/70">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Tabs */}
        <div className="lg:col-span-1">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-0">
              <ul className="menu menu-vertical w-full p-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <a
                      className={activeTab === tab.id ? 'active' : ''}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <tab.icon size={20} />
                      {tab.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-6">Personal Information</h2>

                {/* Profile Picture */}
                <div className="flex items-center gap-6 mb-6 pb-6 border-b border-base-300">
                  <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl font-bold overflow-hidden">
                    {personalInfo.photoUrl ? (
                      <img src={personalInfo.photoUrl} alt={personalInfo.name} className="w-full h-full object-cover" />
                    ) : (
                      personalInfo.name.charAt(0) || currentUser?.email?.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="label">
                      <span className="label-text font-semibold">Photo URL</span>
                    </label>
                    <input
                      type="url"
                      name="photoUrl"
                      placeholder="https://example.com/photo.jpg"
                      className="input input-bordered w-full bg-base-100"
                      value={personalInfo.photoUrl}
                      onChange={handlePersonalInfoChange}
                    />
                    <label className="label">
                      <span className="label-text-alt">Enter a URL for your profile picture</span>
                    </label>
                  </div>
                </div>

                <form onSubmit={handleSavePersonalInfo} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Full Name</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
                        <input
                          type="text"
                          name="name"
                          placeholder="Your full name"
                          className="input input-bordered w-full pl-10 bg-base-100"
                          value={personalInfo.name}
                          onChange={handlePersonalInfoChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
                        <input
                          type="email"
                          name="email"
                          className="input input-bordered w-full pl-10 bg-base-100"
                          value={personalInfo.email}
                          disabled
                        />
                      </div>
                      <label className="label">
                        <span className="label-text-alt">Email cannot be changed</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Phone Number</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+880 1XXX XXXXXX"
                          className="input input-bordered w-full pl-10 bg-base-100"
                          value={personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text">Location</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
                        <input
                          type="text"
                          name="address"
                          placeholder="City, Country"
                          className="input input-bordered w-full pl-10 bg-base-100"
                          value={personalInfo.address}
                          onChange={handlePersonalInfoChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Bio</span>
                    </label>
                    <textarea
                      name="bio"
                      className="textarea textarea-bordered w-full h-32 bg-base-100"
                      placeholder="Tell us about yourself..."
                      value={personalInfo.bio}
                      onChange={handlePersonalInfoChange}
                    ></textarea>
                  </div>

                  <div className="card-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-6">Change Password</h2>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Current Password</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
                      <input
                        type="password"
                        name="currentPassword"
                        placeholder="Enter current password"
                        className="input input-bordered w-full pl-10 bg-base-100"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">New Password</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="Enter new password (min 6 characters)"
                        className="input input-bordered w-full pl-10 bg-base-100"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Confirm New Password</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        className="input input-bordered w-full pl-10 bg-base-100"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="card-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <>
                          <Lock size={20} />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Role-specific Info Tab */}
          {activeTab === 'role' && (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-6 flex items-center gap-2">
                  <GraduationCap size={24} />
                  {userRole === 'tutor' ? 'Teaching Information' : userRole === 'student' ? 'Student Information' : 'Admin Information'}
                </h2>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  {userRole === 'tutor' && (
                    <>
                      <div>
                        <label className="label">
                          <span className="label-text">Education</span>
                        </label>
                        <input
                          type="text"
                          name="education"
                          placeholder="e.g., PhD in Mathematics"
                          className="input input-bordered w-full bg-base-100"
                          value={roleFields.education}
                          onChange={handleRoleFieldsChange}
                        />
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text">Years of Experience</span>
                        </label>
                        <input
                          type="text"
                          name="experience"
                          placeholder="e.g., 10 years"
                          className="input input-bordered w-full bg-base-100"
                          value={roleFields.experience}
                          onChange={handleRoleFieldsChange}
                        />
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text">Subjects Taught</span>
                        </label>
                        <input
                          type="text"
                          name="subjects"
                          placeholder="e.g., Mathematics, Physics, Chemistry"
                          className="input input-bordered w-full bg-base-100"
                          value={roleFields.subjects.join(', ')}
                          onChange={(e) => setRoleFields({
                            ...roleFields,
                            subjects: e.target.value.split(',').map(s => s.trim()),
                          })}
                        />
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text">Hourly Rate (৳)</span>
                        </label>
                        <input
                          type="number"
                          name="hourlyRate"
                          placeholder="e.g., 500-700"
                          className="input input-bordered w-full bg-base-100"
                          value={roleFields.hourlyRate}
                          onChange={handleRoleFieldsChange}
                        />
                      </div>
                    </>
                  )}

                  {userRole === 'student' && (
                    <>
                      <div>
                        <label className="label">
                          <span className="label-text">Learning Preferences</span>
                        </label>
                        <textarea
                          name="preferences"
                          className="textarea textarea-bordered w-full h-24 bg-base-100"
                          placeholder="Describe your learning preferences..."
                          value={roleFields.preferences}
                          onChange={handleRoleFieldsChange}
                        ></textarea>
                      </div>

                      <div>
                        <label className="label">
                          <span className="label-text">Learning Goals</span>
                        </label>
                        <textarea
                          name="learningGoals"
                          className="textarea textarea-bordered w-full h-24 bg-base-100"
                          placeholder="What are your learning goals?"
                          value={roleFields.learningGoals}
                          onChange={handleRoleFieldsChange}
                        ></textarea>
                      </div>
                    </>
                  )}

                  {userRole === 'admin' && (
                    <div>
                      <p className="text-base-content/70">Admin-specific settings can be configured here.</p>
                    </div>
                  )}

                  <div className="card-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-6 flex items-center gap-2">
                  <Bell size={24} />
                  Notification Preferences
                </h2>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-base-300">
                      <div>
                        <p className="font-semibold">Email Notifications</p>
                        <p className="text-sm text-base-content/70">Receive notifications via email</p>
                      </div>
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        className="toggle toggle-primary"
                        checked={notifications.emailNotifications}
                        onChange={handleNotificationChange}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-base-300">
                      <div>
                        <p className="font-semibold">Push Notifications</p>
                        <p className="text-sm text-base-content/70">Receive push notifications in browser</p>
                      </div>
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        className="toggle toggle-primary"
                        checked={notifications.pushNotifications}
                        onChange={handleNotificationChange}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-base-300">
                      <div>
                        <p className="font-semibold">Payment Notifications</p>
                        <p className="text-sm text-base-content/70">Get notified about payment updates</p>
                      </div>
                      <input
                        type="checkbox"
                        name="paymentNotifications"
                        className="toggle toggle-primary"
                        checked={notifications.paymentNotifications}
                        onChange={handleNotificationChange}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-base-300">
                      <div>
                        <p className="font-semibold">Application Notifications</p>
                        <p className="text-sm text-base-content/70">Get notified about new applications</p>
                      </div>
                      <input
                        type="checkbox"
                        name="applicationNotifications"
                        className="toggle toggle-primary"
                        checked={notifications.applicationNotifications}
                        onChange={handleNotificationChange}
                      />
                    </div>
                  </div>

                  <div className="card-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Settings
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-6 flex items-center gap-2">
                  <Shield size={24} />
                  Privacy Settings
                </h2>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Profile Visibility</span>
                    </label>
                    <select
                      name="profileVisibility"
                      className="select select-bordered w-full bg-base-100"
                      value={privacy.profileVisibility}
                      onChange={handlePrivacyChange}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="contacts">Contacts Only</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-base-300">
                      <div>
                        <p className="font-semibold">Show Email</p>
                        <p className="text-sm text-base-content/70">Allow others to see your email</p>
                      </div>
                      <input
                        type="checkbox"
                        name="showEmail"
                        className="toggle toggle-primary"
                        checked={privacy.showEmail}
                        onChange={handlePrivacyChange}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-base-300">
                      <div>
                        <p className="font-semibold">Show Phone</p>
                        <p className="text-sm text-base-content/70">Allow others to see your phone number</p>
                      </div>
                      <input
                        type="checkbox"
                        name="showPhone"
                        className="toggle toggle-primary"
                        checked={privacy.showPhone}
                        onChange={handlePrivacyChange}
                      />
                    </div>
                  </div>

                  <div className="card-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Privacy Settings
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Danger Zone */}
                <div className="mt-8 pt-8 border-t border-base-300">
                  <h3 className="text-xl font-bold text-error mb-4">Danger Zone</h3>
                  <div className="flex gap-4">
                    <button className="btn btn-error btn-outline">
                      <Trash2 size={18} />
                      Delete Account
                    </button>
                  </div>
                  <p className="text-sm text-base-content/70 mt-2">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

