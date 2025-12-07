const useLiveBets = () => {
  const socket = useRef<Socket | null>(null);
  const { account } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const { nickname } = useAccountNickname(
    account,
    account ? truncateHash(account, 5, 4) : "0x"
  );

  // 새로운 게임 내역이 도착했을때 실행되는 함수
  // RTK를 사용해 게임 결과를 저장
  // useCallback()을 사용해 유저가 바뀔때를 대비
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

  // 기존 게임 내역 가져오기
  useEffect(() => {
    dispatch(fetchBetHistory());
    dispatch(fetchCanRaceMultiplierResults());
  }, [dispatch]);

  // 소켓 연결
  useEffect(() => {
    if (socket.current == null) {
      socket.current = io(ZAPANKISWAP_API_SERVER, {
        transports: ["websocket"],
      });
    }
  }, []);

  // bet_v2 이벤트 구독 및 관리
  useEffect(() => {
    socket.current?.on("bet_v2", onNewBet);
    return () => {
      socket.current?.off("bet_v2", onNewBet);
    };
    // onNewBet(유저 변경 시) 기존 이벤트 해제 후 재구독
  }, [onNewBet]);
};

export default useLiveBets;
