import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: !!sessionStorage.getItem("authToken"),
  isLoading: true,
  user: null,
  token: sessionStorage.getItem("authToken") || null,
};

// Initialize authentication on app start
export const initializeAuth = createAsyncThunk("auth/initialize", async (_, { dispatch }) => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    dispatch(setToken(token));
    await dispatch(checkAuth());
  } else {
    dispatch(logoutUser());
  }
});

// Register user
export const registerUser = createAsyncThunk("/auth/register", async (formData) => {
  const response = await axios.post(
    "https://localhost:5000/api/auth/register",
    formData,
    {
      withCredentials: true,
    }
  );
  return response.data;
});

// Login user
export const loginUser = createAsyncThunk("/auth/login", async (formData) => {
  const response = await axios.post(
    "https://localhost:5000/api/auth/login",
    formData,
    {
      withCredentials: true,
    }
  );

  if (!response.data.token) {
    return { success: false, message: "Token missing" };
  }

  sessionStorage.setItem("authToken", response.data.token);
  return response.data;
});

// Logout user
export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  await axios.post(
    "https://localhost:5000/api/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );
  sessionStorage.removeItem("authToken");
  return { success: true };
});

// Check authentication status
export const checkAuth = createAsyncThunk("/auth/checkauth", async (_, { rejectWithValue }) => {
  try {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
      return rejectWithValue({ success: false, message: "No token found" });
    }

    const response = await axios.get(
      "https://localhost:5000/api/auth/check-auth",
      {
        withCredentials: true,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );

    return response.data;
  } catch (error) {
    return rejectWithValue({ success: false });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setTokenFromSession: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.token = action.payload.token || null;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.token = sessionStorage.getItem("authToken") || null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        sessionStorage.removeItem("authToken");
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      });
  },
});

export const { setToken, setTokenFromSession } = authSlice.actions;
export default authSlice.reducer;
