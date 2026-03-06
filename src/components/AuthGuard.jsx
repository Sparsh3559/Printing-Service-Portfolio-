import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function AuthGuard({ children }) {
  const [session, setSession] = useState(undefined) // undefined = still loading

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    // Listen for login / logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Still checking — show a centered spinner
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 size={24} className="animate-spin text-zinc-300" />
      </div>
    )
  }

  // Not logged in — redirect to login
  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  // Logged in — render the page
  return children
}