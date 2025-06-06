const TodayGoals = ({ tasks }) => {
  const todayGoals = tasks.filter(t => t.goalForToday);
  const completed = todayGoals.filter(t =>
    t.milestones.length > 0 &&
    t.milestones.every(m => m.done)
  );

  const percent = todayGoals.length > 0 ? (completed.length / todayGoals.length) * 100 : 0;

  return (
    <div className="my-4 p-4 rounded-lg shadow bg-white">
      <h2 className="text-lg font-semibold mb-2">🎯 Today's Goals</h2>
      <p>{completed.length} / {todayGoals.length} goals completed</p>
      <div className="w-full bg-gray-200 h-3 rounded-full mt-2">
        <div className="bg-green-500 h-3 rounded-full" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
};

export default TodayGoals;
