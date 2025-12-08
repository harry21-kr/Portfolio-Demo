export const useGetLiveBetHistory = (game?: LiveGame) => {
  const selector = useMemo(() => makeGetLiveBetSelector(), []);
  return useSelector((state) => selector(state, game));
};
