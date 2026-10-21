import { ChevronRight } from "lucide-react";

const FeatureCard = ({
    icon,
    title,
    description,
    bgColor=bg-blue-500 ,
}) => {
    return (
       <div className="w-full group flex items-center justify-between p-2 mb-3 rounded-2xl backdrop-blur-md border border-white/10 bg-white/15 hover:border-indigo-400 transition-all duration-300 cursor-pointer shadow-lg hover:[box-shadow:0_0_10px_#0062ff]">

            {/* Left Side */}
            <div className="flex items-center gap-4">

                {/* Icon */}
                <div
                    className={`w-12 h-12 ${bgColor} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300`}
                >
                    {icon}
                </div>

                {/* Text */}
                <div>
                    <h4 className="text-lg font-bold text-white ">
                        {title}
                    </h4>

                    <p className="text-sm text-gray-300 group-hover:text-gray-400 ">
                        {description}
                    </p>
                </div>
            </div>

        </div>
    );
};

export default FeatureCard;