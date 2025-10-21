import BottomNav from '@/components/BottomNav/BottomNav';
import Headers from '@/components/Header/Headers';
import YearPicker from '@/components/Header/YearPicker';
import WeekNavBar from '@/components/WeekNavBar';

export default function Home() {
  return (
    <div className="font-sans items-center min-h-screen px-5 pb-20 gap-16">
      <div className="w-full pt-safe-50 ">
        <Headers right={<YearPicker />} />
        <WeekNavBar />
      </div>
      <main className="w-full max-w-app flex flex-col gap-8 px-4 py-6"></main>
      {/* <BottomNav /> */}
    </div>
  );
}
