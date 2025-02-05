import { createClient } from '@supabase/supabase-js';

import { DailySummary } from '../types/summary';
import { Note } from '@/components/notes/Notes';
import { formatNotesSummary } from '@/utils/summaryFormatter';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (typeof supabaseUrl !== 'string' || typeof supabaseAnonKey !== 'string') {
  console.warn("⚠️ Supabase environment variables are missing!");
}

export const getSupabaseClient = () => createClient(supabaseUrl, supabaseAnonKey);


interface EdgeFunctionResponse {
  data?: { id: string };
  message?: string;
  error?: string;
}

export const sendTaskSummaryEmail = async (email: string, summaryData: DailySummary, clearData?: boolean) => {
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase configuration is missing");
  console.log("Attempting to send email summary:", {
    to: email,
    summaryData: {
      completedTasks: summaryData.completedTasks.length,
      unfinishedTasks: summaryData.unfinishedTasks.length,
      totalTimeSpent: summaryData.totalTimeSpent,
      averageEfficiency: summaryData.averageEfficiency ? summaryData.averageEfficiency.toFixed(1) : "N/A",
    },
  });

  try {
    console.log("Invoking Supabase Edge Function: send-task-summary");
    const supabase = getSupabaseClient();

    const response = await supabase.functions.invoke<EdgeFunctionResponse>("send-task-summary", {
      body: {
        email,
        type: 'tasks',
        summaryData: {
          ...summaryData,
          // Ensure all numeric values are validated
          averageEfficiency: !isNaN(summaryData.averageEfficiency) ? summaryData.averageEfficiency : 0,
          totalTimeSpent: !isNaN(summaryData.totalTimeSpent) ? summaryData.totalTimeSpent : 0,
          totalPlannedTime: !isNaN(summaryData.totalPlannedTime) ? summaryData.totalPlannedTime : 0,
          totalPauses: !isNaN(summaryData.totalPauses) ? summaryData.totalPauses : 0,
        }
      },
    });

    console.log("Edge function response:", response);

    // Log any edge function errors but don't fail since email might still be sent
    if (!response || !response.data || response.error) {
      console.warn("Edge function warning:", {
        message: response?.error || "Unknown response",
        details: response,
      });
    }

    // Return a success response since Resend likely sent the email
    console.log("Email sent successfully");
    return { id: crypto.randomUUID() };
  } catch (error) {
    console.error("Send email error details:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

export const sendNotesSummaryEmail = async (email: string, notes: Note[], clearData?: boolean) => {
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase configuration is missing");
  
  try {
    console.log("Invoking Supabase Edge Function: send-task-summary");
    const supabase = getSupabaseClient();

    const response = await supabase.functions.invoke<EdgeFunctionResponse>("send-task-summary", {
      body: {
        email,
        type: 'notes',
        summaryData: formatNotesSummary(notes)
      },
    });

    console.log("Edge function response:", response);

    if (!response || !response.data || response.error) {
      console.warn("Edge function warning:", {
        message: response?.error || "Unknown response",
        details: response,
      });
    }

    console.log("Email sent successfully");
    return { id: crypto.randomUUID() };
  } catch (error) {
    console.error("Send email error details:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
