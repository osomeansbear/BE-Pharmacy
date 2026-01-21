const whitelist = [
  "http://localhost:3000", // Front end local
];
const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép Postman, curl (origin undefined)
    if (!origin) return callback(null, true);

    // Kiểm tra dynamic startsWith
    const allowed = whitelist.some((w) =>
      origin.startsWith(w.replace(/\/$/, ""))
    );
    if (allowed) return callback(null, true);

    // Nếu không match
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
};

module.exports = corsOptions;
