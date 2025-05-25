import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { data } from "react-router-dom";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isloggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            // 401 means no logged-in user — normal in many cases
            if (error.response?.status !== 401) {
                console.error("Unexpected error in checkAuth:", error);
            }
            set({ authUser: null });  // Treat as not logged in
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally {
            set({ isSigningUp: false });
        }
    },
    login: async (data) => {
        set({ isloggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged In successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally {
            set({ isloggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put(
                "/auth/update-profile", data,
                {
                    headers: {
                        "Content-Type": "application/json", // ✅ tell server it's JSON
                    },
                }
            );
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in update profile", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

}))