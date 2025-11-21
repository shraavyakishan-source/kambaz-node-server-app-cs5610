import axios from "axios";
import fs from "fs";

// Axios instance with cookies
const axiosInstance = axios.create({
  withCredentials: true,
});

const BASE_URL = "https://kambaz-node-server-app-cs5610-iauz.onrender.com";
const COOKIE_FILE = "cookies.txt";

async function saveCookies(cookieHeader) {
  if (cookieHeader) {
    fs.writeFileSync(COOKIE_FILE, cookieHeader.join("; "));
  }
}

async function loadCookies() {
  if (fs.existsSync(COOKIE_FILE)) {
    const cookies = fs.readFileSync(COOKIE_FILE, "utf8");
    return cookies;
  }
  return "";
}

async function testBackend() {
  try {
    console.log("1️⃣ Signing up...");
    let response = await axiosInstance.post(`${BASE_URL}/api/users/signup`, {
      username: "testuser",
      password: "1234",
      email: "test@example.com",
    });
    console.log("Signup response:", response.data);

    await saveCookies(response.headers["set-cookie"]);

    console.log("\n2️⃣ Signing in...");
    response = await axiosInstance.post(
      `${BASE_URL}/api/users/signin`,
      {
        username: "testuser",
        password: "1234",
      },
      { headers: { Cookie: await loadCookies() } }
    );
    console.log("Signin response:", response.data);

    await saveCookies(response.headers["set-cookie"]);

    console.log("\n3️⃣ Fetching profile...");
    response = await axiosInstance.post(
      `${BASE_URL}/api/users/profile`,
      {},
      { headers: { Cookie: await loadCookies() } }
    );
    console.log("Profile response:", response.data);

    console.log("\n4️⃣ Signing out...");
    response = await axiosInstance.post(
      `${BASE_URL}/api/users/signout`,
      {},
      { headers: { Cookie: await loadCookies() } }
    );
    console.log("Signout response:", response.status);

    console.log("\n5️⃣ Profile after signout...");
    try {
      response = await axiosInstance.post(
        `${BASE_URL}/api/users/profile`,
        {},
        { headers: { Cookie: await loadCookies() } }
      );
      console.log("Profile after signout response:", response.data);
    } catch (err) {
      console.error(
        "Expected error after signout:",
        err.response.status,
        err.response.data
      );
    }
  } catch (err) {
    console.error("Error during test:", err.response?.data || err.message);
    app.get("/api/users/signup", (req, res) => res.send("Signup route works!"));
  }
}

testBackend();
