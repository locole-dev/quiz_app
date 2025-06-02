class LoginModel {
    constructor() {
        this.username = undefined;
        this.password = undefined;
    }
    setUsername(username) {
        this.username = username;
        return this;
    }
    setPassword(password) {
        this.password = password;
        return this;
    }
    build() {
        return this;
    }
}

export default LoginModel;