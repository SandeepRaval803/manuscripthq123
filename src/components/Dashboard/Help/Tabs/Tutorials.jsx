import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllTutorials } from "@/apiCall/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import Loader from "@/components/common/Loader";

// Simple modal (replace with your own if you have a better one)
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
        <button
          className="absolute top-1 cursor-pointer right-3 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}

export default function Tutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTutorial, setOpenTutorial] = useState(null);

  useEffect(() => {
    getAllTutorials()
      .then(setTutorials)
      .catch((err) => {
        console.error("Error:", err);
        toast.error("Failed to load video tutorials");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <TabsContent value="tutorials" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Video Tutorials</CardTitle>
            <CardDescription>
              Learn how to UsePRO with these step-by-step tutorials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <p className="text-sm text-muted-foreground">
                <Loader />
              </p>
            ) : tutorials.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tutorials found.
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tutorials.map((tutorial) => (
                  <div
                    key={tutorial._id}
                    className="space-y-1 cursor-pointer"
                    onClick={() => setOpenTutorial(tutorial)}
                  >
                    <div className="aspect-video overflow-hidden rounded-md bg-muted">
                      <img
                        src={tutorial.thumbnailUrl}
                        alt={tutorial.title || "Tutorial Thumbnail"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium">{tutorial.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tutorial.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Modal */}
      <Modal open={!!openTutorial} onClose={() => setOpenTutorial(null)}>
        {openTutorial && (
          <div className="mt-5">
            <div className="aspect-video mb-4 rounded overflow-hidden">
              <video
                src={openTutorial.videoUrl}
                controls
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-lg mb-1">{openTutorial.title}</h3>
            <p className="text-sm text-muted-foreground">
              {openTutorial.description}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
