import Attendance from "./attendace";
import Levels from "./levels";
import CodingProfile from "./codingProfile";

function DashBoardPage(){
    return(
        <div className="space-y-6">
            <Attendance />
            <Levels />
            <CodingProfile />
        </div>
    )
}

export default DashBoardPage;