-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create enum for subscription plans
CREATE TYPE public.subscription_plan AS ENUM ('free', 'pro', 'vip');

-- Create enum for video status
CREATE TYPE public.video_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Create enum for text templates
CREATE TYPE public.text_template AS ENUM ('fade_in', 'bounce', 'typewriter', 'slide_up_glow', 'rotate_zoom');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  date_of_birth DATE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL DEFAULT 'free',
  paddle_subscription_id TEXT,
  paddle_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Create credits table
CREATE TABLE public.credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 50,
  weekly_allowance INTEGER NOT NULL DEFAULT 20,
  last_renewal TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Create photos table
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create videos table
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Minha Retrospectiva',
  prompt TEXT,
  status video_status NOT NULL DEFAULT 'pending',
  duration_seconds INTEGER,
  photo_count INTEGER,
  text_template text_template DEFAULT 'fade_in',
  storage_path TEXT,
  preview_path TEXT,
  credits_used INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create video_photos junction table
CREATE TABLE public.video_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  photo_id UUID NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create saved_prompts table
CREATE TABLE public.saved_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_prompts ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscription" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Credits policies
CREATE POLICY "Users can view their own credits" ON public.credits
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own credits" ON public.credits
  FOR UPDATE USING (auth.uid() = user_id);

-- Photos policies
CREATE POLICY "Users can view their own photos" ON public.photos
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own photos" ON public.photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own photos" ON public.photos
  FOR DELETE USING (auth.uid() = user_id);

-- Videos policies
CREATE POLICY "Users can view their own videos" ON public.videos
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own videos" ON public.videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own videos" ON public.videos
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own videos" ON public.videos
  FOR DELETE USING (auth.uid() = user_id);

-- Video photos policies
CREATE POLICY "Users can view their own video photos" ON public.video_photos
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.videos WHERE videos.id = video_photos.video_id AND videos.user_id = auth.uid())
  );
CREATE POLICY "Users can insert their own video photos" ON public.video_photos
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.videos WHERE videos.id = video_photos.video_id AND videos.user_id = auth.uid())
  );
CREATE POLICY "Users can delete their own video photos" ON public.video_photos
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.videos WHERE videos.id = video_photos.video_id AND videos.user_id = auth.uid())
  );

-- Saved prompts policies
CREATE POLICY "Users can view their own saved prompts" ON public.saved_prompts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own saved prompts" ON public.saved_prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved prompts" ON public.saved_prompts
  FOR DELETE USING (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, name, email, date_of_birth)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    CASE 
      WHEN NEW.raw_user_meta_data->>'date_of_birth' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'date_of_birth')::DATE 
      ELSE NULL 
    END
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Create initial subscription (free)
  INSERT INTO public.subscriptions (user_id, plan)
  VALUES (NEW.id, 'free');
  
  -- Create initial credits (50)
  INSERT INTO public.credits (user_id, balance, weekly_allowance)
  VALUES (NEW.id, 50, 20);
  
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_credits_updated_at
  BEFORE UPDATE ON public.credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('photos', 'photos', false, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('videos', 'videos', false, 104857600, ARRAY['video/mp4', 'video/webm']);

-- Storage policies for photos bucket
CREATE POLICY "Users can upload their own photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their own photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for videos bucket
CREATE POLICY "Users can upload their own videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their own videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own videos" ON storage.objects
  FOR DELETE USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);