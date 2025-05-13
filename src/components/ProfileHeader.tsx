
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileHeaderProps {
  username?: string;
  avatarUrl?: string;
}

const ProfileHeader = ({ 
  username = "32424242424242424", 
  avatarUrl = "https://img.freepik.com/premium-photo/3d-cartoon-avatar-man-minimal-3d-character_652053-2070.jpg" 
}: ProfileHeaderProps) => {
  return (
    <div className="relative overflow-hidden mb-3">
      <div className="absolute inset-0 bg-gradient-to-b from-ptc-lime/20 to-black/50 z-0"></div>
      <div className="relative z-10 bg-black/30 rounded-b-[30px]">
        <div className="px-4 py-4 relative z-10 rounded-b-[30px]">
          <div className="flex gap-3 items-center justify-between">
            <div className="flex gap-2 items-center bg-black/50 border border-gray-500/50 backdrop-blur rounded-full pe-3">
              <img
                className="w-[48px] aspect-square border border-gray-500/50 rounded-full"
                src={avatarUrl}
                alt="Profile"
              />
              <h1 className="text-white text-sm truncate max-w-[120px]">{username}</h1>
              <img 
                className="w-[15px] aspect-square invert" 
                src="https://cdn-icons-png.flaticon.com/128/2985/2985179.png" 
                alt="Verified" 
              />
            </div>
            <Link
              className="flex gap-2 items-center bg-black/50 border border-gray-500/50 backdrop-blur rounded-full p-[10px]"
              to="/profile"
            >
              <Settings className="w-6 h-6 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
