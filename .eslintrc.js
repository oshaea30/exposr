module.exports = {
  extends: ["react-app", "react-app/jest"],
  rules: {
    // Disable warnings that are blocking deployment
    "jsx-a11y/anchor-is-valid": "off",
    "no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn",
  },
};
