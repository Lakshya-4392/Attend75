import { Calendar, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TodaysSummaryProps {
  date: string;
  totalClasses: number;
}

export function TodaysSummary({ date, totalClasses }: TodaysSummaryProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="overflow-hidden bg-gradient-to-r from-background/50 to-background/80 backdrop-blur-sm border-border/40">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Today</span>
            </div>
            <h1 className="text-lg font-bold leading-tight sm:text-2xl lg:text-3xl">{formattedDate}</h1>
          </div>
          
          <div className="flex items-center justify-between sm:flex-col sm:text-right sm:justify-center">
            <div className="flex items-center space-x-2 text-muted-foreground sm:justify-end">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-medium">Classes</span>
            </div>
            <div className="text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">
              {totalClasses}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}