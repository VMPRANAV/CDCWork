import Attendance from "./attendace";
import Levels from "./levels";
import CodingProfile from "./codingProfile";

function DashBoardPage(){
    return(
        <div>
            <Attendance />
            <Levels />
            <CodingProfile />
        </div>
    )
}

export default DashBoardPage;