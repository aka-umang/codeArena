import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; // Fixed import
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { fetchProblems } from "../problemSlice";
import { CircleUserRound, Crown, LogOut, Shield } from "lucide-react";

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  //const [problems, setProblems] = useState([]);
  //const dispatch = useDispatch();

const {
    problems,
    currentPage,
    totalPages,
    loading
} = useSelector(state => state.problem);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });

 useEffect(() => {
    dispatch(
        fetchProblems({
            page,
            limit: 10,
        })
    );
}, [dispatch, page]);

useEffect(() => {
    const fetchSolvedProblems = async () => {
        try {
            const { data } = await axiosClient.get(
                "/problem/problemSolvedByUser"
            );

            setSolvedProblems(data);
        } catch (error) {
            console.error("Error fetching solved problems:", error);
        }
    };

    if (user) {
        fetchSolvedProblems();
    }
}, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]); // Clear solved problems on logout
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });


  if (loading) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navigation Bar */}
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl">CODEARENA</NavLink>
        </div>
        <div className="flex-none">
  <div className="dropdown dropdown-end">

    <button
      tabIndex={0}
      className="btn btn-ghost btn-circle p-0"
    >
      <div className="avatar placeholder">
        <div className="bg-primary text-primary-content rounded-full w-10">
          <span className="font-semibold text-lg">
            {user?.firstName?.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </button>

    <ul
      tabIndex={0}
      className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-xl bg-base-100 rounded-2xl w-64 border border-base-300"
    >

      <li className="menu-title">
        <div className="flex flex-col items-start">

          <span className="text-base font-bold">
            {user?.firstName}
          </span>

          <span className="text-xs text-base-content/60">
            {user?.emailId}
          </span>

          {user?.isPremium ? (
            <span className="badge badge-warning mt-2">
              👑 Premium
            </span>
          ) : (
            <span className="badge badge-neutral mt-2">
              Free Member
            </span>
          )}

        </div>
      </li>

      <div className="divider my-1"></div>

      {user?.role === "admin" && (
        <li>
          <NavLink to="/admin">
            🛠 Admin Panel
          </NavLink>
        </li>
      )}

      <li>
        <button onClick={handleLogout}>
          🚪 Logout
        </button>
      </li>

    </ul>

  </div>
</div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* New Status Filter */}
          <select 
            className="select select-bordered"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>

          <select 
            className="select select-bordered"
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select 
            className="select select-bordered"
            value={filters.tag}
            onChange={(e) => setFilters({...filters, tag: e.target.value})}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

        {/* Problems List */}
        <div className="grid gap-4">
          {filteredProblems.map(problem => (
            <div key={problem._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h2 className="card-title">
                    <NavLink to={`/problem/${problem._id}`} className="hover:text-primary">
                      {problem.title}
                    </NavLink>
                  </h2>
                  {solvedProblems.some(sp => sp._id === problem._id) && (
                    <div className="badge badge-success gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Solved
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </div>
                  <div className="badge badge-info">
                    {problem.tags}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
                  <div className="flex justify-center items-center gap-4 mt-8">

             <button
                className="btn"
        disabled={page === 1}
        onClick={() => setPage(prev => prev - 1)}
    >
        Previous
    </button>

    <span className="font-semibold">
        Page {currentPage} of {totalPages}
    </span>

    <button
        className="btn"
        disabled={page === totalPages}
        onClick={() => setPage(prev => prev + 1)}
    >
        Next
    </button>

</div>

      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};

export default Homepage;