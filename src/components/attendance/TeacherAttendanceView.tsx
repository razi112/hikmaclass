import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { CalendarIcon, CheckCircle2, XCircle, Clock, AlertCircle, Users, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusOptions = [
  { value: 'present', label: 'Present', icon: CheckCircle2 },
  { value: 'absent', label: 'Absent', icon: XCircle },
  { value: 'late', label: 'Late', icon: Clock },
  { value: 'excused', label: 'Excused', icon: AlertCircle },
];

const statusVariant: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
  present: 'default',
  absent: 'destructive',
  late: 'secondary',
  excused: 'outline',
};

export const TeacherAttendanceView = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  // Fetch all student profiles
  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url');
      if (error) throw error;
      return data;
    },
  });

  // Fetch attendance for selected date
  const { data: existingRecords, isLoading: loadingRecords } = useQuery({
    queryKey: ['attendance-date', dateStr],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('date', dateStr);
      if (error) throw error;
      return data;
    },
  });

  // Local state for attendance marking
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({});

  // Sync existing records into map when data loads
  const existingMap: Record<string, string> = {};
  existingRecords?.forEach((r) => {
    existingMap[r.student_id] = r.status;
  });

  const getStatus = (studentId: string) =>
    attendanceMap[studentId] ?? existingMap[studentId] ?? '';

  const setStatus = (studentId: string, status: string) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      const entries = Object.entries(attendanceMap);
      if (!entries.length) throw new Error('No changes to save');

      for (const [studentId, status] of entries) {
        const existing = existingRecords?.find((r) => r.student_id === studentId);
        if (existing) {
          const { error } = await supabase
            .from('attendance_records')
            .update({ status, marked_by: user.id })
            .eq('id', existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('attendance_records')
            .insert({
              student_id: studentId,
              date: dateStr,
              status,
              marked_by: user.id,
            });
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      toast({ title: 'Attendance saved', description: `Saved for ${format(selectedDate, 'PPP')}` });
      setAttendanceMap({});
      queryClient.invalidateQueries({ queryKey: ['attendance-date', dateStr] });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const isLoading = loadingStudents || loadingRecords;
  const hasChanges = Object.keys(attendanceMap).length > 0;

  return (
    <div className="space-y-6">
      {/* Date picker & actions */}
      <div className="flex flex-wrap items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, 'PPP')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => {
                if (d) {
                  setSelectedDate(d);
                  setAttendanceMap({});
                }
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <Button
          onClick={() => saveMutation.mutate()}
          disabled={!hasChanges || saveMutation.isPending}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          {saveMutation.isPending ? 'Saving...' : 'Save Attendance'}
        </Button>

        {/* Quick mark all */}
        <div className="flex gap-2 ml-auto">
          {statusOptions.map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              variant="outline"
              onClick={() => {
                const newMap: Record<string, string> = {};
                students?.forEach((s) => { newMap[s.id] = opt.value; });
                setAttendanceMap(newMap);
              }}
              className="gap-1 text-xs"
            >
              <opt.icon className="w-3 h-3" />
              All {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Student list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5" />
            Mark Attendance — {format(selectedDate, 'PPP')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse text-muted-foreground py-8 text-center">Loading students...</div>
          ) : !students?.length ? (
            <p className="text-center text-muted-foreground py-8">No students found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Quick Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const currentStatus = getStatus(student.id);
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.full_name || 'Unnamed'}</TableCell>
                      <TableCell>
                        {currentStatus ? (
                          <Badge variant={statusVariant[currentStatus] || 'secondary'}>
                            {currentStatus}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not marked</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-end">
                          {statusOptions.map((opt) => (
                            <Button
                              key={opt.value}
                              size="sm"
                              variant={currentStatus === opt.value ? 'default' : 'ghost'}
                              onClick={() => setStatus(student.id, opt.value)}
                              className="h-8 w-8 p-0"
                              title={opt.label}
                            >
                              <opt.icon className="w-4 h-4" />
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
