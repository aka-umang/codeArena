const WatchVideoCard = ({ fetchPremiumVideo }) => {
    return (
        <div className="card bg-base-200 shadow-xl max-w-2xl mx-auto">

            <div className="card-body items-center text-center">

                <div className="text-6xl">
                    🎥
                </div>

                <h2 className="card-title text-3xl mt-3">
                    Video Editorial
                </h2>

                <p className="text-gray-400 max-w-md">
                    Watch a detailed explanation of this problem with a
                    step-by-step walkthrough, intuition, and optimal solution.
                </p>

                <button
                    onClick={fetchPremiumVideo}
                    className="btn btn-primary mt-5"
                >
                    ▶ Watch Video
                </button>

            </div>

        </div>
    );
};

export default WatchVideoCard;