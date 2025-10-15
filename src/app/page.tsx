import Headers from '@/components/Header/Headers';
import YearPicker from '@/components/Header/YearPicker';

export default function Home() {
  return (
    <div className="font-sans items-center min-h-screen p-5 pb-20 gap-16">
      <div className="w-full">
        <Headers right={<YearPicker />} />
      </div>
      <main className="w-full max-w-app flex flex-col gap-8 px-4 py-6"></main>
    </div>
  );
}
