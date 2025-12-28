
const BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const endpoints = {
  auth: {
    register: `${BASE_URL}/auth/register`,
    login: `${BASE_URL}/auth/login`,
    logout: `${BASE_URL}/auth/logout`,
  },
  users: {
    profile: `${BASE_URL}/users/profile`,
  },
  movies: {
    search: (q) => `${BASE_URL}/movies/search?q=${encodeURIComponent(q)}`,
    trending: `${BASE_URL}/movies/trending`,
    popular: `${BASE_URL}/movies/popular`,
    latest: `${BASE_URL}/movies/latest`,
    details: (id) => `${BASE_URL}/movies/${id}`,
    trailer: (id) => `${BASE_URL}/movies/${id}/trailer`,
    similar: (id) => `${BASE_URL}/movies/${id}/similar`,
    streaming: (id) => `${BASE_URL}/movies/${id}/streaming`,
    genres: `${BASE_URL}/movies/genres`,
  },
  watchlist: {
    add: `${BASE_URL}/watchlist`,
    list: `${BASE_URL}/watchlist`,
    remove: (id) => `${BASE_URL}/watchlist/${id}`,
    update: (id) => `${BASE_URL}/watchlist/${id}`,
  },
  reviews: {
    create: `${BASE_URL}/reviews`,
    byMovie: (movieId) => `${BASE_URL}/reviews/${movieId}`,
    update: (id) => `${BASE_URL}/reviews/${id}`,
    delete: (id) => `${BASE_URL}/reviews/${id}`,
  },
  parental: {
    set: `${BASE_URL}/parental/settings`,
    get: `${BASE_URL}/parental/settings`,
  },
  childProfiles: {
    list: `${BASE_URL}/child-profiles`,
    create: `${BASE_URL}/child-profiles`,
    update: (id) => `${BASE_URL}/child-profiles/${id}`,
    remove: (id) => `${BASE_URL}/child-profiles/${id}`,
  },
  plans: {
    list: `${BASE_URL}/plans`,
    purchase: `${BASE_URL}/plans/purchase`,
    createIntent: `${BASE_URL}/payments/create-intent`,
    verifyPayment: `${BASE_URL}/payments/verify`,
    unsubscribe: `${BASE_URL}/subscription/cancel`,
  },
  admin: {
    users: `${BASE_URL}/admin/users`,
    updateUserRole: (id) => `${BASE_URL}/admin/users/${id}/role`,
    deleteUser: (id) => `${BASE_URL}/admin/users/${id}`,
    reviews: `${BASE_URL}/admin/reviews`,
    deleteReview: (id) => `${BASE_URL}/admin/reviews/${id}`,
    toggleReviewVisibility: (id) => `${BASE_URL}/admin/reviews/${id}/visibility`,
    logs: `${BASE_URL}/admin/logs`,
    watchlists: `${BASE_URL}/admin/watchlists`,
    stats: `${BASE_URL}/admin/stats`,
  },
  logs: {
    list: `${BASE_URL}/logs`,
  },
  subscription: {
    get: `${BASE_URL}/subscription`,
    update: `${BASE_URL}/subscription/update`,
  },
  googleAI: {
    chat: `${BASE_URL}/ai/chat`,
  },
};

export default BASE_URL;
