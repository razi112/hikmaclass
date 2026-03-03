import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { TeacherAttendanceView } from '@/components/attendance/TeacherAttendanceView';
import { StudentAttendanceView } from '@/components/attendance/StudentAttendanceView';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ClipboardList, LogIn } from 'lucide-react';

const Attendance = () => {
  const { user, loading, isTeacherOrAdmin } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center space-y-4">
            <ClipboardList className="w-16 h-16 mx-auto text-muted-foreground" />
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Sign in to view attendance
            </h2>
            <p className="text-muted-foreground max-w-md">
              You need to be logged in to access attendance tracking.
            </p>
            <Link to="/admin">
              <Button className="gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Attendance Tracking
            </h1>
            <p className="text-muted-foreground">
              {isTeacherOrAdmin
                ? 'Mark and manage student attendance records.'
                : 'View your attendance history.'}
            </p>
          </div>

          {isTeacherOrAdmin ? (
            <TeacherAttendanceView />
          ) : (
            <StudentAttendanceView userId={user.id} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Attendance;
