import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Calendar, Newspaper, Settings, LogOut, GraduationCap, TrendingUp, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sampleEvents, sampleNews, getRegisteredStudents, type Student } from '@/data/sampleData';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin');
      return;
    }

    // Fetch students from database
    const fetchStudents = async () => {
      setLoading(true);
      const data = await getRegisteredStudents();
      setStudents(data);
      setLoading(false);
    };

    fetchStudents();
  }, [navigate]);

  const handleNotifications = () => {
    // For now, show a simple alert - can be replaced with a proper notifications panel
    alert('Notifications feature coming soon!\n\nYou have:\n• 3 new student registrations\n• 2 upcoming events\n• 1 pending approval');
  };

  const handleSettings = () => {
    // Navigate to settings or show settings dialog
    alert('Settings panel coming soon!\n\nAvailable settings:\n• Profile settings\n• Email notifications\n• Privacy settings\n• Account management');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin');
  };

  const stats = [
    { icon: Users, label: 'Total Students', value: loading ? '...' : students.length, color: 'bg-primary/10 text-primary' },
    { icon: Calendar, label: 'Upcoming Events', value: sampleEvents.length, color: 'bg-secondary/20 text-secondary' },
    { icon: Newspaper, label: 'News Articles', value: sampleNews.length, color: 'bg-accent/20 text-accent' },
    { icon: TrendingUp, label: 'Monthly Visitors', value: '1,234', color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-serif font-semibold hidden sm:block">Admin Panel</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleNotifications}>
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSettings}>
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your union.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Users className="w-5 h-5 text-primary" />
                Manage Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add, edit, or remove student profiles from the directory.
              </p>
              <Button className="w-full" onClick={() => navigate('/students')}>View Students</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Calendar className="w-5 h-5 text-secondary" />
                Manage Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create and manage upcoming events and activities.
              </p>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/events')}>View Events</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Newspaper className="w-5 h-5 text-accent" />
                Manage News
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Post news articles and announcements.
              </p>
              <Button variant="outline" className="w-full" onClick={() => navigate('/')}>View News</Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleNews.slice(0, 3).map((news, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Newspaper className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{news.title}</p>
                    <p className="text-sm text-muted-foreground">{news.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
