import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarDays, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

const statusConfig: Record<string, { label: string; variant: 'default' | 'destructive' | 'secondary' | 'outline'; icon: typeof CheckCircle2 }> = {
  present: { label: 'Present', variant: 'default', icon: CheckCircle2 },
  absent: { label: 'Absent', variant: 'destructive', icon: XCircle },
  late: { label: 'Late', variant: 'secondary', icon: Clock },
  excused: { label: 'Excused', variant: 'outline', icon: AlertCircle },
};

interface Props {
  userId: string;
}

export const StudentAttendanceView = ({ userId }: Props) => {
  const { data: records, isLoading } = useQuery({
    queryKey: ['attendance', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('student_id', userId)
        .order('date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const stats = records?.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      acc.total += 1;
      return acc;
    },
    { present: 0, absent: 0, late: 0, excused: 0, total: 0 } as Record<string, number>
  );

  if (isLoading) {
    return <div className="animate-pulse text-muted-foreground">Loading attendance...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['present', 'absent', 'late', 'excused'] as const).map((status) => {
          const config = statusConfig[status];
          const Icon = config.icon;
          return (
            <Card key={status}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats?.[status] || 0}</p>
                  <p className="text-xs text-muted-foreground">{config.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Records table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="w-5 h-5" />
            Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!records?.length ? (
            <p className="text-center text-muted-foreground py-8">No attendance records yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => {
                  const config = statusConfig[record.status];
                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {format(new Date(record.date), 'PPP')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={config?.variant || 'secondary'}>{config?.label || record.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{record.notes || '—'}</TableCell>
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
