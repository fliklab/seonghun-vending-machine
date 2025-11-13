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
      </main>
    </div>
  );
};

export default HomePage;
