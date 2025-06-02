import { create } from 'zustand';
import AuthService from "../service/authService.js";

const useAuthStore = create((set) => ({
    // Khởi tạo trạng thái ban đầu từ AuthService và localStorage
    // Đảm bảo trạng thái này được đồng bộ khi store được tạo
    isAuthenticated: AuthService.isAuthenticated(),
    currentUser: AuthService.getCurrentUser(),
    accessToken: AuthService.getToken(),       // Thêm accessToken vào store
    refreshToken: AuthService.getRefreshToken(), // Thêm refreshToken vào store
    loading: false,

    // Cập nhật trạng thái loading
    setLoading: (isLoading) => set({ loading: isLoading }),
    setLoginState: (newState) => {
        set(newState);
    },

    // Hành động đăng nhập
    login: async (credentials) => {
        set({ loading: true });
        try {
            const result = await AuthService.login(credentials); // result là object từ backend
            // Đảm bảo userId được lấy ra từ result
            const { userName, role, fullName, accessToken, refreshToken, userId } = result; // THÊM userId Ở ĐÂY

            const userProfile = {
                userId: userId, // LƯU userId VÀO userProfile của store
                userName: userName,
                role: role,
                fullName: fullName || null
            };

            set({
                isAuthenticated: true,
                currentUser: userProfile,
                accessToken: accessToken,
                refreshToken: refreshToken
            });

        } catch (error) {
            console.error("Login failed in useAuthStore:", error);
            // set({
            //     isAuthenticated: false,
            //     currentUser: null,
            //     accessToken: null,
            //     refreshToken: null
            // });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // Hành động đăng xuất
    logout: () => {
        AuthService.logout(); // Xóa token và user khỏi localStorage
        // Cập nhật trạng thái trong store
        set({
            isAuthenticated: false,
            currentUser: null,
            accessToken: null,
            refreshToken: null
        });
    },

    // Hành động cập nhật thông tin người dùng (nếu cần thay đổi thông tin user sau khi login)
    setCurrentUser: (user) => set({ currentUser: user }),

    // Hành động để cập nhật token (ví dụ: sau khi làm mới token)
    setTokens: (newAccessToken, newRefreshToken = null) => {
        AuthService.setAccessToken(newAccessToken); // Cập nhật Access Token trong localStorage
        if (newRefreshToken) {
            AuthService.setRefreshToken(newRefreshToken); // Cập nhật Refresh Token trong localStorage nếu có
        }
        set({ accessToken: newAccessToken, refreshToken: newRefreshToken || AuthService.getRefreshToken() });
    },

    // Hành động khởi tạo trạng thái từ localStorage (gọi khi ứng dụng khởi động)
    initializeAuth: () => {
        set({
            isAuthenticated: AuthService.isAuthenticated(),
            currentUser: AuthService.getCurrentUser(),
            accessToken: AuthService.getToken(),
            refreshToken: AuthService.getRefreshToken()
        });
    }
}));

export default useAuthStore;