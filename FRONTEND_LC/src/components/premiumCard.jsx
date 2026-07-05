import { Crown, CheckCircle, Lock } from "lucide-react";

const PremiumCard = ({ feature = "Video Solutions" }) => {
  return (
    <div className="max-w-3xl mx-auto rounded-2xl border border-yellow-500/40 bg-base-200 shadow-xl overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-amber-400 p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto shadow-lg">
          <Crown className="w-10 h-10 text-yellow-500" />
        </div>

        <h1 className="text-4xl font-bold text-black mt-5">
          Premium Feature
        </h1>

        <p className="text-black/80 mt-2">
          Unlock exclusive learning tools and level up your coding.
        </p>
      </div>

      {/* Body */}
      <div className="p-8">

        <div className="text-center">
          <h2 className="text-2xl font-semibold">
            {feature}
          </h2>

          <p className="text-base-content/70 mt-2">
            This feature is available only for Premium members.
          </p>
        </div>

        <div className="divider"></div>

        {/* Features */}

        <div className="grid gap-4">

          <div className="flex items-center gap-3">
            <CheckCircle className="text-success w-5 h-5" />
            <span>Unlimited Video Editorials</span>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle className="text-success w-5 h-5" />
            <span>AI Code Review</span>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle className="text-success w-5 h-5" />
            <span>AI Hint Generator</span>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle className="text-success w-5 h-5" />
            <span>Company-wise Problem Sheets</span>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle className="text-success w-5 h-5" />
            <span>Upcoming Premium Features</span>
          </div>

        </div>

        {/* Pricing */}

        <div className="mt-8 text-center">

          <div className="text-4xl font-bold text-warning">
            ₹99
            <span className="text-lg text-base-content/60">
              /month
            </span>
          </div>

          <p className="text-sm text-base-content/60 mt-1">
            Launch offer • Cancel anytime
          </p>

        </div>

        {/* CTA */}

        <button
          className="btn btn-warning btn-wide w-full mt-8"
        >
            disabled
          <Lock className="w-5 h-5" />
            Upgrade Coming Soon
        </button>

        <p className="text-center text-xs text-base-content/50 mt-3">
          Payments coming soon 🚀
        </p>

      </div>
    </div>
  );
};

export default PremiumCard;