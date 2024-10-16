import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  //TODO: build a healthcheck response that simply returns the OK status as json with a message
  const isDatabaseConnected = mongoose.connection.readyState === 1;

  if (!isDatabaseConnected) {
    throw new ApiError(500, "Internal server error: Database not connected");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Health checked successfully"));
});

export { healthcheck };
