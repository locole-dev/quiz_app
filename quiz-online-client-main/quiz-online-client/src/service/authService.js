// Constants cho localStorage keys
import api from "../../utils/api.js";
import {message} from "antd"; // Đảm bảo đường dẫn này đúng

const AUTH_TOKEN_KEY = 'authToken'; // Key cho Access Token
const REFRESH_TOKEN_KEY = 'refreshToken'; // Key cho Refresh Token
const USER_DATA_KEY = 'userData'; // Key cho thông tin người dùng

const AuthService = {
    /**
     * Đăng nhập người dùng.
     * Gửi thông tin đăng nhập đến API, nhận về access token, refresh token và thông tin người dùng,
     * sau đó lưu vào localStorage.
     *
     * @param {object} credentials - Đối tượng chứa username và password.
     * Ví dụ: { username: 'testuser', password: 'password123' }
     * @returns {Promise<object>} Promise chứa dữ liệu phản hồi từ API,
     * bao gồm access token, refresh token và thông tin người dùng (userName, role, fullName).
     * @throws {Error} Ném lỗi nếu request API thất bại hoặc phản hồi không hợp lệ.
     */
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);

            // Destructure các trường trực tiếp từ response.data
            // Backend trả về: fullName, userName, role, refreshToken, accessToken
            const { accessToken, refreshToken, userName, role, fullName, userId } = response.data;

            // Kiểm tra tính hợp lệ của dữ liệu phản hồi
            if (!accessToken || !refreshToken || !userName || !role) {
                throw new Error('Phản hồi đăng nhập không hợp lệ: Thiếu token hoặc thông tin người dùng.');
            }

            // Lưu accessToken và refreshToken vào localStorage
            localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

            // Lưu thông tin người dùng vào localStorage
            // Đảm bảo lưu các trường cần thiết của người dùng dưới dạng đối tượng
            const userProfile = {
                userId: userId,
                userName: userName,
                role: role,
                fullName: fullName || null // fullName có thể là null, xử lý để đảm bảo không bị undefined
            };
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(userProfile));

            // Trả về toàn bộ dữ liệu gốc từ backend
            // (Hoặc bạn có thể trả về userProfile nếu Zustand store chỉ cần đó)
            return response.data;
        } catch (error) {
            console.error("AuthService: Login failed:", error.response?.data || error.message);
            message.error('Đăng nhập thất bại. Vui lòng kiểm tra lại tên người dùng và mật khẩu.');
            // Ném lỗi để component hoặc Zustand store có thể bắt và hiển thị thông báo.
            throw error;
        }
    },

    /**
     * Đăng ký người dùng mới.
     * Gửi dữ liệu đăng ký đến API.
     *
     * @param {object} userData - Dữ liệu người dùng để đăng ký.
     * Ví dụ: { username: 'newuser', password: 'newpassword', email: 'new@example.com' }
     * @returns {Promise<object>} Promise chứa dữ liệu phản hồi từ API.
     * @throws {Error} Ném lỗi nếu request API thất bại.
     */
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error("AuthService: Registration failed:", error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Đăng xuất người dùng.
     * Xóa tất cả các token và thông tin người dùng khỏi localStorage.
     * Lưu ý: Hàm này không gọi API backend cho việc đăng xuất
     * trừ khi bạn có endpoint cụ thể cho logout (ví dụ: để invalidate token ở server).
     */
    logout: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY); // Xóa Refresh Token
        localStorage.removeItem(USER_DATA_KEY);
        console.log("AuthService: User logged out and localStorage cleared.");
    },

    /**
     * Lấy Access Token từ localStorage.
     *
     * @returns {string|null} Access Token hoặc null nếu không có.
     */
    getToken: () => {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    },

    /**
     * Lấy Refresh Token từ localStorage.
     *
     * @returns {string|null} Refresh Token hoặc null nếu không có.
     */
    getRefreshToken: () => {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    /**
     * Lấy thông tin người dùng đã đăng nhập từ localStorage.
     *
     * @returns {object|null} Đối tượng thông tin người dùng hoặc null nếu không có.
     */
    getCurrentUser: () => {
        const userData = localStorage.getItem(USER_DATA_KEY);
        try {
            console.log("AuthService: Retrieving user data from localStorage:", userData);
            return userData ? JSON.parse(userData) : null;
        } catch (e) {
            console.error("AuthService: Failed to parse user data from localStorage:", e);
            // Xóa dữ liệu lỗi để tránh các vấn đề sau này
            AuthService.logout();
            return null;
        }
    },

    /**
     * Kiểm tra xem người dùng có đang đăng nhập hay không.
     * Được coi là đã đăng nhập nếu có Access Token và thông tin người dùng hợp lệ.
     *
     * @returns {boolean} True nếu có Access Token và thông tin người dùng, ngược lại False.
     */
    isAuthenticated: () => {
        // Kiểm tra cả access token và user data để đảm bảo trạng thái xác thực đầy đủ
        return !!AuthService.getToken() && !!AuthService.getCurrentUser();
    },

    /**
     * Lưu Access Token vào localStorage. (Hữu ích khi refresh token)
     * @param {string} token - Access Token mới.
     */
    setAccessToken: (token) => {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    },

    /**
     * Lưu Refresh Token vào localStorage.
     * @param {string} token - Refresh Token mới.
     */
    setRefreshToken: (token) => {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    },

    /**
     * Lưu thông tin người dùng vào localStorage. (Hữu ích khi cập nhật thông tin user)
     * @param {object} user - Đối tượng thông tin người dùng.
     */
    setUserData: (user) => {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    },
};

export default AuthService;