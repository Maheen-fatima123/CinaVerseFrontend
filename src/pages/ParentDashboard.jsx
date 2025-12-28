import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useStore } from '../context/StoreContext';
import UserSidebar from '../components/dashboards/UserSidebar';
import ProfileTab from '../components/dashboards/ProfileTab';
import SubscriptionTab from '../components/dashboards/SubscriptionTab';
import SettingsTab from '../components/dashboards/SettingsTab';
import ChildManagementTab from '../components/dashboards/ChildManagementTab';

const ParentDashboard = () => {
  const { user: contextUser, updateProfile } = useStore();
  const [user, setUser] = useState(contextUser || { firstName: '', lastName: '', email: '', plan: '', role: 'parent' });
  const [activeTab, setActiveTab] = useState('children');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (contextUser) {
      setUser(contextUser);
      setIsLoading(false);
    }
  }, [contextUser]);

  const handleSaveProfile = async (formData) => {
    const updated = await updateProfile(formData);
    setUser({ ...user, ...updated });
  };

  if (isLoading) return <div className="text-white bg-black min-vh-100 d-flex justify-content-center align-items-center">Loading...</div>;

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      <Navbar />
      <main className="flex-grow-1 pb-5 mt-5" style={{ paddingTop: 64 }}>
        <div className="container py-4">

          <div className="row g-3">
            <div className="col-lg-3">
              <UserSidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="col-lg-9">
              <div className="transition-all duration-500 ease-in-out">
                {activeTab === 'profile' && <ProfileTab user={user} onSave={handleSaveProfile} />}
                {activeTab === 'subscription' && <SubscriptionTab />}
                {activeTab === 'children' && <ChildManagementTab />}
                {activeTab === 'settings' && <SettingsTab />}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ParentDashboard;
