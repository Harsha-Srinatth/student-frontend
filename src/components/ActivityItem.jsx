import { useDispatch } from "react-redux";
import { toggleActivity } from "../features/activitiesSlice";

const ActivityItem = ({ activity }) => {
  const dispatch = useDispatch();

  return (
    <div
      onClick={() => dispatch(toggleActivity(activity.id))}
      className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:shadow-md transition"
    >
      <input
        type="checkbox"
        checked={activity.selected}
        readOnly
        className="w-5 h-5 accent-blue-600"
      />
      <div>
        <h3 className="font-medium">{activity.title}</h3>
        <p className="text-sm text-gray-500">{activity.date}</p>
      </div>
    </div>
  );
}

export default ActivityItem;
