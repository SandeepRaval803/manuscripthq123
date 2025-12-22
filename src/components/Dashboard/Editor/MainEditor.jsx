"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "./RichTextEditor";
import { Maximize2, Minimize2, Plus, Save } from "lucide-react";
import { fetchManuscriptTree } from "@/apiCall/auth";
import { useAuth } from "@/context/userContext";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import NewChapterModal from "@/components/Modals/NewChapterModal";

const MainEditor = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [tree, setTree] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState({});
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newChapterModalOpen, setNewChapterModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    if (!user?.selectedManuscript) return;

    const getManuscriptTree = async () => {
      setLoading(true);
      const result = await fetchManuscriptTree(
        user?.selectedManuscript._id,
        token
      );

      if (result.success) {
        setTree(result.sections);
        setLoading(false);

        // ✅ Expand if "active" param exists
        const active = searchParams.get("active");
        if (active) {
          setSelectedNodeId(active);
          expandParentNodes(active, result.sections);
        }
      } else {
        setTree([]);
        setLoading(false);
      }
    };

    getManuscriptTree();
  }, [user?.selectedManuscript, token, refresh]);

  const expandParentNodes = (nodeId, nodes) => {
    const parentChain = [];

    const findNode = (children, path = []) => {
      for (const node of children) {
        const newPath = [...path, node._id];
        if (node._id === nodeId) {
          parentChain.push(...path); // all parents except self
          return true;
        }
        if (node.children && findNode(node.children, newPath)) {
          return true;
        }
      }
      return false;
    };

    findNode(nodes);
    const newExpanded = { ...expandedNodes };
    parentChain.forEach((id) => {
      newExpanded[id] = true;
    });
    setExpandedNodes(newExpanded);
  };

  const handleToggleNode = useCallback(
    (nodeId, hasChildren, isSelectable) => {
      if (hasChildren) {
        setExpandedNodes((prevExpanded) => {
          const newExpanded = { ...prevExpanded };
          const currentState = newExpanded[nodeId] || false;
          newExpanded[nodeId] = !currentState;
          return newExpanded;
        });
      }

      if (isSelectable) {
        setSelectedNodeId(nodeId);

        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set("active", nodeId); // ✅ Add/replace 'active'
        router.replace(`?${currentParams.toString()}`); // ✅ Update URL without reload
      }
    },
    [router, searchParams]
  );
  useEffect(() => {
    const active = searchParams.get("active");
    if (active) {
      setSelectedNodeId(active);
    }
  }, [searchParams]);

  const handleSave = async () => {
    if (!selectedNodeId) {
      toast.error("Please select a section to save content to");
      return;
    }

    if (!editorContent.trim()) {
      toast.error("No content to save");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        manuscriptId: user.selectedManuscript._id,
        sectionId: selectedNodeId,
        content: editorContent,
      };

      const response = await fetch(
        "https://apis.manuscripthq.com/api/editor/createOrUpdate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.status === "success" || response.ok) {
        toast.success("Content saved successfully!");
      } else {
        toast.error(
          data.message || "Failed to save content. Please try again."
        );
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleAddPart = useCallback(() => {
    setNewChapterModalOpen(true);
  }, []);

  const handleContentChange = useCallback((content) => {
    setEditorContent(content);
  }, []);

  const renderTreeNode = (node, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node._id] || false;
    const isSelected = node._id === selectedNodeId;
    const isSelectable = level > 0 || node.type === "chapter";

    return (
      <div key={node._id} style={{ paddingLeft: `${level * 16 + 8}px` }}>
        <div
          className={`group flex items-center gap-2 rounded-md px-2 py-1.5 mb-1 transition-colors cursor-pointer ${
            isSelected ? "border-[#eaa8f9] border-2 bg-[#eaa8f9]/20" : ""
          } ${isSelectable ? "hover:bg-gray-100" : "hover:bg-gray-50"}`}
          role="button"
          onClick={() => handleToggleNode(node._id, hasChildren, isSelectable)}
        >
          {hasChildren ? (
            <div className="h-5 w-5 text-primary rounded flex items-center justify-center transition-colors">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          ) : (
            <div className="ml-5">
              {node.type === "scene" ? (
                <File className="h-4 w-4 text-primary" />
              ) : (
                <Folder className="h-4 w-4 text-primary" />
              )}
            </div>
          )}

          <span
            className={`flex-1 truncate font-medium ${
              level === 0 ? "text-slate-700 font-semibold" : "text-slate-900"
            } ${isSelectable ? "" : "text-slate-600"}`}
          >
            {node.title}
          </span>
          {!isSelectable && hasChildren && (
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
              {node.type}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <ul>
            {node.children.map((child) => renderTreeNode(child, level + 1))}
          </ul>
        )}
      </div>
    );
  };

  const createNewNode = (data) => {
    // Use the actual data returned from the API instead of creating a temporary node
    const newNode = {
      _id: data._id, // Use the actual _id from the API response
      title: data.title,
      type: data.type,
      wordCount: data.wordCount || 0,
      status: data.status || "draft",
      children: data.children || [],
    };

    if (!data.parent) {
      // Add to root level
      setTree((prevTree) => [...prevTree, newNode]);
      // Auto-select the new node if it's selectable (chapter or scene)
      if (data.type === "chapter" || data.type === "scene") {
        setSelectedNodeId(data._id);
        // Update URL with the new section
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.set("active", data._id);
        router.replace(`?${currentParams.toString()}`);
        toast.success(`${data.title} created and selected!`);
      }
      // Trigger refresh to get updated tree from server after a short delay
      setTimeout(() => {
        setRefresh(!refresh);
      }, 100);
      return;
    }

    // Add as child of parent
    const addChildToNode = (nodes) => {
      return nodes.map((node) => {
        if (node._id === data.parent) {
          return {
            ...node,
            children: [...(node.children || []), newNode],
          };
        }
        if (node.children) {
          return {
            ...node,
            children: addChildToNode(node.children),
          };
        }
        return node;
      });
    };

    setTree((prevTree) => addChildToNode(prevTree));
    setExpandedNodes((prev) => ({
      ...prev,
      [data.parent]: true,
    }));

    // Auto-select the new node if it's selectable (chapter or scene)
    if (data.type === "chapter" || data.type === "scene") {
      setSelectedNodeId(data._id);
      // Update URL with the new section
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set("active", data._id);
      router.replace(`?${currentParams.toString()}`);
      toast.success(`${data.title} created and selected!`);
    }

    // Trigger refresh to get updated tree from server after a short delay
    setTimeout(() => {
      setRefresh(!refresh);
    }, 100);
  };

  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }

    if (tree.length === 0) {
      return (
        <div className="text-center text-muted-foreground">
          <div className="space-y-3">
            <Button onClick={() => handleAddPart()} className="bg-primary">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <ul className="space-y-2 text-sm">
        {tree.map((node) => renderTreeNode(node))}
      </ul>
    );
  };

  return (
    <div
      className={`flex-1 space-y-4 p-4 md:p-6 pt-6 ${
        isFullScreen ? "fixed top-0 left-0 w-full h-full bg-white z-50" : ""
      }`}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-1 text-3xl font-bold text-primary">
              Manuscript Editor
            </h1>
            <p className="text-muted-foreground">
              Create, edit, and organize your manuscript with ease in a seamless
              writing environment.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              className="bg-primary flex items-center space-x-1"
              onClick={handleSave}
              disabled={isSaving || !selectedNodeId}
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </Button>

            <Button
              variant="outline"
              className="border-[#eaa8f9] text-primary flex items-center space-x-2 bg-transparent"
              onClick={toggleFullScreen}
              disabled={!selectedNodeId}
            >
              {isFullScreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
              <span>{isFullScreen ? "Exit Full Screen" : "Full Screen"}</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="col-span-1 md:col-span-1">
            <Tabs defaultValue="outline" className="w-full px-2">
              <TabsList className="grid w-full grid-cols-1 bg-[#eaa8f9]">
                <TabsTrigger
                  value="outline"
                  className="data-[state=active]:text-primary cursor-pointer"
                >
                  Outline
                </TabsTrigger>
              </TabsList>
              <TabsContent value="outline" className="my-4">
                <div className="space-y-4">
                  <div className="font-medium">Manuscript Structure</div>
                  {renderContent()}
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {selectedNodeId ? (
            <Card className="col-span-1 md:col-span-3 p-4">
              <RichTextEditor
                selectedNodeId={selectedNodeId}
                onContentChange={handleContentChange}
              />
            </Card>
          ) : (
            <Card className="col-span-3 md:col-span-3 flex flex-col items-center justify-center h-160">
              <div className="text-center text-muted-foreground p-8">
                <Folder className="mx-auto h-12 w-12 text-primary mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  No Section Selected
                </h2>
                <p className="mb-4">
                  Select a section from the manuscript structure to begin
                  editing.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
      <NewChapterModal
        isOpen={newChapterModalOpen}
        onClose={() => setNewChapterModalOpen(false)}
        onSubmit={createNewNode}
        selectedParentId={null}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default MainEditor;
