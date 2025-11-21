import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Briefcase, GraduationCap, Search, Mail, Phone, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
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
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const toggleDescription = (studentId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

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
      {/* Unique Diagonal Hero Section */}
      <section className="relative overflow-hidden">
        {/* Diagonal Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent/20 to-primary/90 transform -skew-y-3 origin-top-left"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10"></div>
        
        {/* Logo Badge */}
        <div className="absolute top-6 left-6 z-20 bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-3 border border-primary-foreground/20 shadow-2xl animate-fade-in">
          <img src={logo} alt="Uncommon Logo" className="h-14 w-14 sm:h-16 sm:w-16" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-primary-foreground space-y-6 animate-fade-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                uncommon.org
                <span className="block text-accent mt-2">students website</span>
              </h1>
              <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-xl">
                Discover talented students from the Uncommon program. Browse specializations, portfolios, and connect with the next generation of professionals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-base sm:text-lg px-8"
                  onClick={() => window.location.href = '/auth'}
                >
                  Create Your Profile
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 text-base sm:text-lg px-8"
                  onClick={() => window.location.href = '/profile'}
                >
                  Manage Profile
                </Button>
              </div>
            </div>

            {/* Right Carousel */}
            <div className="animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <Carousel 
                className="w-full" 
                opts={{ loop: true, align: "center" }}
                plugins={[plugin.current]}
              >
                <CarouselContent>
                  <CarouselItem>
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-primary-foreground/20">
                      <div className="bg-card aspect-[4/3] flex items-center justify-center">
                        <img src={students1} alt="Uncommon Students" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-primary-foreground/20">
                      <div className="bg-card aspect-[4/3] flex items-center justify-center">
                        <img src={students2} alt="Student Working" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-primary-foreground/20">
                      <div className="bg-card aspect-[4/3] flex items-center justify-center">
                        <img src={students3} alt="Students Collaborating" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-primary-foreground/20">
                      <div className="bg-card aspect-[4/3] flex items-center justify-center">
                        <img src={students4} alt="Student Presenting" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12 bg-primary-foreground/90 hover:bg-primary-foreground text-primary hover:scale-110 transition-all duration-300 shadow-lg" />
                <CarouselNext className="hidden md:flex -right-12 bg-primary-foreground/90 hover:bg-primary-foreground text-primary hover:scale-110 transition-all duration-300 shadow-lg" />
              </Carousel>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Filter Section - Floating Style */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-foreground">
            Explore Our <span className="text-primary">Talented</span> Students
          </h2>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as StudentStatus | "all")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-3 p-2 bg-transparent">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border data-[state=active]:border-primary rounded-xl text-sm sm:text-base py-3"
              >
                All Students
              </TabsTrigger>
              <TabsTrigger 
                value="employed" 
                className="data-[state=active]:bg-[hsl(var(--status-employed))] data-[state=active]:text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border data-[state=active]:border-[hsl(var(--status-employed))] rounded-xl text-sm sm:text-base py-3"
              >
                Employed
              </TabsTrigger>
              <TabsTrigger 
                value="internship" 
                className="data-[state=active]:bg-[hsl(var(--status-internship))] data-[state=active]:text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border data-[state=active]:border-[hsl(var(--status-internship))] rounded-xl text-sm sm:text-base py-3"
              >
                Internship
              </TabsTrigger>
              <TabsTrigger 
                value="looking" 
                className="data-[state=active]:bg-[hsl(var(--status-looking))] data-[state=active]:text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border data-[state=active]:border-[hsl(var(--status-looking))] rounded-xl text-sm sm:text-base py-3"
              >
                Looking
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Students Grid - Masonry Style */}
      <section className="container mx-auto px-4 pb-20">
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse rounded-2xl">
                <CardContent className="p-6">
                  <div className="h-32 bg-muted rounded-xl mb-4"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-muted/50 rounded-3xl">
              <p className="text-2xl text-muted-foreground font-semibold">No students found matching your filter.</p>
              <p className="text-sm text-muted-foreground mt-2">Try selecting a different filter above</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
                  className="group relative overflow-hidden border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-scale-in rounded-2xl bg-card"
                  style={{ 
                    animationDelay: `${index * 0.1}s`, 
                    animationFillMode: 'both',
                  }}
                >
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardContent className="p-6 relative">
                    {/* Animated background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    
                    <div className="flex flex-col items-center text-center gap-4 mb-4 relative z-10">
                      <Avatar className="h-20 w-20 border-4 border-primary/20 group-hover:border-primary transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl ring-4 ring-background">
                        <AvatarImage src={student.profile_photo_url || undefined} alt={student.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xl font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="w-full">
                        <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                          {student.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 font-medium">
                          {student.specialization}
                        </p>
                        <Badge className={`${statusConfig.className} transition-all duration-300 hover:scale-110 shadow-lg px-3 py-1`}>
                          <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="relative z-10 mb-4">
                      <p className={`text-sm text-foreground/70 leading-relaxed text-center transition-all duration-300 ${
                        expandedDescriptions.has(student.id) ? '' : 'line-clamp-3'
                      }`}>
                        {student.description}
                      </p>
                      {student.description.length > 150 && (
                        <button
                          onClick={() => toggleDescription(student.id)}
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium mt-2 mx-auto transition-all duration-300 hover:gap-2"
                        >
                          {expandedDescriptions.has(student.id) ? 'Read less' : 'Read more'}
                          <ChevronDown 
                            className={`h-3.5 w-3.5 transition-transform duration-300 ${
                              expandedDescriptions.has(student.id) ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                      )}
                    </div>

                    {(student.email || student.phone_number) && (
                      <div className="flex flex-col gap-2 mb-4 text-xs relative z-10 bg-muted/30 rounded-xl p-3">
                        {student.email && (
                          <div className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="truncate">{student.email}</span>
                          </div>
                        )}
                        {student.phone_number && (
                          <div className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{student.phone_number}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {student.status === "looking" && student.portfolio_link ? (
                      <Button
                        size="sm"
                        className="w-full relative z-10 transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl py-5 text-base font-semibold"
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
                        className="w-full relative z-10 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-xl py-5 text-base font-semibold"
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
      
      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-12 mt-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center gap-4">
            <img src={logo} alt="Uncommon Logo" className="h-16 w-16" />
            <p className="text-lg font-semibold">uncommon.org</p>
            <p className="text-sm text-primary-foreground/80 max-w-md">
              Empowering students to showcase their talents and connect with opportunities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
