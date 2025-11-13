import { Link } from "react-router-dom";

const quickLinks = [
  {
    title: "자판기 시뮬레이터",
    description:
      "입력 모듈, 결제 흐름, 거스름돈 반환 등의 작동을 실시간으로 확인할 수 있습니다.",
    to: "/simulator",
    cta: "시뮬레이터 실행",
  },
  {
    title: "상태 다이어그램",
    description: "자판기 시스템 구성과 상태 전이를 한눈에 확인할 수 있습니다.",
    to: "/architecture",
    cta: "상태도 보기",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 text-center">
          <span className="mx-auto rounded-full border border-slate-700 bg-slate-800/60 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
            vending-machine-simulation
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            자판기 시스템 시뮬레이터
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            State Machine 기반의 자판기 시스템과 작동 흐름을 알 수 있습니다.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/simulator"
              className="rounded-full bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:bg-blue-400"
            >
              자판기 시뮬레이터 시작하기
            </Link>
            <a
              href="https://vitejs.dev"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              기술 스택 살펴보기
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <section className="grid gap-6 md:grid-cols-2">
          {quickLinks.map((link) => (
            <div
              key={link.title}
              className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-slate-900/40"
            >
              <h2 className="text-2xl font-semibold text-white">
                {link.title}
              </h2>
              <p className="text-sm leading-relaxed text-slate-300">
                {link.description}
              </p>
              <Link
                to={link.to}
                className="mt-auto inline-flex w-fit items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-slate-700 hover:text-blue-200"
              >
                {link.cta}
                <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 shadow-lg shadow-slate-900/30">
          <h3 className="text-lg font-semibold text-slate-200">
            프로젝트 구성
          </h3>
          <ul className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <li className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <span className="block text-sm font-semibold text-white">
                Vite + React 18
              </span>
              <span className="mt-2 block text-xs text-slate-400">
                빠른 개발 환경과 HMR을 기본으로 합니다.
              </span>
            </li>
            <li className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <span className="block text-sm font-semibold text-white">
                TypeScript + Router
              </span>
              <span className="mt-2 block text-xs text-slate-400">
                정적 타입과 페이지 라우팅을 결합해 유지보수성을 강화했습니다.
              </span>
            </li>
            <li className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <span className="block text-sm font-semibold text-white">
                Tailwind CSS
              </span>
              <span className="mt-2 block text-xs text-slate-400">
                다크 테마 기반의 UI를 빠르게 커스터마이징할 수 있습니다.
              </span>
            </li>
            <li className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <span className="block text-sm font-semibold text-white">
                모듈화된 상태 시스템
              </span>
              <span className="mt-2 block text-xs text-slate-400">
                지폐/동전/카드 모듈과 타이머, 재고, 배출기 로직을 체인 형태로
                구성했습니다.
              </span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
