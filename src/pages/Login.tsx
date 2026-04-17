import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, User, Phone, UserPlus, LogIn, Camera } from 'lucide-react';
import { addStudent } from '@/data/sampleData';
import { toast } from 'sonner';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const navigate = useNavigate();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Signed in successfully!');
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const admissionNumber = formData.get('admissionNumber') as string;
    const rollNumber = formData.get('rollNumber') as string;
    const parentName = formData.get('parentName') as string;

    const photoUrl = photoPreview ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e3a5f&color=fff&size=300&font-size=0.4&bold=true`;

    const result = await addStudent({
      name, email, phone, admissionNumber, rollNumber, parentName,
      photo: photoUrl, classYear: 'Class of 2026', graduationYear: 2026,
      department: 'Hikma Class Union', address: 'Kerala, India',
    });

    setIsLoading(false);

    if (result.success) {
      toast.success('Registration successful! Welcome to Hikma Class Union.');
      navigate('/students');
    } else {
      toast.error(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center py-12 px-4 hero-gradient">
        <div className="w-full max-w-md animate-scale-in">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" className="gap-2">
                <LogIn className="w-4 h-4" /> Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="gap-2">
                <UserPlus className="w-4 h-4" /> Register
              </TabsTrigger>
            </TabsList>

            {/* Sign In */}
            <TabsContent value="signin">
              <Card className="border-2 shadow-elevated">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-serif text-center">Welcome Back</CardTitle>
                  <CardDescription className="text-center">Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input id="signin-email" type="email" placeholder="your.email@example.com" className="pl-10" required />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 gap-2" disabled={isLoading}>
                      {isLoading
                        ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
                        : <><LogIn className="w-4 h-4" /> Sign In</>
                      }
                    </Button>
                  </form>

                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <button onClick={() => (document.querySelector('[value="register"]') as HTMLElement)?.click()}
                      className="text-primary hover:underline font-medium">
                      Register now
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Register */}
            <TabsContent value="register">
              <Card className="border-2 shadow-elevated">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-serif text-center">Create Account</CardTitle>
                  <CardDescription className="text-center">Join the Hikma Class Union community</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    {/* Profile Photo */}
                    <div className="space-y-2">
                      <Label htmlFor="profile-photo">Profile Photo</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                          {photoPreview
                            ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                            : <Camera className="w-8 h-8 text-muted-foreground" />
                          }
                        </div>
                        <div className="flex-1">
                          <Input id="profile-photo" type="file" accept="image/*" onChange={handlePhotoChange} className="cursor-pointer" />
                          <p className="text-xs text-muted-foreground mt-1">Upload a profile photo (optional)</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="register-name" name="name" type="text" placeholder="John Doe" className="pl-10" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="register-email" name="email" type="email" placeholder="your.email@example.com" className="pl-10" required />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="register-phone" name="phone" type="tel" placeholder="+91 9876543210" className="pl-10" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-admission">Admission Number</Label>
                        <Input id="register-admission" name="admissionNumber" type="text" placeholder="HKM138" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-roll">Roll Number</Label>
                        <Input id="register-roll" name="rollNumber" type="text" placeholder="1" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-parent">Parent/Guardian Name</Label>
                        <Input id="register-parent" name="parentName" type="text" placeholder="Mr. John Doe" required />
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <input type="checkbox" className="rounded mt-1" required />
                      <span className="text-muted-foreground">
                        I agree to the{' '}
                        <a href="#" className="text-primary hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                      </span>
                    </div>

                    <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 gap-2" disabled={isLoading}>
                      {isLoading
                        ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account...</>
                        : <><UserPlus className="w-4 h-4" /> Create Account</>
                      }
                    </Button>
                  </form>

                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button onClick={() => (document.querySelector('[value="signin"]') as HTMLElement)?.click()}
                      className="text-primary hover:underline font-medium">
                      Sign in
                    </button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
