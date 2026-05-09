import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { apiService } from '../services/api.js';



const PREFERENCES_KEY = 'user_settings_preferences';

const defaultPreferences = {
  emailUpdates: true,
  orderAlerts: true,
  compactMode: false,
  language: 'vi',
};

const Settings= () => {
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [preferences, setPreferences] = useState(() => {
    try {
      const raw = localStorage.getItem(PREFERENCES_KEY);
      return raw ? { ...defaultPreferences, ...JSON.parse(raw) } : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const me = await apiService.getMe();
        const nextProfile = {
          userId: me.userId,
          fullName: me.fullName || '',
          email: me.email || '',
          phone: me.phone || '',
          address: me.address || '',
          role: me.role || 'USER',
          enabled: Boolean(me.enabled),
          createdAt: typeof me.createdAt === 'string' ? me.createdAt : null,
        };

        setProfile(nextProfile);
        setProfileForm({
          fullName: nextProfile.fullName,
          email: nextProfile.email,
          phone: nextProfile.phone,
          address: nextProfile.address,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Không thể tải thông tin tài khoản.';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const initials = useMemo(() => {
    const parts = (profileForm.fullName || 'Admin')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);

    return parts.map((part) => part[0]?.toUpperCase()).join('') || 'AD';
  }, [profileForm.fullName]);

  const roleLabel = useMemo(() => {
    const value = (profile?.role || 'USER').toUpperCase();
    if (value === 'ADMIN') return 'Quản trị viên';
    if (value === 'USER') return 'Nhân viên';
    return value;
  }, [profile?.role]);

  const createdAtLabel = useMemo(() => {
    if (!profile?.createdAt) return 'Chưa có dữ liệu';
    const date = new Date(profile.createdAt);
    if (Number.isNaN(date.getTime())) return profile.createdAt;
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }, [profile?.createdAt]);

  const handlePreferenceToggle = (key) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  };

  const savePreferences = () => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    toast.success('Đã lưu tùy chọn cá nhân trên trình duyệt.');
  };

  const saveProfileDraft = () => {
    setProfile((current) =>
      current
        ? {
            ...current,
            fullName: profileForm.fullName,
            email: profileForm.email,
            phone: profileForm.phone,
            address: profileForm.address,
          }
        : current
    );
    toast.info('Hiện backend chưa có API cập nhật hồ sơ, nên đây chỉ là bản nháp giao diện.');
  };

  const handleChangePassword = async () => {
    if (!profile?.userId) {
      toast.error('Không xác định được tài khoản để đổi mật khẩu.');
      return;
    }

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Nhập đầy đủ mật khẩu cũ, mật khẩu mới và xác nhận mật khẩu.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Mật khẩu mới cần ít nhất 6 ký tự.');
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      toast.error('Mật khẩu mới cần khác mật khẩu cũ.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Xác nhận mật khẩu không khớp.');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await apiService.updateAdminUserPassword(profile.userId, passwordForm.newPassword);
      toast.success(res.message || 'Đổi mật khẩu thành công.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể đổi mật khẩu.';
      toast.error(message);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 font-bold text-text-muted">Đang tải cài đặt...</div>;
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text tracking-tight">Cài đặt tài khoản</h1>
          <p className="text-text-muted text-xs md:text-sm font-medium mt-1">
            Tập trung vào hồ sơ người dùng, tùy chọn cá nhân và trạng thái bảo mật tài khoản.
          </p>
        </div>
        <div className="inline-flex items-center gap-3 bg-surface border border-border rounded-[1.5rem] px-4 py-3 shadow-sm">
          <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-black shadow-lg shadow-primary/20">
            {initials}
          </div>
          <div>
            <p className="text-sm font-black text-text">{profile?.fullName || 'Tài khoản người dùng'}</p>
            <p className="text-[11px] font-bold text-text-muted mt-1">{roleLabel}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-surface p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg md:text-xl font-black text-text">Thông tin cá nhân</h3>
              <p className="text-xs font-bold text-text-muted mt-1">Thay vì cấu hình API, khu vực này nên ưu tiên dữ liệu tài khoản.</p>
            </div>
            <button
              type="button"
              onClick={saveProfileDraft}
              className="px-5 py-3 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 hover:opacity-95 transition-all"
            >
              Lưu nháp
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Họ và tên</span>
              <input
                value={profileForm.fullName}
                onChange={(e) => setProfileForm((current) => ({ ...current, fullName: e.target.value }))}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                placeholder="Nguyễn Văn A"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Email</span>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm((current) => ({ ...current, email: e.target.value }))}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                placeholder="admin@example.com"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Số điện thoại</span>
              <input
                value={profileForm.phone}
                onChange={(e) => setProfileForm((current) => ({ ...current, phone: e.target.value }))}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                placeholder="09xxxxxxxx"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black text-text-muted uppercase tracking-wider ml-1">Địa chỉ</span>
              <input
                value={profileForm.address}
                onChange={(e) => setProfileForm((current) => ({ ...current, address: e.target.value }))}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                placeholder="Quận, thành phố"
              />
            </label>
          </div>
        </div>

        <div className="bg-surface p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
          <h3 className="text-lg md:text-xl font-black text-text mb-6">Tài khoản hiện tại</h3>
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">Vai trò</p>
              <p className="text-sm font-black text-text mt-2">{roleLabel}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">Trạng thái</p>
              <p className={`text-sm font-black mt-2 ${profile?.enabled ? 'text-emerald-600' : 'text-rose-600'}`}>
                {profile?.enabled ? 'Đang hoạt động' : 'Đã khóa'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">Ngày tạo</p>
              <p className="text-sm font-black text-text mt-2">{createdAtLabel}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-surface p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg md:text-xl font-black text-text">Tùy chọn cá nhân</h3>
              <p className="text-xs font-bold text-text-muted mt-1">Những thiết lập này được lưu cục bộ trên trình duyệt quản trị.</p>
            </div>
            <button
              type="button"
              onClick={savePreferences}
              className="px-5 py-3 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 hover:opacity-95 transition-all"
            >
              Lưu tùy chọn
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                key: 'emailUpdates',
                title: 'Thông báo qua email',
                description: 'Nhận các cập nhật vận hành và thay đổi quan trọng của hệ thống.',
              },
              {
                key: 'orderAlerts',
                title: 'Cảnh báo đơn hàng',
                description: 'Ưu tiên hiển thị đơn mới hoặc đơn cần xử lý ngay.',
              },
              {
                key: 'compactMode',
                title: 'Giao diện gọn',
                description: 'Rút gọn khoảng cách giữa các khối để xem nhiều dữ liệu hơn.',
              },
            ].map((item) => (
              <div key={item.key} className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4">
                <div>
                  <p className="text-sm font-black text-text">{item.title}</p>
                  <p className="text-xs font-bold text-text-muted mt-1">{item.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreferenceToggle(item.key)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${preferences[item.key] ? 'bg-primary' : 'bg-slate-200'}`}
                  aria-pressed={preferences[item.key]}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all ${
                      preferences[item.key] ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            ))}

            <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4">
              <p className="text-sm font-black text-text mb-3">Ngôn ngữ hiển thị</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPreferences((current) => ({ ...current, language: 'vi' }))}
                  className={`px-4 py-3 rounded-2xl border font-black transition-all ${
                    preferences.language === 'vi'
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                      : 'bg-white text-text border-border'
                  }`}
                >
                  Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => setPreferences((current) => ({ ...current, language: 'en' }))}
                  className={`px-4 py-3 rounded-2xl border font-black transition-all ${
                    preferences.language === 'en'
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                      : 'bg-white text-text border-border'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
          <h3 className="text-lg md:text-xl font-black text-text mb-6">Đổi mật khẩu</h3>
          <div className="space-y-4 text-sm">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">Mật khẩu cũ</p>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((current) => ({ ...current, currentPassword: e.target.value }))}
                className="w-full mt-3 px-5 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">Mật khẩu mới</p>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((current) => ({ ...current, newPassword: e.target.value }))}
                className="w-full mt-3 px-5 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">Xác nhận mật khẩu</p>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((current) => ({ ...current, confirmPassword: e.target.value }))}
                className="w-full mt-3 px-5 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-text"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <button
              type="button"
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="w-full px-5 py-4 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 hover:opacity-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {changingPassword ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </button>

            <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">Khuyến nghị</p>
              <ul className="space-y-2 text-xs font-bold text-text-muted mt-2">
                <li>Backend hiện chỉ nhận mật khẩu mới, chưa có endpoint kiểm tra mật khẩu cũ.</li>
                <li>Chỉ cấp quyền `ADMIN` cho người thực sự cần thao tác quản trị.</li>
                <li>Giữ máy quản trị đăng xuất khi không sử dụng để tránh chiếm phiên.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
