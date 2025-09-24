import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, ExternalLink, Search, Filter, Lock, Unlock, Timer } from "lucide-react"

// Mock escrow data
const escrowStats = [
  {
    title: "Total Locked",
    value: "18.4500",
    usdValue: "$18,450",
    icon: Lock,
    color: "text-primary",
  },
  {
    title: "Active Contracts",
    value: "6",
    change: "+2 this week",
    icon: Shield,
    color: "text-accent",
  },
  {
    title: "Pending Releases",
    value: "3",
    change: "2 due today",
    icon: Timer,
    color: "text-yellow-500",
  },
  {
    title: "Released This Month",
    value: "12.8000",
    usdValue: "$12,800",
    icon: Unlock,
    color: "text-accent",
  },
]

const activeContracts = [
  {
    id: "0x1234...5678",
    project: "E-commerce Website Development",
    client: "TechCorp Inc.",
    freelancer: "John Doe",
    amount: "5.2000",
    usdAmount: "$5,200",
    status: "Active",
    statusColor: "bg-primary",
    progress: 65,
    autoReleaseDate: "Dec 22, 2024",
    milestones: {
      completed: 1,
      total: 3,
    },
    lastActivity: "2 hours ago",
  },
  {
    id: "0x2345...6789",
    project: "Mobile App UI/UX Design",
    client: "StartupXYZ",
    freelancer: "Jane Smith",
    amount: "3.8000",
    usdAmount: "$3,800",
    status: "Pending Release",
    statusColor: "bg-yellow-500",
    progress: 100,
    autoReleaseDate: "Dec 15, 2024",
    milestones: {
      completed: 2,
      total: 2,
    },
    lastActivity: "1 day ago",
  },
  {
    id: "0x3456...7890",
    project: "WordPress Plugin Development",
    client: "RetailCorp",
    freelancer: "Mike Johnson",
    amount: "1.8000",
    usdAmount: "$1,800",
    status: "Disputed",
    statusColor: "bg-destructive",
    progress: 80,
    autoReleaseDate: "Dec 20, 2024",
    milestones: {
      completed: 2,
      total: 3,
    },
    lastActivity: "3 days ago",
  },
]

const completedContracts = [
  {
    id: "0x4567...8901",
    project: "Brand Identity Package",
    client: "Creative Agency",
    freelancer: "Sarah Wilson",
    amount: "2.5000",
    usdAmount: "$2,500",
    completedDate: "Dec 5, 2024",
    duration: "14 days",
    rating: 5,
  },
  {
    id: "0x5678...9012",
    project: "React Dashboard",
    client: "DataTech Solutions",
    freelancer: "Alex Chen",
    amount: "4.2000",
    usdAmount: "$4,200",
    completedDate: "Nov 28, 2024",
    duration: "21 days",
    rating: 4.8,
  },
]

export default function EscrowPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Header />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Escrow Contracts</h1>
            <p className="text-muted-foreground">Manage your secure payment contracts and track fund releases</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {escrowStats.map((stat, index) => (
              <Card key={index} className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                    {stat.title.includes("ETH") || stat.title.includes("Locked") || stat.title.includes("Released")
                      ? " ETH"
                      : ""}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.usdValue || stat.change || "Smart contract secured"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="active">Active Contracts</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="create">Create New</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search contracts..." className="pl-10 bg-muted/50" />
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending Release</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              {/* Active Contracts */}
              <div className="space-y-4">
                {activeContracts.map((contract) => (
                  <Card key={contract.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{contract.project}</h3>
                            <Badge className={`${contract.statusColor} text-white`}>{contract.status}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Client: {contract.client}</span>
                            <span>•</span>
                            <span>Freelancer: {contract.freelancer}</span>
                            <span>•</span>
                            <span>Last activity: {contract.lastActivity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-foreground">{contract.amount} ETH</p>
                          <p className="text-sm text-muted-foreground">{contract.usdAmount}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-foreground">{contract.progress}%</span>
                          </div>
                          <Progress value={contract.progress} className="h-2" />
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Milestones</p>
                          <p className="text-sm text-foreground">
                            {contract.milestones.completed} of {contract.milestones.total} completed
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Auto-release</p>
                          <p className="text-sm text-foreground">{contract.autoReleaseDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-border">
                        <code className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                          {contract.id}
                        </code>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                        <div className="flex-1" />
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        {contract.status === "Pending Release" && (
                          <Button size="sm" className="bg-accent hover:bg-accent/90">
                            Release Funds
                          </Button>
                        )}
                        {contract.status === "Disputed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-destructive text-destructive bg-transparent"
                          >
                            Resolve Dispute
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="space-y-4">
                {completedContracts.map((contract) => (
                  <Card key={contract.id} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{contract.project}</h3>
                            <Badge className="bg-accent/20 text-accent">Completed</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Client: {contract.client}</span>
                            <span>•</span>
                            <span>Freelancer: {contract.freelancer}</span>
                            <span>•</span>
                            <span>Duration: {contract.duration}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-foreground">{contract.amount} ETH</p>
                          <p className="text-sm text-muted-foreground">{contract.usdAmount}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4">
                          <code className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            {contract.id}
                          </code>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">Rating:</span>
                            <span className="text-sm text-foreground">★ {contract.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Completed: {contract.completedDate}</span>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Shield className="w-5 h-5" />
                    Create New Escrow Contract
                  </CardTitle>
                  <CardDescription>Set up a secure payment contract for your project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Project Title</label>
                        <Input placeholder="Enter project title..." className="bg-muted/50" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Client Address</label>
                        <Input placeholder="0x..." className="bg-muted/50" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Freelancer Address</label>
                        <Input placeholder="0x..." className="bg-muted/50" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Contract Amount (ETH)</label>
                        <Input type="number" step="0.01" placeholder="0.00" className="bg-muted/50" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Auto-Release Period</label>
                        <Select>
                          <SelectTrigger className="bg-muted/50">
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 days</SelectItem>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="14">14 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Milestone Structure</label>
                        <Select>
                          <SelectTrigger className="bg-muted/50">
                            <SelectValue placeholder="Select structure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single Payment</SelectItem>
                            <SelectItem value="two">Two Milestones</SelectItem>
                            <SelectItem value="three">Three Milestones</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <div className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-lg mb-6">
                      <Shield className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Smart Contract Security</p>
                        <p className="text-sm text-muted-foreground">
                          Funds will be locked in a secure smart contract until project completion or dispute resolution
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button className="flex-1 bg-primary hover:bg-primary/90">
                        <Lock className="w-4 h-4 mr-2" />
                        Create & Deploy Contract
                      </Button>
                      <Button variant="outline" className="bg-transparent">
                        Save as Draft
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
