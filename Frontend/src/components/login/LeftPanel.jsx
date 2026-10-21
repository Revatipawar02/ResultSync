import FeatureCard from "./FeatureCard";
import loginBg from "../../assets/images/login-bg.png";
import Toplog from "./Toplogo";

import {
    FileText,
    BarChart3,
    Bell,
    ShieldCheck,
} from "lucide-react";
import Toplogo from "./Toplogo";


function LeftPanel() {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${loginBg})` }}>

            <div className="relative z-10 p-8 ml-5">
                <div className="absolute top-4 left-6 ">
                    <Toplogo />
                </div>
                <div className="mt-26 ml-4 inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-md border border-blue-400 rounded-xl shadow-lg [text-shadow:0_0_10px_#0061ff] [box-shadow:0_0_10px_#0061ff] cursor-pointer">
                    <h4 className="text-white text-lg font-medium">
                        Welcome Student! 👋
                    </h4>
                </div>
                <div className="mt-4">
                    <h1 className="text-4xl font-extrabold leading-tight ml-4 text-white">
                        Your Academic Journey,
                        <br />
                        Simplified &{" "}
                        <span className="text-blue-400 relative [text-shadow:0_0_10px_#0061ff]">
                            Smart
                            {/* <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></span> */}
                        </span>
                    </h1>

                    <p className="ml-4 mt-4 max-w-xl text-ls leading-6 text-white">
                        ResultSync is your all-in-one platform to manage academic results,
                        monitor performance, access semester reports, and stay updated with
                        important announcements anytime, anywhere.
                    </p>
                </div>
                <div className="mt-8 w-full max-w-[650px] space-y-2">
                <FeatureCard
                    icon={<FileText size={28} className="text-white" />}
                    title="Submit & Track Results"
                    description="Easily submit your semester results and track status."
                    bgColor="bg-blue-600"
                />

                <FeatureCard
                    icon={<BarChart3 size={28} className="text-white" />}
                    title="Performance Insights"
                    description="View detailed performance analytics."
                    bgColor="bg-purple-600"
                />

                <FeatureCard
                    icon={<Bell size={28} className="text-white" />}
                    title="Stay Notified"
                    description="Receive important academic updates."
                    bgColor="bg-green-600"
                />

                <FeatureCard
                    icon={<ShieldCheck size={28} className="text-white" />}
                    title="Secure & Reliable"
                    description="Your academic data is protected."
                    bgColor="bg-orange-500"
                />
                </div>

            </div>
        </div>
    );
}

export default LeftPanel;