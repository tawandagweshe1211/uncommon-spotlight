import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

const Submit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    status: "looking" as "employed" | "internship" | "looking",
    description: "",
    portfolio_link: "",
    profile_photo_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("student_submissions").insert([formData]);

      if (error) throw error;

      toast({
        title: "Submission successful!",
        description: "Your profile has been submitted for review. We'll get back to you soon!",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        specialization: "",
        status: "looking",
        description: "",
        portfolio_link: "",
        profile_photo_url: "",
      });

      // Navigate back to home after a delay
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-secondary py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Button
          variant="ghost"
          className="mb-6 text-primary-foreground hover:bg-primary-foreground/10"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Showcase
        </Button>

        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Submit Your Profile
            </CardTitle>
            <CardDescription className="text-base">
              Share your information with us and showcase your talents to potential employers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Area of Specialization *</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  required
                  placeholder="e.g., Full Stack Development, Data Science"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Current Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "employed" | "internship" | "looking") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="looking">Looking for Opportunities</SelectItem>
                    <SelectItem value="internship">On Internship</SelectItem>
                    <SelectItem value="employed">Employed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile_photo_url">Profile Photo URL</Label>
                <Input
                  id="profile_photo_url"
                  type="url"
                  value={formData.profile_photo_url}
                  onChange={(e) => setFormData({ ...formData, profile_photo_url: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio_link">Portfolio Link</Label>
                <Input
                  id="portfolio_link"
                  type="url"
                  value={formData.portfolio_link}
                  onChange={(e) => setFormData({ ...formData, portfolio_link: e.target.value })}
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">About You *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Tell us about yourself, your skills, and what you're passionate about..."
                  className="min-h-[120px]"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Submit;
