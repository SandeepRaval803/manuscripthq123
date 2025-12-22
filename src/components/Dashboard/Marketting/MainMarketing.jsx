"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Mail,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Share2,
  PlusCircle,
  Edit,
  Trash2,
  Send,
  Download,
  TrendingUp,
  Target,
  Star,
  Heart,
  MessageCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Loader from "@/components/common/Loader";

export default function MainMarketing() {
  // State management
  const [campaigns, setCampaigns] = useState([]);
  const [arcReaders, setArcReaders] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);
  const [timelineTasks, setTimelineTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [newCampaignOpen, setNewCampaignOpen] = useState(false);
  const [addReaderOpen, setAddReaderOpen] = useState(false);
  const [viewTemplateOpen, setViewTemplateOpen] = useState(false);
  const [editCampaignOpen, setEditCampaignOpen] = useState(false);
  const [schedulePostOpen, setSchedulePostOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form states
  const [campaignForm, setCampaignForm] = useState({
    id: "",
    name: "",
    description: "",
    type: "",
    scheduledDate: "",
    status: "draft",
  });

  const [readerForm, setReaderForm] = useState({
    name: "",
    email: "",
    platform: "email",
  });

  const [postForm, setPostForm] = useState({
    platform: "",
    content: "",
    scheduledDate: "",
  });

  const [currentTemplate, setCurrentTemplate] = useState({
    title: "",
    content: "",
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedCampaigns = localStorage.getItem("marketing-campaigns");
        const savedReaders = localStorage.getItem("arc-readers");
        const savedPosts = localStorage.getItem("social-posts");
        const savedTasks = localStorage.getItem("timeline-tasks");

        if (savedCampaigns) setCampaigns(JSON.parse(savedCampaigns));
        if (savedReaders) setArcReaders(JSON.parse(savedReaders));
        if (savedPosts) setSocialPosts(JSON.parse(savedPosts));
        if (savedTasks) setTimelineTasks(JSON.parse(savedTasks));
        else {
          // Initialize with default timeline tasks
          const defaultTasks = [
            {
              id: "1",
              title: "Start building email list",
              description:
                "Set up email marketing platform and create signup forms",
              dueDate: "2024-02-15",
              completed: true,
              category: "3-months",
            },
            {
              id: "2",
              title: "Choose social media platforms",
              description:
                "Select 1-2 platforms where your audience is most active",
              dueDate: "2024-02-20",
              completed: true,
              category: "3-months",
            },
            {
              id: "3",
              title: "Recruit ARC readers",
              description: "Find and invite advance readers for your book",
              dueDate: "2024-03-15",
              completed: true,
              category: "2-months",
            },
            {
              id: "4",
              title: "Request endorsements",
              description:
                "Reach out to authors and experts for book endorsements",
              dueDate: "2024-03-20",
              completed: false,
              category: "2-months",
            },
            {
              id: "5",
              title: "Reveal book cover",
              description:
                "Share your book cover across all marketing channels",
              dueDate: "2024-04-15",
              completed: false,
              category: "1-month",
            },
          ];
          setTimelineTasks(defaultTasks);
          localStorage.setItem("timeline-tasks", JSON.stringify(defaultTasks));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error loading data",
          description: "There was an issue loading your saved data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("marketing-campaigns", JSON.stringify(campaigns));
    }
  }, [campaigns, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("arc-readers", JSON.stringify(arcReaders));
    }
  }, [arcReaders, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("social-posts", JSON.stringify(socialPosts));
    }
  }, [socialPosts, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("timeline-tasks", JSON.stringify(timelineTasks));
    }
  }, [timelineTasks, loading]);

  // Templates
  const templates = {
    "Initial ARC Invitation": `Subject: Invitation to be an Advance Reader for [Book Title]

Dear [Name],

I hope this email finds you well! I'm reaching out because I believe you'd be a perfect advance reader for my upcoming book, "[Book Title]."

As an ARC reader, you would:
• Receive a free digital copy of the book before publication
• Get exclusive behind-the-scenes content about the writing process
• Have your review featured on the book's launch materials (if you choose)
• Be acknowledged in the book's acknowledgments section

In exchange, I would greatly appreciate:
• An honest review posted on Goodreads, Amazon, or your preferred platform
• Any feedback that could help improve the book before publication
• Sharing about the book on social media (if you enjoyed it)

The book is [genre] and approximately [word count] words. I'm planning to send advance copies on [date] with a review deadline of [date].

Would you be interested in participating? I'd be thrilled to have your thoughts on the book!

Best regards,
[Your Name]
[Your Contact Information]`,

    "Review Reminder": `Subject: Gentle Reminder - ARC Review for [Book Title]

Dear [Name],

I hope you've been enjoying your advance copy of "[Book Title]"! I wanted to send a friendly reminder that the review deadline is approaching on [date].

I completely understand that life gets busy, and there's no pressure if you need more time or if circumstances have changed. Just let me know what works best for you.

If you have any questions about the book or need any additional information for your review, please don't hesitate to reach out.

Your honest feedback means the world to me, and I'm grateful for your time and support.

Thank you again for being part of this journey!

Warmly,
[Your Name]`,

    "Thank You Message": `Subject: Thank You for Your Amazing Review!

Dear [Name],

I just saw your review of "[Book Title]" and I'm absolutely thrilled! Thank you so much for taking the time to read the book and share your thoughtful feedback.

Your review truly means the world to me as an author. Knowing that the story resonated with you makes all the late nights and countless revisions worth it.

I'm so grateful to have readers like you who support independent authors. Your review will help other readers discover the book, and that support is invaluable.

I'd love to stay in touch and let you know about future releases. Would you be interested in joining my email list for updates on upcoming books?

Thank you again for being such an important part of this book's journey!

With heartfelt gratitude,
[Your Name]

P.S. If you enjoyed this book, I'd be honored if you'd consider leaving a review on Amazon or Goodreads to help other readers find it!`,
  };

  // Utility functions
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const resetCampaignForm = () => {
    setCampaignForm({
      id: "",
      name: "",
      description: "",
      type: "",
      scheduledDate: "",
      status: "draft",
    });
  };

  const resetReaderForm = () => {
    setReaderForm({
      name: "",
      email: "",
      platform: "email",
    });
  };

  const resetPostForm = () => {
    setPostForm({
      platform: "",
      content: "",
      scheduledDate: "",
    });
  };

  // Campaign handlers
  const handleCampaignSubmit = () => {
    if (
      !campaignForm.name ||
      !campaignForm.type ||
      !campaignForm.scheduledDate
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    const newCampaign = {
      ...campaignForm,
      id: campaignForm.id || generateId(),
      createdAt: new Date().toISOString(),
      recipients: Math.floor(Math.random() * 50) + 20,
      openRate: Math.floor(Math.random() * 30) + 60,
      clickRate: Math.floor(Math.random() * 15) + 10,
    };

    if (campaignForm.id) {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignForm.id ? newCampaign : c))
      );
      toast({
        title: "Campaign updated",
        description: `${campaignForm.name} has been updated successfully`,
      });
    } else {
      setCampaigns((prev) => [...prev, newCampaign]);
      toast({
        title: "Campaign created",
        description: `${campaignForm.name} has been scheduled for ${campaignForm.scheduledDate}`,
      });
    }

    resetCampaignForm();
    setNewCampaignOpen(false);
    setEditCampaignOpen(false);
    setEditingCampaign(null);
  };

  const handleEditCampaign = (campaign) => {
    setCampaignForm(campaign);
    setEditingCampaign(campaign);
    setEditCampaignOpen(true);
  };

  const handleSendCampaign = (campaignId) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: "sent" } : c))
    );
    toast({
      title: "Campaign sent",
      description: "Your campaign has been sent successfully",
    });
  };

  // ARC Reader handlers
  const handleReaderSubmit = () => {
    if (!readerForm.name || !readerForm.email) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    const newReader = {
      id: generateId(),
      name: readerForm.name,
      email: readerForm.email,
      status: "pending",
      dateAdded: new Date().toISOString(),
      platform: readerForm.platform,
    };

    setArcReaders((prev) => [...prev, newReader]);
    toast({
      title: "Reader added",
      description: `${readerForm.name} has been added to your ARC program`,
    });

    resetReaderForm();
    setAddReaderOpen(false);
  };

  const handleUpdateReaderStatus = (readerId, status) => {
    setArcReaders((prev) =>
      prev.map((r) =>
        r.id === readerId
          ? {
              ...r,
              status,
              reviewDate:
                status === "reviewed" ? new Date().toISOString() : r.reviewDate,
              rating:
                status === "reviewed"
                  ? Math.floor(Math.random() * 2) + 4
                  : r.rating,
            }
          : r
      )
    );
    toast({
      title: "Status updated",
      description: `Reader status has been updated to ${status}`,
    });
  };

  // Social Media handlers
  const handleSchedulePost = () => {
    if (!postForm.platform || !postForm.content || !postForm.scheduledDate) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    const newPost = {
      id: generateId(),
      platform: postForm.platform,
      content: postForm.content,
      scheduledDate: postForm.scheduledDate,
      status: "scheduled",
      engagement: {
        likes: Math.floor(Math.random() * 50) + 10,
        comments: Math.floor(Math.random() * 20) + 2,
        shares: Math.floor(Math.random() * 15) + 1,
      },
    };

    setSocialPosts((prev) => [...prev, newPost]);
    toast({
      title: "Post scheduled",
      description: `Your ${postForm.platform} post has been scheduled for ${postForm.scheduledDate}`,
    });

    resetPostForm();
    setSchedulePostOpen(false);
  };

  const handlePublishPost = (postId) => {
    setSocialPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: "published" } : p))
    );
    toast({
      title: "Post published",
      description: "Your post has been published successfully",
    });
  };

  // Timeline handlers
  const handleToggleTask = (taskId) => {
    setTimelineTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // Delete handlers
  const handleDelete = (type, id) => {
    setDeleteTarget({ type, id });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    const { type, id } = deleteTarget;

    switch (type) {
      case "campaign":
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
        toast({
          title: "Campaign deleted",
          description: "Campaign has been removed",
        });
        break;
      case "reader":
        setArcReaders((prev) => prev.filter((r) => r.id !== id));
        toast({
          title: "Reader removed",
          description: "Reader has been removed from your ARC program",
        });
        break;
      case "post":
        setSocialPosts((prev) => prev.filter((p) => p.id !== id));
        toast({
          title: "Post deleted",
          description: "Social media post has been deleted",
        });
        break;
    }

    setDeleteTarget(null);
    setDeleteDialogOpen(false);
  };

  // Template handlers
  const handleViewTemplate = (templateName) => {
    setCurrentTemplate({
      title: templateName,
      content: templates[templateName],
    });
    setViewTemplateOpen(true);
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(currentTemplate.content);
    toast({
      title: "Template copied",
      description: "Template has been copied to clipboard",
    });
  };

  // Analytics calculations
  const totalSubscribers =
    42 + campaigns.filter((c) => c.status === "sent").length * 3;
  const totalReaders = arcReaders.length;
  const reviewsReceived = arcReaders.filter(
    (r) => r.status === "reviewed"
  ).length;
  const socialEngagement = socialPosts.reduce(
    (acc, post) =>
      acc +
      (post.engagement?.likes || 0) +
      (post.engagement?.comments || 0) +
      (post.engagement?.shares || 0),
    0
  );
  const completedTasks = timelineTasks.filter((t) => t.completed).length;
  const launchProgress = Math.round(
    (completedTasks / timelineTasks.length) * 100
  );

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-1 text-3xl text-primary font-bold tracking-tight">
            Marketing
          </h1>
          <p className="text-muted-foreground">
            Track and manage your book marketing strategies
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            className={"border-[#eaa8f9] text-primary"}
            variant="outline"
            onClick={() => setSchedulePostOpen(true)}
          >
            <Calendar className="mr-2 h-4 w-4 " />
            Schedule Post
          </Button>
          <Button onClick={() => setNewCampaignOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Email Subscribers
            </CardTitle>
            <Mail className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.round(((totalSubscribers - 42) / 42) * 100)}% from
              campaigns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARC Readers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReaders}</div>
            <p className="text-xs text-muted-foreground">
              {reviewsReceived} reviews submitted
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Social Engagement
            </CardTitle>
            <Share2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{socialEngagement}</div>
            <p className="text-xs text-muted-foreground">Total interactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Launch Progress
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{launchProgress}%</div>
            <Progress value={launchProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className={"bg-[#eaa8f9]"}>
          <TabsTrigger
            className={"data-[state=active]:text-primary  cursor-pointer"}
            value="overview"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            className={"data-[state=active]:text-primary  cursor-pointer"}
            value="campaigns"
          >
            Campaigns
          </TabsTrigger>
          <TabsTrigger
            className={"data-[state=active]:text-primary  cursor-pointer"}
            value="social"
          >
            Social Media
          </TabsTrigger>
          <TabsTrigger
            className={"data-[state=active]:text-primary  cursor-pointer"}
            value="arc"
          >
            ARC Readers
          </TabsTrigger>
          <TabsTrigger
            className={"data-[state=active]:text-primary  cursor-pointer"}
            value="timeline"
          >
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {campaigns.slice(0, 3).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center space-x-3"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        campaign.status === "sent"
                          ? "bg-green-500"
                          : campaign.status === "scheduled"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {campaign.status}
                      </p>
                    </div>
                  </div>
                ))}
                {campaigns.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No campaigns yet
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-primary" />
                  Goals Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Email Subscribers</span>
                    <span>{totalSubscribers}/100</span>
                  </div>
                  <Progress
                    value={(totalSubscribers / 100) * 100}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>ARC Reviews</span>
                    <span>{reviewsReceived}/25</span>
                  </div>
                  <Progress
                    value={(reviewsReceived / 25) * 100}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Timeline Tasks</span>
                    <span>
                      {completedTasks}/{timelineTasks.length}
                    </span>
                  </div>
                  <Progress value={launchProgress} className="h-2 " />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {timelineTasks
                  .filter((task) => !task.completed)
                  .slice(0, 3)
                  .map((task) => (
                    <div key={task.id} className="flex items-start space-x-3">
                      <Clock className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                {timelineTasks.filter((task) => !task.completed).length ===
                  0 && (
                  <p className="text-sm text-muted-foreground">
                    All tasks completed! 🎉
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>
                  Your recent email campaign metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {campaigns.filter((c) => c.status === "sent").length > 0 ? (
                  <div className="space-y-4">
                    {campaigns
                      .filter((c) => c.status === "sent")
                      .slice(0, 3)
                      .map((campaign) => (
                        <div
                          key={campaign.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{campaign.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {campaign.recipients} recipients
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {campaign.openRate}% open
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {campaign.clickRate}% click
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-semibold">
                      No campaigns sent yet
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Create and send your first campaign to see performance
                      metrics
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => setNewCampaignOpen(true)}
                    >
                      Create Campaign
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media Insights</CardTitle>
                <CardDescription>Your social media performance</CardDescription>
              </CardHeader>
              <CardContent>
                {socialPosts.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center">
                          <Heart className="h-4 w-4 text-red-500 mr-1" />
                          <span className="font-bold">
                            {socialPosts.reduce(
                              (acc, post) =>
                                acc + (post.engagement?.likes || 0),
                              0
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Likes</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center">
                          <MessageCircle className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="font-bold">
                            {socialPosts.reduce(
                              (acc, post) =>
                                acc + (post.engagement?.comments || 0),
                              0
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Comments
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center">
                          <Share2 className="h-4 w-4 text-green-500 mr-1" />
                          <span className="font-bold">
                            {socialPosts.reduce(
                              (acc, post) =>
                                acc + (post.engagement?.shares || 0),
                              0
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Shares</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      {socialPosts.slice(0, 3).map((post) => (
                        <div
                          key={post.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{post.platform}</Badge>
                            <span className="text-sm">
                              {post.content.slice(0, 30)}...
                            </span>
                          </div>
                          <Badge
                            variant={
                              post.status === "published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {post.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Share2 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">
                      No social posts yet
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Schedule your first social media post to see insights
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => setSchedulePostOpen(true)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Schedule Your First Post
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaigns</CardTitle>
              <CardDescription>
                Manage your email marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {campaigns.length > 0 ? (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{campaign.name}</h3>
                          <Badge
                            variant={
                              campaign.status === "sent"
                                ? "default"
                                : campaign.status === "scheduled"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {campaign.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>Type: {campaign.type}</span>
                          <span>
                            Scheduled:{" "}
                            {new Date(
                              campaign.scheduledDate
                            ).toLocaleDateString()}
                          </span>
                          {campaign.recipients && (
                            <span>Recipients: {campaign.recipients}</span>
                          )}
                        </div>
                        {campaign.status === "sent" && campaign.openRate && (
                          <div className="flex items-center space-x-4 mt-2 text-xs">
                            <span className="text-green-600">
                              Open Rate: {campaign.openRate}%
                            </span>
                            <span className="text-blue-600">
                              Click Rate: {campaign.clickRate}%
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {campaign.status === "draft" && (
                          <Button
                            size="sm"
                            onClick={() => handleSendCampaign(campaign.id)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCampaign(campaign)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete("campaign", campaign.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No campaigns yet
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Create your first email campaign to start engaging with your
                    audience
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setNewCampaignOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Campaign
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Posts</CardTitle>
              <CardDescription>
                Manage your social media content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {socialPosts.length > 0 ? (
                <div className="space-y-4">
                  {socialPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{post.platform}</Badge>
                          <Badge
                            variant={
                              post.status === "published"
                                ? "default"
                                : post.status === "scheduled"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {post.status}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{post.content}</p>
                        <p className="text-xs text-muted-foreground">
                          Scheduled for:{" "}
                          {new Date(post.scheduledDate).toLocaleString()}
                        </p>
                        {post.status === "published" && post.engagement && (
                          <div className="flex items-center space-x-4 mt-2 text-xs">
                            <span className="flex items-center">
                              <Heart className="h-3 w-3 text-red-500 mr-1" />
                              {post.engagement.likes}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="h-3 w-3 text-blue-500 mr-1" />
                              {post.engagement.comments}
                            </span>
                            <span className="flex items-center">
                              <Share2 className="h-3 w-3 text-green-500 mr-1" />
                              {post.engagement.shares}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {post.status === "scheduled" && (
                          <Button
                            size="sm"
                            onClick={() => handlePublishPost(post.id)}
                          >
                            Publish Now
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete("post", post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Share2 className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No social posts yet
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Schedule your first social media post to start building your
                    audience
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setSchedulePostOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Schedule Your First Post
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ARC Reader Management</CardTitle>
              <CardDescription>
                Manage your advance reader copy program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{totalReaders}</div>
                    <p className="text-xs text-muted-foreground">
                      Total Readers
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {arcReaders.filter((r) => r.status === "sent").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Books Sent</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{reviewsReceived}</div>
                    <p className="text-xs text-muted-foreground">
                      Reviews Received
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {arcReaders.filter((r) => r.status === "pending").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
                <Button onClick={() => setAddReaderOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Reader
                </Button>
              </div>

              {arcReaders.length > 0 ? (
                <div className="space-y-4">
                  {arcReaders.map((reader) => (
                    <div
                      key={reader.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{reader.name}</h3>
                          <Badge
                            variant={
                              reader.status === "reviewed"
                                ? "default"
                                : reader.status === "sent"
                                ? "secondary"
                                : reader.status === "declined"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {reader.status}
                          </Badge>
                          {reader.rating && (
                            <div className="flex items-center">
                              {Array.from({ length: reader.rating }).map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                  />
                                )
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {reader.email}
                        </p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                          <span>
                            Added:{" "}
                            {new Date(reader.dateAdded).toLocaleDateString()}
                          </span>
                          {reader.reviewDate && (
                            <span>
                              Reviewed:{" "}
                              {new Date(reader.reviewDate).toLocaleDateString()}
                            </span>
                          )}
                          <span>Platform: {reader.platform}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {reader.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateReaderStatus(reader.id, "sent")
                            }
                          >
                            Mark as Sent
                          </Button>
                        )}
                        {reader.status === "sent" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateReaderStatus(reader.id, "reviewed")
                            }
                          >
                            Mark as Reviewed
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete("reader", reader.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No ARC readers yet
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Add your first advance reader to start building your review
                    base
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setAddReaderOpen(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Reader
                  </Button>
                </div>
              )}

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="font-semibold">Email Templates</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  {Object.keys(templates).map((templateName) => (
                    <div key={templateName} className="p-3 border rounded-lg">
                      <p className="font-medium">{templateName}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {templateName === "Initial ARC Invitation" &&
                          "Template for inviting new ARC readers"}
                        {templateName === "Review Reminder" &&
                          "Template for following up with ARC readers"}
                        {templateName === "Thank You Message" &&
                          "Template for thanking readers after review"}
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => handleViewTemplate(templateName)}
                      >
                        View Template
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Book Launch Timeline</CardTitle>
              <CardDescription>
                Track your marketing activities before and after launch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Launch Date</h3>
                  <p className="text-sm text-muted-foreground">
                    Your book launch is scheduled for
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">August 15, 2024</p>
                  <p className="text-sm text-primary">
                    {Math.ceil(
                      (new Date("2024-08-15").getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days remaining
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {timelineTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start space-x-4 p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
                        className="rounded"
                      />
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Clock className="h-5 w-5 text-black" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`font-semibold ${
                            task.completed ? "line-through text-primary" : ""
                          }`}
                        >
                          {task.title}
                        </h4>
                        <Badge variant="outline">{task.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  className="border-[#eaa8f9] text-primary"
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4 " />
                  Export Timeline
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Campaign Modal */}
      <Dialog open={newCampaignOpen} onOpenChange={setNewCampaignOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Create a new email marketing campaign for your book
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="campaign-name">Campaign Name *</Label>
              <Input
                id="campaign-name"
                placeholder="e.g., Book Launch Announcement"
                value={campaignForm.name}
                onChange={(e) =>
                  setCampaignForm({ ...campaignForm, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="campaign-description">Description</Label>
              <Textarea
                id="campaign-description"
                placeholder="Describe your campaign goals and content"
                value={campaignForm.description}
                onChange={(e) =>
                  setCampaignForm({
                    ...campaignForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="campaign-type">Campaign Type *</Label>
              <Select
                className="w-full"
                value={campaignForm.type}
                onValueChange={(value) =>
                  setCampaignForm({ ...campaignForm, type: value })
                }
              >
                <SelectTrigger className="w-full" id="campaign-type">
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="launch">Book Launch</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="arc-invitation">ARC Invitation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="scheduled-date">Scheduled Date *</Label>
              <Input
                id="scheduled-date"
                type="datetime-local"
                value={campaignForm.scheduledDate}
                onChange={(e) =>
                  setCampaignForm({
                    ...campaignForm,
                    scheduledDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="campaign-status">Status</Label>
              <Select
                className="w-full"
                value={campaignForm.status}
                onValueChange={(value) =>
                  setCampaignForm({ ...campaignForm, status: value })
                }
              >
                <SelectTrigger className="w-full" id="campaign-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={resetCampaignForm}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleCampaignSubmit}>
              {editingCampaign ? "Update Campaign" : "Create Campaign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Modal */}
      {/* Uses same form/modal as New Campaign */}

      {/* Add Reader Modal */}
      <Dialog open={addReaderOpen} onOpenChange={setAddReaderOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add ARC Reader</DialogTitle>
            <DialogDescription>
              Add a new advance reader to your ARC program
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reader-name">Reader Name *</Label>
              <Input
                id="reader-name"
                placeholder="e.g., John Smith"
                value={readerForm.name}
                onChange={(e) =>
                  setReaderForm({ ...readerForm, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reader-email">Email Address *</Label>
              <Input
                id="reader-email"
                type="email"
                placeholder="e.g., john@example.com"
                value={readerForm.email}
                onChange={(e) =>
                  setReaderForm({ ...readerForm, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reader-platform">Preferred Platform</Label>
              <Select
                className="w-full"
                value={readerForm.platform}
                onValueChange={(value) =>
                  setReaderForm({ ...readerForm, platform: value })
                }
              >
                <SelectTrigger className="w-full" id="reader-platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="goodreads">Goodreads</SelectItem>
                  <SelectItem value="amazon">Amazon</SelectItem>
                  <SelectItem value="bookbub">BookBub</SelectItem>
                  <SelectItem value="netgalley">NetGalley</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={resetReaderForm}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleReaderSubmit}>Add Reader</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Post Modal */}
      <Dialog open={schedulePostOpen} onOpenChange={setSchedulePostOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule Social Media Post</DialogTitle>
            <DialogDescription>
              Create and schedule a new social media post
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="post-platform">Platform *</Label>
              <Select
                className="w-full"
                value={postForm.platform}
                onValueChange={(value) =>
                  setPostForm({ ...postForm, platform: value })
                }
              >
                <SelectTrigger className="w-full" id="post-platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="post-content">Content *</Label>
              <Textarea
                id="post-content"
                placeholder="Write your post content here..."
                value={postForm.content}
                onChange={(e) =>
                  setPostForm({ ...postForm, content: e.target.value })
                }
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {postForm.content.length}/280 characters
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="post-scheduled-date">
                Scheduled Date & Time *
              </Label>
              <Input
                id="post-scheduled-date"
                type="datetime-local"
                value={postForm.scheduledDate}
                onChange={(e) =>
                  setPostForm({ ...postForm, scheduledDate: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={resetPostForm}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSchedulePost}>Schedule Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Template Modal */}
      <Dialog open={viewTemplateOpen} onOpenChange={setViewTemplateOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentTemplate.title}</DialogTitle>
            <DialogDescription>
              Email template for your ARC program
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 border rounded-lg bg-muted/50">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {currentTemplate.content}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCopyTemplate}>
              Copy to Clipboard
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {deleteTarget?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
