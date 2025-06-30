import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { socket } from "./MessageInput";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser, setTypingUserId, typingUserId } = useChatStore();
    const { onlineUsers, authUser } = useAuthStore();


    useEffect(() => {
        socket.on("typing", ({ from, to }) => {
            console.log("Received typing event on client:", from, to); // <-- confirm this shows in browser console

            if (to === authUser._id && from === selectedUser._id) {
                setTypingUserId(from);

                const timeout = setTimeout(() => {
                    setTypingUserId(null);
                }, 7000);

                return () => clearTimeout(timeout);
            }
        });

        return () => socket.off("typing");
    }, [selectedUser, authUser._id]);


    const isTyping = typingUserId === selectedUser._id

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium">{selectedUser.fullName}</h3>
                        <p className="text-sm text-base-content/70">
                            {isTyping
                                ? "Typing..."
                                : onlineUsers.includes(selectedUser._id)
                                    ? "Online"
                                    : "Offline"}
                        </p>
                    </div>
                </div>

                {/* Close button */}
                <button onClick={() => setSelectedUser(null)}>
                    <X />
                </button>
            </div>
        </div>
    );
};
export default ChatHeader;