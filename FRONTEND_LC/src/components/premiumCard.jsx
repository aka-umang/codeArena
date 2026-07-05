import { Crown, Lock } from "lucide-react";
import { useNavigate } from "react-router";

const PremiumCard = ({ feature = "Video Solutions" }) => {

    const navigate = useNavigate();

    return (
        

        <div className="max-w-2xl mx-auto">

            <div className="card bg-base-200 shadow-2xl border border-yellow-500">

                <div className="card-body items-center text-center">

                    <div className="bg-yellow-500 p-4 rounded-full">
                        <Crown size={45} className="text-white" />
                    </div>

                    <h2 className="card-title text-3xl mt-4">
                        Premium Feature
                    </h2>

                    <p className="text-lg mt-2">
                        <span className="font-semibold">
                            {feature}
                        </span>{" "}
                        is available only for Premium Members.
                    </p>

                    <div className="divider"></div>

                    <div className="space-y-2 text-left">

                        <p>✅ Video Editorials</p>

                        <p>✅ AI Code Review</p>

                        <p>✅ AI Hint Generator</p>

                        <p>✅ Upcoming Premium Features</p>

                    </div>

                    <button
                        className="btn btn-warning btn-wide mt-6"
                        onClick={() => navigate("/premium")}
                    >
                        <Lock size={18} />
                        Upgrade to Premium
                    </button>

                </div>

            </div>

        </div>

    );
};

export default PremiumCard;