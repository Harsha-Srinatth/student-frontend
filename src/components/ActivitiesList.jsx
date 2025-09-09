import { useSelector } from "react-redux";
import ActivityItem from "./ActivityItem";

const ActivitiesList = () => {
  const activities = useSelector((state) => state.activities.list);
  
  return (
    <div className="space-y-3 p-4">
      <h2 className="text-lg font-semibold mb-2">My Activities</h2>
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
};

export default ActivitiesList;
