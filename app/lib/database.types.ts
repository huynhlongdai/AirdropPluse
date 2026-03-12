export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          project_type: string;
          chain: string[];
          ecosystem: string[];
          status: string;
          cost_type: string;
          estimated_cost: string | null;
          potential_value: string;
          hype_score: number;
          risk_level: string;
          risk_factors: string[];
          sentiment: string;
          funding_amount: string | null;
          funding_rounds: Json;
          investors: string[];
          tge_date: string | null;
          total_supply: string | null;
          vesting_info: string | null;
          milestones: Json;
          image_url: string;
          logo_url: string | null;
          snapshot_date: string | null;
          claim_date: string | null;
          expiry_date: string | null;
          priority: string;
          is_hot: boolean;
          is_new: boolean;
          source_url: string | null;
          twitter_url: string | null;
          discord_url: string | null;
          telegram_url: string | null;
          participating_wallet_ids: string[];
          linked_wallets: Json;
          linked_identities: Json;
          updates: Json;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
      };
      project_tasks: {
        Row: {
          id: string;
          project_id: string;
          description: string;
          completed: boolean;
          wallet_id: string | null;
          completed_at: string | null;
          due_date: string | null;
          priority: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["project_tasks"]["Row"], never>;
        Update: Partial<Database["public"]["Tables"]["project_tasks"]["Row"]>;
      };
      wallets: {
        Row: {
          id: string;
          name: string;
          address: string;
          type: string;
          chains: string[];
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["wallets"]["Row"], never>;
        Update: Partial<Database["public"]["Tables"]["wallets"]["Row"]>;
      };
      sub_wallets: {
        Row: {
          id: string;
          main_wallet_id: string;
          name: string;
          address: string;
          type: string;
          chains: string[];
          status: string;
          purpose: string | null;
          linked_identity_ids: string[];
          gas_balances: Json;
          active_project_ids: string[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sub_wallets"]["Row"], never>;
        Update: Partial<Database["public"]["Tables"]["sub_wallets"]["Row"]>;
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          guide: string | null;
          guide_source: string | null;
          guide_source_label: string | null;
          type: string;
          priority: string;
          status: string;
          recurring: string | null;
          project_id: string | null;
          project_name: string | null;
          chain_id: string | null;
          estimated_gas_fee: string | null;
          gas_currency: string | null;
          deadline: string | null;
          linked_identity_ids: string[];
          tags: string[];
          is_overdue: boolean;
          is_daily_reset: boolean;
          guide_url: string | null;
          proof_images: string[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tasks"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Row"]>;
      };
      task_executions: {
        Row: {
          id: string;
          task_id: string;
          wallet_id: string;
          wallet_name: string;
          address: string;
          status: string;
          completed_at: string | null;
          tx_hash: string | null;
          actual_gas_fee: string | null;
          note: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["task_executions"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["task_executions"]["Row"]>;
      };
      task_subtasks: {
        Row: {
          id: string;
          task_id: string;
          title: string;
          completed: boolean;
          completed_at: string | null;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["task_subtasks"]["Row"], never>;
        Update: Partial<Database["public"]["Tables"]["task_subtasks"]["Row"]>;
      };
      task_notes: {
        Row: {
          id: string;
          task_id: string;
          content: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["task_notes"]["Row"], never>;
        Update: Partial<Database["public"]["Tables"]["task_notes"]["Row"]>;
      };
      task_activity_log: {
        Row: {
          id: string;
          task_id: string;
          type: string;
          message: string;
          timestamp: string;
        };
        Insert: Omit<Database["public"]["Tables"]["task_activity_log"]["Row"], never>;
        Update: Partial<Database["public"]["Tables"]["task_activity_log"]["Row"]>;
      };
      identities: {
        Row: {
          id: string;
          alias: string;
          status: string;
          email_data: Json;
          twitter_data: Json;
          discord_data: Json;
          telegram_data: Json;
          tiktok_data: Json;
          others: Json;
          linked_wallets: string[];
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["identities"]["Row"], never>;
        Update: Partial<Database["public"]["Tables"]["identities"]["Row"]>;
      };
      inbox_items: {
        Row: {
          id: string;
          raw_content: string;
          source_type: string;
          source_url: string | null;
          item_type: string;
          status: string;
          extracted_data: Json;
          created_at: string;
          processed_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["inbox_items"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["inbox_items"]["Row"]>;
      };
      settings_providers: {
        Row: {
          id: string;
          name: string;
          provider: string;
          category: string;
          description: string;
          icon_color: string;
          docs_url: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["settings_providers"]["Row"], never>;
        Update: Partial<Database["public"]["Tables"]["settings_providers"]["Row"]>;
      };
      settings_api_keys: {
        Row: {
          id: string;
          provider_id: string;
          label: string;
          value_masked: string | null;
          status: string;
          usage_percent: number | null;
          usage_label: string | null;
          quota_limit: string | null;
          last_checked: string | null;
          is_primary: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["settings_api_keys"]["Row"], never>;
        Update: Partial<Database["public"]["Tables"]["settings_api_keys"]["Row"]>;
      };
      settings_ai_config: {
        Row: {
          feature: string;
          feature_label: string;
          feature_description: string;
          primary_model: string;
          fallback_model: string;
          temperature: number;
          max_tokens: number;
        };
        Insert: Database["public"]["Tables"]["settings_ai_config"]["Row"];
        Update: Partial<Database["public"]["Tables"]["settings_ai_config"]["Row"]>;
      };
      settings_taxonomy: {
        Row: {
          id: string;
          type: string;
          label: string;
          color: string;
          built_in: boolean;
          usage_count: number;
        };
        Insert: Omit<Database["public"]["Tables"]["settings_taxonomy"]["Row"], never>;
        Update: Partial<Database["public"]["Tables"]["settings_taxonomy"]["Row"]>;
      };
      settings_ingestion: {
        Row: {
          id: string;
          crawl_depth: number;
          skip_images: boolean;
          text_only: boolean;
          auto_scrape_enabled: boolean;
          scrape_interval_hours: number;
          priority_domains: string[];
          max_items_per_run: number;
          deduplication: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["settings_ingestion"]["Row"], never>;
        Update: Partial<Database["public"]["Tables"]["settings_ingestion"]["Row"]>;
      };
      api_logs: {
        Row: {
          id: string;
          timestamp: string;
          service: string;
          endpoint: string;
          status_code: number;
          latency_ms: number;
          tokens_used: number | null;
          cost_usd: number | null;
          success: boolean;
          error_message: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["api_logs"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["api_logs"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
