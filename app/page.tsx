"use client";
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
import {
  DollarSign,
  Shield,
  Clock,
  TrendingUp,
  Briefcase,
  Users,
  AlertTriangle,
} from "lucide-react";
import React from "react";

// Mock data
const stats = [
  {
    title: "Total Escrow Value",
    value: "$24,580",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-accent",
  },
  {
    title: "Active Contracts",
    value: "8",
    change: "+2",
    icon: Shield,
    color: "text-primary",
  },
  {
    title: "Pending Releases",
    value: "3",
    change: "2 due today",
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    title: "Success Rate",
    value: "98.5%",
    change: "+0.5%",
    icon: TrendingUp,
    color: "text-accent",
  },
];

const recentJobs = [
  {
    id: "1",
    title: "E-commerce Website Development",
    client: "TechCorp Inc.",
    amount: "$5,200",
    status: "In Progress",
    dueDate: "Dec 15, 2024",
    statusColor: "bg-primary",
  },
  {
    id: "2",
    title: "Mobile App UI/UX Design",
    client: "StartupXYZ",
    amount: "$3,800",
    status: "Review",
    dueDate: "Dec 10, 2024",
    statusColor: "bg-yellow-500",
  },
  {
    id: "3",
    title: "Brand Identity Package",
    client: "Creative Agency",
    amount: "$2,500",
    status: "Completed",
    dueDate: "Dec 5, 2024",
    statusColor: "bg-accent",
  },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Header />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your escrow activity.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Jobs */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Briefcase className="w-5 h-5" />
                  Recent Jobs
                </CardTitle>
                <CardDescription>
                  Your latest freelance projects and their status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">
                        {job.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {job.client}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {job.dueDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {job.amount}
                      </p>
                      <Badge
                        className={`${job.statusColor} text-white text-xs`}
                      >
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                >
                  View All Jobs
                </Button>
              </CardContent>
            </Card>
            {/* Quick Actions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Shield className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common tasks and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        Payment Due
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 contracts need client approval
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        New Client
                      </p>
                      <p className="text-xs text-muted-foreground">
                        StartupABC wants to hire you
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Create New Contract
                  </Button>
                </div>
              </CardContent>
            </Card>
            0x303D4863df86497cF36F8F9076450980283307E1{" "}
          </div>
        </main>
      </div>
    </div>
  );
}

// export default function ConnectButton() {
//

//   return (
//     <>
//       <button>Open Connect Modal</button>
//       <w3m-button />

//       {isConnected && (
//         <div>
//           <p>You are now connected to the wallet. Address: {address}</p>
//           <w3m-network-button />
//         </div>
//       )}
//     </>
//   );
// }
