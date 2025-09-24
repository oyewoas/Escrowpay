"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import Link from "next/link"

export default function CreateJobPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [skills, setSkills] = useState<string[]>(["React", "Node.js"])
  const [newSkill, setNewSkill] = useState("")

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 md:ml-64">
        <Header />

        <main className="p-6">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/jobs">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Create New Job</h1>
                <p className="text-muted-foreground">Post a new project and find the perfect freelancer</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <form className="space-y-8">
              {/* Basic Information */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Basic Information</CardTitle>
                  <CardDescription>Provide the essential details about your project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input id="title" placeholder="e.g., E-commerce Website Development" className="bg-muted/50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Web Development</SelectItem>
                        <SelectItem value="mobile">Mobile Development</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="writing">Writing & Content</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Project Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project in detail. Include requirements, expectations, and any specific technologies or tools needed..."
                      rows={6}
                      className="bg-muted/50"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Budget and Timeline */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Budget & Timeline</CardTitle>
                  <CardDescription>Set your budget and project timeline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="budgetType">Budget Type *</Label>
                      <Select>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Select budget type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Price</SelectItem>
                          <SelectItem value="hourly">Hourly Rate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Amount (ETH) *</Label>
                      <Input id="budget" type="number" step="0.01" placeholder="0.00" className="bg-muted/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Project Deadline *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal bg-muted/50">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Estimated Duration</Label>
                      <Select>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-week">Less than 1 week</SelectItem>
                          <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                          <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                          <SelectItem value="1-2-months">1-2 months</SelectItem>
                          <SelectItem value="2-6-months">2-6 months</SelectItem>
                          <SelectItem value="6-months-plus">6+ months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills and Requirements */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Skills & Requirements</CardTitle>
                  <CardDescription>Specify the skills and experience needed for this project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Required Skills *</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill..."
                        className="bg-muted/50"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" onClick={addSkill} size="icon" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level *</Label>
                    <Select>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Additional Requirements</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Any specific requirements, certifications, or preferences..."
                      rows={3}
                      className="bg-muted/50"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Escrow Settings */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Escrow Settings</CardTitle>
                  <CardDescription>Configure payment and escrow terms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="milestones">Payment Milestones</Label>
                      <Select>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Select milestone structure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single Payment (100% on completion)</SelectItem>
                          <SelectItem value="two">Two Milestones (50% / 50%)</SelectItem>
                          <SelectItem value="three">Three Milestones (33% / 33% / 34%)</SelectItem>
                          <SelectItem value="custom">Custom Milestones</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="autoRelease">Auto-Release Period</Label>
                      <Select>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Select auto-release period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="terms">Escrow Terms</Label>
                    <Textarea
                      id="terms"
                      placeholder="Specify any additional terms for the escrow contract..."
                      rows={3}
                      className="bg-muted/50"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <Button variant="outline" asChild>
                  <Link href="/jobs">Cancel</Link>
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Post Job
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
