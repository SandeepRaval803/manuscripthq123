// MainChecklist.js

import { useState, useEffect } from "react";
import { useAuth } from "@/context/userContext";
import { useRouter } from "next/router";
import {
  Crown,
  CheckCircle2,
  Target,
  Filter,
  X,
  Clock,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { fetchAllCategories, fetchCategoryDetails } from "@/apiCall/auth";
import Loader from "@/components/common/Loader";

const MainChecklist = () => {
  const { token, user, updateUser } = useAuth();
  const router = useRouter();

  // Sidebar state
  const [loading, setLoading] = useState(false);
  const [taskCategories, setTaskCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [taskCompletedPercentage, setTaskCompletedPercentage] = useState(0);
  const [taskSidebarOpen, setTaskSidebarOpen] = useState(false);

  // Category details state
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [checklistTasks, setChecklistTasks] = useState([]);

  // Fetch all categories for sidebar
  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      setLoading(true);
      const categories = await fetchAllCategories(token, user);
      if (categories.length > 0) {
        const allTasks = categories.flatMap((cat) => cat.checklist);
        const completed = allTasks.filter((task) => task.completed).length;

        setTaskCategories(categories);
        setTotalTasks(allTasks.length);
        setCompletedTasks(completed);
        setTaskCompletedPercentage(
          allTasks.length === 0
            ? 0
            : Math.round((completed / allTasks.length) * 100)
        );

        // Auto-select first category
        handleCategorySelect(categories[0]);
      } else {
        setTaskCategories([]);
        setTotalTasks(0);
        setCompletedTasks(0);
        setTaskCompletedPercentage(0);
      }
      setLoading(false);
    };

    fetchCategories();
  }, [token, user]);

  // Fetch detailed category data when category is selected
  const fetchDetails = async (categoryId) => {
    if (!token || !categoryId || !user?.selectedManuscript) return;

    setCategoryLoading(true);
    const { title, tasks } = await fetchCategoryDetails(
      token,
      user,
      categoryId
    );
    setCategoryTitle(title);
    setChecklistTasks(tasks);
    setCategoryLoading(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchDetails(category.id);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setTaskSidebarOpen(false);
    }
  };
  const subscription = () => {
    router.push("/dashboard/subscription");
  };

  const handleViewTask = (taskId) => {
    router.push(`/dashboard/view-task/${taskId}`);
  };

  const completedDetailTasks = checklistTasks.filter(
    (task) => task.completed
  ).length;
  const totalDetailTasks = checklistTasks.length;
  const detailCompletionPercentage =
    totalDetailTasks > 0
      ? Math.round((completedDetailTasks / totalDetailTasks) * 100)
      : 0;

  return (
    <div className="h-screen bg-slate-50 flex relative">
      <Button
        variant="outline"
        size="sm"
        className="fixed top-20 right-3 z-50 md:hidden bg-white shadow-lg border-primary hover:bg-primary/5"
        onClick={() => setTaskSidebarOpen(!taskSidebarOpen)}
      >
        {taskSidebarOpen ? (
          <X className="w-4 h-4 text-primary" />
        ) : (
          <>
            <Filter className="w-4 h-4 text-primary mr-2" />
            <span className="text-primary font-medium">Categories</span>
          </>
        )}
      </Button>

      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-200 
          flex flex-col h-screen transform transition-transform duration-300 ease-in-out
          md:translate-x-0 ${
            taskSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }
        `}
      >
        <div className="p-6 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-900">
              Publishing Checklist
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setTaskSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <Card className="bg-primary text-white border-0">
            <CardContent className="p-4">
              <div className="text-center mb-3">
                <div className="text-2xl font-bold">
                  {taskCompletedPercentage}%
                </div>
                <div className="text-sm opacity-90">Overall Progress</div>
              </div>
              <Progress
                value={taskCompletedPercentage}
                className="h-2 bg-white/20 [&>div]:bg-white mb-2"
              />
              <div className="flex justify-between text-xs opacity-90">
                <span>{completedTasks} done</span>
                <span>{totalTasks - completedTasks} remaining</span>
              </div>
            </CardContent>
          </Card>
          {user?.subscription === "Free" && (
            <Button
              variant="outline"
              size="sm"
              className="w-full my-5 border-2 border-primary"
              onClick={subscription}
            >
              Subscribe Now
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <Loader />
          ) : (
            <div className="space-y-2">
              {taskCategories.map((category) => {
                const isProCategory = category.checklist.some(
                  (task) => task.isProOnly
                );
                const isProLocked =
                  user.subscription === "Free" && isProCategory;
                const completionPercentage =
                  category.counts.total > 0
                    ? Math.round(
                        (category.counts.completed / category.counts.total) *
                          100
                      )
                    : 0;
                const isSelected = selectedCategory?.id === category.id;

                return (
                  <div
                    key={category.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary/10 border border-primary"
                        : "hover:bg-slate-50"
                    }`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className={`font-medium text-sm ${
                          isProLocked ? "text-slate-400" : "text-slate-900"
                        }`}
                      >
                        {category.title}
                      </h3>
                      {isProLocked && (
                        <Crown className="w-4 h-4 text-primary" />
                      )}
                    </div>

                    {!isProLocked && (
                      <>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>
                            {category.counts.completed}/{category.counts.total}
                          </span>
                          <span>{completionPercentage}%</span>
                        </div>
                        <Progress
                          value={completionPercentage}
                          className="h-1 [&>div]:bg-primary"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {taskSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setTaskSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col h-screen">
        {!selectedCategory ? (
          <div className="flex items-center justify-center flex-1 p-4">
            <div className="text-center">
              <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Select a Category
              </h3>
              <p className="text-slate-600">
                {taskCategories.length > 0 ? (
                  <>
                    <span className="md:hidden">
                      Tap the "Categories" button to choose a category
                    </span>
                    <span className="hidden md:inline">
                      Choose a category from the sidebar to view its tasks
                    </span>
                  </>
                ) : (
                  "No categories available"
                )}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-600 mb-1">
                      <Target className="w-4 h-4" />
                      <span>Publishing Checklist</span>
                    </div>
                  </div>
                  {totalDetailTasks > 0 && (
                    <div className="hidden md:flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {detailCompletionPercentage}%
                        </div>
                        <div className="text-xs text-slate-600">Complete</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">
                          {completedDetailTasks}
                        </div>
                        <div className="text-xs text-slate-600">Done</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-600">
                          {totalDetailTasks - completedDetailTasks}
                        </div>
                        <div className="text-xs text-slate-600">Remaining</div>
                      </div>
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mt-2">
                  {categoryTitle || selectedCategory.title}
                </h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {categoryLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center space-y-4">
                    <Loader />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        Loading Tasks
                      </h3>
                      <p className="text-slate-600">
                        Please wait while we fetch your task details...
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-6xl space-y-8">
                  {totalDetailTasks > 0 && (
                    <div className="md:hidden">
                      <Card className="bg-primary text-white border-0">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-5 h-5" />
                              <span className="font-semibold">
                                Progress Overview
                              </span>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-white/20 text-white border-0"
                            >
                              {detailCompletionPercentage}% Complete
                            </Badge>
                          </div>
                          <Progress
                            value={detailCompletionPercentage}
                            className="h-2 bg-white/20 [&>div]:bg-white mb-4"
                          />
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-xl font-bold">
                                {totalDetailTasks}
                              </div>
                              <div className="text-xs opacity-90">Total</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold">
                                {completedDetailTasks}
                              </div>
                              <div className="text-xs opacity-90">Done</div>
                            </div>
                            <div>
                              <div className="text-xl font-bold">
                                {totalDetailTasks - completedDetailTasks}
                              </div>
                              <div className="text-xs opacity-90">Left</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {checklistTasks.length === 0 ? (
                    <Card className="border-0 shadow-lg">
                      <CardContent className="text-center py-16">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Target className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          No Tasks Available
                        </h3>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                          This category doesn't have any tasks yet. Tasks will
                          appear here once they're added to the system.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {checklistTasks.map((task, index) => {
                        // Check if this task is pro-only and user is on free plan
                        const isProTask =
                          selectedCategory?.checklist?.find(
                            (t) => t.id === task.id
                          )?.isProOnly || false;
                        const isProLocked =
                          user.subscription === "Free" && isProTask;

                        return (
                          <Card
                            key={task.id}
                            className={`group border-0 shadow-md transition-all duration-300 overflow-hidden ${
                              isProLocked
                                ? "cursor-not-allowed opacity-60"
                                : "hover:shadow-xl cursor-pointer"
                            }`}
                            onClick={
                              isProLocked
                                ? undefined
                                : () => handleViewTask(task.id)
                            }
                          >
                            <CardContent className="p-0 relative">
                              {isProLocked && (
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-100/80 to-slate-200/80 backdrop-blur-sm z-10 flex items-center justify-center">
                                  <div className="text-center space-y-2">
                                    <Button
                                      size="sm"
                                      className="bg-primary text-white text-xs px-3 py-1"
                                      onClick={() => {
                                        router.push("/dashboard/subscription");
                                      }}
                                    >
                                      <Crown className="w-3 h-3 mr-1" />
                                      Upgrade to Unlock
                                    </Button>
                                  </div>
                                </div>
                              )}

                              <div
                                className={`flex items-center p-6 ${
                                  isProLocked ? "blur-sm" : ""
                                }`}
                              >
                                <div className="flex-shrink-0 mr-6">
                                  <div className="relative">
                                    <div
                                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                        task.completed
                                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                                          : "bg-primary text-white"
                                      }`}
                                    >
                                      {task.completed ? (
                                        <CheckCircle2 className="w-6 h-6" />
                                      ) : (
                                        <span>
                                          {String(index + 1).padStart(2, "0")}
                                        </span>
                                      )}
                                    </div>
                                    {task.completed && (
                                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <h3
                                        className={`text-lg font-semibold transition-all duration-300 ${
                                          task.completed
                                            ? "text-slate-500 line-through"
                                            : "text-slate-900 group-hover:text-primary"
                                        }`}
                                      >
                                        {task.title}
                                      </h3>
                                      {isProTask && (
                                        <Badge
                                          variant="outline"
                                          className="text-primary border-primary bg-primary/10 text-xs"
                                        >
                                          <Crown className="w-3 h-3 mr-1" />
                                          Pro
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                      {task.completed ? (
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                                          <CheckCircle2 className="w-3 h-3 mr-1" />
                                          Completed
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant="outline"
                                          className="text-primary border-primary bg-primary/5"
                                        >
                                          <Clock className="w-3 h-3 mr-1" />
                                          Pending
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  {task.description && (
                                    <p
                                      className={`text-slate-600 leading-relaxed ${
                                        task.completed ? "text-slate-400" : ""
                                      }`}
                                    >
                                      {task.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  {checklistTasks.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center space-x-2 text-slate-900">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <span>Progress Analytics</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-600">
                              Completion Rate
                            </span>
                            <span className="text-lg font-bold text-primary">
                              {detailCompletionPercentage}%
                            </span>
                          </div>
                          <Progress
                            value={detailCompletionPercentage}
                            className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-[#CA24D6] [&>div]:to-[#9B1C8C]"
                          />
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="text-center p-3 bg-emerald-50 rounded-lg">
                              <div className="text-2xl font-bold text-emerald-600">
                                {completedDetailTasks}
                              </div>
                              <div className="text-xs text-emerald-600 font-medium">
                                Completed
                              </div>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                              <div className="text-2xl font-bold text-slate-600">
                                {totalDetailTasks - completedDetailTasks}
                              </div>
                              <div className="text-xs text-slate-600 font-medium">
                                Remaining
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center space-x-2 text-slate-900">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span>Category Summary</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">
                                Total Tasks
                              </span>
                              <span className="font-semibold text-slate-900">
                                {totalDetailTasks}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">
                                Category
                              </span>
                              <span className="font-semibold text-slate-900">
                                {categoryTitle || selectedCategory.title}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-slate-600">
                                Status
                              </span>
                              <Badge
                                className={
                                  detailCompletionPercentage === 100
                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                    : detailCompletionPercentage > 0
                                    ? "bg-primary/10 text-primary hover:bg-primary/10"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                                }
                              >
                                {detailCompletionPercentage === 100
                                  ? "Complete"
                                  : detailCompletionPercentage > 0
                                  ? "In Progress"
                                  : "Not Started"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainChecklist;
