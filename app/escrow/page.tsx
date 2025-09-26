"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  ExternalLink,
  Search,
  Filter,
  Lock,
  Unlock,
  Timer,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { useEscrow } from "@/context/escrow-context";
import { useToast } from "@/hooks/use-toast";
import { web3Utils } from "@/lib/smart-contracts";

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
];

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
];

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
];

export default function EscrowPage() {
  const {
    jobs,
    activeJobs,
    totalJobs,
    isLoading,
    releaseJob,
    refundJob,
    emergencyRefundJob,
    createJob,
    refreshJobs,
  } = useEscrow();
  const { toast } = useToast();

  const [newJobData, setNewJobData] = useState({
    freelancer: "",
    amount: "",
    duration: "7", // days
    description: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // useEffect(() => {
  //   refreshJobs();
  // }, [refreshJobs]);

  const handleCreateJob = async () => {
    if (!newJobData.freelancer || !newJobData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const durationInSeconds = parseInt(newJobData.duration) * 24 * 60 * 60; // Convert days to seconds
      await createJob(
        newJobData.freelancer,
        durationInSeconds,
        newJobData.amount
      );

      toast({
        title: "Job Created",
        description: "New escrow job created successfully",
      });

      // Reset form
      setNewJobData({
        freelancer: "",
        amount: "",
        duration: "7",
        description: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create job",
        variant: "destructive",
      });
    }
  };

  const handleReleaseJob = async (jobId: string) => {
    try {
      await releaseJob(jobId);
      toast({
        title: "Funds Released",
        description: "Funds have been released to the freelancer",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to release funds",
        variant: "destructive",
      });
    }
  };

  const handleRefundJob = async (jobId: string) => {
    try {
      await refundJob(jobId);
      toast({
        title: "Refund Processed",
        description: "Funds have been refunded to the client",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process refund",
        variant: "destructive",
      });
    }
  };

  // Filter jobs based on search and status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.freelancer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !job.isCompleted && !job.isRefunded) ||
      (statusFilter === "completed" && job.isCompleted) ||
      (statusFilter === "refunded" && job.isRefunded);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Header />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Escrow Contracts
            </h1>
            <p className="text-muted-foreground">
              Manage your secure payment contracts and track fund releases
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Jobs
                </CardTitle>
                <Shield className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {totalJobs}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Smart contract secured
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Jobs
                </CardTitle>
                <Lock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {activeJobs.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently running
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed Jobs
                </CardTitle>
                <Unlock className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {jobs.filter((job) => job.isCompleted).length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Successfully finished
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Locked
                </CardTitle>
                <Timer className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {jobs
                    .filter((job) => !job.isCompleted && !job.isRefunded)
                    .reduce((total, job) => total + parseFloat(job.amount), 0)
                    .toFixed(4)}{" "}
                  ETH
                </div>
                <p className="text-xs text-muted-foreground mt-1">In escrow</p>
              </CardContent>
            </Card>
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
                  <Input
                    placeholder="Search contracts..."
                    className="pl-10 bg-muted/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={refreshJobs}
                  disabled={isLoading}
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              {/* Job Contracts */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Loading contracts...
                    </p>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No contracts found</p>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <Card
                      key={job.jobId}
                      className="bg-card border-border hover:border-primary/50 transition-colors"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-foreground">
                                Job #{job.jobId}
                              </h3>
                              <Badge
                                className={`${
                                  job.isCompleted
                                    ? "bg-accent"
                                    : job.isRefunded
                                    ? "bg-destructive"
                                    : "bg-primary"
                                } text-white`}
                              >
                                {job.isCompleted
                                  ? "Completed"
                                  : job.isRefunded
                                  ? "Refunded"
                                  : "Active"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                Client: {web3Utils.formatAddress(job.client)}
                              </span>
                              <span>•</span>
                              <span>
                                Freelancer:{" "}
                                {web3Utils.formatAddress(job.freelancer)}
                              </span>
                              <span>•</span>
                              <span>Duration: {job.duration}s</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-foreground">
                              {job.amount} ETH
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ~${(parseFloat(job.amount) * 2500).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-border">
                          <code className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            {job.jobId}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                          <div className="flex-1" />

                          {!job.isCompleted && !job.isRefunded && (
                            <>
                              <Button
                                size="sm"
                                className="bg-accent hover:bg-accent/90"
                                onClick={() => handleReleaseJob(job.jobId)}
                                disabled={isLoading}
                              >
                                Release Funds
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-destructive text-destructive bg-transparent"
                                onClick={() => handleRefundJob(job.jobId)}
                                disabled={isLoading}
                              >
                                Refund
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
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
                            <h3 className="text-lg font-semibold text-foreground">
                              {contract.project}
                            </h3>
                            <Badge className="bg-accent/20 text-accent">
                              Completed
                            </Badge>
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
                          <p className="text-xl font-bold text-foreground">
                            {contract.amount} ETH
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {contract.usdAmount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4">
                          <code className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            {contract.id}
                          </code>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">
                              Rating:
                            </span>
                            <span className="text-sm text-foreground">
                              ★ {contract.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Completed: {contract.completedDate}
                          </span>
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
                  <CardDescription>
                    Set up a secure payment contract for your project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="freelancer">Freelancer Address *</Label>
                        <Input
                          id="freelancer"
                          placeholder="0x..."
                          className="bg-muted/50"
                          value={newJobData.freelancer}
                          onChange={(e) =>
                            setNewJobData((prev) => ({
                              ...prev,
                              freelancer: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="amount">Contract Amount (ETH) *</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.001"
                          placeholder="0.00"
                          className="bg-muted/50"
                          value={newJobData.amount}
                          onChange={(e) =>
                            setNewJobData((prev) => ({
                              ...prev,
                              amount: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="duration">Duration (Days) *</Label>
                        <Select
                          value={newJobData.duration}
                          onValueChange={(value) =>
                            setNewJobData((prev) => ({
                              ...prev,
                              duration: value,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-muted/50">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day</SelectItem>
                            <SelectItem value="3">3 days</SelectItem>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="14">14 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="description">
                          Description (Optional)
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Brief description of the job..."
                          rows={3}
                          className="bg-muted/50"
                          value={newJobData.description}
                          onChange={(e) =>
                            setNewJobData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <div className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-lg mb-6">
                      <Shield className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">
                          Smart Contract Security
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Funds will be locked in a secure smart contract until
                          project completion or dispute resolution
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={handleCreateJob}
                        disabled={
                          isLoading ||
                          !newJobData.freelancer ||
                          !newJobData.amount
                        }
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        {isLoading ? "Creating..." : "Create & Deploy Contract"}
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-transparent"
                        disabled={isLoading}
                      >
                        Cancel
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
  );
}
