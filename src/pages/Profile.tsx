import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Save, Trash2, Upload, X } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StudentProfile {
  id?: string;
  name: string;
  specialization: string;
  status: "employed" | "internship" | "looking";
  description: string;
  portfolio_link: string;
  profile_photo_url: string;
  email: string;
  phone_number: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [profile, setProfile] = useState<StudentProfile>({
    name: "",
    specialization: "",
    status: "looking",
    description: "",
    portfolio_link: "",
    profile_photo_url: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      } else {
        // Defer profile fetch
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setHasProfile(true);
        setProfile({
          id: data.id,
          name: data.name,
          specialization: data.specialization,
          status: data.status,
          description: data.description,
          portfolio_link: data.portfolio_link || "",
          profile_photo_url: data.profile_photo_url || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
        });
        setPreviewUrl(data.profile_photo_url || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setSaving(true);

    try {
      const profileData = {
        user_id: session.user.id,
        name: profile.name,
        specialization: profile.specialization,
        status: profile.status,
        description: profile.description,
        portfolio_link: profile.portfolio_link || null,
        profile_photo_url: profile.profile_photo_url || null,
        email: profile.email || null,
        phone_number: profile.phone_number || null,
      };

      if (hasProfile && profile.id) {
        // Update existing profile
        const { error } = await supabase
          .from("students")
          .update(profileData)
          .eq("id", profile.id);

        if (error) throw error;

        toast({
          title: "Profile updated!",
          description: "Your changes have been saved successfully.",
        });
      } else {
        // Create new profile
        const { error } = await supabase
          .from("students")
          .insert([profileData]);

        if (error) throw error;

        setHasProfile(true);
        toast({
          title: "Profile created!",
          description: "Your profile is now visible on the showcase.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!profile.id) return;
    if (!confirm("Are you sure you want to delete your profile? This action cannot be undone.")) return;

    try {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Profile deleted",
        description: "Your profile has been removed from the showcase.",
      });

      setHasProfile(false);
      setProfile({
        name: "",
        specialization: "",
        status: "looking",
        description: "",
        portfolio_link: "",
        profile_photo_url: "",
        email: "",
        phone_number: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete profile.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Delete old profile picture if exists
      if (profile.profile_photo_url) {
        const oldPath = profile.profile_photo_url.split('/').slice(-2).join('/');
        await supabase.storage.from('profile-pictures').remove([oldPath]);
      }

      // Upload new image
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      setProfile({ ...profile, profile_photo_url: publicUrl });
      setPreviewUrl(publicUrl);

      toast({
        title: "Image uploaded",
        description: "Don't forget to save your profile to keep the changes.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setProfile({ ...profile, profile_photo_url: "" });
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              View Showcase
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>
              {hasProfile ? "Edit Your Profile" : "Create Your Profile"}
            </CardTitle>
            <CardDescription>
              {hasProfile
                ? "Update your information to keep your profile current"
                : "Fill in your details to appear on the student showcase"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Area of Specialization *</Label>
                <Input
                  id="specialization"
                  value={profile.specialization}
                  onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                  required
                  placeholder="e.g., Full Stack Development, Data Science"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Current Status *</Label>
                <Select
                  value={profile.status}
                  onValueChange={(value: "employed" | "internship" | "looking") =>
                    setProfile({ ...profile, status: value })
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
                <Label>Profile Picture</Label>
                <div className="flex items-start gap-4">
                  <Avatar className="h-24 w-24 border-2 border-border">
                    <AvatarImage src={previewUrl || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="profile-picture-input"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? "Uploading..." : "Upload Photo"}
                      </Button>
                      {previewUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemovePhoto}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload a profile picture (max 5MB). Accepts JPG, PNG, or WEBP.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio_link">Portfolio Link</Label>
                <Input
                  id="portfolio_link"
                  type="url"
                  value={profile.portfolio_link}
                  onChange={(e) => setProfile({ ...profile, portfolio_link: e.target.value })}
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={profile.phone_number}
                  onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">About You *</Label>
                <Textarea
                  id="description"
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  required
                  placeholder="Tell us about yourself, your skills, and what you're passionate about..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : hasProfile ? "Update Profile" : "Create Profile"}
                </Button>
                {hasProfile && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
