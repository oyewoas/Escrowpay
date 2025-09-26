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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Filter,
  Calendar,
  DollarSign,
  User,
  Clock,
  Shield,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useEscrow } from "@/context/escrow-context";
import { useAccount } from "wagmi";
import { web3Utils } from "@/lib/smart-contracts";
import { useToast } from "@/hooks/use-toast";

export default function JobsPage() {
  const { address, isConnected } = useAccount();
  const {
    jobs,
    userJobs,
    activeJobs,
    totalJobs,
    isLoading,
    refreshJobs,
    releaseJob,
    refundJob,
  } = useEscrow();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [availableSearchTerm, setAvailableSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // useEffect(() => {
  //   if (isConnected) {
  //     refreshJobs();
  //   }
  // }, [isConnected, refreshJobs]);

  // Helper function to get job status
  console.log("Jobs", jobs, userJobs, activeJobs);
  const getJobStatus = (job: any) => {
    if (job.isCompleted) return { status: "Completed", color: "bg-accent" };
    if (job.isRefunded) return { status: "Refunded", color: "bg-destructive" };
    return { status: "Active", color: "bg-primary" };
  };

  // Helper function to get client avatar
  const getClientAvatar = (address: string) => {
    return address.slice(2, 4).toUpperCase();
  };

  // Filter user jobs
  const filteredUserJobs = userJobs.filter((job) => {
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

  // Handle job actions
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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Header />

        <main className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Jobs</h1>
              <p className="text-muted-foreground">
                Manage your freelance projects and find new opportunities
              </p>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/jobs/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Proposal
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="my-jobs" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
              <TabsTrigger value="available">Available Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="my-jobs" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search your jobs..."
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

              {/* Jobs Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">
                      Loading your jobs...
                    </p>
                  </div>
                ) : filteredUserJobs.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No jobs found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {!isConnected
                        ? "Connect your wallet to view your jobs"
                        : "Create your first escrow job to get started"}
                    </p>
                  </div>
                ) : (
                  filteredUserJobs.map((job) => {
                    const jobStatus = getJobStatus(job);
                    return (
                      <Card
                        key={job.jobId}
                        className="bg-card border-border hover:border-primary/50 transition-colors"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium">
                                  {getClientAvatar(job.client)}
                                </span>
                              </div>
                              <div>
                                <CardTitle className="text-lg text-foreground">
                                  Job #{job.jobId}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                  <User className="w-3 h-3" />
                                  Client: {web3Utils.formatAddress(job.client)}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge className={`${jobStatus.color} text-white`}>
                              {jobStatus.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              <strong>Freelancer:</strong>{" "}
                              {web3Utils.formatAddress(job.freelancer)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <strong>Duration:</strong> {job.duration} seconds
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-semibold text-foreground">
                                {job.amount} ETH
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Shield className="w-4 h-4" />
                              <span>Smart Contract</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-border">
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

                            {!job.isCompleted &&
                              !job.isRefunded &&
                              address === job.client && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-accent hover:bg-accent/90"
                                    onClick={() => handleReleaseJob(job.jobId)}
                                    disabled={isLoading}
                                  >
                                    Release
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-destructive text-destructive"
                                    onClick={() => handleRefundJob(job.jobId)}
                                    disabled={isLoading}
                                  >
                                    Refund
                                  </Button>
                                </>
                              )}

                            {!job.isCompleted &&
                              !job.isRefunded &&
                              address === job.freelancer && (
                                <Button size="sm" variant="outline">
                                  Update Status
                                </Button>
                              )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>

            <TabsContent value="available" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search available jobs..."
                    className="pl-10 bg-muted/50"
                    value={availableSearchTerm}
                    onChange={(e) => setAvailableSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="active">Active Jobs</SelectItem>
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

              {/* Available Jobs */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Loading available jobs...
                    </p>
                  </div>
                ) : activeJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      No active jobs available
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Check back later for new opportunities
                    </p>
                  </div>
                ) : (
                  activeJobs
                    .filter(
                      (job) =>
                        // Filter out user's own jobs and apply search
                        job.client !== address &&
                        job.freelancer !== address &&
                        (availableSearchTerm === "" ||
                          job.jobId
                            .toLowerCase()
                            .includes(availableSearchTerm.toLowerCase()) ||
                          job.client
                            .toLowerCase()
                            .includes(availableSearchTerm.toLowerCase()) ||
                          job.freelancer
                            .toLowerCase()
                            .includes(availableSearchTerm.toLowerCase()))
                    )
                    .map((job) => {
                      const jobStatus = getJobStatus(job);
                      return (
                        <Card
                          key={job.jobId}
                          className="bg-card border-border hover:border-primary/50 transition-colors"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium">
                                    {getClientAvatar(job.client)}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground">
                                    Job #{job.jobId}
                                  </h3>
                                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <User className="w-3 h-3" />
                                    Client:{" "}
                                    {web3Utils.formatAddress(job.client)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-foreground">
                                  {job.amount} ETH
                                </p>
                                <Badge
                                  className={`${jobStatus.color} text-white text-xs`}
                                >
                                  {jobStatus.status}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4">
                              <p className="text-sm text-muted-foreground">
                                <strong>Freelancer:</strong>{" "}
                                {web3Utils.formatAddress(job.freelancer)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <strong>Duration:</strong> {job.duration}{" "}
                                seconds
                              </p>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-1">
                                <Shield className="w-4 h-4" />
                                <span>Smart Contract Secured</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>Funds in Escrow</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-border">
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

                              <Link href={`/jobs/${job.jobId}/proposal`}>
                                <Button
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
