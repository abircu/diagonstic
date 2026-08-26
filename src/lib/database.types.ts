export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Localized = { en: string; bn: string };

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "admin" | "editor" | "user";
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          role?: "admin" | "editor" | "user";
          full_name?: string | null;
        };
        Update: {
          role?: "admin" | "editor" | "user";
          full_name?: string | null;
        };
      };
      site_settings: {
        Row: {
          id: number;
          brand: string;
          brand_short: string;
          tagline: Localized;
          phone_main: string;
          phone_main_display: string;
          phone_medical: string;
          phone_medical_display: string;
          phone_admission: string;
          phone_admission_display: string;
          email_info: string;
          email_admission: string;
          address: Localized;
          hours: Localized;
          social: Json;
          marquee_text: Localized;
          logo_url: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]> & { id?: number };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
      };
      departments: {
        Row: {
          id: string;
          slug: string;
          name: Localized;
          group_key: string;
          summary: Localized;
          body: Localized;
          sort_order: number;
          published: boolean;
          created_at: string;
        };
        Insert: {
          slug: string;
          name: Localized;
          group_key: string;
          summary: Localized;
          body: Localized;
          sort_order?: number;
          published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["departments"]["Insert"]>;
      };
      doctors: {
        Row: {
          id: string;
          slug: string;
          name: Localized;
          title: Localized;
          department_slug: string | null;
          hub: "medical" | "autism" | "both";
          bio: Localized;
          schedule: Localized;
          photo_url: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
        };
        Insert: {
          slug: string;
          name: Localized;
          title: Localized;
          department_slug?: string | null;
          hub: "medical" | "autism" | "both";
          bio: Localized;
          schedule: Localized;
          photo_url?: string | null;
          sort_order?: number;
          published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["doctors"]["Insert"]>;
      };
      therapies: {
        Row: {
          id: string;
          slug: string;
          name: Localized;
          summary: Localized;
          what: Localized;
          how: Localized;
          benefits: Localized[];
          featured: boolean;
          sort_order: number;
          published: boolean;
          created_at: string;
        };
        Insert: {
          slug: string;
          name: Localized;
          summary: Localized;
          what: Localized;
          how: Localized;
          benefits?: Localized[];
          featured?: boolean;
          sort_order?: number;
          published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["therapies"]["Insert"]>;
      };
      programs: {
        Row: {
          id: string;
          slug: string;
          name: Localized;
          age: Localized;
          summary: Localized;
          offer: Localized;
          why: Localized;
          benefits: Localized[];
          featured: boolean;
          sort_order: number;
          published: boolean;
          created_at: string;
        };
        Insert: {
          slug: string;
          name: Localized;
          age: Localized;
          summary: Localized;
          offer: Localized;
          why: Localized;
          benefits?: Localized[];
          featured?: boolean;
          sort_order?: number;
          published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["programs"]["Insert"]>;
      };
      specialties: {
        Row: {
          id: string;
          slug: string;
          name: Localized;
          summary: Localized;
          sort_order: number;
          published: boolean;
        };
        Insert: {
          slug: string;
          name: Localized;
          summary: Localized;
          sort_order?: number;
          published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["specialties"]["Insert"]>;
      };
      diagnostics: {
        Row: {
          id: string;
          slug: string;
          name: Localized;
          summary: Localized;
          image_url: string | null;
          sort_order: number;
          published: boolean;
        };
        Insert: {
          slug: string;
          name: Localized;
          summary: Localized;
          image_url?: string | null;
          sort_order?: number;
          published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["diagnostics"]["Insert"]>;
      };
      packages: {
        Row: {
          id: string;
          slug: string;
          name: Localized;
          summary: Localized;
          includes: Localized[];
          sort_order: number;
          published: boolean;
        };
        Insert: {
          slug: string;
          name: Localized;
          summary: Localized;
          includes?: Localized[];
          sort_order?: number;
          published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["packages"]["Insert"]>;
      };
      faqs: {
        Row: {
          id: string;
          category: string;
          question: Localized;
          answer: Localized;
          sort_order: number;
          published: boolean;
        };
        Insert: {
          id?: string;
          category: string;
          question: Localized;
          answer: Localized;
          sort_order?: number;
          published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Insert"]>;
      };
      services: {
        Row: {
          id: string;
          slug: string;
          name: Localized;
          summary: Localized;
          link_path: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: Localized;
          summary: Localized;
          link_path?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
      };
      testimonials: {
        Row: {
          id: string;
          quote: Localized;
          author: Localized;
          sort_order: number;
          published: boolean;
        };
        Insert: {
          id?: string;
          quote: Localized;
          author: Localized;
          sort_order?: number;
          published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
      };
      gallery_items: {
        Row: {
          id: string;
          title: Localized;
          kind: "photo" | "video";
          image_url: string | null;
          sort_order: number;
          published: boolean;
        };
        Insert: {
          id?: string;
          title: Localized;
          kind?: "photo" | "video";
          image_url?: string | null;
          sort_order?: number;
          published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["gallery_items"]["Insert"]>;
      };
      youtube_videos: {
        Row: {
          id: string;
          title: Localized;
          youtube_url: string;
          category: "promo" | "reference";
          sort_order: number;
          published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: Localized;
          youtube_url: string;
          category?: "promo" | "reference";
          sort_order?: number;
          published?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["youtube_videos"]["Insert"]>;
      };
      sliders: {
        Row: {
          id: string;
          title: Localized | null;
          subtitle: Localized | null;
          image_url: string;
          link_url: string | null;
          sort_order: number;
          published: boolean;
        };
        Insert: {
          id?: string;
          title?: Localized | null;
          subtitle?: Localized | null;
          image_url: string;
          link_url?: string | null;
          sort_order?: number;
          published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["sliders"]["Insert"]>;
      };
      stats: {
        Row: {
          id: string;
          value: number;
          suffix: string;
          label: Localized;
          sort_order: number;
          published: boolean;
        };
        Insert: {
          id: string;
          value: number;
          suffix?: string;
          label: Localized;
          sort_order?: number;
          published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["stats"]["Insert"]>;
      };
      appointment_requests: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          phone: string;
          email: string | null;
          department_slug: string | null;
          doctor_slug: string | null;
          preferred_date: string | null;
          notes: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          full_name: string;
          phone: string;
          email?: string | null;
          department_slug?: string | null;
          doctor_slug?: string | null;
          preferred_date?: string | null;
          notes?: string | null;
          status?: string;
        };
        Update: Partial<Database["public"]["Tables"]["appointment_requests"]["Insert"]>;
      };
      assessment_requests: {
        Row: {
          id: string;
          user_id: string | null;
          parent_name: string;
          phone: string;
          email: string | null;
          child_age: string;
          concerns: string;
          prior_diagnosis: string | null;
          preferred_shift: string | null;
          notes: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          parent_name: string;
          phone: string;
          email?: string | null;
          child_age: string;
          concerns: string;
          prior_diagnosis?: string | null;
          preferred_shift?: string | null;
          notes?: string | null;
          status?: string;
        };
        Update: Partial<Database["public"]["Tables"]["assessment_requests"]["Insert"]>;
      };
      ambulance_requests: {
        Row: {
          id: string;
          user_id: string | null;
          contact_name: string;
          phone: string;
          email: string | null;
          pickup_location: string;
          notes: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          contact_name: string;
          phone: string;
          email?: string | null;
          pickup_location: string;
          notes?: string | null;
          status?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ambulance_requests"]["Insert"]>;
      };
    };
  };
};
