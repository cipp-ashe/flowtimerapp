import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from './utils';
import { formatTaskSummaryEmail, formatNotesSummaryEmail } from './utils';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_ANON_KEY') || ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, type, summaryData } = await req.json();
    console.log('Summary data:', JSON.stringify(summaryData, null, 2));

    const emailHtml = type === 'notes' 
      ? formatNotesSummaryEmail(summaryData)
      : formatTaskSummaryEmail(summaryData);

    const { error } = await supabase.functions.invoke('send-email', {
      method: 'POST',
      body: { 
        to: email,
        subject: type === 'notes' ? 'Your Notes Summary' : 'Your Daily Task Summary',
        html: emailHtml 
      }
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
