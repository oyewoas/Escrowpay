import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Filter, Calendar, DollarSign, User, Clock } from "lucide-react"

// Mock data for jobs
const jobs = [
  {
    id: "1",
    title: "E-commerce Website Development",
    description: "Build a modern e-commerce platform with React and Node.js",
    client: "TechCorp Inc.",
    clientAvatar: "TC",
    amount: "$5,200",
    status: "In Progress",
    statusColor: "bg-primary",
    deadline: "Dec 15, 2024",
    progress: 65,
    skills: ["React", "Node.js", "MongoDB"],
    postedDate: "Nov 20, 2024",
  },
  {
    id: "2",
    title: "Mobile App UI/UX Design",
    description: "Design user interface and experience for a fitness tracking mobile app",
    client: "StartupXYZ",
    clientAvatar: "SX",
    amount: "$3,800",
    status: "Review",
    statusColor: "bg-yellow-500",
    deadline: "Dec 10, 2024",
    progress: 90,
    skills: ["Figma", "UI/UX", "Mobile Design"],
    postedDate: "Nov 15, 2024",
  },
  {
    id: "3",
    title: "Brand Identity Package",
    description: "Complete brand identity including logo, colors, and guidelines",
    client: "Creative Agency",
    clientAvatar: "CA",
    amount: "$2,500",
    status: "Completed",
    statusColor: "bg-accent",
    deadline: "Dec 5, 2024",
    progress: 100,
    skills: ["Branding", "Logo Design", "Adobe Creative"],
    postedDate: "Nov 10, 2024",
  },
  {
    id: "4",
    title: "WordPress Plugin Development",
    description: "Custom WordPress plugin for inventory management",
    client: "RetailCorp",
    clientAvatar: "RC",
    amount: "$1,800",
    status: "Proposal",
    statusColor: "bg-blue-500",
    deadline: "Dec 20, 2024",
    progress: 0,
    skills: ["WordPress", "PHP", "MySQL"],
    postedDate: "Nov 25, 2024",
  },
]

const availableJobs = [
  {
    id: "5",
    title: "React Dashboard Development",
    description: "Build an analytics dashboard with charts and real-time data",
    client: "DataTech Solutions",
    clientAvatar: "DT",
    budget: "$4,000 - $6,000",
    deadline: "Jan 15, 2025",
    skills: ["React", "D3.js", "TypeScript"],
    postedDate: "2 hours ago",
    proposals: 12,
  },
  {
    id: "6",
    title: "Logo Design for Tech Startup",
    description: "Modern, minimalist logo design for AI-focused startup",
    client: "AI Innovations",
    clientAvatar: "AI",
    budget: "$800 - $1,200",
    deadline: "Dec 30, 2024",
    skills: ["Logo Design", "Branding", "Illustrator"],
    postedDate: "5 hours ago",
    proposals: 8,
  },
]

export default function JobsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Header />

        <main className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Jobs</h1>
              <p className="text-muted-foreground">Manage your freelance projects and find new opportunities</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Proposal
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
                  <Input placeholder="Search your jobs..." className="pl-10 bg-muted/50" />
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              {/* Jobs Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <Card key={job.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{job.clientAvatar}</span>
                          </div>
                          <div>
                            <CardTitle className="text-lg text-foreground">{job.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <User className="w-3 h-3" />
                              {job.client}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={`${job.statusColor} text-white`}>{job.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{job.description}</p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-foreground">{job.amount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {job.deadline}
                        </div>
                      </div>

                      {job.progress > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-foreground">{job.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Message Client
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="available" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search available jobs..." className="pl-10 bg-muted/50" />
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              {/* Available Jobs */}
              <div className="space-y-4">
                {availableJobs.map((job) => (
                  <Card key={job.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{job.clientAvatar}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <User className="w-3 h-3" />
                              {job.client}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-foreground">{job.budget}</p>
                          <p className="text-xs text-muted-foreground">{job.proposals} proposals</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">{job.description}</p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Deadline: {job.deadline}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Posted {job.postedDate}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Submit Proposal
                        </Button>
                        <Button size="sm" variant="outline">
                          Save Job
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
