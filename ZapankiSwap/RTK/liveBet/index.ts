export const fetchBetHistory = createAsyncThunk<{
  bets: { [key in LiveGame]: LiveBetResponse[] } & { all: LiveBetResponse[] };
}>("liveBet/fetchBetHistory", async () => {
  const bets = await Promise.all([
    getBetHistory(),
    getBetHistory(LiveGame.COINFILP),
    getBetHistory(LiveGame.EVENT_COINFLIP),
    getBetHistory(LiveGame.MINES),
    getBetHistory(LiveGame.PLINKO),
    getBetHistory(LiveGame.SLOTS),
    getBetHistory(LiveGame.CANRACING),
    getBetHistory(LiveGame.RANGE),
    getBetHistory(LiveGame.RPS),
  ]);
  const mappedBets = {
    all: bets[0],
    [LiveGame.COINFILP]: bets[1],
    [LiveGame.EVENT_COINFLIP]: bets[2],
    [LiveGame.MINES]: bets[3],
    [LiveGame.PLINKO]: bets[4],
    [LiveGame.SLOTS]: bets[5],
    [LiveGame.CANRACING]: bets[6],
    [LiveGame.RANGE]: bets[7],
    [LiveGame.RPS]: bets[8],
  };
  return { bets: mappedBets };
});

export const liveBetSlice = createSlice({
  name: "liveBet",
  initialState,
  reducers: {
    setLiveBet(state, action: PayloadAction<LiveBetResponse>) {
      state.live = action.payload;
    },
    addBetHistory(
      state,
      action: PayloadAction<{ bet: LiveBetResponse; myAddress: string }>
    ) {
      state.games[action.payload.bet.game] = [
        action.payload.bet,
        ...state.games[action.payload.bet.game],
      ];
      state.games.all = [action.payload.bet, ...state.games.all];

      if (action.payload.myAddress === action.payload.bet.playerAddress) {
        state.user[action.payload.bet.game] = [
          action.payload.bet,
          ...state.user[action.payload.bet.game],
        ];
        state.user.all = [action.payload.bet, ...state.user.all];
      }

      state.live = null;
    },
    setCachedLiveBet(state, action: PayloadAction<LiveBetResponse>) {
      state.cached = action.payload;
    },
    addDelayedBetHistoryFromCache(state) {
      if (state.cached) {
        state.games[state.cached.game] = [
          state.cached,
          ...state.games[state.cached.game],
        ];
        state.games.all = [state.cached, ...state.games.all];
        state.user[state.cached.game] = [
          state.cached,
          ...state.user[state.cached.game],
        ];
        state.user.all = [state.cached, ...state.user.all];
      }
      state.cached = null;
      state.live = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBetHistory.fulfilled, (state, action) => {
      state.games.all = action.payload.bets.all;
      state.games.coinflip = action.payload.bets.coinflip;
      state.games.mines = action.payload.bets.mines;
      state.games.plinko = action.payload.bets.plinko;
      state.games.slots = action.payload.bets.slots;
      state.games.canracing = action.payload.bets.canracing;
      state.games.range = action.payload.bets.range;
      state.games.rps = action.payload.bets.rps;
    });
  },
});

export const setLiveBet = liveBetSlice.actions.setLiveBet;
export const addBetHistory = liveBetSlice.actions.addBetHistory;
export const setCachedLiveBet = liveBetSlice.actions.setCachedLiveBet;
export const addDelayedBetHistoryFromCache =
  liveBetSlice.actions.addDelayedBetHistoryFromCache;
