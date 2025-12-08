## RTK 사용 사례

### ZapankiSwap에서 사용된 RTK의 사용 사례를 간소화하여 정리하였습니다.

### /store.ts

RTK의 store를 정의하는 폴더입니다.
Next.js를 사용함에 따라 하이드레이션과 관련된 코드 작성,
RTK 디버깅을 위해 개발 모드일 시 devTools 활성화,
타입 정확성을 위한 useAppDispatch 선언 등이 포함되어 있습니다.

### /liveBet/index.ts

RTK의 게임 내역을 담당하는 slice입니다.
createAsyncThunk를 사용하여 비동기 요청과 전역 변수 관리를 간편하게 하고자 하였으며, 요청의 상태에 따른 reducer를 작성하였습니다.

### /liveBet/selector.ts

여러 종류의 게임 내역들을 가져오는 selector입니다.
createSelector를 사용하였으며, 그 이유는 하나의 셀렉터로 여러가지의 상태들을 캐싱하기 위해 사용하였습니다.
game 파라미터에 따라 새로운 selector를 생성하고,
중복된 게임에 대한 데이터는 캐싱하여 성능을 최적화합니다.
만약 게임의 종류가 주어지지 않는다면, 모든 게임 내역을 선택하는 selector를 생성합니다.

### /liveBet/hooks.ts

selector로 선택한 게임 내역을 간편하게 사용할 수 있도록 만든 커스텀 훅입니다.
useMemo를 사용하여 매 렌더링마다 새로운 selector가 생성되는 것을 방지하고,
game 파라미터에 따라 selector 내부에서 결과를 캐싱하여 성능을 최적화합니다.
