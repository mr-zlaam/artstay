export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Custom rules
    "type-empty": [2, "never"], // Ensure the type is not empty
    "type-enum": [
      2,
      "always",
      [
        "feat", // new feature
        "fix", // bug fix
        "docs", // documentation only changes
        "style", // formatting, missing semicolons, etc
        "refactor", // code change that neither fixes a bug nor adds a feature
        "perf", // performance improvements
        "test", // adding missing tests
        "chore", // updating build tasks, package manager configs, etc
        "revert" // reverting a previous commit
      ]
    ],
    "header-max-length": [2, "always", 100],
    "subject-case": [2, "always", ["sentence-case"]]
  }
};