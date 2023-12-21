import { PuffLoader } from 'react-spinners';

function Loading() {
  return (
    <div className="text-center selection:bg-green-900">
      <header className="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-white">
        <PuffLoader color="#36d7b7" />
      </header>
    </div>
  );
}

export default Loading;
