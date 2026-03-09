import { useParams } from "react-router-dom";
import CollaborativeEditor from "../components/CollaborativeEditor";

export default function Session() {
  const { roomId } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Collaborative Session: {roomId}
      </h1>

      <CollaborativeEditor roomId={roomId} />
    </div>
  );
}