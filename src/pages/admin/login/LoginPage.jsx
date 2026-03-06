import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Loader2, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")
  const navigate                = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    if (!email.trim() || !password) return
    setLoading(true)
    setError("")

    const { error: authError } = await supabase.auth.signInWithPassword({
      email:    email.trim(),
      password,
    })

    if (authError) {
      setError("Invalid email or password.")
      setLoading(false)
      return
    }

    navigate("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm">

        {/* Logo / Header */}
        <div className="text-center mb-8">
          <img
            src="/mekal_logo.png"
            alt="Mekal Enterprises"
            className="h-14 w-auto object-contain mx-auto mb-4"
            onError={e => { e.target.style.display = "none" }}
          />
          <h1 className="text-2xl font-bold text-zinc-900">Admin Login</h1>
          <p className="text-sm text-zinc-500 mt-1">Sign in to manage your store</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-9"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-9"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full mt-2"
              style={{ backgroundColor: "#065999" }}
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin mr-2" />Signing in…</>
                : "Sign In"}
            </Button>

          </form>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-6">
          Admin access only — contact your administrator for access.
        </p>
      </div>
    </div>
  )
}