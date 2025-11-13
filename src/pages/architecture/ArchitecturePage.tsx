// ===== 상태 다이어그램 컴포넌트 =====
function StateDiagram() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          자판기 시스템 아키텍처 & 상태 다이어그램
        </h1>

        {/* 시스템 구성도 */}
        <div className="bg-slate-800 rounded-lg p-8 border-2 border-slate-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">시스템 구성</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 입력 모듈 */}
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-4">
                입력 모듈
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="bg-slate-800 p-3 rounded">
                  <div className="font-bold text-white mb-2">
                    💵 지폐 인식 모듈
                  </div>
                  <div className="text-xs space-y-1">
                    <div>• IDLE → DETECTING → VALIDATING</div>
                    <div>• → ACCEPTED / REJECTED</div>
                    <div>• → STACKED (보관)</div>
                    <div className="text-yellow-400">가짜 지폐 감지 & 반환</div>
                  </div>
                </div>
                <div className="bg-slate-800 p-3 rounded">
                  <div className="font-bold text-white mb-2">
                    🪙 동전 인식 모듈
                  </div>
                  <div className="text-xs space-y-1">
                    <div>• IDLE → DETECTING → VALIDATING</div>
                    <div>• → ACCEPTED / REJECTED</div>
                    <div>• → STORED (보관)</div>
                    <div className="text-yellow-400">무게/크기 검증</div>
                  </div>
                </div>
                <div className="bg-slate-800 p-3 rounded">
                  <div className="font-bold text-white mb-2">
                    💳 카드 리더기
                  </div>
                  <div className="text-xs space-y-1">
                    <div>• IDLE → CARD_DETECTED</div>
                    <div>• → READING → PROCESSING</div>
                    <div>• → APPROVED / DECLINED</div>
                    <div className="text-yellow-400">네트워크 통신</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 중앙 제어 */}
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-400 mb-4">
                중앙 제어
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="bg-slate-800 p-3 rounded">
                  <div className="font-bold text-white mb-2">
                    🎛️ 메인 자판기
                  </div>
                  <div className="text-xs space-y-1">
                    <div>• IDLE (대기)</div>
                    <div>• PAYMENT_IN_PROGRESS</div>
                    <div>• ITEM_SELECTED</div>
                    <div>• DISPENSING</div>
                    <div>• RETURNING_CHANGE</div>
                    <div>• ERROR / OUT_OF_SERVICE</div>
                  </div>
                </div>
                <div className="bg-slate-800 p-3 rounded">
                  <div className="font-bold text-white mb-2">
                    ⏱️ 타이머 모듈
                  </div>
                  <div className="text-xs space-y-1">
                    <div>• IDLE → RUNNING</div>
                    <div>• PAUSED / EXPIRED</div>
                    <div>• RESET</div>
                    <div className="text-yellow-400">60초 자동 반환</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 출력 모듈 */}
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4">
                출력 모듈
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="bg-slate-800 p-3 rounded">
                  <div className="font-bold text-white mb-2">📦 재고 센서</div>
                  <div className="text-xs space-y-1">
                    <div>• IDLE → CHECKING</div>
                    <div>• → AVAILABLE</div>
                    <div>• → OUT_OF_STOCK</div>
                    <div className="text-yellow-400">실시간 재고 감지</div>
                  </div>
                </div>
                <div className="bg-slate-800 p-3 rounded">
                  <div className="font-bold text-white mb-2">🥤 배출기</div>
                  <div className="text-xs space-y-1">
                    <div>• IDLE → DISPENSING</div>
                    <div>• → COMPLETED</div>
                    <div>• → JAMMED (걸림)</div>
                    <div className="text-yellow-400">모터 제어</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 플로우 다이어그램 */}
        <div className="bg-slate-800 rounded-lg p-8 border-2 border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">메인 플로우</h2>
          <div className="space-y-6">
            {/* IDLE */}
            <div className="flex items-center justify-center">
              <div className="bg-gray-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg">
                IDLE (대기)
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-green-400 font-mono text-sm">
                [지폐/동전 인식 OR 카드 삽입]
              </div>
              <div className="text-white text-2xl">↓</div>
            </div>

            {/* 입력 모듈 처리 */}
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-blue-400 text-center font-bold mb-3">
                입력 모듈 처리
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="text-center">
                  <div className="text-white font-bold">지폐</div>
                  <div className="text-slate-400">DETECTING → VALIDATING</div>
                  <div className="text-green-400">→ ACCEPTED (승인)</div>
                  <div className="text-red-400">→ REJECTED (가짜)</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold">동전</div>
                  <div className="text-slate-400">DETECTING → VALIDATING</div>
                  <div className="text-green-400">→ ACCEPTED (승인)</div>
                  <div className="text-red-400">→ REJECTED (무게)</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold">카드</div>
                  <div className="text-slate-400">CARD_DETECTED → READING</div>
                  <div className="text-green-400">→ 대기</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-white text-2xl">↓</div>
            </div>

            {/* PAYMENT_IN_PROGRESS + TIMER */}
            <div className="flex items-center justify-center gap-4">
              <div className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg">
                PAYMENT_IN_PROGRESS
              </div>
              <div className="text-white text-2xl">+</div>
              <div className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg">
                TIMER: RUNNING
                <div className="text-sm font-normal">60초 카운트다운</div>
              </div>
            </div>

            {/* 재고 센서 체크 */}
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="text-purple-400 text-center font-bold mb-3">
                음료 선택 → 재고 센서
              </div>
              <div className="flex justify-center gap-8 text-sm">
                <div className="text-center">
                  <div className="text-green-400">CHECKING → AVAILABLE</div>
                  <div className="text-white">→ 계속 진행</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400">CHECKING → OUT_OF_STOCK</div>
                  <div className="text-white">→ 품절 메시지</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-white text-2xl">↓</div>
            </div>

            {/* DISPENSING + 배출기 */}
            <div className="flex items-center justify-center gap-4">
              <div className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg">
                DISPENSING
              </div>
              <div className="text-white text-2xl">→</div>
              <div className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg">
                배출기: DISPENSING
                <div className="text-sm font-normal">모터 작동</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-4">
              <div className="flex flex-col items-center">
                <div className="text-green-400 font-mono mb-2">
                  ✅ COMPLETED
                </div>
                <div className="text-white text-2xl">↓</div>
                <div className="bg-purple-500 text-white px-4 py-2 rounded font-bold">
                  RETURNING_CHANGE
                </div>
                <div className="text-white text-2xl mt-2">↓</div>
                <div className="bg-gray-500 text-white px-4 py-2 rounded font-bold">
                  IDLE
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-red-400 font-mono mb-2">❌ JAMMED</div>
                <div className="text-white text-2xl">↓</div>
                <div className="bg-red-500 text-white px-4 py-2 rounded font-bold">
                  ERROR (E201)
                </div>
              </div>
            </div>

            {/* 타이머 만료 */}
            <div className="bg-yellow-900 border-2 border-yellow-600 rounded-lg p-4 mt-8">
              <div className="text-yellow-400 font-bold text-center mb-2">
                ⏰ 타이머 만료 (60초)
              </div>
              <div className="text-white text-center text-sm">
                PAYMENT_IN_PROGRESS → TIMER: EXPIRED → RETURNING_CHANGE → IDLE
              </div>
            </div>
          </div>
        </div>

        {/* 에러 코드 */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6 border-2 border-red-700">
          <h3 className="text-white font-bold mb-4 text-xl">에러 코드 체계</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
            <div>
              <span className="text-red-400 font-mono">E101</span> - 거스름돈
              부족
            </div>
            <div>
              <span className="text-red-400 font-mono">E201</span> - 배출
              메커니즘 오류 (Dispenser JAMMED)
            </div>
            <div>
              <span className="text-red-400 font-mono">E301</span> - 카드 리더기
              오류 (Card DECLINED)
            </div>
            <div>
              <span className="text-red-400 font-mono">E302</span> - 네트워크
              오류
            </div>
            <div>
              <span className="text-red-400 font-mono">E401</span> - 재고 센서
              오류 (Inventory ERROR)
            </div>
            <div>
              <span className="text-red-400 font-mono">E501</span> - 지폐 인식
              모듈 오류 (Bill Validator ERROR)
            </div>
            <div>
              <span className="text-red-400 font-mono">E601</span> - 동전 인식
              모듈 오류 (Coin Validator ERROR)
            </div>
            <div>
              <span className="text-red-400 font-mono">E999</span> - 시스템 전체
              오류
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ArchitecturePage = () => (
  <>
    <StateDiagram />
  </>
);

export default ArchitecturePage;
