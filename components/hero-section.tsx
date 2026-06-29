'use client'

import { Calendar } from 'lucide-react'

export function HeroSection() {
  const semesterInfo = {
    semester: 'Fall 2024',
    daysLeft: 45,
    gpa: '3.87',
    coursesCount: 5,
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          Welcome back, Alex
        </h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s your academic performance overview
        </p>
      </div>

      {/* Semester Summary Card */}
      <div className="glass-card rounded-2xl p-8 border border-primary/20 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Current Semester</p>
            <p className="text-2xl font-bold text-foreground mt-2">{semesterInfo.semester}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Days Remaining</p>
            <p className="text-2xl font-bold text-foreground mt-2">{semesterInfo.daysLeft}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Current GPA</p>
            <p className="text-2xl font-bold text-primary mt-2">{semesterInfo.gpa}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">Active Courses</p>
            <p className="text-2xl font-bold text-foreground mt-2">{semesterInfo.coursesCount}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
