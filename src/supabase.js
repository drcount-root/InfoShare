import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ftpdlpdvtowizakkrnxh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cGRscGR2dG93aXpha2tybnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA5NDQ3MDAsImV4cCI6MTk4NjUyMDcwMH0.u_CYulUzEScT1Ab2otctCwY-9Wm6wuYn4av4FAmLl6M";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
