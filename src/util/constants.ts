const RESPONSE_MESSAGES = {
  USERS_FOUND: "All users fetched Successfully",
  USER_LOGIN_SUCCESS: "User Logged In Successfully",
  USER_EXISTS: "User already exists",
  USER_REGISTERED_SUCCESSFULLY: "User registered successfully",
  CANDIDATES_FOUND: "All candidates fetched Successfully",
  CANDIDATE_FOUND: "candidate fetched Successfully",
  CANDIDATES_NOT_FOUND: "candidates not found",
  CANDIDATE_NOT_FOUND: "candidate not found",
  CANDIDATE_ADDED: "new candidate added Successfully",
  CANDIDATES_WITH_ADVERSE_ACTION: "candidates with notice fetched Successfully",
  ADVERSE_ACTION_SENT: "Adverse action notice sent successfully",
  COURT_SEARCH_ADDED: "New court search added successfully",
  COURT_SEARCH_FOUND: "court search found successfully",
  COURT_SEARCH_NOT_FOUND: "court search not found",
  REPORT_ADDED: "New report added successfully",
  REPORT_FOUND: "report found successfully",
  REPORT_NOT_FOUND: "report not found",
  NOT_AUTHENTICATED_NO_TOKEN: "Not Authenticated !!! No Token Passed",
  NOT_AUTHENTICATED_WRONG_TOKEN: "Not Authenticated !!! Wrong Token",
  INVALID_CREDENTIALS: "Invalid credentials !",
};

const PAGINATION = {
  DEFAULT_PAGE: "1",
  DEFAULT_LIMIT: "3",
};
module.exports = {
  RESPONSE_MESSAGES,
  PAGINATION,
};
