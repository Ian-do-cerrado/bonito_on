"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

export default function TestIntegrationsPage() {
  const [supabaseLoading, setSupabaseLoading] = useState(false)
  const [supabaseResult, setSupabaseResult] = useState<any>(null)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendResult, setResendResult] = useState<any>(null)
  const [email, setEmail] = useState("")

  const handleSupabaseTest = async () => {
    setSupabaseLoading(true)
    try {
      const res = await fetch("/api/test-supabase")
      const data = await res.json()
      setSupabaseResult(data)
    } catch (error) {
      setSupabaseResult({ success: false, error: String(error) })
    } finally {
      setSupabaseLoading(false)
    }
  }

  const handleResendTest = async () => {
    if (!email) {
      setResendResult({ success: false, error: "Please enter an email address" })
      return
    }

    setResendLoading(true)
    try {
      const res = await fetch("/api/test-resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      setResendResult(data)
    } catch (error) {
      setResendResult({ success: false, error: String(error) })
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Integration Tests</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Test</CardTitle>
            <CardDescription>Test your Supabase database connection and data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSupabaseTest} disabled={supabaseLoading} className="w-full mb-4">
              {supabaseLoading ? "Testing..." : "Test Supabase Connection"}
            </Button>

            {supabaseResult && (
              <div className="mt-4 space-y-4">
                <Alert variant={supabaseResult.success ? "default" : "destructive"}>
                  <div className="flex items-center gap-2">
                    {supabaseResult.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    <AlertTitle>{supabaseResult.success ? "Success" : "Error"}</AlertTitle>
                  </div>
                  <AlertDescription>{supabaseResult.message}</AlertDescription>
                </Alert>

                {supabaseResult.environment && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Environment Variables:</h3>
                    <ul className="space-y-1">
                      <li>Supabase URL: {supabaseResult.environment.supabaseUrl}</li>
                      <li>Supabase Key: {supabaseResult.environment.supabaseKey}</li>
                    </ul>
                  </div>
                )}

                {supabaseResult.availableTables && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Available Tables:</h3>
                    {supabaseResult.availableTables.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {supabaseResult.availableTables.map((table: string, i: number) => (
                          <li key={i}>{table}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-red-500">No tables found</p>
                    )}
                  </div>
                )}

                {supabaseResult.errors && supabaseResult.errors.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Errors:</h3>
                    <ul className="list-disc pl-5 text-red-500">
                      {supabaseResult.errors.map((error: string, i: number) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {supabaseResult.data && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Data Preview:</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Tours: {supabaseResult.counts.tours}</h4>
                        {supabaseResult.data.tours && supabaseResult.data.tours.length > 0 ? (
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                            {JSON.stringify(supabaseResult.data.tours, null, 2)}
                          </pre>
                        ) : (
                          <p className="text-amber-500">No tour data found</p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium">Packages: {supabaseResult.counts.packages}</h4>
                        {supabaseResult.data.packages && supabaseResult.data.packages.length > 0 ? (
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                            {JSON.stringify(supabaseResult.data.packages, null, 2)}
                          </pre>
                        ) : (
                          <p className="text-amber-500">No package data found</p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium">Attractions: {supabaseResult.counts.attractions}</h4>
                        {supabaseResult.data.attractions && supabaseResult.data.attractions.length > 0 ? (
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                            {JSON.stringify(supabaseResult.data.attractions, null, 2)}
                          </pre>
                        ) : (
                          <p className="text-amber-500">No attraction data found</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resend Test</CardTitle>
            <CardDescription>Test your email sending capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Test Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full p-2 border rounded"
                />
              </div>

              <Button onClick={handleResendTest} disabled={resendLoading || !email} className="w-full">
                {resendLoading ? "Sending..." : "Send Test Email"}
              </Button>

              {resendResult && (
                <Alert variant={resendResult.success ? "default" : "destructive"} className="mt-4">
                  <div className="flex items-center gap-2">
                    {resendResult.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    <AlertTitle>{resendResult.success ? "Success" : "Error"}</AlertTitle>
                  </div>
                  <AlertDescription>{resendResult.message || resendResult.error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
