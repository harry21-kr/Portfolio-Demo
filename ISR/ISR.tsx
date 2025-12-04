export const getStaticProps: GetStaticProps<StatsProps> = async () => {
  try {
    const [statsResponse, betsResponse] = await Promise.all([
      axios.get(`${ZAPANKISWAP_API_SERVER}/stats`),
      axios.get(`${ZAPANKISWAP_API_SERVER}/bets`),
    ]);
    return {
      props: {
        stats: statsResponse.data,
        initialBets: betsResponse.data.data,
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      props: {
        stats: { totalBets: "0", totalUsers: "0", totalWager: "0" },
        initialBets: [],
      },
      revalidate: 60,
    };
  }
};

const LandingPage = ({
  stats,
  initialBets,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <Landing stats={stats} initialBets={initialBets} />;
};

export default LandingPage;
