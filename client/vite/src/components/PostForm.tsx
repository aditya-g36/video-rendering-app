import React, { useState, useContext, FormEvent } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface StreamFormProps {
  onClose: () => void;
}

const PostForm: React.FC<StreamFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!videoFile || !thumbnailFile) {
      console.error("Both video and thumbnail files are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("thumbnail", thumbnailFile);
      formData.append("userId", user.id);
      formData.append("title", title);
      formData.append("description", description);

      await axios.post("http://localhost:5000/api/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onClose();
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <Card className="w-[400px] bg-black">
        <CardHeader>
          <CardTitle>Upload a New Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  className="bg-black"
                  id="title"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  className="bg-black"
                  id="description"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="video">Video File</Label>
                <Input
                  className="bg-black"
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="thumbnail">Thumbnail File</Label>
                <Input
                  className="bg-black"
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setThumbnailFile(e.target.files?.[0] || null)
                  }
                  required
                />
              </div>
            </div>
            <CardFooter className="flex justify-between">
              <Button className="bg-black" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button className="bg-white" type="submit">
                Upload Video
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostForm;
