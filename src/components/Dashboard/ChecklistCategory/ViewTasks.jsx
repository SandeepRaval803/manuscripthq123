"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/userContext";
import { useRouter } from "next/router";
import {
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Trash2,
  Plus,
  Edit3,
  Bell,
  FileText,
  CheckSquare,
  AlertCircle,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import { SetReminderModal } from "./SetReminderModal";
import { PersonalNoteModal } from "./PersonalNoteModal";
import Loader from "@/components/common/Loader";
import { fetchTaskDetails, toggleTaskComplete } from "@/apiCall/auth";

// API call for deleting reminder
export const deleteReminder = async ({ id, token }) => {
  const response = await fetch(
    `https://apis.manuscripthq.com/api/reminder/delete/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    }
  );
  return response.json();
};

// API call for deleting note
export const deleteNote = async ({ id, token }) => {
  const response = await fetch(
    `https://apis.manuscripthq.com/api/notes/delete/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    }
  );
  return response.json();
};

const ViewTask = () => {
  const router = useRouter();
  const { id } = router.query;
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [reminders, setReminders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [activeTab, setActiveTab] = useState("reminders");
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  useEffect(() => {
    if (!token || !id || !user?.selectedManuscript) return;

    const getTask = async () => {
      setLoading(true);
      try {
        const result = await fetchTaskDetails({
          id,
          token,
          manuscriptId: user.selectedManuscript._id,
        });

        if (result.status === "success" && result.data && result.data.task) {
          const t = result.data.task;
          setTask({
            title: t.title || "",
            description: t.description || "",
            completed: t.isCompleted || false,
          });
          setReminders(
            (result.data.reminders || []).map((r) => ({
              id: r._id,
              title: r.title,
              datetime: r.datetime,
            }))
          );
          setNotes(
            (result.data.notes || []).map((n) => ({
              id: n._id,
              content: n.note,
              createdAt: n.createdAt,
            }))
          );
          setIsChecked(t.isCompleted || false);
        } else {
          setTask({ title: "", description: "", completed: false });
          setReminders([]);
          setNotes([]);
          setIsChecked(false);
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
        setTask({ title: "", description: "", completed: false });
        setReminders([]);
        setNotes([]);
        setIsChecked(false);
        toast.error("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    getTask();
  }, [token, id, user?.selectedManuscript, reload]);

  const handleToggleComplete = async () => {
    if (!token || !user?._id || !user?.selectedManuscript || !id) {
      toast.error("Missing user or task information");
      return;
    }
    setToggleLoading(true);

    try {
      const data = await toggleTaskComplete({
        userId: user._id,
        manuscriptId: user.selectedManuscript._id,
        checklistTaskId: id,
        token,
      });

      if (data.status === "success") {
        setIsChecked((prev) => !prev);
        setTask((prev) => ({ ...prev, completed: !prev.completed }));
        toast.success(
          `🎉 Task marked as ${!isChecked ? "complete" : "incomplete"}!`
        );
      } else {
        toast.error(data.message || "Failed to update task status");
      }
    } catch (error) {
      console.error("Error toggling task:", error);
      toast.error("An error occurred while updating status");
    } finally {
      setToggleLoading(false);
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    try {
      const result = await deleteReminder({ id: reminderId, token });
      if (result.status === "success") {
        toast.success("✅ Reminder deleted successfully");
        setReminders((prev) => prev.filter((r) => r.id !== reminderId));
      } else {
        toast.error(result.message || "Failed to delete reminder");
      }
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Network error, please try again.");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const result = await deleteNote({ id: noteId, token });
      if (result.status === "success") {
        toast.success("✅ Note deleted successfully");
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      } else {
        toast.error(result.message || "Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Network error, please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntilReminder = (datetime) => {
    const now = new Date();
    const reminderDate = new Date(datetime);
    const diffInHours = Math.ceil((reminderDate - now) / (1000 * 60 * 60));

    if (diffInHours < 0)
      return { text: "Overdue", color: "text-red-500", bg: "bg-red-50" };
    if (diffInHours < 24)
      return {
        text: `${diffInHours}h left`,
        color: "text-orange-500",
        bg: "bg-orange-50",
      };
    const days = Math.ceil(diffInHours / 24);
    return {
      text: `${days}d left`,
      color: "text-green-500",
      bg: "bg-green-50",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="border-b border-white/20 bg-white ">
        <div className="px-6 py-4">
          <div className="mb-2 md:mb-0">
            <h2 className="text-3xl font-bold text-primary md:mb-1 mb-2">
              Publishing Checklist
            </h2>
            <p className="text-muted-foreground">Task Details</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <Loader />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardHeader className="relative overflow-hidden p-8">
                  <div className="absolute inset-0 " />
                  <div className="relative space-y-6">
                    <div className="flex items-start space-x-6">
                      <div className="relative group">
                        <Button
                          variant="ghost"
                          size="lg"
                          onClick={handleToggleComplete}
                          disabled={toggleLoading}
                          className="w-10 h-10 rounded-xl transition-all duration-700 transform  bg-primary text-white shadow-2xl shadow-[#CA24D6]/40"
                        >
                          {toggleLoading ? (
                            <Loader />
                          ) : isChecked ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </Button>

                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#CA24D6]/20 to-[#9B1C8C]/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <div className="flex-1 space-y-4">
                        <CardTitle
                          className={`text-xl font-bold leading-tight transition-all duration-700 ${
                            isChecked
                              ? "text-slate-500 line-through"
                              : "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent"
                          }`}
                        >
                          {task.title}
                        </CardTitle>
                        {task.description && (
                          <p
                            className={`text-md leading-relaxed transition-all duration-700 ${
                              isChecked
                                ? "text-slate-400 line-through"
                                : "text-slate-600"
                            }`}
                          >
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                    <Button
                      onClick={handleToggleComplete}
                      disabled={toggleLoading}
                      size="lg"
                      className={`h-16 w-full text-lg font-semibold flex items-center justify-center rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                        isChecked ? "bg-secondary" : "bg-primary"
                      } text-white`}
                    >
                      <CheckSquare className="w-6 h-6 mr-3" />
                      {toggleLoading
                        ? "Updating..."
                        : `Mark ${isChecked ? "Incomplete" : "Complete"}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-8 h-16 bg-slate-100/80 backdrop-blur-sm rounded-2xl">
                      <TabsTrigger
                        value="reminders"
                        className="h-14 text-base font-semibold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300"
                      >
                        <Bell className="w-5 h-5 mr-2" />
                        Reminders
                        <Badge
                          variant="secondary"
                          className="ml-2 bg-primary/10 text-primary"
                        >
                          {reminders.length}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="notes"
                        className="h-14 text-base font-semibold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-300"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Notes
                        <Badge
                          variant="secondary"
                          className="ml-2 bg-primary/10 text-primary"
                        >
                          {notes.length}
                        </Badge>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="reminders" className="space-y-6">
                      {reminders.length === 0 ? (
                        <div className="text-center py-20">
                          <div className="relative mb-8">
                            <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto">
                              <Bell className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                          <h3 className="text-3xl font-bold text-slate-900 mb-4">
                            No Reminders Yet
                          </h3>
                          <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
                            Never miss a deadline! Set smart reminders to keep
                            your tasks on track.
                          </p>
                          <Button
                            size="lg"
                            onClick={() => setShowReminderModal(true)}
                            className="bg-primary text-white  transform hover:scale-105 transition-all duration-300 rounded-2xl px-8 py-4 text-lg"
                          >
                            <Plus className="w-6 h-6 mr-3" />
                            Create First Reminder
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {reminders.map((reminder) => {
                            const timeInfo = getTimeUntilReminder(
                              reminder.datetime
                            );
                            return (
                              <Card
                                key={reminder.id}
                                className="border border-slate-200/60 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden"
                              >
                                <CardContent className="p-6">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-4">
                                      <div className="flex items-center space-x-4">
                                        <h4 className="text-xl font-bold text-slate-900">
                                          {reminder.title}
                                        </h4>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center space-x-2 bg-slate-50 rounded-xl px-4 py-2">
                                          <Calendar className="w-4 h-4 text-slate-500" />
                                          <span className="font-medium text-slate-700">
                                            {formatDate(reminder.datetime)}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-slate-50 rounded-xl px-4 py-2">
                                          <Clock className="w-4 h-4 text-slate-500" />
                                          <span className="font-medium text-slate-700">
                                            {formatTime(reminder.datetime)}
                                          </span>
                                        </div>
                                        <Badge
                                          className={`${timeInfo.bg} ${timeInfo.color} border-0 px-3 py-1 font-semibold rounded-xl`}
                                        >
                                          <AlertCircle className="w-3 h-3 mr-1" />
                                          {timeInfo.text}
                                        </Badge>
                                      </div>
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteReminder(reminder.id)
                                      }
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="notes" className="space-y-6">
                      {notes.length === 0 ? (
                        <div className="text-center py-20">
                          <div className="relative mb-8">
                            <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto">
                              <FileText className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                          <h3 className="text-3xl font-bold text-slate-900 mb-4">
                            No Notes Added
                          </h3>
                          <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
                            Capture your thoughts, ideas, and important
                            information as you work.
                          </p>
                          <Button
                            size="lg"
                            onClick={() => setShowNoteModal(true)}
                            className="bg-gradient-to-r bg-primary text-white   transform hover:scale-105 transition-all duration-300 rounded-2xl px-8 py-4 text-lg"
                          >
                            <Plus className="w-6 h-6 mr-3" />
                            Write First Note
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {notes.map((note) => (
                            <Card
                              key={note.id}
                              className="border border-slate-200/60 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden"
                            >
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 space-y-4">
                                    <div className="flex items-start space-x-4">
                                      <div className="w-4 h-4 bg-primary rounded-full mt-2 flex-shrink-0" />
                                      <p className="text-slate-900 leading-relaxed text-lg font-medium">
                                        {note.content}
                                      </p>
                                    </div>

                                    <div className="flex items-center space-x-2 bg-slate-50 rounded-xl px-4 py-2 w-fit ml-8">
                                      <Calendar className="w-4 h-4 text-slate-500" />
                                      <span className="text-sm font-medium text-slate-700">
                                        Created {formatDate(note.createdAt)}
                                      </span>
                                    </div>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-slate-900">
                    <Zap className="w-5 h-5 text-primary" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowReminderModal(true)}
                    className="w-full justify-start h-12 border-primary text-primary hover:bg-primary/10 rounded-xl"
                  >
                    <Bell className="w-4 h-4 mr-3" />
                    Set Reminder
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNoteModal(true)}
                    className="w-full justify-start h-12 border-primary text-primary hover:bg-primary/10 rounded-xl"
                  >
                    <Edit3 className="w-4 h-4 mr-3" />
                    Add Note
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl ">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-slate-900">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span>Task Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Status</span>
                    <Badge
                      className={
                        isChecked
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-orange-100 text-orange-700"
                      }
                    >
                      {isChecked ? "Complete" : "In Progress"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Reminders</span>
                    <span className="font-semibold text-slate-900">
                      {reminders.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Notes</span>
                    <span className="font-semibold text-slate-900">
                      {notes.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <SetReminderModal
        visible={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        manuscriptId={user?.selectedManuscript._id || ""}
        checklistTaskId={id}
        token={token || ""}
        reload={reload}
        setReload={setReload}
      />
      <PersonalNoteModal
        visible={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        manuscriptId={user?.selectedManuscript._id}
        checklistTaskId={id}
        token={token}
        reload={reload}
        setReload={setReload}
      />
    </div>
  );
};

export default ViewTask;
