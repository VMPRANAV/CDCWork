import Attendance from "./attendace";
import MyAppliactions from "./MyApplications";
import CodingProfile from "./codingProfile";

function DashBoardPage(){
    return(
        <div className="space-y-6">
            <Attendance />
            <MyAppliactions />
            <CodingProfile />
        </div>
    )
}

export default DashBoardPage;