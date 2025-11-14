import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Briefcase, GraduationCap, Search, Mail, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import logo from "@/assets/logo.png";
import students1 from "@/assets/students-1.jpg";
import students2 from "@/assets/students-2.jpg";
import students3 from "@/assets/students-3.jpg";
import students4 from "@/assets/students-4.jpg";

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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20 animate-pulse"></div>
        
        {/* Floating Logo */}
        <div className="absolute top-8 left-8 animate-bounce">
          <img src={logo} alt="Uncommon Logo" className="h-16 w-16 md:h-20 md:w-20 drop-shadow-2xl" />
        </div>

        <div className="container relative mx-auto px-4 py-20 text-center">
          {/* Main Heading with enhanced animation */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl animate-fade-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Uncommon Student Showcase
          </h1>
          
          {/* Carousel Slider with Images */}
          <div className="mx-auto max-w-5xl mb-8 animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <Carousel 
              className="w-full" 
              opts={{ loop: true, align: "center" }}
              plugins={[
                Autoplay({
                  delay: 4000,
                })
              ]}
            >
              <CarouselContent>
                <CarouselItem>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img src={students1} alt="Uncommon Students" className="w-full h-[400px] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex items-end">
                      <p className="p-8 text-2xl md:text-3xl text-primary-foreground font-bold">
                        Discover talented students from the Uncommon program
                      </p>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img src={students2} alt="Student Working" className="w-full h-[400px] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex items-end">
                      <p className="p-8 text-2xl md:text-3xl text-primary-foreground font-bold">
                        Browse specializations and view amazing portfolios
                      </p>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img src={students3} alt="Students Collaborating" className="w-full h-[400px] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex items-end">
                      <p className="p-8 text-2xl md:text-3xl text-primary-foreground font-bold">
                        Connect with the next generation of professionals
                      </p>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img src={students4} alt="Student Presenting" className="w-full h-[400px] object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex items-end">
                      <p className="p-8 text-2xl md:text-3xl text-primary-foreground font-bold">
                        Find your perfect team member or mentor today
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground transition-all duration-300 hover:scale-110" />
              <CarouselNext className="hidden md:flex bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground transition-all duration-300 hover:scale-110" />
            </Carousel>
          </div>

          <div className="flex gap-4 justify-center animate-scale-in opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:rotate-1"
              onClick={() => window.location.href = '/auth'}
            >
              Create Your Profile
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:-rotate-1"
              onClick={() => window.location.href = '/profile'}
            >
              Manage Profile
            </Button>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="container mx-auto px-4 py-8 animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as StudentStatus | "all")} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto shadow-lg">
            <TabsTrigger value="all" className="transition-all duration-300 hover:scale-110 hover:-translate-y-1">All Students</TabsTrigger>
            <TabsTrigger value="employed" className="transition-all duration-300 hover:scale-110 hover:-translate-y-1">Employed</TabsTrigger>
            <TabsTrigger value="internship" className="transition-all duration-300 hover:scale-110 hover:-translate-y-1">Internship</TabsTrigger>
            <TabsTrigger value="looking" className="transition-all duration-300 hover:scale-110 hover:-translate-y-1">Looking</TabsTrigger>
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
            {filteredStudents.map((student, index) => {
              const statusConfig = getStatusConfig(student.status);
              const StatusIcon = statusConfig.icon;
              const initials = student.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <Card 
                  key={student.id} 
                  className="group overflow-hidden border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                >
                  <CardContent className="p-6 relative">
                    {/* Animated background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="flex items-start gap-4 mb-4 relative z-10">
                      <Avatar className="h-16 w-16 border-2 border-primary transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 group-hover:shadow-lg">
                        <AvatarImage src={student.profile_photo_url || undefined} alt={student.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-foreground mb-1 truncate group-hover:text-primary transition-all duration-300 group-hover:scale-105 transform origin-left">
                          {student.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2 group-hover:text-foreground transition-colors duration-300">
                          {student.specialization}
                        </p>
                        <Badge className={`${statusConfig.className} transition-all duration-300 hover:scale-110 hover:rotate-3 animate-pulse`}>
                          <StatusIcon className="mr-1 h-3 w-3 animate-bounce" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-foreground/80 mb-4 line-clamp-3 relative z-10 group-hover:text-foreground transition-colors duration-300">
                      {student.description}
                    </p>

                    {(student.email || student.phone_number) && (
                      <div className="flex flex-wrap gap-2 mb-4 text-xs text-muted-foreground relative z-10">
                        {student.email && (
                          <div className="flex items-center gap-1 transition-all duration-300 hover:text-primary hover:scale-110 hover:-translate-y-1">
                            <Mail className="h-3 w-3 group-hover:animate-bounce" />
                            <span>{student.email}</span>
                          </div>
                        )}
                        {student.phone_number && (
                          <div className="flex items-center gap-1 transition-all duration-300 hover:text-primary hover:scale-110 hover:-translate-y-1">
                            <Phone className="h-3 w-3 group-hover:animate-bounce" />
                            <span>{student.phone_number}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {student.status === "looking" && student.portfolio_link ? (
                      <Button
                        size="sm"
                        className="w-full relative z-10 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-1 hover:rotate-1 animate-pulse"
                        asChild
                      >
                        <a
                          href={student.portfolio_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Briefcase className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                          Hire Me
                        </a>
                      </Button>
                    ) : student.portfolio_link ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full relative z-10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 hover:scale-110 hover:shadow-xl hover:-translate-y-1"
                        asChild
                      >
                        <a
                          href={student.portfolio_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4 group-hover:animate-bounce" />
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
