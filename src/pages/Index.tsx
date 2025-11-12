import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Briefcase, GraduationCap, Search, Mail, Phone } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type StudentStatus = "employed" | "internship" | "looking";

interface Student {
  id: string;
  name: string;
  specialization: string;
  status: StudentStatus;
  description: string;
  portfolio_link: string | null;
  profile_photo_url: string | null;
  email: string | null;
  phone_number: string | null;
}

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filter, setFilter] = useState<StudentStatus | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = filter === "all" 
    ? students 
    : students.filter(s => s.status === filter);

  const getStatusConfig = (status: StudentStatus) => {
    const configs = {
      employed: { label: "Employed", icon: Briefcase, className: "bg-[hsl(var(--status-employed))] text-white" },
      internship: { label: "On Internship", icon: GraduationCap, className: "bg-[hsl(var(--status-internship))] text-white" },
      looking: { label: "Looking for Opportunities", icon: Search, className: "bg-[hsl(var(--status-looking))] text-white" }
    };
    return configs[status];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary to-primary/90 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="container relative mx-auto px-4 py-20 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">
            Uncommon Student Showcase
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/90 md:text-xl mb-8">
            Discover talented students from the Uncommon program. Browse their specializations, 
            view portfolios, and connect with the next generation of professionals.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => window.location.href = '/auth'}
            >
              Create Your Profile
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20"
              onClick={() => window.location.href = '/profile'}
            >
              Manage Profile
            </Button>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="container mx-auto px-4 py-8">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as StudentStatus | "all")} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="all">All Students</TabsTrigger>
            <TabsTrigger value="employed">Employed</TabsTrigger>
            <TabsTrigger value="internship">Internship</TabsTrigger>
            <TabsTrigger value="looking">Looking</TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {/* Students Grid */}
      <section className="container mx-auto px-4 pb-20">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-40 bg-muted rounded-md mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No students found matching your filter.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student) => {
              const statusConfig = getStatusConfig(student.status);
              const StatusIcon = statusConfig.icon;
              const initials = student.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <Card key={student.id} className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-16 w-16 border-2 border-primary">
                        <AvatarImage src={student.profile_photo_url || undefined} alt={student.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-foreground mb-1 truncate">
                          {student.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {student.specialization}
                        </p>
                        <Badge className={statusConfig.className}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-foreground/80 mb-4 line-clamp-3">
                      {student.description}
                    </p>

                    {(student.email || student.phone_number) && (
                      <div className="flex flex-wrap gap-2 mb-4 text-xs text-muted-foreground">
                        {student.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{student.email}</span>
                          </div>
                        )}
                        {student.phone_number && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{student.phone_number}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {student.status === "looking" && student.portfolio_link ? (
                      <Button
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <a
                          href={student.portfolio_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          Hire Me
                        </a>
                      </Button>
                    ) : student.portfolio_link ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        asChild
                      >
                        <a
                          href={student.portfolio_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Portfolio
                        </a>
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
