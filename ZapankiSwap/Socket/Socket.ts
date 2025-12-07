const useLiveBets = () => {
  const socket = useRef<Socket | null>(null);
  const { account } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const { nickname } = useAccountNickname(
    account,
    account ? truncateHash(account, 5, 4) : "0x"
  );

  const onNewBet = useCallback(
    (bet: LiveBetResponse) => {
      if (bet.playerAddress === account) {
        dispatch(setLiveBet(bet));
      }

      const isSupportedToken =
        bet.tokenAddress &&
        Object.values(kromaTokens)
          .map((token) => token.address)
          .includes(bet.tokenAddress);

      if (
        !bet.createdAt ||
        !isSupportedToken ||
        !Object.values(LiveGame).includes(bet.game)
      ) {
        return;
      }

      if (account && bet.playerAddress !== account) {
        dispatch(addBetHistory({ bet, myAddress: account }));
      } else {
        dispatch(setCachedLiveBet({ ...bet, playerName: nickname }));
      }
    },
    [dispatch, account, nickname]
  );

  useEffect(() => {
    dispatch(fetchBetHistory());
    dispatch(fetchCanRaceMultiplierResults());
  }, [dispatch]);

  useEffect(() => {
    if (socket.current == null) {
      socket.current = io(ZAPANKISWAP_API_SERVER, {
        transports: ["websocket"],
      });
    }
  }, []);

  useEffect(() => {
    socket.current?.on("bet_v2", onNewBet);
    return () => {
      socket.current?.off("bet_v2", onNewBet);
    };
  }, [onNewBet]);
};

export default useLiveBets;
