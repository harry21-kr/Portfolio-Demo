export const makeGetLiveBetSelector = () =>
  createSelector(
    [selectGame, (_state, game?: LiveGame) => game || "all"],
    (games, game) => games[game]?.map(trasformLiveBetResponse) || []
  );
