"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, BellDotIcon, CalendarDays, Clock, FileText } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import QuickAction from "../QuickAction"
import { useAuth } from "@/context/userContext"
import toast from "react-hot-toast"
import Loader from "@/components/common/Loader"

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium">{`Date: ${label}`}</p>
        <p className="text-sm text-blue-600">{`Words: ${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

// Skeleton loader component for cards
const CardSkeleton = ({ iconBg, iconColor }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      <div className={`p-2 ${iconBg} rounded-full`}>
        <div className={`h-4 w-4 ${iconColor} opacity-50`}></div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-32 animate-pulse"></div>
    </CardContent>
  </Card>
)

export default function OverviewTab() {
  const [recentActivity, setRecentActivity] = useState([])
  const [manuscriptData, setManuscriptData] = useState({})
  const [writingActivity, setWritingActivity] = useState([])
  const [selectedDays, setSelectedDays] = useState("7")
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(false)

  useEffect(() => {
    if (!token) return
    const fetchActivities = async () => {
      setLoading(true)
      try {
        const response = await fetch(`https://apis.manuscripthq.com/api/recentactivity/user-activities`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        })
        const data = await response.json()
        if (data.status === "success") {
          setRecentActivity(data.data)
        } else {
          toast.error(data.message || "Failed to load activities.")
        }
        setLoading(false)
      } catch (error) {
        toast.error("Failed to load activities.")
        console.error("Error fetching activities:", error)
        setLoading(false)
      }
    }
    fetchActivities()
  }, [token])

  useEffect(() => {
    if (!token) return
    const fetchCounts = async () => {
      setStatsLoading(true)
      try {
        const response = await fetch(`https://apis.manuscripthq.com/api/section/get/dashboardCount`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        })
        const data = await response.json()
        if (data.status === "success") {
          setManuscriptData(data.data)
        } else {
          toast.error(data.message || "Failed to load counts.")
        }
        setStatsLoading(false)
      } catch (error) {
        toast.error("Failed to load counts.")
        console.error("Error fetching counts:", error)
        setStatsLoading(false)
      }
    }
    fetchCounts()
  }, [token])

  useEffect(() => {
    if (!token) return
    const fetchWritingActivities = async () => {
      setChartLoading(true)
      try {
        const response = await fetch(
          `https://apis.manuscripthq.com/api/section/get/daily-word-count?days=${selectedDays}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          },
        )
        const data = await response.json()
        if (data.status === "success") {
          // Format the data for the chart
          const formattedData = data.data
            .map((item) => ({
              date: new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              wordCount: item.wordCount,
              fullDate: item.date,
            }))
            .reverse() // Reverse to show chronological order
          setWritingActivity(formattedData)
        } else {
          toast.error(data.message || "Failed to load writing activity.")
        }
        setChartLoading(false)
      } catch (error) {
        toast.error("Failed to load writing activity.")
        console.error("Error fetching writing activity:", error)
        setChartLoading(false)
      }
    }
    fetchWritingActivities()
  }, [token, selectedDays])

  const handleDaysChange = (value) => {
    setSelectedDays(value)
  }

  return (
    <Tabs defaultValue="overview">
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsLoading ? (
            <>
              <CardSkeleton iconBg="bg-blue-100" iconColor="text-blue-600" />
              <CardSkeleton iconBg="bg-green-100" iconColor="text-green-600" />
              <CardSkeleton iconBg="bg-orange-100" iconColor="text-orange-600" />
              <CardSkeleton iconBg="bg-purple-100" iconColor="text-purple-600" />
            </>
          ) : (
            <>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Manuscripts</CardTitle>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{manuscriptData.manuscriptCount || 0}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {manuscriptData.manuscriptCount === 1 ? "manuscript" : "manuscripts"} in progress
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Words Written</CardTitle>
                  <div className="p-2 bg-green-100 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-green-600"
                    >
                      <path d="M16 18V6m-8 6v6M8 6v4" />
                    </svg>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {(manuscriptData.totalWordCount || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Total words across all manuscripts</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Writing Streak</CardTitle>
                  <div className="p-2 bg-orange-100 rounded-full">
                    <CalendarDays className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">{manuscriptData.writingStreak || 0}</span>
                    <span className="text-sm font-medium text-gray-600">
                      {manuscriptData.writingStreak === 1 ? "day" : "days"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {manuscriptData.writingStreak > 0 ? "Keep it up!" : "Start your streak today!"}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Writing Time</CardTitle>
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">{manuscriptData.totalWritingTime || 0}</span>
                    <span className="text-sm font-medium text-gray-600">min</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {manuscriptData.totalWritingTime > 60
                      ? `${Math.floor((manuscriptData.totalWritingTime || 0) / 60)}h ${(manuscriptData.totalWritingTime || 0) % 60}m total`
                      : "Total writing time"}
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Writing Activity</CardTitle>
                  <CardDescription>Your daily word count for the past {selectedDays} days</CardDescription>
                </div>
                <Select value={selectedDays} onValueChange={handleDaysChange}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Days" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="15">15 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {chartLoading ? (
                <div className="h-[200px] flex items-center justify-center">
                  <Loader />
                </div>
              ) : writingActivity.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                    <p>No writing activity data available</p>
                  </div>
                </div>
              ) : (
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={writingActivity} >
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#6b7280" }}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="wordCount"
                        fill="#eaa8f9"
                        radius={[4, 4, 0, 0]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent writing activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="h-[200px] flex items-center justify-center">
                  <Loader />
                </div>
                ) : recentActivity.length === 0 ? (
                  <div className="flex justify-center items-center text-center text-muted-foreground">
                    <p>No recent activities found.</p>
                  </div>
                ) : (
                  recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full">
                          <BellDotIcon className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.manuscriptTitle} • {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <QuickAction />
      </TabsContent>
    </Tabs>
  )
}
