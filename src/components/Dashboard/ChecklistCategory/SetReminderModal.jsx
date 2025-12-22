"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Clock, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

export const SetReminderModal = ({
  visible,
  onClose,
  manuscriptId,
  checklistTaskId,
  token,
  reload,
  setReload,
}) => {
  const [data, setData] = useState({
    title: "",
    datetime: new Date(),
    checklistTaskId: checklistTaskId || "", 
    manuscriptId: manuscriptId || "", 
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setData({
        title: "",
        datetime: new Date(),
        checklistTaskId: checklistTaskId || "", 
        manuscriptId: manuscriptId || "", 
      });
    }
  }, [visible, manuscriptId, checklistTaskId]);

  const handleTitleChange = (text) => {
    setData((prev) => ({ ...prev, title: text }));
  };

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const handleDateChange = (value) => {
    const selectedDate = new Date(value);
    const now = new Date();

    if (
      selectedDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())
    ) {
      toast.error("You cannot select a past date.");
      return;
    }

    setData((prev) => {
      const dt = new Date(prev.datetime);
      dt.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      if (dt < new Date()) {
        dt.setHours(now.getHours(), now.getMinutes());
      }
      return { ...prev, datetime: dt };
    });
  };

  const handleTimeChange = (value) => {
    const [hours, minutes] = value.split(":").map(Number);
    const now = new Date();

    setData((prev) => {
      const dt = new Date(prev.datetime);
      dt.setHours(hours, minutes);

      if (isSameDay(dt, now) && dt < now) {
        toast.error("You cannot select a past time for today.");
        return prev;
      }
      return { ...prev, datetime: dt };
    });
  };

  const handleCreateReminder = async () => {
    // Ensure manuscriptId and checklistTaskId are not empty before submission
    if (!data.title || !data.datetime || !data.manuscriptId || !data.checklistTaskId) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);

    const createReminderUrl =
      "https://apis.manuscripthq.com/api/reminder/create";

    try {
      const response = await fetch(createReminderUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          ...data,
          datetime: data.datetime.toISOString(),
        }),
      });

      const result = await response.json();
      toast.dismiss("creating-reminder");

      if (result.status === "success") {
        toast.success("🎉 Reminder created successfully!");
        setData({
          title: "",
          datetime: new Date(),
          checklistTaskId,
          manuscriptId,
        });
        setReload(!reload);
        onClose();
      } else {
        toast.error(
          result.message || "Error creating reminder. Please try again."
        );
      }
    } catch (error) {
      toast.dismiss("creating-reminder");
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  const formatTimeForInput = (date) => {
    return date.toTimeString().slice(0, 5);
  };

  const handleClose = () => {
    setData({
      title: "",
      datetime: new Date(),
      checklistTaskId,
      manuscriptId,
    });
    onClose();
  };

  return (
    <Dialog open={visible} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Set Task Reminder
          </DialogTitle>
          <p className="text-slate-600">
            Never miss a deadline! Set a smart reminder to keep your task on
            track.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label
              htmlFor="title"
              className="text-sm font-semibold text-slate-700"
            >
              Reminder Title
            </Label>
            <div className="relative">
              <Input
                id="title"
                placeholder="e.g., 'Editing is Due Tomorrow!'"
                value={data.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="h-12 pl-4 pr-4 border-2 rounded-xl transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label
                htmlFor="date"
                className="text-sm font-semibold text-slate-700"
              >
                Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="date"
                  type="date"
                  value={formatDateForInput(data.datetime)}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={formatDateForInput(new Date())}
                  className="h-12 pl-10 pr-4 border-2 rounded-xl transition-colors"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="time"
                className="text-sm font-semibold text-slate-700"
              >
                Time
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="time"
                  type="time"
                  value={formatTimeForInput(data.datetime)}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="h-12 pl-10 pr-4 border-2 rounded-xl transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-12 border-2 hover:bg-slate-50 rounded-xl font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateReminder}
              disabled={loading || !data.title}
              className="flex-1 h-12 bg-primary text-white shadow-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Reminder</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
