export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          complement: string | null
          created_at: string
          id: string
          is_default: boolean
          neighborhood: string
          number: string
          state: string
          street: string
          updated_at: string
          user_id: string
          zipcode: string
        }
        Insert: {
          city: string
          complement?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          neighborhood: string
          number: string
          state: string
          street: string
          updated_at?: string
          user_id: string
          zipcode: string
        }
        Update: {
          city?: string
          complement?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          neighborhood?: string
          number?: string
          state?: string
          street?: string
          updated_at?: string
          user_id?: string
          zipcode?: string
        }
        Relationships: []
      }
      carousel_items: {
        Row: {
          alt_text: string
          created_at: string | null
          id: string
          image_url: string
          item_order: number | null
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          alt_text: string
          created_at?: string | null
          id?: string
          image_url: string
          item_order?: number | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          alt_text?: string
          created_at?: string | null
          id?: string
          image_url?: string
          item_order?: number | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cart_analytics: {
        Row: {
          action: string
          created_at: string
          id: string
          item_count: number
          items: Json
          session_id: string | null
          total_value: number
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          item_count?: number
          items?: Json
          session_id?: string | null
          total_value?: number
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          item_count?: number
          items?: Json
          session_id?: string | null
          total_value?: number
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      manuals: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          pages: number | null
          pdf_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          pages?: number | null
          pdf_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          pages?: number | null
          pdf_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      material_leads: {
        Row: {
          consent: boolean
          created_at: string
          downloaded_material: string | null
          email: string
          id: string
          name: string
          source: string | null
          updated_at: string
        }
        Insert: {
          consent?: boolean
          created_at?: string
          downloaded_material?: string | null
          email: string
          id?: string
          name: string
          source?: string | null
          updated_at?: string
        }
        Update: {
          consent?: boolean
          created_at?: string
          downloaded_material?: string | null
          email?: string
          id?: string
          name?: string
          source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string | null
          product_image_url: string | null
          product_name: string
          quantity: number
          species_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price?: number
          product_id?: string | null
          product_image_url?: string | null
          product_name: string
          quantity?: number
          species_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string | null
          product_image_url?: string | null
          product_name?: string
          quantity?: number
          species_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_cpf: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          notes: string | null
          payment_method: string | null
          shipping_address: Json | null
          status: string
          total_amount: number
          tracking_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_cpf?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          shipping_address?: Json | null
          status?: string
          total_amount?: number
          tracking_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_cpf?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          shipping_address?: Json | null
          status?: string
          total_amount?: number
          tracking_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          available: boolean
          category: string
          created_at: string
          description: string
          details: Json
          featured: boolean
          id: string
          images: Json
          is_new: boolean
          meta: Json | null
          name: string
          order_position: number | null
          original_price: number | null
          payment_link: string | null
          pix_price: number | null
          price: number
          slug: string | null
          species_id: string | null
          species_name: string
          status: string
          stock: number | null
          subcategory: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          available?: boolean
          category: string
          created_at?: string
          description?: string
          details?: Json
          featured?: boolean
          id?: string
          images?: Json
          is_new?: boolean
          meta?: Json | null
          name: string
          order_position?: number | null
          original_price?: number | null
          payment_link?: string | null
          pix_price?: number | null
          price?: number
          slug?: string | null
          species_id?: string | null
          species_name: string
          status?: string
          stock?: number | null
          subcategory: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          available?: boolean
          category?: string
          created_at?: string
          description?: string
          details?: Json
          featured?: boolean
          id?: string
          images?: Json
          is_new?: boolean
          meta?: Json | null
          name?: string
          order_position?: number | null
          original_price?: number | null
          payment_link?: string | null
          pix_price?: number | null
          price?: number
          slug?: string | null
          species_id?: string | null
          species_name?: string
          status?: string
          stock?: number | null
          subcategory?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "products_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      species: {
        Row: {
          characteristics: Json | null
          commonname: string
          created_at: string | null
          curiosities: Json | null
          description: string | null
          gallery: Json | null
          id: string
          image: string | null
          name: string
          order: number | null
          slug: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          characteristics?: Json | null
          commonname: string
          created_at?: string | null
          curiosities?: Json | null
          description?: string | null
          gallery?: Json | null
          id?: string
          image?: string | null
          name: string
          order?: number | null
          slug: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          characteristics?: Json | null
          commonname?: string
          created_at?: string | null
          curiosities?: Json | null
          description?: string | null
          gallery?: Json | null
          id?: string
          image?: string | null
          name?: string
          order?: number | null
          slug?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          contact_preference: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          contact_preference?: string
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          contact_preference?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
