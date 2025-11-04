import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  specialization: string;
  status: "employed" | "internship" | "looking";
  description: string;
  portfolio_link: string | null;
  profile_photo_url: string | null;
}

interface StudentFormProps {
  student: Student | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function StudentForm({ student, onSuccess, onCancel }: StudentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    status: "looking" as "employed" | "internship" | "looking",
    description: "",
    portfolio_link: "",
    profile_photo_url: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        specialization: student.specialization,
        status: student.status,
        description: student.description,
        portfolio_link: student.portfolio_link || "",
        profile_photo_url: student.profile_photo_url || "",
      });
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        portfolio_link: formData.portfolio_link || null,
        profile_photo_url: formData.profile_photo_url || null,
      };

      if (student) {
        const { error } = await supabase
          .from("students")
          .update(dataToSubmit)
          .eq("id", student.id);

        if (error) throw error;
        toast.success("Student updated successfully");
      } else {
        const { error } = await supabase
          .from("students")
          .insert([dataToSubmit]);

        if (error) throw error;
        toast.success("Student added successfully");
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error saving student:", error);
      toast.error(error.message || "Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{student ? "Edit Student" : "Add New Student"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Area of Specialization *</Label>
            <Input
              id="specialization"
              placeholder="e.g., Web Development, Data Science"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
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
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="internship">On Internship</SelectItem>
                <SelectItem value="looking">Looking for Opportunities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Brief description about the student"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio_link">Portfolio Link</Label>
            <Input
              id="portfolio_link"
              type="url"
              placeholder="https://portfolio.example.com"
              value={formData.portfolio_link}
              onChange={(e) => setFormData({ ...formData, portfolio_link: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile_photo_url">Profile Photo URL</Label>
            <Input
              id="profile_photo_url"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={formData.profile_photo_url}
              onChange={(e) => setFormData({ ...formData, profile_photo_url: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : student ? "Update Student" : "Add Student"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
