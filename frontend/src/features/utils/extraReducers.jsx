
export const uiState = {
  error: null,
  successMsg: "",
  loading: false
};

export const handlePending = (state) => {
    state.loading = true;
    state.error = null;
    state.successMsg = null;
};

export const handleOnRejected = (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.successMsg = null;
};