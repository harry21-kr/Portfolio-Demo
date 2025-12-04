// getStaticProps + revalidate를 통한 ISR 구현
export const getStaticProps: GetStaticProps<StatsProps> = async () => {
  try {
    // Promise.all으로 데이터를 병렬으로 요청
    const [statsResponse, betsResponse] = await Promise.all([
      axios.get(`${ZAPANKISWAP_API_SERVER}/stats`),
      axios.get(`${ZAPANKISWAP_API_SERVER}/bets`),
    ]);
    return {
      props: {
        stats: statsResponse.data,
        initialBets: betsResponse.data.data,
      },
      // 60초마다 새로운 데이터를 담은 정적 페이지를 생성
      revalidate: 60,
    };
  } catch (error) {
    // 다양한 원인(서버 장애 등)으로 에러 발생 시 기본 값 리턴
    return {
      props: {
        stats: { totalBets: "0", totalUsers: "0", totalWager: "0" },
        initialBets: [],
      },
      // 에러가 발생해도 60초마다 데이터를 다시 요청해 안정성을 높임.
      revalidate: 60,
    };
  }
};

// 랜딩페이지에서 getStaticProps를 통해 가져온 데이터를 props로 수령 후 자식 컴포넌트에서 사용
const LandingPage = ({
  stats,
  initialBets,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <Landing stats={stats} initialBets={initialBets} />;
};

export default LandingPage;
