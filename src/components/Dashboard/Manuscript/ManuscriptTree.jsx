"use client";

import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  MoreHorizontal,
  Pen,
  Plus,
  Trash,
  BookOpen,
} from "lucide-react";
import { useState, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteConfirmationModal } from "@/components/Modals/DeleteConfirmationModal";
import { EditChapterModal } from "@/components/Modals/EditChapterModal";
import NewChapterModal from "@/components/Modals/NewChapterModal";
import { useAuth } from "@/context/userContext";
import { fetchManuscriptTree } from "@/apiCall/auth";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";

const generateUniqueKey = (node, level) => `${node._id}-${level}-${node.type}`;

const TreeNode = memo(
  ({
    node,
    level,
    expandedNodes,
    onToggle,
    onEdit,
    onDelete,
    onAdd,
    statusColors,
  }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node._id] || false;

    const handleToggle = useCallback(
      (e) => {
        e.stopPropagation();
        e.preventDefault();
        onToggle(node._id);
      },
      [node._id, isExpanded, onToggle]
    );

    const handleEdit = useCallback(
      (e) => {
        e.stopPropagation();
        e.preventDefault();
        onEdit(node);
      },
      [node, onEdit]
    );

    const handleDelete = useCallback(
      (e) => {
        e.stopPropagation();
        e.preventDefault();
        onDelete(node);
      },
      [node, onDelete]
    );

    const handleAdd = useCallback(
      (e) => {
        e.stopPropagation();
        e.preventDefault();
        onAdd(node._id);
      },
      [node._id, onAdd]
    );
    const calculateTotalWordCount = (node) => {
      if (!node.children || node.children.length === 0) {
        return node.wordCount || 0;
      }

      return node.children.reduce(
        (sum, child) => sum + calculateTotalWordCount(child),
        node.wordCount || 0
      );
    };

    return (
      <div className="select-none">
        <div
          className={`group flex items-center gap-2 rounded-md px-2 py-1.5 mb-1 transition-colors cursor-pointer ${
            isExpanded ? "bg-[#eaa8f9]" : ""
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={handleToggle}
        >
          {hasChildren ? (
            <div
              className="h-5 w-5 text-primary hover:bg-primary/10 rounded flex items-center justify-center transition-colors"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleToggle(e);
                }
              }}
            >
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

          <span className="flex-1 truncate font-medium text-slate-900">
            {node.title}
          </span>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div
              className="h-7 w-7 text-primary hover:bg-primary/10 rounded flex items-center justify-center transition-colors cursor-pointer"
              onClick={(e) => handleEdit(e)} // Edit button
              role="button"
              tabIndex={0}
            >
              <Pen className="h-4 w-4" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className="h-7 w-7 text-primary hover:bg-primary/10 rounded flex items-center justify-center transition-colors cursor-pointer"
                  role="button"
                  tabIndex={0}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom" sideOffset={5}>
                {node.type !== "scene" && (
                  <>
                    <DropdownMenuItem onClick={handleAdd}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add {node.type === "part" ? "Chapter" : "Scene"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleEdit}>
                  <Pen className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs border-slate-200 bg-white text-primary"
            >
              {calculateTotalWordCount(node)} words
            </Badge>
            <Badge className={`text-xs ${statusColors[node.status]}`}>
              {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
            </Badge>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child) => (
              <TreeNode
                key={generateUniqueKey(child, level + 1)}
                node={child}
                level={level + 1}
                expandedNodes={expandedNodes}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onAdd={onAdd}
                statusColors={statusColors}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

TreeNode.displayName = "TreeNode";

export function ManuscriptTree({ refresh, setRefresh, setUserInfo }) {
  const [manuscript, setManuscript] = useState(null);
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [newChapterModalOpen, setNewChapterModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedParentId, setSelectedParentId] = useState(undefined);
  const { user, token } = useAuth();

  const statusColors = {
    draft:
      "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800/30 dark:bg-amber-900/30 dark:text-amber-300",
    editing:
      "border-purple-200 bg-purple-100 text-purple-700 dark:border-purple-800/30 dark:bg-purple-900/30 dark:text-purple-300",
    complete:
      "border-teal-200 bg-teal-100 text-teal-700 dark:border-teal-800/30 dark:bg-teal-900/30 dark:text-teal-300",
  };

  useEffect(() => {
    if (!user?.selectedManuscript) return;

    const getManuscriptTree = async () => {
      setLoading(true);
      const result = await fetchManuscriptTree(
        user?.selectedManuscript?._id,
        token
      );

      if (result.success) {
        setManuscript(result.manuscript);
        setTree(result.sections);
        setUserInfo({
          title: result.manuscript.title,
          author: result.manuscript.author,
          genre: result.manuscript.genre,
        });
      } else {
        setTree([]);
      }

      setLoading(false);
    };

    getManuscriptTree();
  }, [user?.selectedManuscript, token, setUserInfo, refresh]);

  const handleToggleNode = useCallback((nodeId) => {
    setExpandedNodes((prevExpanded) => {
      const newExpanded = { ...prevExpanded };
      const currentState = newExpanded[nodeId] || false;
      newExpanded[nodeId] = !currentState;
      return newExpanded;
    });
  }, []);

  const handleAddChapter = useCallback((parentId) => {
    setSelectedParentId(parentId);
    setNewChapterModalOpen(true);
  }, []);

  const handleAddPart = useCallback(() => {
    setSelectedParentId(undefined);
    setNewChapterModalOpen(true);
  }, []);

  const handleEditNode = useCallback((node) => {
    setSelectedNode(node);
    setEditModalOpen(true);
  }, []);

  const handleDeleteNode = useCallback((node) => {
    setSelectedNode(node);
    setDeleteModalOpen(true);
  }, []);

  const createNewNode = (data) => {
    const newNode = {
      id: `${data.type}-${Date.now()}`,
      title: data.title,
      type: data.type,
      wordCount: 0,
      status: "draft",
    };

    if (!data.parentId) {
      setTree((prevTree) => [...prevTree, newNode]);
      return;
    }

    const addChildToNode = (nodes) => {
      return nodes.map((node) => {
        if (node._id === data.parentId) {
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
      [data.parentId]: true,
    }));
  };

  const updateNode = (data) => {
    const updateNodeInTree = (nodes) => {
      return nodes.map((node) => {
        if (node._id === data._id) {
          return {
            ...node,
            title: data.title,
            status: data.status,
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateNodeInTree(node.children),
          };
        }
        return node;
      });
    };

    setTree((prevTree) => updateNodeInTree(prevTree));
  };

  const deleteNode = async (id) => {
    try {
      const response = await fetch(
        `https://apis.manuscripthq.com/api/section/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );
      const result = await response.json();
      if (result.status === "success") {
        toast.success("Deleted successfully");
        setRefresh(!refresh);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const getParentOptions = () => {
    const options = [];

    const addNodeToOptions = (node) => {
      if (node.type === "part" || node.type === "chapter") {
        options.push({ id: node._id, title: node.title });
      }
      if (node.children) {
        node.children.forEach(addNodeToOptions);
      }
    };

    tree.forEach(addNodeToOptions);
    return options;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tree.length === 0 ? (
        <div className="space-y-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-white">
            <CardContent className="text-center py-12">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-primary/10 to-[#9B1C8C]/10 rounded-3xl flex items-center justify-center mx-auto">
                  <BookOpen className="w-12 h-12 text-primary" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Start Your Manuscript
                  </h3>
                  <p className="text-slate-600 text-lg max-w-lg mx-auto">
                    Your manuscript is empty. Get started by adding a part,
                    chapter, or scene to build your story structure. [+ Add
                    First Section] Use sections like “Act 1,” “Chapter 1,” or
                    “Opening Scene”
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => handleAddPart()}
                    className="bg-primary"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create First Part
                  </Button>
                  <p className="text-sm text-slate-500">
                    Parts help organize your manuscript into major sections like
                    "Act 1", "Part One", etc.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        tree.map((node) => (
          <TreeNode
            key={generateUniqueKey(node, 0)}
            node={node}
            level={0}
            expandedNodes={expandedNodes}
            onToggle={handleToggleNode}
            onEdit={handleEditNode}
            onDelete={handleDeleteNode}
            onAdd={handleAddChapter}
            statusColors={statusColors}
          />
        ))
      )}

      <Button
        variant="ghost"
        className="mt-4 w-full justify-start text-primary hover:bg-primary/10 transition-colors"
        onClick={() => handleAddPart()}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add new Part, Chapter, Scenes.
      </Button>

      <NewChapterModal
        isOpen={newChapterModalOpen}
        onClose={() => setNewChapterModalOpen(false)}
        onSubmit={createNewNode}
        parentOptions={getParentOptions()}
        selectedParentId={selectedParentId}
        refresh={refresh}
        setRefresh={setRefresh}
      />

      {selectedNode && (
        <EditChapterModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSubmit={updateNode}
          chapter={selectedNode}
        />
      )}

      {selectedNode && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => deleteNode(selectedNode._id)}
          title={`Delete ${
            selectedNode.type.charAt(0).toUpperCase() +
            selectedNode.type.slice(1)
          }`}
          description={`Are you sure you want to delete "${selectedNode.title}"? This action cannot be undone.`}
          itemName={selectedNode.type}
        />
      )}
    </div>
  );
}
