const isDev = process.env.NODE_ENV === "development";

export interface IState {
  liveBet: LiveBetState;
  leaderBoard: LeaderBoardStatsState;
  competition: CompetitionStatsState;
}

const combinedReducer = combineReducers({
  liveBet: liveBetSlice.reducer,
  leaderBoard: leaderBoardSlice.reducer,
  competition: competitionSlice.reducer,
});

const rootReducer = (
  state: IState | undefined,
  action: AnyAction
): CombinedState<IState> => {
  if (action.type === HYDRATE) {
    return {
      ...state,
      ...action.payload,
    };
  }
  return combinedReducer(state, action);
};

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV === "development",
  });

export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();

const wrapper = createWrapper(makeStore, { debug: isDev });

export default wrapper;
