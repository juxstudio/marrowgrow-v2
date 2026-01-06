const PlayFabService = {
  // Initialize PlayFab
  initialize() {
    PlayFab.settings.titleId = "B6749"; // Set to Marrow Grow's PlayFab Title ID
  },

  // Session management
  // In PlayFabService, update the saveSession method to be more explicit:
  saveSession(playerName, sessionTicket) {
    if (!playerName || !sessionTicket) {
      console.error("Cannot save session: missing playerName or sessionTicket");
      return;
    }
    localStorage.setItem("marrowgrow_session_user", playerName);
    localStorage.setItem("marrowgrow_session_ticket", sessionTicket);
    localStorage.setItem("marrowgrow_session_timestamp", Date.now().toString());
  },

  //add a helper function to get the session data
  getSessionData() {
    const sessionUser = localStorage.getItem("marrowgrow_session_user");
    const sessionTicket = localStorage.getItem("marrowgrow_session_ticket");
    const timestamp = localStorage.getItem("marrowgrow_session_timestamp");

    if (sessionUser && timestamp) {
      const sessionAge = Date.now() - parseInt(timestamp);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (sessionAge < sevenDays) {
        return { user: sessionUser, ticket: sessionTicket };
      } else {
        this.clearSession();
      }
    }
    return null;
  },

  // Update getSession to use the helper
  getSession() {
    const sessionData = this.getSessionData();
    return sessionData ? sessionData.user : null;
  },

  clearSession() {
    localStorage.removeItem("marrowgrow_session_user");
    localStorage.removeItem("marrowgrow_session_timestamp");
    localStorage.removeItem("marrowgrow_session_ticket");
  },

  // Auto-login with stored session
  // In PlayFabService, update autoLogin:
  autoLogin() {
    return new Promise((resolve, reject) => {
      const sessionData = this.getSessionData();
      if (!sessionData || !sessionData.user || !sessionData.ticket) {
        resolve(null);
        return;
      }

      // Try to validate the session ticket
      PlayFab._internalSettings.sessionTicket = sessionData.ticket;

      // Use GetAccountInfo to validate the session
      PlayFab.ClientApi.GetAccountInfo({}, (result, error) => {
        if (error) {
          console.log("Session invalid, clearing:", error);
          this.clearSession();
          resolve(null);
          return;
        }

        if (result && result.data && result.data.AccountInfo) {
          console.log("Session valid for:", sessionData.user);
          resolve(sessionData.user);
        } else {
          this.clearSession();
          resolve(null);
        }
      });
    });
  },

  // Logout function
  logout() {
    this.clearSession();
    // PlayFab doesn't have an explicit logout, but clearing the session is enough
    PlayFab._internalSettings.sessionTicket = null;
    return Promise.resolve();
  },

  // Password validation
  validatePassword(password) {
    if (password.length < 4) {
      return {
        valid: false,
        message: "Password must be at least 4 characters long",
      };
    }
    if (!/[0-9]/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one number",
      };
    }
    return { valid: true };
  },

  // Simple hash function (better than base64 but still not production-grade)
  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16); // Convert to hex string
  },

  // Security questions for password reset
  securityQuestions: [
    "What was your first pet's name?",
    "What is your mother's maiden name?",
    "What was the name of your first school?",
    "What is your favorite color?",
    "What is your birth city?",
  ],

  // Register new user with password and security question
  register(playerName, password, securityQuestion, securityAnswer) {
    return new Promise((resolve, reject) => {
      // Validate password strength
      const validation = this.validatePassword(password);
      if (!validation.valid) {
        console.error("Password validation failed:", validation.message);
        reject(new Error(validation.message));
        return;
      }

      const request = { CustomId: playerName, CreateAccount: true };
      console.log("Attempting registration with:", request);

      PlayFab.ClientApi.LoginWithCustomID(request, (result, error) => {
        if (error) {
          console.error(
            "Registration login step failed:",
            JSON.stringify(error, null, 2)
          );
          reject(error);
          return;
        }

        if (result && result.data && result.data.PlayFabId) {
          console.log(
            "Registration login succeeded:",
            JSON.stringify(result.data, null, 2)
          );

          const passwordRequest = {
            Data: {
              passwordHash: this.hashPassword(password),
              securityQuestion: securityQuestion,
              securityAnswer: this.hashPassword(securityAnswer.toLowerCase()),
            },
          };

          PlayFab.ClientApi.UpdateUserData(
            passwordRequest,
            (pwdResult, pwdError) => {
              if (pwdError) {
                console.error(
                  "UpdateUserData failed:",
                  JSON.stringify(pwdError, null, 2)
                );
                reject(pwdError);
                return;
              }

              if (pwdResult && pwdResult.code === 200) {
                console.log(
                  "User data update successful:",
                  JSON.stringify(pwdResult, null, 2)
                );
                resolve(result.data.PlayFabId);
              } else {
                console.warn(
                  "Unexpected UpdateUserData result:",
                  JSON.stringify(pwdResult, null, 2)
                );
                reject(pwdResult);
              }
            }
          );
        } else {
          console.error(
            "Unexpected registration result:",
            JSON.stringify(result, null, 2)
          );
          reject(result);
        }
      });
    });
  },

  // Check if display name is already taken
  checkDisplayNameExists(displayName) {
    return new Promise((resolve, reject) => {
      // Use GetAccountInfo to check if display name exists
      PlayFab.ClientApi.GetAccountInfo(
        {
          Username: displayName,
        },
        (result, error) => {
          if (result && result.data && result.data.AccountInfo) {
            resolve(true); // Display name exists
          } else if (error && error.errorCode === 1001) {
            resolve(false); // Display name doesn't exist
          } else {
            reject(error || result);
          }
        }
      );
    });
  },

  // Login with password verification
  login(playerName, password) {
    return new Promise((resolve, reject) => {
      const request = { CustomId: playerName, CreateAccount: false };
      console.log("Attempting login with:", request);

      PlayFab.ClientApi.LoginWithCustomID(request, (result, error) => {
        if (error) {
          console.error("Login failed:", JSON.stringify(error, null, 2));
          reject(error);
          return;
        }

        if (result && result.data && result.data.PlayFabId) {
          console.log("PlayFab login successful, verifying password...");

          // Now verify the password by checking stored hash
          PlayFab.ClientApi.GetUserData({}, (dataResult, dataError) => {
            if (dataError) {
              console.error(
                "Failed to get user data for password verification:",
                dataError
              );
              reject(dataError);
              return;
            }

            if (dataResult && dataResult.data && dataResult.data.Data) {
              const userData = dataResult.data.Data;
              const storedPasswordHash = userData.passwordHash?.Value;

              if (!storedPasswordHash) {
                // User exists but no password hash stored - might be Google-only user
                reject(
                  new Error(
                    "No password set for this account. Please use Google login."
                  )
                );
                return;
              }

              // Hash the provided password and compare
              const providedPasswordHash = this.hashPassword(password);
              if (storedPasswordHash === providedPasswordHash) {
                console.log("Password verification successful");

                // Run one-time cleanup on login
                this.executeCloudScript("cleanupUserData", {})
                  .then((cleanupResult) => {
                    console.log("Cleanup result:", cleanupResult);
                    resolve(result.data);
                  })
                  .catch((cleanupError) => {
                    console.warn(
                      "Cleanup failed, but continuing login:",
                      cleanupError
                    );
                    resolve(result.data);
                  });
              } else {
                console.log("Password verification failed");
                reject(new Error("Invalid password"));
              }
            } else {
              reject(new Error("Failed to retrieve user data"));
            }
          });
        } else {
          console.warn(
            "Unexpected login result:",
            JSON.stringify(result, null, 2)
          );
          reject(result);
        }
      });
    });
  },

  // Check if user exists
  checkUserExists(playerName) {
    return new Promise((resolve, reject) => {
      const request = {
        CustomId: playerName,
        CreateAccount: false,
      };
      PlayFab.ClientApi.LoginWithCustomID(request, (result, error) => {
        if (result && result.data && result.data.PlayFabId) {
          resolve(true);
        } else if (
          error &&
          (error.error === "AccountNotFound" || error.errorCode === 1001)
        ) {
          resolve(false); // User does not exist, not an error
        } else {
          reject(error || result);
        }
      });
    });
  },

  // Save high scores
  saveHighScores(scores) {
    return new Promise((resolve, reject) => {
      const request = {
        Data: {
          highScores: JSON.stringify(scores),
        },
      };
      PlayFab.ClientApi.UpdateUserData(request, (result, error) => {
        if (error) {
          // If there's an authentication error, just resolve instead of rejecting
          if (error.error === "NotAuthenticated" || error.errorCode === 1001) {
            resolve();
            return;
          }
          reject(error || result);
          return;
        }
        if (result && result.code === 200) {
          resolve();
        } else {
          reject(error || result);
        }
      });
    });
  },

  // Load high scores
  loadHighScores() {
    return new Promise((resolve, reject) => {
      PlayFab.ClientApi.GetUserData({}, (result, error) => {
        if (error) {
          // If there's an authentication error, return default scores instead of rejecting
          if (error.error === "NotAuthenticated" || error.errorCode === 1001) {
            resolve({
              potency: [],
              yield: [],
              potencyHistory: {},
              totalYield: {},
              seedBank: {},
              seedLives: {},
            });
            return;
          }
          reject(error || result);
          return;
        }
        if (result && result.data && result.data.Data) {
          const data = result.data.Data;
          if (data && data.highScores) {
            try {
              resolve(JSON.parse(data.highScores.Value));
            } catch (e) {
              resolve({
                potency: [],
                yield: [],
                potencyHistory: {},
                totalYield: {},
                seedBank: {},
                seedLives: {},
              });
            }
          } else {
            resolve({
              potency: [],
              yield: [],
              potencyHistory: {},
              totalYield: {},
              seedBank: {},
              seedLives: {},
            });
          }
        } else {
          resolve({
            potency: [],
            yield: [],
            potencyHistory: {},
            totalYield: {},
            seedBank: {},
            seedLives: {},
          });
        }
      });
    });
  },

  // Update leaderboard statistic
  updateLeaderboard(statisticName, value) {
    return new Promise((resolve, reject) => {
      PlayFab.ClientApi.UpdatePlayerStatistics(
        {
          Statistics: [
            {
              StatisticName: statisticName,
              Value: value,
            },
          ],
        },
        (result, error) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
    });
  },

  // Get leaderboard data
  getLeaderboard(statisticName, maxResults = 10) {
    return new Promise((resolve, reject) => {
      PlayFab.ClientApi.GetLeaderboard(
        {
          StatisticName: statisticName,
          MaxResultsCount: maxResults,
        },
        (result, error) => {
          if (result && result.data && result.data.Leaderboard) {
            resolve(result.data.Leaderboard);
          } else {
            reject(error || result);
          }
        }
      );
    });
  },

  // Save game state
  saveGameState(state) {
    return new Promise((resolve, reject) => {
      const request = {
        Data: {
          gameState: JSON.stringify(state),
        },
      };
      PlayFab.ClientApi.UpdateUserData(request, (result, error) => {
        if (result && result.code === 200) {
          resolve();
        } else {
          reject(error || result);
        }
      });
    });
  },

  // Load game state
  loadGameState() {
    return new Promise((resolve, reject) => {
      PlayFab.ClientApi.GetUserData({}, (result, error) => {
        if (
          result &&
          result.data &&
          result.data.Data &&
          result.data.Data.gameState
        ) {
          try {
            resolve(JSON.parse(result.data.Data.gameState.Value));
          } catch (e) {
            reject(new Error("Failed to parse game state"));
          }
        } else if (result) {
          resolve(null); // No game state saved
        } else {
          reject(error);
        }
      });
    });
  },

  setDisplayName(displayName) {
    return new Promise((resolve, reject) => {
      PlayFab.ClientApi.UpdateUserTitleDisplayName(
        {
          DisplayName: displayName,
        },
        (result, error) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
    });
  },

  getSecurityQuestion(playerName) {
    return new Promise((resolve, reject) => {
      const request = {
        CustomId: playerName,
        CreateAccount: false,
      };
      PlayFab.ClientApi.LoginWithCustomID(request, (result, error) => {
        if (result && result.data && result.data.PlayFabId) {
          PlayFab.ClientApi.GetUserData({}, (dataResult, dataError) => {
            if (
              dataResult &&
              dataResult.data &&
              dataResult.data.Data &&
              dataResult.data.Data.securityQuestion
            ) {
              resolve(dataResult.data.Data.securityQuestion.Value);
            } else {
              reject(dataError || new Error("No security question found."));
            }
          });
        } else {
          reject(error || result);
        }
      });
    });
  },

  resetPassword(playerName, securityAnswer, newPassword) {
    return new Promise((resolve, reject) => {
      // First, log in to get a session ticket
      const request = {
        CustomId: playerName,
        CreateAccount: false,
      };
      PlayFab.ClientApi.LoginWithCustomID(request, (result, error) => {
        if (error) {
          reject(error);
          return;
        }

        // Get user data to verify security answer
        PlayFab.ClientApi.GetUserData({}, (dataResult, dataError) => {
          if (dataError) {
            reject(dataError);
            return;
          }
          if (dataResult && dataResult.data && dataResult.data.Data) {
            const storedAnswerHash = dataResult.data.Data.securityAnswer?.Value;
            if (
              storedAnswerHash &&
              storedAnswerHash ===
                this.hashPassword(securityAnswer.toLowerCase())
            ) {
              // Validate new password
              const validation = this.validatePassword(newPassword);
              if (!validation.valid) {
                reject(new Error(validation.message));
                return;
              }
              // Update password hash
              const passwordRequest = {
                Data: {
                  passwordHash: this.hashPassword(newPassword),
                },
              };
              PlayFab.ClientApi.UpdateUserData(
                passwordRequest,
                (pwdResult, pwdError) => {
                  if (pwdResult && pwdResult.code === 200) {
                    resolve();
                  } else {
                    reject(pwdError || pwdResult);
                  }
                }
              );
            } else {
              reject(new Error("Incorrect security answer"));
            }
          } else {
            reject(new Error("User data not found"));
          }
        });
      });
    });
  },

  // --- Seed Lockout Timestamp ---
  setSeedLockoutTimestamp(playerName) {
    return new Promise((resolve, reject) => {
      const key = GAME_CONFIG.SEED_LOCKOUT_KEY + "_" + playerName;
      const request = {
        Data: {},
      };
      request.Data[key] = Date.now().toString();
      PlayFab.ClientApi.UpdateUserData(request, (result, error) => {
        if (result && result.code === 200) {
          resolve();
        } else {
          reject(error || result);
        }
      });
    });
  },
  getSeedLockoutTimestamp(playerName) {
    return new Promise((resolve, reject) => {
      const key = GAME_CONFIG.SEED_LOCKOUT_KEY + "_" + playerName;
      PlayFab.ClientApi.GetUserData({}, (result, error) => {
        if (
          result &&
          result.data &&
          result.data.Data &&
          result.data.Data[key]
        ) {
          resolve(parseInt(result.data.Data[key].Value, 10));
        } else if (result && result.data && result.data.Data) {
          resolve(0);
        } else {
          reject(error || result);
        }
      });
    });
  },
  clearSeedLockoutTimestamp(playerName) {
    return new Promise((resolve, reject) => {
      const key = GAME_CONFIG.SEED_LOCKOUT_KEY + "_" + playerName;
      const request = {
        KeysToRemove: [key],
      };
      PlayFab.ClientApi.UpdateUserData(request, (result, error) => {
        if (result && result.code === 200) {
          resolve();
        } else {
          reject(error || result);
        }
      });
    });
  },

  // Methods for storing array data
  async getSlotsSpinData(playerName) {
    const data = await this.getUserArray(
      GAME_CONFIG.SLOTS_KEY + "_" + playerName
    );
    if (data.length === 2) {
      return {
        date: data[0],
        count: parseInt(data[1], 10),
      };
    }
    return {
      date: null,
      count: 0,
    };
  },
  async setSlotsSpinData(playerName, date, count) {
    const key = GAME_CONFIG.SLOTS_KEY + "_" + playerName;
    const data = [date, count.toString()];

    return new Promise((resolve, reject) => {
      const request = {
        Data: {
          [key]: JSON.stringify(data),
        },
      };
      PlayFab.ClientApi.UpdateUserData(request, (result, error) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  },

  // Generic method to append a value to a user data array (or create/overwrite it)
  async appendToUserArray(key, value, overwrite = false) {
    return new Promise((resolve, reject) => {
      // First, get the current array
      PlayFab.ClientApi.GetUserData({ Keys: [key] }, (getResult, getError) => {
        if (getError) return reject(getError);

        let currentArray = [];
        if (!overwrite && getResult.data.Data[key]) {
          try {
            currentArray = JSON.parse(getResult.data.Data[key].Value);
            if (!Array.isArray(currentArray)) currentArray = [];
          } catch (e) {
            currentArray = [];
          }
        }

        currentArray.push(value);

        // Now, update the user data
        const updateRequest = {
          Data: {
            [key]: JSON.stringify(currentArray),
          },
        };
        PlayFab.ClientApi.UpdateUserData(
          updateRequest,
          (updateResult, updateError) => {
            if (updateError) return reject(updateError);
            resolve(updateResult);
          }
        );
      });
    });
  },

  // Generic method to retrieve a user data array
  async getUserArray(key) {
    return new Promise((resolve, reject) => {
      PlayFab.ClientApi.GetUserData({ Keys: [key] }, (getResult, getError) => {
        if (getError) return reject(getError);
        if (getResult.data.Data[key]) {
          try {
            const arr = JSON.parse(getResult.data.Data[key].Value);
            resolve(Array.isArray(arr) ? arr : []);
          } catch (e) {
            resolve([]);
          }
        } else {
          resolve([]);
        }
      });
    });
  },

  getGlobalLeaderboard(statisticName, startPosition, maxResults) {
    return new Promise((resolve, reject) => {
      PlayFab.ClientApi.GetLeaderboard(
        {
          StatisticName: statisticName,
          StartPosition: startPosition,
          MaxResultsCount: maxResults,
        },
        (result, error) => {
          if (result && result.data && result.data.Leaderboard) {
            resolve(result.data.Leaderboard);
          } else {
            reject(error || result);
          }
        }
      );
    });
  },

  getPlayerLeaderboardEntry(statisticName) {
    return new Promise((resolve, reject) => {
      if (!PlayFab.ClientApi.IsClientLoggedIn()) {
        return resolve(null);
      }
      PlayFab.ClientApi.GetLeaderboardAroundPlayer(
        {
          StatisticName: statisticName,
          MaxResultsCount: 1,
        },
        (result, error) => {
          if (
            result &&
            result.data &&
            result.data.Leaderboard &&
            result.data.Leaderboard.length > 0
          ) {
            // The result for GetLeaderboardAroundPlayer is an array containing the player's entry
            resolve(result.data.Leaderboard[0]);
          } else if (
            error &&
            error.errorCode === PlayFab.ErrorCodes.LeaderboardNotFound
          ) {
            resolve(null); // Not an error, player just isn't on the board yet
          } else if (result) {
            resolve(null); // Player not on leaderboard
          } else {
            reject(error);
          }
        }
      );
    });
  },

  // Execute Cloud Script function
  executeCloudScript(functionName, parameters) {
    return new Promise((resolve, reject) => {
      PlayFab.ClientApi.ExecuteCloudScript(
        {
          FunctionName: functionName,
          FunctionParameter: parameters,
        },
        (result, error) => {
          if (result && result.data && result.data.FunctionResult) {
            const functionResult = result.data.FunctionResult;
            if (functionResult.success === false) {
              reject(functionResult);
            } else {
              resolve(functionResult);
            }
          } else {
            reject(error || result);
          }
        }
      );
    });
  },
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = PlayFabService;
}
