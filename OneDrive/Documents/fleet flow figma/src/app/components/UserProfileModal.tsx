import { useState, useEffect, useRef } from "react";
import { X, Camera, User, Mail, Phone, MapPin, Calendar, Save } from "lucide-react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  role: string;
  onProfileUpdate?: () => void;
}

export function UserProfileModal({ isOpen, onClose, userId, userName, role, onProfileUpdate }: UserProfileModalProps) {
  const [profileData, setProfileData] = useState({
    name: userName,
    email: "",
    phone: "",
    location: "",
    bio: "",
    profilePicture: ""
  });
  const [previewImage, setPreviewImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile data from localStorage
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(`profile_${userId}`);
      if (stored) {
        const data = JSON.parse(stored);
        setProfileData(data);
        setPreviewImage(data.profilePicture || "");
      } else {
        // Set default values - preserve any existing data
        const currentName = sessionStorage.getItem('currentUserName') || userName;
        setProfileData({
          name: currentName,
          email: `${userId.toLowerCase()}@logistix.com`,
          phone: "",
          location: "",
          bio: "",
          profilePicture: ""
        });
        setPreviewImage("");
      }
    }
  }, [isOpen, userId, userName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 1MB)
      if (file.size > 1024 * 1024) {
        alert("Image size should be less than 1MB. Please choose a smaller image.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        console.log('Image loaded, original size:', result.length, 'characters');
        
        // Compress image by resizing
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Resize to max 200x200 for profile picture
          const maxSize = 200;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with reduced quality
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
          console.log('Image compressed, new size:', compressedImage.length, 'characters');
          console.log('Compression ratio:', ((1 - compressedImage.length / result.length) * 100).toFixed(1) + '%');
          
          setPreviewImage(compressedImage);
          setProfileData(prev => ({
            ...prev,
            profilePicture: compressedImage
          }));
        };
        img.src = result;
      };
      reader.onerror = () => {
        console.error('Error reading file');
        alert("Error reading image file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log('=== SAVING PROFILE ===');
    console.log('User ID:', userId);
    console.log('Profile data:', {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
      bio: profileData.bio,
      hasPicture: !!profileData.profilePicture,
      pictureLength: profileData.profilePicture?.length || 0
    });
    
    try {
      // Test localStorage availability
      const testKey = 'test_storage';
      try {
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        console.log('✓ localStorage is available');
      } catch (e) {
        console.error('✗ localStorage is NOT available or is full:', e);
        alert("Cannot save profile: Browser storage is full or disabled. Please enable cookies/storage in your browser settings.");
        return;
      }
      
      // Save to localStorage
      const dataToSave = JSON.stringify(profileData);
      console.log('Data size to save:', dataToSave.length, 'characters', '≈', (dataToSave.length / 1024).toFixed(2), 'KB');
      
      // Check if data is too large (localStorage typically has 5-10MB limit)
      if (dataToSave.length > 5 * 1024 * 1024) {
        console.error('✗ Data too large for localStorage');
        alert("Profile data is too large. Please use a smaller profile picture.");
        return;
      }
      
      localStorage.setItem(`profile_${userId}`, dataToSave);
      console.log('✓ Profile saved to localStorage with key:', `profile_${userId}`);
      
      // Verify it was saved
      const verification = localStorage.getItem(`profile_${userId}`);
      if (verification) {
        const parsed = JSON.parse(verification);
        console.log('✓ Verification SUCCESS: Profile picture exists in storage:', !!parsed.profilePicture);
        if (parsed.profilePicture) {
          console.log('✓ Picture size in storage:', parsed.profilePicture.length, 'characters');
        }
      } else {
        console.error('✗ Verification FAILED: Could not read back from localStorage');
        alert("Error: Profile was not saved correctly. Please try again.");
        return;
      }
      
      // Update user name in users list if changed
      if (profileData.name !== userName) {
        const usersData = localStorage.getItem('logistix_users');
        if (usersData) {
          const users = JSON.parse(usersData);
          const updatedUsers = users.map((user: any) => 
            user.id === userId ? { ...user, name: profileData.name } : user
          );
          localStorage.setItem('logistix_users', JSON.stringify(updatedUsers));
          
          // Update session storage
          sessionStorage.setItem('currentUserName', profileData.name);
          console.log('✓ Updated userName in session storage');
        }
      }
      
      alert("Profile updated successfully!");
      
      // Trigger profile update callback
      if (onProfileUpdate) {
        console.log('Calling onProfileUpdate callback');
        onProfileUpdate();
      }
      
      onClose();
    } catch (error) {
      console.error('✗ Error saving profile:', error);
      alert("Error saving profile: " + (error as Error).message);
    }
  };

  const getRoleDisplay = () => {
    const roleMap: any = {
      "admin": "Administrator",
      "fleet-owner": "Fleet Owner",
      "driver": "Driver",
      "shipper": "Shipper"
    };
    return roleMap[role] || role;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">My Profile</h2>
                <p className="text-blue-100 text-sm mt-1">Manage your account information</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    userName.charAt(0)
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500 mt-3">Click the camera icon to upload a photo</p>
            </div>

            {/* User ID & Role (Read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">User ID</div>
                <div className="font-semibold text-gray-900">{userId}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Role</div>
                <div className="font-semibold text-gray-900">{getRoleDisplay()}</div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="City, State"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
