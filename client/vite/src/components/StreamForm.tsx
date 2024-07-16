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

import { Snippet } from "@nextui-org/react";

interface StreamInfo {
  streamKey: string;
  rtmpUrl: string;
}

interface StreamFormProps {
  onClose: () => void;
}

const StreamForm: React.FC<StreamFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<StreamInfo>(
        "http://localhost:5000/api/livestream/create-stream",
        {
          userId: user.id,
          title,
          description,
        }
      );
      setStreamInfo(response.data);
    } catch (error) {
      console.error("Error creating stream:", error);
    }
  };

  return (
    <div className=" fixed inset-0 bg-black/50 flex justify-center items-center">
      <Card className="w-[400px] bg-black">
        <CardHeader>
          <CardTitle>
            {!streamInfo ? "Start a New Stream" : "Stream Created!"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!streamInfo ? (
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
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <strong>Stream Key:</strong>
              <Snippet variant="bordered">{streamInfo.streamKey}</Snippet>
              <p>
                <strong>RTMP URL:</strong>
                <Snippet variant="bordered">{streamInfo.rtmpUrl}</Snippet>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!streamInfo ? (
            <>
              <Button className="bg-black" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="bg-white"
                onClick={(e) => handleSubmit(e as any)}
              >
                Start Stream
              </Button>
            </>
          ) : (
            <Button className="bg-white" onClick={onClose}>
              Close
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default StreamForm;
