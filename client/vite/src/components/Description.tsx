import { Avatar } from "@nextui-org/react";

interface VideoDescriptionProps {
  title: string;
  username: string;
  profilePicture: string;
  description: string;
}

export default function VideoDescription({
  title,
  username,
  profilePicture,
  description,
}: VideoDescriptionProps) {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold text-gray-300">{title}</h2>
      <div className="flex items-center mt-2">
        <Avatar src={profilePicture} size="md" alt={username} />
        <p className="ml-2 text-sm text-gray-500">{username}</p>
      </div>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
    </div>
  );
}
