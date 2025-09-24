"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { escrowService, web3Utils } from "@/lib/smart-contracts"
import { TestTube, Wallet, Send, CheckCircle, XCircle, Clock, AlertTriangle, Network, Copy } from "lucide-react"

export default function ContractTestingPage() {
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [currentAccount, setCurrentAccount] = useState("")
  const [currentNetwork, setCurrentNetwork] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Test data states
  const [createEscrowData, setCreateEscrowData] = useState({
    freelancer: "",
    amount: "",
    deadline: "",
    description: "",
  })

  const [escrowId, setEscrowId] = useState("")
  const [escrowDetails, setEscrowDetails] = useState<any>(null)
  const [testResults, setTestResults] = useState<any[]>([])

  useEffect(() => {
    checkConnection()
    setupEventListeners()
  }, [])

  const checkConnection = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0])
          setIsConnected(true)

          const network = await escrowService.getCurrentNetwork()
          setCurrentNetwork(network)
        }
      }
    } catch (error) {
      console.error("[v0] Failed to check connection:", error)
    }
  }

  const connectWallet = async () => {
    try {
      setLoading(true)
      await escrowService.initializeProvider()
      await checkConnection()

      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const setupEventListeners = () => {
    escrowService.setupEventListeners()
  }

  const addTestResult = (test: string, success: boolean, data?: any, error?: string) => {
    const result = {
      id: Date.now(),
      test,
      success,
      data,
      error,
      timestamp: new Date().toLocaleTimeString(),
    }
    setTestResults((prev) => [result, ...prev])
  }

  const testCreateEscrow = async () => {
    if (
      !createEscrowData.freelancer ||
      !createEscrowData.amount ||
      !createEscrowData.deadline ||
      !createEscrowData.description
    ) {
      toast({
        title: "Missing Data",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const deadline = Math.floor(new Date(createEscrowData.deadline).getTime() / 1000)

      const result = await escrowService.createEscrow(
        createEscrowData.freelancer,
        createEscrowData.amount,
        deadline,
        createEscrowData.description,
      )

      addTestResult("Create Escrow", true, result)
      setEscrowId(result.escrowId)

      toast({
        title: "Escrow Created",
        description: `Escrow ID: ${result.escrowId}`,
      })
    } catch (error: any) {
      addTestResult("Create Escrow", false, null, error.message)
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const testGetEscrowDetails = async () => {
    if (!escrowId) {
      toast({
        title: "Missing Escrow ID",
        description: "Please enter an escrow ID",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const details = await escrowService.getEscrowDetails(escrowId)
      setEscrowDetails(details)
      addTestResult("Get Escrow Details", true, details)

      toast({
        title: "Details Retrieved",
        description: "Escrow details loaded successfully",
      })
    } catch (error: any) {
      addTestResult("Get Escrow Details", false, null, error.message)
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const testReleaseFunds = async () => {
    if (!escrowId) {
      toast({
        title: "Missing Escrow ID",
        description: "Please enter an escrow ID",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const result = await escrowService.releaseFunds(escrowId)
      addTestResult("Release Funds", true, { transactionHash: result.transactionHash })

      toast({
        title: "Funds Released",
        description: "Transaction submitted successfully",
      })
    } catch (error: any) {
      addTestResult("Release Funds", false, null, error.message)
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <TestTube className="h-8 w-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">Smart Contract Testing</h1>
          <p className="text-muted-foreground">Test all contract functions through your frontend interface</p>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Wallet Status</p>
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <Badge variant="default" className="bg-green-500">
                      Connected
                    </Badge>
                    <span className="text-sm text-muted-foreground">{web3Utils.formatAddress(currentAccount)}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(currentAccount)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Badge variant="destructive">Disconnected</Badge>
                )}
              </div>
            </div>
            {!isConnected && (
              <Button onClick={connectWallet} disabled={loading}>
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>

          {currentNetwork && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Network</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {currentNetwork.name} (Chain ID: {currentNetwork.chainId})
                </Badge>
                {currentNetwork.chainId !== 42161 && currentNetwork.chainId !== 421614 && (
                  <Button variant="outline" size="sm" onClick={() => escrowService.switchToArbitrum()}>
                    Switch to Arbitrum
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Testing Interface */}
      <Tabs defaultValue="create" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create Escrow</TabsTrigger>
          <TabsTrigger value="query">Query Escrow</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Escrow</CardTitle>
              <CardDescription>Test creating a new escrow contract</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freelancer">Freelancer Address</Label>
                  <Input
                    id="freelancer"
                    placeholder="0x..."
                    value={createEscrowData.freelancer}
                    onChange={(e) => setCreateEscrowData((prev) => ({ ...prev, freelancer: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (ETH)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.001"
                    placeholder="0.1"
                    value={createEscrowData.amount}
                    onChange={(e) => setCreateEscrowData((prev) => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={createEscrowData.deadline}
                  onChange={(e) => setCreateEscrowData((prev) => ({ ...prev, deadline: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the project..."
                  value={createEscrowData.description}
                  onChange={(e) => setCreateEscrowData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <Button onClick={testCreateEscrow} disabled={loading || !isConnected} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Create Escrow Contract
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="query" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Query Escrow Details</CardTitle>
              <CardDescription>Get details of an existing escrow contract</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Enter Escrow ID" value={escrowId} onChange={(e) => setEscrowId(e.target.value)} />
                <Button onClick={testGetEscrowDetails} disabled={loading || !isConnected}>
                  Query Details
                </Button>
              </div>

              {escrowDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Escrow Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Client</p>
                        <p className="text-muted-foreground">{web3Utils.formatAddress(escrowDetails.client)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Freelancer</p>
                        <p className="text-muted-foreground">{web3Utils.formatAddress(escrowDetails.freelancer)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Amount</p>
                        <p className="text-muted-foreground">{web3Utils.formatEth(escrowDetails.amount)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Status</p>
                        <Badge variant={escrowDetails.status === 0 ? "default" : "secondary"}>
                          {escrowDetails.status === 0 ? "Active" : "Completed"}
                        </Badge>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="font-medium mb-1">Description</p>
                      <p className="text-sm text-muted-foreground">{escrowDetails.description}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Deadline</p>
                      <p className="text-sm text-muted-foreground">{escrowDetails.deadline.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Release Funds</CardTitle>
                <CardDescription>Release escrowed funds to the freelancer</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={testReleaseFunds} disabled={loading || !isConnected || !escrowId} className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Release Funds
                </Button>
              </CardContent>
            </Card>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Make sure you have sufficient ETH for gas fees and that you're connected to the correct network.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>History of all contract function tests</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No tests run yet</p>
              ) : (
                <div className="space-y-3">
                  {testResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium">{result.test}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {result.timestamp}
                        </div>
                      </div>

                      {result.success && result.data && (
                        <div className="text-sm bg-green-50 dark:bg-green-950 p-2 rounded">
                          <pre className="whitespace-pre-wrap">{JSON.stringify(result.data, null, 2)}</pre>
                        </div>
                      )}

                      {!result.success && result.error && (
                        <div className="text-sm bg-red-50 dark:bg-red-950 p-2 rounded text-red-700 dark:text-red-300">
                          {result.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
