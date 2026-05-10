import axios from "axios"
import { setUserData } from "../redux/userSlice";
import { setItems } from "../redux/itemSlice";
import { setClaims, setMyClaims } from "../redux/claimSlice";


// Declare API URL BEFORE axios uses it (prevents TDZ issues in production bundles)
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:4000"
    : "https://campussync-e49n.onrender.com")
).replace(/\/$/, "");

const serverUrl = API_BASE_URL;

// Configure axios defaults safely for cross-origin cookies
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;
// NOTE: Don't set Content-Type here - let browser auto-set it for FormData uploads


export const getCurrentuser =async(dispatch)=>{
    try {
        const res =await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true});
    
        dispatch(setUserData(res.data.user))
        
    } catch (error) {
        console.log(error);
        
    }

}


export const updateProfile = async (dispatch, payload) => {
  try {
    const isFormData = typeof FormData !== "undefined" && payload instanceof FormData
    const config = { 
      withCredentials: true,
      headers: {}
    }
    
    // For FormData, DON'T set Content-Type - browser will auto-set with boundary
    // For JSON, explicitly set Content-Type
    if (!isFormData) {
      config.headers['Content-Type'] = 'application/json'
    }
    
    const res = await axios.put(`${serverUrl}/api/user/profile`, payload, config)
    dispatch(setUserData(res.data.user));
    return res.data;
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      error: true,
      message: error.response?.data?.message || "Update failed",
    };
  }
};

export const deleteProfileImage = async (url) => {
  try {
    const res = await axios.delete(`${serverUrl}/api/user/profile/image`, {
      data: { url },
      withCredentials: true,
    })
    return res.data
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Delete failed' }
  }
}

export const generateNotes = async (payload) => {
  try {
    const { data } = await axios.post(
      `${serverUrl}/api/notes/generate-notes`,
      payload,
      { withCredentials: true }
    );
    console.log(data);
    
    return data;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.message || "Generate failed"
    };
  }
};


export const fetchItems = async (dispatch) => {
  try {
    const res = await axios.get(`${serverUrl}/api/item/getAll`, {
      withCredentials: true,
    })
    dispatch(setItems(res.data.items || []))
  } catch (err) {
    console.error("Fetch items failed", err)
  }
}

export const deleteItem = async (id) => {
  try {
    const res = await axios.delete(`${serverUrl}/api/item/${id}`, { withCredentials: true })
    return res.data
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Delete failed' }
  }
}

export const updateItem = async (id, payload) => {
  try {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
    const config = { withCredentials: true }
    if (!isFormData) config.headers = { 'Content-Type': 'application/json' }
    const res = await axios.put(`${serverUrl}/api/item/${id}`, payload, config)
    return res.data
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Update failed' }
  }
}

export const fetchClaimRequests = async (dispatch) => {
  try {
    const res = await axios.get(`${serverUrl}/api/item/claimed-request`, {
      withCredentials: true,
    })
    dispatch(setClaims(res.data?.claims || []))
  } catch (err) {
    console.error("Fetch claim requests failed", err)
  }
}

export const fetchMyClaims = async (dispatch) => {
  try {
    const res = await axios.get(`${serverUrl}/api/item/claim/my`, {
      withCredentials: true,
    })
    dispatch(setMyClaims(res.data?.claims || []))
  } catch (err) {
    console.error("Fetch my claims failed", err)
  }
}

export const fetchMarketplaceItems = async (dispatch, filters = {}) => {
  try {
    const params = new URLSearchParams()
    if (filters.category && filters.category !== "all") {
      params.append("category", filters.category)
    }
    if (filters.search) {
      params.append("search", filters.search)
    }
    if (filters.status) {
      params.append("status", filters.status)
    }

    const res = await axios.get(`${serverUrl}/api/marketplace?${params.toString()}`, {
      withCredentials: true,
    })
    
    const { setMarketplaceItems } = await import("../redux/marketplaceSlice")
    dispatch(setMarketplaceItems(res.data.items || []))
    return res.data
  } catch (err) {
    console.error("Fetch marketplace items failed", err)
    return { items: [] }
  }
}

export const deleteMarketplaceItem = async (id) => {
  try {
    const res = await axios.delete(`${serverUrl}/api/marketplace/${id}`, { withCredentials: true })
    return res.data
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Delete failed' }
  }
}

export const updateMarketplaceItem = async (id, payload) => {
  try {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
    const config = { withCredentials: true }
    if (!isFormData) config.headers = { 'Content-Type': 'application/json' }
    const res = await axios.put(`${serverUrl}/api/marketplace/${id}`, payload, config)
    return res.data
  } catch (error) {
    return { error: true, message: error.response?.data?.message || 'Update failed' }
  }
}

export const fetchMarketplaceItemById = async (id) => {
  try {
    const res = await axios.get(`${serverUrl}/api/marketplace/${id}`, {
      withCredentials: true,
    })
    return res.data
  } catch (err) {
    console.error("Fetch marketplace item failed", err)
    throw err
  }
}

export const fetchMessages = async (receiverId, dispatch) => {
  try {
    if (!receiverId) {
      return []
    }

    const res = await axios.get(`${serverUrl}/api/message/get/${receiverId}`, {
      withCredentials: true,
    })

    const messages = res?.data?.messages || []

    if (dispatch) {
      const { setMessages } = await import("../redux/messageSlice")
      dispatch(setMessages(messages))
    }

    return messages
  } catch (error) {
    console.error("Fetch messages failed", error)
    if (dispatch) {
      const { setMessages } = await import("../redux/messageSlice")
      dispatch(setMessages([]))
    }
    return []
  }
}

export const fetchConversationUsers = async (dispatch) => {
  try {
    const res = await axios.get(`${serverUrl}/api/message/conversations`, {
      withCredentials: true,
    })

    const users = res?.data?.conversationUsers || []

    if (dispatch) {
      const { setConversationUsers } = await import("../redux/messageSlice")
      dispatch(setConversationUsers(users))
    }

    return users
  } catch (error) {
    console.error("Fetch conversations failed", error)
    if (dispatch) {
      const { setConversationUsers } = await import("../redux/messageSlice")
      dispatch(setConversationUsers([]))
    }
    return []
  }
}

export const fetchAllUsers = async (dispatch) => {
  try {
    const res = await axios.get(`${serverUrl}/api/message/allusers`, {
      withCredentials: true,
    })

    const users = res?.data?.users || []

    if (dispatch) {
      const { setAllUsers } = await import("../redux/messageSlice")
      dispatch(setAllUsers(users))
    }

    return users
  } catch (error) {
    console.error("Fetch all users failed", error)
    if (dispatch) {
      const { setAllUsers } = await import("../redux/messageSlice")
      dispatch(setAllUsers([]))
    }
    return []
  }
}

// Backward compatible alias (typo-safe)
export const fatchMessage = fetchMessages