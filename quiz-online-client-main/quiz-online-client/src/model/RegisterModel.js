class RegisterModel {
    constructor() {
        this.fullName = undefined;
        this.email = undefined;
        this.password = undefined;
        this.username = undefined;
        this.phone = undefined;
        this.gender = undefined;
    }
    setFullName(fullName) {
        this.fullName = fullName;
        return this;
    }
    setEmail(email) {
        this.email = email;
        return this;
    }
    setPassword(password) {
        this.password = password;
        return this;
    }
    setUsername(username) {
        this.username = username;
        return this;
    }
    setPhone(phone) {
        this.phone = phone;
        return this;
    }
    setGender(gender) {
        this.gender = gender;
        return this;
    }
    build() {
        return this;
    }
}

export default RegisterModel;