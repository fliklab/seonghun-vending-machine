import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-center text-slate-200">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-500">
          Error 404
        </p>
        <h1 className="text-4xl font-semibold">페이지를 찾을 수 없습니다</h1>
        <p className="max-w-md text-sm text-slate-400">
          요청한 페이지가 존재하지 않거나 이동되었을 수 있습니다. 아래 버튼을 통해 홈으로
          돌아가거나, 시뮬레이터를 바로 실행할 수 있습니다.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            홈으로 가기
          </Link>
          <Link
            to="/simulator"
            className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            시뮬레이터 실행
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

